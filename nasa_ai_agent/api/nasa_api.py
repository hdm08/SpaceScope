import requests
import json
from django.core.cache import cache
from datetime import datetime, timedelta

NASA_API_KEY = 'krK46NWGm8NbNbgNdNiq7YovCnsoaaWat6uPVSlW'  # Replace with your NASA API key in production

def fetch_apod():
    cache_key = 'nasa_apod'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)  # Cache for 24 hours
    return data

def fetch_neo_feed(start_date=None, end_date=None):
    cache_key = f'nasa_neo_{start_date}_{end_date}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    if not start_date:
        start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    url = f'https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={NASA_API_KEY}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_epic():
    cache_key = 'nasa_epic'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/EPIC/api/natural?api_key={NASA_API_KEY}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_image_search(query):
    cache_key = f'nasa_image_{query}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://images-api.nasa.gov/search?q={query}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_mars_weather():
    cache_key = 'nasa_mars_weather'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/insight_weather/?api_key={NASA_API_KEY}&feedtype=json&ver=1.0'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_tle():
    cache_key = 'nasa_tle'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = 'https://tle.ivanstanojevic.me/api/tle/'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_donki_cme(start_date, end_date):
    cache_key = f'nasa_donki_cme_{start_date}_{end_date}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/DONKI/CME?startDate={start_date}&endDate={end_date}&api_key={NASA_API_KEY}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

# Add similar functions for other DONKI endpoints (CMEAnalysis, GST, IPS, FLR, SEP, MPC, HSS, RBE, WSAEnlilSimulations, notifications)
# Example for one more DONKI endpoint
def fetch_donki_flr(start_date, end_date):
    cache_key = f'nasa_donki_flr_{start_date}_{end_date}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/DONKI/FLR?startDate={start_date}&endDate={end_date}&api_key={NASA_API_KEY}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_mars_photos(sol=1000, camera=None, page=1):
    cache_key = f'nasa_mars_photos_{sol}_{camera}_{page}'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = f'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol={sol}&page={page}&api_key={NASA_API_KEY}'
    if camera:
        url += f'&camera={camera}'
    response = requests.get(url)
    data = response.json()
    cache.set(cache_key, data, timeout=86400)
    return data

def fetch_exoplanets_transiting():
    cache_key = 'nasa_exoplanets_transiting'
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    url = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&format=ipac&where=pl_tranflag=1'
    response = requests.get(url)
    data = response.text  # IPAC format
    cache.set(cache_key, data, timeout=86400)
    return data