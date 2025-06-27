
import requests
import json 
from django.conf import settings
import regex as re 

def get_donki_notifications(start_date: str, end_date: str = '', type: str = 'all') -> dict:
    """
    Fetches Notifications data from NASA's DONKI API.
    
    Args:
        start_date: Date in YYYY-MM-DD format, required.
        end_date: Optional date in YYYY-MM-DD format, defaults to current UTC date.
        type: String, defaults to 'all' (choices: all, FLR, SEP, CME, IPS, MPC, GST, RBE, report).
    
    Returns:
        Dict with 'status' ('success' or 'error'), 'data' (list of notification details or None), and 'error' (message or None).
    """
    print(f"Calling Notifications API with start_date: {start_date}, end_date: {end_date}, type: {type}")
    try:
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        if not re.match(date_pattern, start_date):
            print(f"Invalid start_date format: {start_date}")
            return {"status": "error", "data": None, "error": "Start date must be in YYYY-MM-DD format."}
        if end_date and not re.match(date_pattern, end_date):
            print(f"Invalid end_date format: {end_date}")
            return {"status": "error", "data": None, "error": "End date must be in YYYY-MM-DD format."}
        valid_types = ['all', 'FLR', 'SEP', 'CME', 'IPS', 'MPC', 'GST', 'RBE', 'report']
        if type not in valid_types:
            print(f"Invalid type: {type}")
            return {"status": "error", "data": None, "error": f"Type must be one of {valid_types}."}

        url = "https://api.nasa.gov/DONKI/notifications"
        params = {"api_key": settings.NASA_API_KEY, "startDate": start_date, "type": type}
        if end_date:
            params["endDate"] = end_date
        response = requests.get(url, params=params)
        response.raise_for_status()
        notif_data = response.json()
        print(f"Notifications API response: {json.dumps(notif_data, indent=2)[:200]}...")

        result = [
            {
                "message_id": notif.get("messageID", ""),
                "message_type": notif.get("messageType", ""),
                "message_time": notif.get("messageTime", ""),
                "message_body": notif.get("messageBody", "")[:200]
            } for notif in notif_data[:10]
        ]
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling Notifications API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_donki_notifications: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}