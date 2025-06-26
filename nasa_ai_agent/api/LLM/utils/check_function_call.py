from ..Agent_Function.get_apod import get_apod
import json
import time

def execute_function(function_name: str, arguments: dict) -> dict:
    function_map = {
        "get_apod": get_apod,
        # Add other functions here if needed, e.g., "get_wikipedia_data": get_wikipedia_data
    }
    
    if function_name not in function_map:
        return {"status": "error", "error": f"Unknown function {function_name}"}
    
    try:
        return function_map[function_name](**arguments)
    except Exception as e:
        return {"status": "error", "error": f"Error executing {function_name}: {str(e)}"}

def check_function_call(required_action, thread_id: str, run_id: str, client) -> str:
   
    print(f"Function call detected: {required_action.submit_tool_outputs.tool_calls}")

    tool_outputs = []

    for tool_call in required_action.submit_tool_outputs.tool_calls:
        try:
            arguments = json.loads(tool_call.function.arguments)
            print(f"Executing {tool_call.function.name} with arguments: {arguments}")
            
            # Execute the function using the function map
            result = execute_function(tool_call.function.name, arguments)
            
            if result.get("status") == "success":
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps(result["data"])
                })
                print(f"Added result to tool_outputs: {result['data']}")
            else:
                tool_outputs.append({
                    "tool_call_id": tool_call.id,
                    "output": json.dumps({"error": result["error"]})
                })
                print(f"Function error: {result['error']}")
        except json.JSONDecodeError:
            tool_outputs.append({
                "tool_call_id": tool_call.id,
                "output": json.dumps({"error": "Invalid function arguments"})
            })
            print("Error: Invalid function arguments.")
        except Exception as e:
            tool_outputs.append({
                "tool_call_id": tool_call.id,
                "output": json.dumps({"error": f"Unexpected error: {str(e)}"})
            })
            print(f"Unexpected error processing tool call: {str(e)}")

    # Submit tool outputs to the run
    print("Submitting tool outputs to run...")
    try:
        run = client.beta.threads.runs.submit_tool_outputs(
            thread_id=thread_id,
            run_id=run_id,
            tool_outputs=tool_outputs
        )

        # Poll for run completion
        while run.status in ["queued", "in_progress"]:
            time.sleep(0.5)
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)

        if run.status == "completed":
            # Retrieve the latest assistant message
            messages = client.beta.threads.messages.list(thread_id=thread_id, limit=1)
            response_text = messages.data[0].content[0].text.value if messages.data else ""
            print(f"Run completed. Response: {response_text[:100]}...")
            return response_text
        else:
            print(f"Run failed with status: {run.status}")
            return f"Error: Run failed with status: {run.status}"
    except Exception as e:
        print(f"Error submitting tool outputs: {str(e)}")
        return f"Error submitting tool outputs: {str(e)}"