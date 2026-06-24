import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getWeatherIcon(description) {
  const d = description.toLowerCase()
  if (d.includes('thunder'))                    return '⛈️'
  if (d.includes('blizzard'))                   return '🌨️'
  if (d.includes('heavy snow') || d === 'snow') return '❄️'
  if (d.includes('snow') || d.includes('sleet'))return '🌨️'
  if (d.includes('heavy rain'))                 return '🌧️'
  if (d.includes('rain') || d.includes('shower')) return '🌦️'
  if (d.includes('drizzle'))                    return '🌦️'
  if (d.includes('fog') || d.includes('rime'))  return '🌫️'
  if (d.includes('overcast'))                   return '☁️'
  if (d.includes('partly cloudy'))              return '⛅'
  if (d.includes('mainly clear'))               return '🌤️'
  if (d.includes('clear'))                      return '☀️'
  return '🌡️'
}

const buildMapUrl = (lat, lon) => {
  const pad  = 0.06
  const bbox = `${lon - pad},${lat - pad},${lon + pad},${lat + pad}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
}

export default function Weather() {
  const [city, setCity]       = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const getWeather = async () => {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)
    try {
      const res  = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Something went wrong.')
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') getWeather() }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🌤️</span>
        <h2>Weather</h2>
      </div>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter city name…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-primary" onClick={getWeather} disabled={loading}>
          {loading ? 'Loading…' : 'Search'}
        </button>
      </div>

      {error && <p className="error-msg">⚠️ {error}</p>}

      {weather && (
        <>
          <div className="weather-result-card">
            <div className="weather-icon-large">{getWeatherIcon(weather.description)}</div>
            <p className="weather-city">{weather.city}, {weather.country}</p>
            <p className="weather-temp">{weather.temperature_c}°C</p>
            <p className="weather-temp-f">{weather.temperature_f}°F</p>
            <span className="weather-badge">{weather.description}</span>
          </div>

          <div className="map-wrapper">
            <iframe
              title={`Map of ${weather.city}`}
              src={buildMapUrl(weather.lat, weather.lon)}
              className="weather-map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </>
      )}
    </div>
  )
}
