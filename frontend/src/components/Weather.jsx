import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default marker icons — they break with Vite's asset bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Moves the map centre whenever the city changes
function RecenterMap({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], 11)
  }, [lat, lon, map])
  return null
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
        <>
          <div className="weather-result">
            <p className="city-name">{weather.city}, {weather.country}</p>
            <p className="temperature">{weather.temperature_c}°C</p>
            <p className="temperature" style={{ fontSize: '1.3rem', color: '#a0aec0' }}>
              {weather.temperature_f}°F
            </p>
            <p className="description">{weather.description}</p>
          </div>

          {/* Interactive map centred on the city */}
          <div className="weather-map-wrapper">
            <MapContainer
              center={[weather.lat, weather.lon]}
              zoom={11}
              className="weather-map"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap lat={weather.lat} lon={weather.lon} />
              <Marker position={[weather.lat, weather.lon]}>
                <Popup>{weather.city}, {weather.country}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </>
      )}
    </div>
  )
}
