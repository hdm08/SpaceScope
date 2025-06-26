import wikipedia
import time
def get_wikipedia_data(query, client, thread_id, assistant, assistant_id, history, response_text) -> dict:
    print("Insufficient data detected, attempting Wikipedia fallback...")
    print(f"Searching Wikipedia for: {query} NASA")

    try:
        wikipedia.set_lang("en")
        search_results = wikipedia.search(query + " NASA", results=1)
        print(f"Wikipedia search results: {search_results}")
        if search_results:
            wiki_content = wikipedia.summary(search_results[0], sentences=3)
            wiki_result=  {"status": "success", "data": wiki_content, "error": None}
        else:
            wiki_result=  {"status": "error", "data": None, "error": "No relevant Wikipedia data found."}
    except wikipedia.exceptions.DisambiguationError:
        wiki_result=  {"status": "error", "data": None, "error": "Wikipedia search returned ambiguous results. Please refine your query."}
    except wikipedia.exceptions.HTTPTimeoutError:
        wiki_result=  {"status": "error", "data": None, "error": "Wikipedia API timed out. Please try again later."}
    except Exception as e:
        wiki_result=  {"status": "error", "data": None, "error": f"Error accessing Wikipedia: {str(e)}"}
    
    if wiki_result["status"] == "success":
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="system",
            content=f"Additional context from Wikipedia: {wiki_result['data']}"
        )
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id,
            instructions=f"""
            {assistant.instructions}
            **Conversation History**: {history or 'None'}
            **API Used**: NASA APOD API available via get_apod function
            **Wikipedia Data**: {wiki_result['data']}
            """,
            max_completion_tokens=2000
        )
        while run.status in ["queued", "in_progress"]:
        
            time.sleep(0.5)
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        if run.status == "completed":
            messages = client.beta.threads.messages.list(thread_id=thread_id, limit=1)
            response_text = messages.data[0].content[0].text.value if messages.data else response_text
        else:
            response_text += f"\nWiki run failed with status: {run.status}"
    else:
        response_text += f"\n{wiki_result['error']}"
        
    return response_text