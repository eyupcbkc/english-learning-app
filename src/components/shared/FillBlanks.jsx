import { useState } from 'react'

export default function FillBlanks({ exercises }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const handleChange = (i, value) => {
    setAnswers(prev => ({ ...prev, [i]: value }))
  }

  const checkAll = () => setChecked(true)
  const reset = () => { setAnswers({}); setChecked(false) }

  const score = exercises.reduce((acc, ex, i) =>
    acc + (answers[i]?.trim().toLowerCase() === ex.answer.toLowerCase() ? 1 : 0), 0)

  return (
    <div className="card">
      <div className="card-title">✏️ Fill in the Blanks / Boşluk Doldurma</div>

      {exercises.map((ex, i) => {
        const isCorrect = answers[i]?.trim().toLowerCase() === ex.answer.toLowerCase()
        return (
          <div key={i} className="exercise-question">
            <p>{ex.sentence.replace('___', '______')}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>İpucu: {ex.hint}</p>
            <input
              type="text"
              className={`exercise-input ${checked ? (isCorrect ? 'correct' : 'wrong') : ''}`}
              value={answers[i] || ''}
              onChange={e => handleChange(i, e.target.value)}
              placeholder="Cevabını yaz..."
              disabled={checked}
            />
            {checked && !isCorrect && (
              <p style={{ color: '#ef4444', fontSize: 13, marginTop: 4 }}>
                Doğru cevap: <strong>{ex.answer}</strong>
              </p>
            )}
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {!checked ? (
          <button className="btn btn-primary" onClick={checkAll}
            disabled={Object.keys(answers).length < exercises.length}>
            Kontrol Et / Check
          </button>
        ) : (
          <button className="btn btn-outline" onClick={reset}>Tekrar Dene / Retry</button>
        )}
      </div>

      {checked && (
        <div className={`score-display ${score < exercises.length / 2 ? 'low' : ''}`}>
          <div className="score-number">{score}/{exercises.length}</div>
          <div>{score === exercises.length ? 'Harika! / Excellent!' : 'Pratik yap! / Keep practicing!'}</div>
        </div>
      )}
    </div>
  )
}
