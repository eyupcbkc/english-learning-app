import { useState } from 'react'

export default function MultipleChoice({ exercises }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const handleSelect = (qi, oi) => {
    if (checked) return
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const reset = () => { setAnswers({}); setChecked(false) }
  const score = exercises.reduce((acc, ex, i) => acc + (answers[i] === ex.correct ? 1 : 0), 0)

  return (
    <div className="card">
      <div className="card-title">🔘 Multiple Choice / Çoktan Seçmeli</div>

      {exercises.map((ex, qi) => (
        <div key={qi} className="exercise-question">
          <p><strong>{qi + 1}.</strong> {ex.question}</p>
          <div className="options-grid">
            {ex.options.map((opt, oi) => {
              let cls = 'option-btn'
              if (answers[qi] === oi) cls += ' selected'
              if (checked && oi === ex.correct) cls += ' correct'
              if (checked && answers[qi] === oi && oi !== ex.correct) cls += ' wrong'
              return (
                <button key={oi} className={cls} onClick={() => handleSelect(qi, oi)}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {!checked ? (
          <button className="btn btn-primary" onClick={() => setChecked(true)}
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
          <div>{score === exercises.length ? 'Mükemmel! / Perfect!' : 'Tekrar dene! / Try again!'}</div>
        </div>
      )}
    </div>
  )
}
