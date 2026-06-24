import { useState } from 'react'

// Read the backend URL from the .env file (falls back to localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Weather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong.')
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Allow pressing Enter to search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') getWeather()
  }

  return (
    <div className="card">
      <h2>🌤️ Weather</h2>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <p className="error">⚠️ {error}</p>}

      {weather && (
        <div className="weather-result">
          <p className="city-name">
            {weather.city}, {weather.country}
          </p>
          <p className="temperature">{weather.temperature_c}°C</p>
          <p className="temperature" style={{ fontSize: '1.3rem', color: '#a0aec0' }}>
            {weather.temperature_f}°F
          </p>
          <p className="description">{weather.description}</p>
        </div>
      )}
    </div>
  )
}

export default Weather
