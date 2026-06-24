import random
import time
import requests
import pandas as pd
import streamlit as st

# Open-Meteo — 100% free, no API key required
GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL   = "https://api.open-meteo.com/v1/forecast"

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

st.set_page_config(page_title="Weather & Dice App", page_icon="🎲", layout="centered")
st.title("🌤️ Weather & 🎲 Dice App")
st.write("A simple demo app — weather lookup and dice simulator. No API key needed!")

# ─── Weather ────────────────────────────────────────────────────────────────

st.header("🌤️ Weather Information")

city = st.text_input("Enter a city name", placeholder="e.g. London, Paris, Tokyo")

if st.button("Get Weather") and city:
    with st.spinner("Fetching weather..."):
        try:
            # Step 1: city name → coordinates
            geo = requests.get(GEOCODING_URL, params={
                "name": city, "count": 1, "language": "en", "format": "json"
            }, timeout=10)
            geo_data = geo.json()

            if not geo_data.get("results"):
                st.error(f"City '{city}' not found. Try a different name.")
            else:
                r       = geo_data["results"][0]
                lat     = r["latitude"]
                lon     = r["longitude"]
                name    = r["name"]
                country = r.get("country", "")

                # Step 2: coordinates → current weather
                w_res = requests.get(WEATHER_URL, params={
                    "latitude": lat, "longitude": lon,
                    "current": "temperature_2m,weather_code",
                    "timezone": "auto",
                }, timeout=10)

                current = w_res.json()["current"]
                temp_c  = round(current["temperature_2m"], 1)
                temp_f  = round((temp_c * 9 / 5) + 32, 1)
                desc    = WEATHER_CODES.get(current["weather_code"], "Unknown")

                st.success(f"**{name}, {country}**")
                col1, col2 = st.columns(2)
                col1.metric("Temperature (°C)", f"{temp_c}°C")
                col2.metric("Temperature (°F)", f"{temp_f}°F")
                st.caption(f"Condition: {desc}")

                # Map centred on the city
                st.map(pd.DataFrame({"lat": [lat], "lon": [lon]}), zoom=10)

        except requests.exceptions.Timeout:
            st.error("Request timed out. Check your internet connection.")
        except Exception as e:
            st.error(f"Error: {e}")

st.divider()

# ─── Dice Simulator ──────────────────────────────────────────────────────────

st.header("🎲 Dice Simulator")

if st.button("🎲 Roll Dice"):
    with st.spinner("Rolling..."):
        time.sleep(0.6)

    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    total = die1 + die2

    faces = {1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅"}

    col1, col2, col3 = st.columns(3)
    col1.metric("Die 1", f"{faces[die1]}  {die1}")
    col2.metric("Die 2", f"{faces[die2]}  {die2}")
    col3.metric("Total", total)
