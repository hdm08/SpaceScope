import requests
import json 
from django.conf import settings
import regex as re 
def get_cme_analysis(start_date: str, end_date: str = '', most_accurate_only: bool = True, complete_entry_only: bool = True, speed: int = 0, half_angle: int = 0, catalog: str = 'ALL', keyword: str = 'NONE') -> dict:
    
    print(f"Calling CME Analysis API with start_date: {start_date}, end_date: {end_date}, most_accurate_only: {most_accurate_only}, complete_entry_only: {complete_entry_only}, speed: {speed}, half_angle: {half_angle}, catalog: {catalog}, keyword: {keyword}")
    try:
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        if not re.match(date_pattern, start_date):
            print(f"Invalid start_date format: {start_date}")
            return {"status": "error", "data": None, "error": "Start date must be in YYYY-MM-DD format."}
        if end_date and not re.match(date_pattern, end_date):
            print(f"Invalid end_date format: {end_date}")
            return {"status": "error", "data": None, "error": "End date must be in YYYY-MM-DD format."}
        valid_catalogs = ['ALL', 'SWRC_CATALOG', 'JANG_ET_AL_CATALOG']
        if catalog not in valid_catalogs:
            print(f"Invalid catalog: {catalog}")
            return {"status": "error", "data": None, "error": f"Catalog must be one of {valid_catalogs}."}

        url = "https://api.nasa.gov/DONKI/CMEAnalysis"
        params = {
            "api_key": settings.NASA_API_KEY,
            "startDate": start_date,
            "mostAccurateOnly": str(most_accurate_only).lower(),
            "completeEntryOnly": str(complete_entry_only).lower(),
            "speed": speed,
            "halfAngle": half_angle,
            "catalog": catalog,
            "keyword": keyword
        }
        if end_date:
            params["endDate"] = end_date
        response = requests.get(url, params=params)
        response.raise_for_status()
        cme_data = response.json()
        print(f"CME Analysis API response: {json.dumps(cme_data, indent=2)[:200]}...")

        result = [
            {
                "time": cme.get("time21_5", ""),
                "latitude": cme.get("latitude", 0),
                "longitude": cme.get("longitude", 0),
                "speed": cme.get("speed", 0),
                "half_angle": cme.get("halfAngle", 0),
                "type": cme.get("type", ""),
                "¿s_associated_cme_id": cme.get("associatedCMEID", "")
            } for cme in cme_data[:10]
        ]
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling CME Analysis API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_cme_analysis: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}