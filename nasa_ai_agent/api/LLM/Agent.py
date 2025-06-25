from django.conf import settings
import openai
from rest_framework.response import Response
from rest_framework import status
import wikipedia
import uuid

def openAIAgent(query, thread_id=None):
    # Ensure OpenAI API key is set
    if not settings.OPENAI_API_KEY:
        return Response({'error': 'OpenAI API key is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    PROMPT = '''
    You are a NASA AI Agent with expertise strictly limited to NASA. Your knowledge is confined to NASA's missions, programs, technologies, history, and data up to December 31, 2022. You have no understanding of any other topics outside this scope and must refuse to answer queries unrelated to NASA.
    **Instructions**:
    - Respond to the user's query in a clear, concise, and engaging manner, as if explaining to a curious space enthusiast.
    - Use the provided API data or Wikipedia data (if available) to ensure accuracy, but only for NASA or competitor-related queries.
    - If API or Wikipedia data is provided, incorporate it into your response naturally, avoiding raw JSON or unformatted data.
    - Adopt a friendly, informative tone, avoiding technical jargon unless necessary, and explain terms if used.
    - If the query is unrelated to NASA or its competitors, politely refuse to answer and suggest asking about NASA or a competitor instead.
    - If the data is incomplete or unclear, acknowledge it and provide a general response based on your NASA-specific knowledge up to 2022.
    - Do not reference events, data, or missions after December 31, 2022.
    **User Query**: "{query}"
    '''

    # Initialize OpenAI client
    client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    # Create or use existing thread
    if not thread_id:
        thread = client.beta.threads.create()
        thread_id = thread.id
    else:
        try:
            # Verify thread exists
            client.beta.threads.retrieve(thread_id)
        except openai.APIError:
            return Response({'error': 'Invalid thread ID.'}, status=status.HTTP_400_BAD_REQUEST)

    response = ""
    try:
        # Add user message to thread
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=query
        )

        # Create and run assistant
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id="asst_nasa_specific",  # Assumes assistant is pre-configured
            instructions=PROMPT.format(query=query)
        )

        # Poll for run completion
        while True:
            run_status = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
            if run_status.status == "completed":
                break
            elif run_status.status in ["failed", "cancelled"]:
                return Response({'error': f'OpenAI run failed with status: {run_status.status}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # Add brief sleep to avoid excessive API calls
            import time
            time.sleep(0.5)

        # Retrieve messages from thread
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        response = messages.data[0].content[0].text.value

        # Check if response indicates insufficient data
        if "insufficient data" in response.lower() or "not enough information" in response.lower():
            try:
                # Search Wikipedia for NASA-related content
                wikipedia.set_lang("en")
                search_results = wikipedia.search(query + " NASA", results=1)
                if search_results:
                    wiki_content = wikipedia.summary(search_results[0], sentences=3)
                    # Append Wikipedia data to thread
                    client.beta.threads.messages.create(
                        thread_id=thread_id,
                        role="system",
                        content=f"Additional context from Wikipedia: {wiki_content}"
                    )
                    # Re-run with additional context
                    run = client.beta.threads.runs.create(
                        thread_id=thread_id,
                        assistant_id="asst_nasa_specific",
                        instructions=PROMPT.format(query=query)
                    )
                    # Poll again
                    while True:
                        run_status = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
                        if run_status.status == "completed":
                            break
                        elif run_status.status in ["failed", "cancelled"]:
                            return Response({'error': f'OpenAI run failed with status: {run_status.status}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        time.sleep(0.5)
                    # Get updated response
                    messages = client.beta.threads.messages.list(thread_id=thread_id)
                    response = messages.data[0].content[0].text.value
                else:
                    response += "\nNo relevant Wikipedia data found."
            except wikipedia.exceptions.DisambiguationError:
                response += "\nWikipedia search returned ambiguous results. Please refine your query."
            except wikipedia.exceptions.PageError:
                response += "\nNo relevant Wikipedia page found."
            except Exception as e:
                response += f"\nError accessing Wikipedia: {str(e)}"

    except openai.APIError as e:
        return Response({'error': f'OpenAI API error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return {
        'response': response,
        'thread_id': thread_id
    }