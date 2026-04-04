import { useState, useMemo } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchExercise({ exercises }) {
  const shuffledRight = useMemo(() => shuffle(exercises.map(e => e.right)), [exercises])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState([])

  const tryMatch = (side, value) => {
    if (matched.includes(value)) return

    let left = selectedLeft, right = selectedRight
    if (side === 'left') left = value
    else right = value

    if (left && right) {
      const pair = exercises.find(e => e.left === left)
      if (pair && pair.right === right) {
        setMatched(prev => [...prev, left, right])
      }
      setSelectedLeft(null)
      setSelectedRight(null)
    } else {
      setSelectedLeft(left)
      setSelectedRight(right)
    }
  }

  const allMatched = matched.length === exercises.length * 2

  return (
    <div className="card">
      <div className="card-title">🔗 Matching / Eşleştirme</div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Soldan bir kelime, sağdan Türkçe karşılığını seç / Click left then right to match
      </p>
      <div className="match-container">
        <div>
          {exercises.map((ex, i) => (
            <div
              key={i}
              className={`match-item ${selectedLeft === ex.left ? 'selected' : ''} ${matched.includes(ex.left) ? 'matched' : ''}`}
              onClick={() => tryMatch('left', ex.left)}
              style={{ marginBottom: 8 }}
            >
              {ex.left}
            </div>
          ))}
        </div>
        <div>
          {shuffledRight.map((right, i) => (
            <div
              key={i}
              className={`match-item ${selectedRight === right ? 'selected' : ''} ${matched.includes(right) ? 'matched' : ''}`}
              onClick={() => tryMatch('right', right)}
              style={{ marginBottom: 8 }}
            >
              {right}
            </div>
          ))}
        </div>
      </div>

      {allMatched && (
        <div className="score-display">
          <div className="score-number">✓</div>
          <div>Hepsini eşleştirdin! / All matched!</div>
        </div>
      )}
    </div>
  )
}
