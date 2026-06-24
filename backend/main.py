import random
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow the React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Open-Meteo — 100% free, no API key required
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL   = "https://api.open-meteo.com/v1/forecast"

# Human-readable labels for Open-Meteo weather codes
WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Rain showers", 81: "Heavy showers", 82: "Violent showers",
    85: "Snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Heavy thunderstorm",
}


@app.get("/")
def root():
    return {"message": "API is running ✅"}


@app.get("/weather")
def get_weather(city: str):
    # Step 1: convert city name → latitude/longitude
    geo = requests.get(GEOCODING_URL, params={
        "name": city, "count": 1, "language": "en", "format": "json"
    }, timeout=10)

    geo_data = geo.json()
    if not geo_data.get("results"):
        raise HTTPException(status_code=404, detail=f"City '{city}' not found.")

    result     = geo_data["results"][0]
    lat        = result["latitude"]
    lon        = result["longitude"]
    city_name  = result["name"]
    country    = result.get("country", "")

    # Step 2: fetch current weather for those coordinates
    weather = requests.get(WEATHER_URL, params={
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,weather_code",
        "timezone": "auto",
    }, timeout=10)

    w = weather.json()["current"]
    temp_c = round(w["temperature_2m"], 1)
    temp_f = round((temp_c * 9 / 5) + 32, 1)
    description = WEATHER_CODES.get(w["weather_code"], "Unknown")

    return {
        "city": city_name,
        "country": country,
        "temperature_c": temp_c,
        "temperature_f": temp_f,
        "description": description,
        "lat": lat,
        "lon": lon,
    }


@app.get("/roll-dice")
def roll_dice():
    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    return {
        "die1": die1,
        "die2": die2,
        "total": die1 + die2,
    }
