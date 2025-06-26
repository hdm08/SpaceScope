from api.models import ChatThread
from rest_framework.response import Response
from rest_framework import status
import uuid

def get_thread(thread_id, history = ""):
    new_thread_id = thread_id

    if thread_id:
        try:
            new_thread_id = uuid.UUID(thread_id)
            print(f"Retrieving history for thread_id: {new_thread_id}")
            chat_history = ChatThread.objects.filter(thread_id=new_thread_id).order_by('-created_at')[:getattr(settings, 'CHAT_HISTORY_LIMIT', 10)]
            history = "\n".join([f"User: {chat.query}\nAI: {chat.response}" for chat in reversed(chat_history)])
            print(f"Retrieved history: {history[:100]}...")  # Truncate for brevity
            return history, new_thread_id
        except ValueError:
            print(f"Error: Invalid thread_id format: {thread_id}")
            return Response({'error': 'Invalid thread ID format.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error retrieving thread history: {str(e)}")
            return Response({'error': f'Error retrieving thread history: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        new_thread_id = uuid.uuid4()
        print(f"Generated new thread_id: {new_thread_id}")
        return history, new_thread_id
