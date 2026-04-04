import { useState } from 'react'

export default function ReadingSection({ reading }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (qIndex, optIndex) => {
    if (showResults) return
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }))
  }

  const score = reading.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)

  return (
    <div className="card">
      <div className="card-title">📖 Reading / Okuma</div>
      <div className="reading-text">{reading.text}</div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, fontStyle: 'italic' }}>{reading.textTr}</p>

      {reading.questions.map((q, qi) => (
        <div key={qi} className="exercise-question">
          <p><strong>{qi + 1}.</strong> {q.question}</p>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{q.questionTr}</p>
          <div className="options-grid">
            {q.options.map((opt, oi) => {
              let cls = 'option-btn'
              if (answers[qi] === oi) cls += ' selected'
              if (showResults && oi === q.correct) cls += ' correct'
              if (showResults && answers[qi] === oi && oi !== q.correct) cls += ' wrong'
              return (
                <button key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {Object.keys(answers).length === reading.questions.length && !showResults && (
        <button className="btn btn-primary" onClick={() => setShowResults(true)}>
          Kontrol Et / Check
        </button>
      )}

      {showResults && (
        <div className={`score-display ${score < reading.questions.length / 2 ? 'low' : ''}`}>
          <div className="score-number">{score}/{reading.questions.length}</div>
          <div>
            {score === reading.questions.length ? 'Mükemmel! / Perfect!' : 'Tekrar dene! / Try again!'}
          </div>
        </div>
      )}
    </div>
  )
}
