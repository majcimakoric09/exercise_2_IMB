import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const PIPS = {
  1: [5],
  2: [3, 7],
  3: [3, 5, 7],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
}

const SHOW_FACE = {
  1: 'rotateX(0deg)   rotateY(0deg)',
  2: 'rotateX(-90deg) rotateY(0deg)',
  3: 'rotateX(0deg)   rotateY(-90deg)',
  4: 'rotateX(0deg)   rotateY(90deg)',
  5: 'rotateX(90deg)  rotateY(0deg)',
  6: 'rotateX(0deg)   rotateY(180deg)',
}

const RESTING = 'rotateX(-20deg) rotateY(25deg)'

function Face({ value }) {
  const active = PIPS[value]
  return (
    <div className="die-face-pips">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
        <span key={pos} className={`pip ${active.includes(pos) ? 'pip-on' : ''}`} />
      ))}
    </div>
  )
}

function Die({ value, rolling }) {
  const rotation = value ? SHOW_FACE[value] : RESTING
  return (
    <div className="die-scene">
      <div
        className={`die-cube ${rolling ? 'die-rolling' : 'die-resting'}`}
        style={!rolling ? { transform: rotation } : undefined}
      >
        <div className="die-face face-front">  <Face value={1} /></div>
        <div className="die-face face-back">   <Face value={6} /></div>
        <div className="die-face face-right">  <Face value={3} /></div>
        <div className="die-face face-left">   <Face value={4} /></div>
        <div className="die-face face-top">    <Face value={2} /></div>
        <div className="die-face face-bottom"> <Face value={5} /></div>
      </div>
    </div>
  )
}

export default function DiceSimulator() {
  const [result, setResult]   = useState(null)
  const [rolling, setRolling] = useState(false)

  const rollDice = async () => {
    setRolling(true)
    setResult(null)
    try {
      const res  = await fetch(`${API_URL}/roll-dice`)
      const data = await res.json()
      setTimeout(() => {
        setResult(data)
        setRolling(false)
      }, 900)
    } catch {
      setRolling(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🎲</span>
        <h2>Dice Simulator</h2>
      </div>

      <button className="btn-roll" onClick={rollDice} disabled={rolling}>
        {rolling ? '🎲 Rolling…' : result ? '🎲 Roll Again' : '🎲 Roll Dice'}
      </button>

      <div className="dice-3d-row">
        <Die value={result?.die1 ?? null} rolling={rolling} />
        <Die value={result?.die2 ?? null} rolling={rolling} />
      </div>

      {!rolling && result && (
        <div className="dice-result-card">
          <div className="dice-values">
            <div className="die-value-item">
              <span className="die-value-label">Die 1</span>
              <span className="die-value-number">{result.die1}</span>
            </div>
            <div className="dice-separator" />
            <div className="die-value-item">
              <span className="die-value-label">Die 2</span>
              <span className="die-value-number">{result.die2}</span>
            </div>
          </div>
          <div className="dice-total">
            <span className="dice-total-label">Total Score</span>
            <span className="dice-total-value">{result.total}</span>
          </div>
        </div>
      )}
    </div>
  )
}
