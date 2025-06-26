function_tools = [
        {
            "type": "function",
            "function": {
                "name": "get_apod",
                "description": "Fetches NASA's Astronomy Picture of the Day (APOD) for a specific date.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string",
                            "description": "Date in YYYY-MM-DD format. If not provided, convert to YYYY-MM-DD",
                            "pattern": "^\\d{4}-\\d{2}-\\d{2}$|^$"
                        }
                    },
                    "required": []
                }
            }
        }
    ]