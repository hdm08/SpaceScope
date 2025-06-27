

import requests
import json 
from django.conf import settings
import regex as re 

def get_solar_energetic_particle(start_date: str, end_date: str = '') -> dict:
   
    print(f"Calling SEP API with start_date: {start_date}, end_date: {end_date}")
    try:
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        if not re.match(date_pattern, start_date):
            print(f"Invalid start_date format: {start_date}")
            return {"status": "error", "data": None, "error": "Start date must be in YYYY-MM-DD format."}
        if end_date and not re.match(date_pattern, end_date):
            print(f"Invalid end_date format: {end_date}")
            return {"status": "error", "data": None, "error": "End date must be in YYYY-MM-DD format."}

        url = "https://api.nasa.gov/DONKI/SEP"
        params = {"api_key": settings.NASA_API_KEY, "startDate": start_date}
        if end_date:
            params["endDate"] = end_date
        response = requests.get(url, params=params)
        response.raise_for_status()
        sep_data = response.json()
        print(f"SEP API response: {json.dumps(sep_data, indent=2)[:200]}...")

        result = [
            {
                "sep_id": sep.get("sepID", ""),
                "event_time": sep.get("eventTime", ""),
                "instruments": [inst.get("displayName", "") for inst in sep.get("instruments", [])]
            } for sep in sep_data[:10]
        ]
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling SEP API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_solar_energetic_particle: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
