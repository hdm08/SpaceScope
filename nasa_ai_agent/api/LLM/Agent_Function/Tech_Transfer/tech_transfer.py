import json
import requests
from django.conf import settings

def get_tech_transfer(patent: str = '', patent_issued: str = '', software: str = '', spinoff: str = '') -> dict:
    
    print(f"Calling Tech Transfer API with patent: {patent}, patent_issued: {patent_issued}, software: {software}, spinoff: {spinoff}")
    try:
        url = "https://api.nasa.gov/techtransfer/patent/"
        params = {"api_key": settings.NASA_API_KEY}
        if patent:
            params["patent"] = patent
        if patent_issued:
            params["patent_issued"] = patent_issued
        if software:
            params["software"] = software
        if spinoff:
            params["spinoff"] = spinoff
        
        if not any([patent, patent_issued, software, spinoff]):
            print("No search parameters provided.")
            return {"status": "error", "data": None, "error": "At least one search parameter (patent, patent_issued, software, spinoff) is required."}

        response = requests.get(url, params=params)
        response.raise_for_status()
        tech_data = response.json()
        print(f"Tech Transfer API response: {json.dumps(tech_data, indent=2)[:200]}...")

        result = []
        for item in tech_data.get("results", [])[:10]:  # Limit to 10 results
            simplified = {
                "id": item[0],
                "title": item[2],
                "description": item[3],
                "category": item[10] if len(item) > 10 else "",
                "link": item[11] if len(item) > 11 else ""
            }
            result.append(simplified)
        return {"status": "success", "data": result, "error": None}
    except requests.RequestException as e:
        print(f"Error calling Tech Transfer API: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}
    except Exception as e:
        print(f"Unexpected error in get_tech_transfer: {str(e)}")
        return {"status": "error", "data": None, "error": str(e)}

def get_tech_transfer_patent(patent: str) -> dict:
    
    return get_tech_transfer(patent=patent)

def get_tech_transfer_patent_issued(patent_issued: str) -> dict:
    
    return get_tech_transfer(patent_issued=patent_issued)

def get_tech_transfer_software(software: str) -> dict:
    
    return get_tech_transfer(software=software)

def get_tech_transfer_spinoff(spinoff: str) -> dict:
    
    return get_tech_transfer(spinoff=spinoff)