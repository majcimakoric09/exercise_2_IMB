import Weather from './components/Weather'
import DiceSimulator from './components/DiceSimulator'

const QUOTES = [
  "Every day is a new opportunity to grow.",
  "Small steps every day lead to big results.",
  "Happiness is found in the little things.",
  "Keep rolling — your lucky day might be next.",
  "Wherever you go, go with all your heart.",
  "Life is short — make every moment count.",
  "A smooth sea never made a skilled sailor.",
  "The best time for a fresh start is right now.",
]

const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather &amp; Dice</h1>
        <p className="app-subtitle">Live weather from anywhere on Earth · Roll the dice · Have fun</p>
      </header>

      <main className="cards">
        <Weather />
        <DiceSimulator />
      </main>

      <footer className="app-footer">
        <div className="footer-divider" />
        <p className="footer-quote">"{randomQuote}"</p>
      </footer>
    </div>
  )
}

export default App
