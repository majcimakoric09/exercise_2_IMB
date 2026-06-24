import Weather from './components/Weather'
import DiceSimulator from './components/DiceSimulator'

function App() {
  return (
    <div className="app">
      <h1>🌤️ Weather &amp; 🎲 Dice App</h1>
      <div className="cards">
        <Weather />
        <DiceSimulator />
      </div>
    </div>
  )
}

export default App
