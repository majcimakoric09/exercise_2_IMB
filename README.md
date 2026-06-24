# Weather & Dice App

A demo web app with a **React** frontend and **Python/FastAPI** backend.
Also includes a standalone **Streamlit** version.

Features: live weather lookup and a dice simulator.

---

## Quick Start (Windows)

You need two terminals open at the same time.

### Step 1 — Get a free weather API key

1. Go to https://openweathermap.org/api and create a free account
2. Copy your API key from the dashboard

### Step 2 — Start the Backend (Terminal 1)

```cmd
cd exercise2\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Open `backend\.env` in Notepad and replace `your_openweathermap_api_key_here` with your real key.

```cmd
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### Step 3 — Start the Frontend (Terminal 2)

```cmd
cd exercise2\frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at: http://localhost:5173  
Open that URL in your browser.

---

## Streamlit Version (standalone)

No separate backend needed — runs everything in one terminal.

```cmd
cd exercise2\streamlit_app
pip install -r requirements.txt
copy .env.example .env
```

Create `streamlit_app\.env` with:
```
WEATHER_API_KEY=your_openweathermap_api_key_here
```

```cmd
streamlit run app.py
```

Opens at: http://localhost:8501

---

## Project Structure

```
exercise2/
├── backend/
│   ├── main.py              # FastAPI app (weather + dice endpoints)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── vercel.json          # Vercel deployment config
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── Weather.jsx
│           └── DiceSimulator.jsx
├── streamlit_app/
│   ├── app.py
│   └── requirements.txt
├── .gitignore
├── README.md
└── business_requirements.md
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/` | Health check |
| GET | `/weather?city=London` | Get current weather |
| GET | `/roll-dice` | Roll two dice |

---

## Deployment

See `business_requirements.md` for full deployment instructions for:
- Vercel (frontend) + Render (backend)
- Streamlit Cloud
- VPS with Nginx (optional)
