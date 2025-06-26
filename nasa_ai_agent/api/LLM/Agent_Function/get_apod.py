import requests
from django.conf import settings
import json

def get_apod(date: str = '') -> dict:

    print(f"Calling APOD API with date: {date}")
    try:
        apod_url = "https://api.nasa.gov/planetary/apod"
        params = {"api_key": settings.NASA_API_KEY}
        if date:
            params["date"] = date
        response = requests.get(apod_url, params=params)
        response.raise_for_status()
        apod_data = response.json()
        
        # Simplify APOD data
        result = {
            "date": apod_data.get("date", ""),
            "title": apod_data.get("title", ""),
            "explanation": apod_data.get("explanation", ""),
            "url": apod_data.get("url", ""),
            "media_type": apod_data.get("media_type", "")
        }
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        return {"status": "error", "data": None, "error": str(e)}