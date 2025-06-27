import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.response import Response
from api.LLM import Agent
import uuid

@csrf_exempt
@require_POST
def query_nasa(request):

    print("Received request to query_nasa")
    
    try:
        data = json.loads(request.body)
        query = data.get('query', '').strip()
        thread_id = data.get('thread_id', None)
        
        print(f"Parsed query: {query}, thread_id: {thread_id}")
        
        if not query:
            print("Error: Query is required.")
            return JsonResponse({'response': 'Error: Query is required.'}, status=400)
        
        if thread_id:
            try:
                uuid.UUID(thread_id)
            except ValueError:
                print(f"Error: Invalid thread_id format: {thread_id}")
                return JsonResponse({'response': 'Error: Invalid thread ID format.'}, status=400)
        
        # Call openAIAgent
        print(f"Calling openAIAgent with query: {query}, thread_id: {thread_id}")
        agent_response = Agent.openAIAgent(query, thread_id)
        
        # Handle response
        if isinstance(agent_response, Response):
            # Error case: openAIAgent returned a DRF Response
            error_message = agent_response.data.get('error', 'Unknown error')
            print(f"openAIAgent error: {error_message}")
            return JsonResponse({'response': f'Error: {error_message}'}, status=agent_response.status_code)
        
        print(f"openAIAgent success: response: {agent_response['response']} query_id={agent_response['query_id']}, thread_id={agent_response['thread_id']}")
        response_data = {
            'response': agent_response['response'],
            'query_id': agent_response['query_id'],
            'thread_id': agent_response['thread_id'],
        }
        
        print(f"Query ID {response_data['query_id']} logged for tracking")
        
        return JsonResponse(response_data, status=200)
    
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in request body.")
        return JsonResponse({'response': 'Error: Invalid JSON format.'}, status=400)
    except Exception as e:
        print(f"Unexpected error in query_nasa: {str(e)}")
        return JsonResponse({'response': f'Error: {str(e)}'}, status=500)