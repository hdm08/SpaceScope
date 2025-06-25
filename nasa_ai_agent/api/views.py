import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from api.LLM import Agent  # Assuming openAIAgent is defined here

@csrf_exempt
@require_POST
def query_nasa(request):
    try:
        data = json.loads(request.body)
        query = data.get('query', '')
        thread_id = data.get('thread_id', None)  # Get thread_id from request body, if provided

        if not query:
            return JsonResponse({'response': 'Error: Query is required.'}, status=400)

        # Call the openAIAgent function with query and thread_id
        agent_response = Agent.openAIAgent(query, thread_id)

        # Check if the response is a DRF Response object (e.g., error case)
        if isinstance(agent_response):
            # Extract error message if status is not 200
            if agent_response.status_code != 200:
                return JsonResponse({'response': f'Error: {agent_response.get("error", "Unknown error")}'}, status=agent_response.status_code)
            # For success, extract the response and thread_id
            response_data = {
                'response': agent_response['response'],
                'thread_id': agent_response['thread_id']
            }
        else:
            # Handle case where openAIAgent returns a string (from your original code)
            response_data = {
                'response': agent_response,
                'thread_id': thread_id  # Keep existing thread_id if provided
            }

        return JsonResponse(response_data)
    except json.JSONDecodeError:
        return JsonResponse({'response': 'Error: Invalid JSON format.'}, status=400)
    except Exception as e:
        return JsonResponse({'response': f'Error: {str(e)}'}, status=400)