from django.conf import settings
import requests
import json
from datetime import datetime

# Fetch Asteroid details based on asteroid number
def get_asteroid_info(asteroid_id: int) -> dict:
    print(f"Calling NEO API with asteroid_id: {asteroid_id}")
    try:
        neo_url = f"https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}"
        params = {"api_key": settings.NASA_API_KEY}
        response = requests.get(neo_url, params=params)
        response.raise_for_status()
        neo_data = response.json()
        print(f"NEO API response: {json.dumps(neo_data, indent=2)[:200]}...")

        # Parse all close approaches
        today = datetime.now(datetime.timezone.utc)
        past_approaches = []
        future_approaches = []

        for approach in neo_data.get("close_approach_data", []):
            try:
                approach_date = datetime.strptime(approach.get("close_approach_date", ""), "%Y-%m-%d").date()
                if approach_date < today:
                    past_approaches.append((approach_date, approach))
                elif approach_date >= today:
                    future_approaches.append((approach_date, approach))
            except Exception as e:
                print(f"Skipping approach due to date parsing error: {e}")

        # Get most recent past and next future approach
        most_recent = max(past_approaches, default=(None, None))[1]
        next_upcoming = min(future_approaches, default=(None, None))[1]

        def simplify_approach(approach):
            if not approach:
                return None
            return {
                "date": approach.get("close_approach_date", ""),
                "relative_velocity_kmh": approach.get("relative_velocity", {}).get("kilometers_per_hour", "0"),
                "miss_distance_km": approach.get("miss_distance", {}).get("kilometers", "0")
            }

        # Simplify asteroid data
        result = {
            "name": neo_data.get("name", ""),
            "id": neo_data.get("neo_reference_id", ""),
            "is_potentially_hazardous": neo_data.get("is_potentially_hazardous_asteroid", False),
            "diameter_meters": {
                "estimated_diameter_min": neo_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_min", 0),
                "estimated_diameter_max": neo_data.get("estimated_diameter", {}).get("meters", {}).get("estimated_diameter_max", 0)
            },
            "most_recent_approach": simplify_approach(most_recent),
            "next_upcoming_approach": simplify_approach(next_upcoming)
        }

        return {"status": "success", "data": result, "error": None}

    except requests.RequestException as e:
        print(f"Error calling NEO API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_asteroid_info: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
