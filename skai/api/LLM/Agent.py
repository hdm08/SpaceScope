from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
import openai
import uuid
import time
from .Agent_Function.Wikipedia.get_wikipedia_data import get_wikipedia_data
from .utils.client import Client
from .utils.check_function_call import check_function_call
from .utils.Assistant import Assistant


def openAIAgent(query: str, thread_id: str = None) -> Response:
    print(f"Received query: {query}, thread_id: {thread_id}")
    
    if not query or not isinstance(query, str):
        print("Error: Invalid query provided.")
        return Response({'error': 'Query must be a non-empty string.'}, status=status.HTTP_400_BAD_REQUEST)

    if not settings.OPENAI_API_KEY:
        print("Error: OpenAI API key not configured.")
        return Response({'error': 'OpenAI API key is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if not settings.NASA_API_KEY:
        print("Error: NASA API key not configured.")
        return Response({'error': 'NASA API key is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #1. Initialize OpenAI client
    print("Initializing OpenAI client...")
    client = Client()  # Assumes Client wraps openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    #2. Create or retrieve Assistant
    try:
        assistant = Assistant(client)
        assistant_id = assistant.id
    except Exception as e:
        print(f"Error creating assistant: {str(e)}")
        return Response({'error': f'Failed to create assistant: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #3. Create or use existing thread
    try:
        if not thread_id:
            print("Creating new thread...")
            thread = client.beta.threads.create()
            thread_id = thread.id
        else:
            # Verify thread_id exists by attempting to retrieve it
            print(f"Verifying thread_id: {thread_id}")
            client.beta.threads.retrieve(thread_id=thread_id)
    except openai.APIError as e:
        print(f"Invalid or non-existent thread_id: {str(e)}")
        return Response({'error': f'Invalid thread ID: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    response_text = ""

    #4.
    try:
        # Retrieve thread history (last 20 messages)
        print("Retrieving thread history...")
        messages = client.beta.threads.messages.list(thread_id=thread_id, limit=20)
        history = ""
        if messages.data:
            history = "\n".join([
                f"{'User' if msg.role == 'user' else 'AI'}: {msg.content[0].text.value}"
                for msg in reversed(messages.data)  # Reverse to chronological order
            ])

        # Add user message to thread
        print("Adding user message to thread...")
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=query
        )

        # Run the assistant
        print("Running assistant...")
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id,
            instructions=f"""
            {assistant.instructions}
            **Conversation History**: {history or 'None'}
            **API Used**: NASA APOD API available via get_apod function
            **Wikipedia Data**: None
            """,
            max_completion_tokens=2000
        )

        # Poll for run completion
        while run.status in ["queued", "in_progress"]:
            time.sleep(0.5)
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        #5. checking for function calls
        if run.status == "requires_action" and run.required_action:
            print("Handling function call...")
            response_text = check_function_call(run.required_action, thread_id, run.id, client)  # Pass run.id
        elif run.status == "completed":
            # Retrieve the latest assistant message
            messages = client.beta.threads.messages.list(thread_id=thread_id, limit=1)
            response_text = messages.data[0].content[0].text.value if messages.data else ""
        else:
            print(f"Run failed with status: {run.status}")
            return Response({'error': f'Run failed with status: {run.status}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        #6. Wikipedia fallback for insufficient data
        if "insufficient data" in response_text.lower() or "not enough information" in response_text.lower():
            print("Fetching Wikipedia data...")
            response_text = get_wikipedia_data(query, client, thread_id, assistant, assistant_id, history, response_text)
        

    except openai.AuthenticationError:
        print("OpenAI authentication failed.")
        return Response({'error': 'Invalid OpenAI API key.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except openai.RateLimitError:
        print("OpenAI rate limit exceeded.")
        return Response({'error': 'Rate limit exceeded. Please try again later.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    except openai.APIError as e:
        print(f"OpenAI API error: {str(e)}")
        return Response({'error': f'OpenAI API error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({'error': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(f"Returning response for thread_id: {thread_id}")
    return {
        'response': response_text,
        'query_id': str(uuid.uuid4()),
        'thread_id': thread_id
    }