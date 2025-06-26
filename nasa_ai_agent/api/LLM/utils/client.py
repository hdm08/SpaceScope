import openai
from django.conf import settings

def Client():
    return openai.OpenAI(api_key=settings.OPENAI_API_KEY)



def Chat_Completion(prompt_messages, client):
    chat_completion = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=prompt_messages,
                        temperature=0.2,
                        max_tokens=2000,
                    )
    
    response_text = chat_completion.choices[0].message.content
    
    return response_text

    