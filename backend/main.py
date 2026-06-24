import os
import random
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow the React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.get("/")
def root():
    return {"message": "API is running ✅"}


@app.get("/weather")
def get_weather(city: str):
    if not WEATHER_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="WEATHER_API_KEY is missing. Add it to backend/.env"
        )

    response = requests.get(WEATHER_URL, params={
        "q": city,
        "appid": WEATHER_API_KEY,
        "units": "metric"
    })

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail=f"City '{city}' not found.")
    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid API key.")
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Weather service error.")

    data = response.json()
    temp_c = round(data["main"]["temp"], 1)
    temp_f = round((temp_c * 9 / 5) + 32, 1)

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature_c": temp_c,
        "temperature_f": temp_f,
        "description": data["weather"][0]["description"].capitalize(),
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
