import requests
import regex as re
import json
from django.conf import settings
def get_neo_feed(start_date: str, end_date: str = '') -> dict:
    print(f"Calling NEO Feed API with start_date: {start_date}, end_date: {end_date}")
    try:
        # Validate date format (YYYY-MM-DD)
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        if not re.match(date_pattern, start_date):
            print(f"Invalid start_date format: {start_date}")
            return {"status": "error", "data": None, "error": "Start date must be in YYYY-MM-DD format."}
        if end_date and not re.match(date_pattern, end_date):
            print(f"Invalid end_date format: {end_date}")
            return {"status": "error", "data": None, "error": "End date must be in YYYY-MM-DD format."}

        neo_url = "https://api.nasa.gov/neo/rest/v1/feed"
        params = {"api_key": settings.NASA_API_KEY, "start_date": start_date}
        if end_date:
            params["end_date"] = end_date
        response = requests.get(neo_url, params=params)
        response.raise_for_status()
        neo_data = response.json()
        print(f"NEO Feed API response: {json.dumps(neo_data, indent=2)[:200]}...")

        # Simplify NEO data
        result = []
        for date, asteroids in neo_data.get("near_earth_objects", {}).items():
            for asteroid in asteroids[:10]:  # Limit to 10 asteroids for brevity
                result.append({
                    "name": asteroid.get("name", ""),
                    "id": asteroid.get("neo_reference_id", ""),
                    "is_potentially_hazardous": asteroid.get("is_potentially_hazardous_asteroid", False),
                    "diameter_meters": {
                        "estimated_diameter_min": asteroid.get("estimated_diameter", {})
                            .get("meters", {})
                            .get("estimated_diameter_min", 0),
                        "estimated_diameter_max": asteroid.get("estimated_diameter", {})
                            .get("meters", {})
                            .get("estimated_diameter_max", 0)
                    },
                    "close_approach_date": asteroid.get("close_approach_data", [{}])[0]
                        .get("close_approach_date", ""),
                    "relative_velocity_kmh": asteroid.get("close_approach_data", [{}])[0]
                        .get("relative_velocity", {})
                        .get("kilometers_per_hour", "0"),
                    "miss_distance_km": asteroid.get("close_approach_data", [{}])[0]
                        .get("miss_distance", {})
                        .get("kilometers", "0")
                })
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling NEO Feed API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_neo_feed: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}