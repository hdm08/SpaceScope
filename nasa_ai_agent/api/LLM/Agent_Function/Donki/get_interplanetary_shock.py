import requests
import json 
from django.conf import settings
import regex as re 

def get_interplanetary_shock(start_date: str, end_date: str = '', location: str = 'ALL', catalog: str = 'ALL') -> dict:
    
    print(f"Calling IPS API with start_date: {start_date}, end_date: {end_date}, location: {location}, catalog: {catalog}")
    try:
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        if not re.match(date_pattern, start_date):
            print(f"Invalid start_date format: {start_date}")
            return {"status": "error", "data": None, "error": "Start date must be in YYYY-MM-DD format."}
        if end_date and not re.match(date_pattern, end_date):
            print(f"Invalid end_date format: {end_date}")
            return {"status": "error", "data": None, "error": "End date must be in YYYY-MM-DD format."}
        valid_locations = ['ALL', 'Earth', 'MESSENGER', 'STEREO A', 'STEREO B']
        valid_catalogs = ['ALL', 'SWRC_CATALOG', 'WINSLOW_MESSENGER_ICME_CATALOG']
        if location not in valid_locations:
            print(f"Invalid location: {location}")
            return {"status": "error", "data": None, "error": f"Location must be one of {valid_locations}."}
        if catalog not in valid_catalogs:
            print(f"Invalid catalog: {catalog}")
            return {"status": "error", "data": None, "error": f"Catalog must be one of {valid_catalogs}."}

        url = "https://api.nasa.gov/DONKI/IPS"
        params = {
            "api_key": settings.NASA_API_KEY,
            "startDate": start_date,
            "location": location,
            "catalog": catalog
        }
        if end_date:
            params["endDate"] = end_date
        response = requests.get(url, params=params)
        response.raise_for_status()
        ips_data = response.json()
        print(f"IPS API response: {json.dumps(ips_data, indent=2)[:200]}...")

        result = [
            {
                "ips_id": ips.get("ipsID", ""),
                "event_time": ips.get("eventTime", ""),
                "location": ips.get("location", ""),
                "instruments": [inst.get("displayName", "") for inst in ips.get("instruments", [])]
            } for ips in ips_data[:10]
        ]
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling IPS API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_interplanetary_shock: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}