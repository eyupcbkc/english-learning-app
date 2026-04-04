import { useState, useMemo } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SentenceOrder({ exercises }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWords = useMemo(
    () => shuffle(exercises[current].words),
    [current, exercises]
  )

  const addWord = (word) => {
    if (checked) return
    if (selected.includes(word)) return
    setSelected(prev => [...prev, word])
  }

  const removeWord = (word) => {
    if (checked) return
    setSelected(prev => prev.filter(w => w !== word))
  }

  const check = () => {
    const isCorrect = selected.join(' ') === exercises[current].correct
    if (isCorrect) setScore(s => s + 1)
    setChecked(true)
  }

  const next = () => {
    setSelected([])
    setChecked(false)
    setCurrent(c => c + 1)
  }

  const isLast = current >= exercises.length - 1
  const isCorrect = selected.join(' ') === exercises[current].correct

  return (
    <div className="card">
      <div className="card-title">🔤 Sentence Order / Cümle Sıralama</div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Kelimeleri doğru sıraya diz / Put the words in correct order ({current + 1}/{exercises.length})
      </p>

      <div className="sentence-builder">
        {selected.length === 0 && <span style={{ color: '#94a3b8' }}>Kelimelere tıkla...</span>}
        {selected.map((word, i) => (
          <span key={i} className="word-chip" onClick={() => removeWord(word)}>
            {word}
          </span>
        ))}
      </div>

      <div className="word-chips" style={{ marginTop: 12 }}>
        {shuffledWords.map((word, i) => (
          <span
            key={i}
            className={`word-chip ${selected.includes(word) ? 'used' : ''}`}
            onClick={() => addWord(word)}
          >
            {word}
          </span>
        ))}
      </div>

      {checked && (
        <p style={{ color: isCorrect ? '#22c55e' : '#ef4444', fontWeight: 600, margin: '8px 0' }}>
          {isCorrect ? '✓ Doğru! / Correct!' : `✗ Doğru cevap: ${exercises[current].correct}`}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {!checked ? (
          <button className="btn btn-primary" onClick={check}
            disabled={selected.length !== exercises[current].words.length}>
            Kontrol Et / Check
          </button>
        ) : !isLast ? (
          <button className="btn btn-primary" onClick={next}>Sonraki / Next →</button>
        ) : (
          <div className={`score-display ${score < exercises.length / 2 ? 'low' : ''}`}>
            <div className="score-number">{score}/{exercises.length}</div>
            <div>{score === exercises.length ? 'Harika! / Excellent!' : 'Pratik yap! / Keep practicing!'}</div>
          </div>
        )}
      </div>
    </div>
  )
}
