import random
import time
import os
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(page_title="Weather & Dice App", page_icon="🎲", layout="centered")
st.title("🌤️ Weather & 🎲 Dice App")
st.write("A simple demo app — weather lookup and dice simulator.")

# ─── Weather ────────────────────────────────────────────────────────────────

st.header("🌤️ Weather Information")

city = st.text_input("Enter a city name", placeholder="e.g. London, Paris, Tokyo")

if st.button("Get Weather") and city:
    api_key = os.getenv("WEATHER_API_KEY")

    if not api_key:
        st.error("WEATHER_API_KEY not found. Add it to streamlit_app/.env")
    else:
        with st.spinner("Fetching weather..."):
            try:
                res = requests.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"q": city, "appid": api_key, "units": "metric"},
                    timeout=10,
                )

                if res.status_code == 404:
                    st.error(f"City '{city}' not found. Try a different name.")
                elif res.status_code == 401:
                    st.error("Invalid API key. Check your WEATHER_API_KEY.")
                elif res.status_code == 200:
                    data = res.json()
                    temp_c = round(data["main"]["temp"], 1)
                    temp_f = round((temp_c * 9 / 5) + 32, 1)
                    desc = data["weather"][0]["description"].capitalize()

                    st.success(f"**{data['name']}, {data['sys']['country']}**")

                    col1, col2 = st.columns(2)
                    col1.metric("Temperature (°C)", f"{temp_c}°C")
                    col2.metric("Temperature (°F)", f"{temp_f}°F")
                    st.caption(f"Condition: {desc}")
                else:
                    st.error("Weather service returned an unexpected error.")

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
