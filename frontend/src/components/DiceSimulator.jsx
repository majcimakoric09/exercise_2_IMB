import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Unicode dice faces
const DICE_FACES = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' }

function DiceSimulator() {
  const [result, setResult] = useState(null)
  const [rolling, setRolling] = useState(false)

  const rollDice = async () => {
    setRolling(true)

    try {
      const res = await fetch(`${API_URL}/roll-dice`)
      const data = await res.json()

      // Keep the animation running for 700ms, then show the result
      setTimeout(() => {
        setResult(data)
        setRolling(false)
      }, 700)
    } catch {
      setRolling(false)
    }
  }

  return (
    <div className="card">
      <h2>🎲 Dice Simulator</h2>

      <button onClick={rollDice} disabled={rolling}>
        {rolling ? '🎲 Rolling...' : result ? '🎲 Roll Again' : '🎲 Roll Dice'}
      </button>

      {/* Spinning placeholder while waiting */}
      {rolling && (
        <div className="dice-result">
          <div className="dice rolling">
            <span className="die">⚄</span>
            <span className="die">⚂</span>
          </div>
          <p className="dice-values">Rolling...</p>
        </div>
      )}

      {/* Show result after roll completes */}
      {!rolling && result && (
        <div className="dice-result">
          <div className="dice">
            <span className="die">{DICE_FACES[result.die1]}</span>
            <span className="die">{DICE_FACES[result.die2]}</span>
          </div>
          <p className="dice-values">
            Die 1: <strong>{result.die1}</strong>&nbsp;&nbsp;Die 2: <strong>{result.die2}</strong>
          </p>
          <p className="total">Total: {result.total}</p>
        </div>
      )}
    </div>
  )
}

export default DiceSimulator
