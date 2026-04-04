import { useState } from 'react'

export default function TranslationExercise({ exercises }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const normalize = (s) => s.trim().toLowerCase().replace(/[.,!?']/g, '')

  const isCorrect = (i) => {
    const ans = normalize(answers[i] || '')
    const ex = exercises[i]
    const accepted = [ex.english, ...(ex.acceptAlso || [])].map(normalize)
    return accepted.includes(ans)
  }

  const score = exercises.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)
  const reset = () => { setAnswers({}); setChecked(false) }

  return (
    <div className="card">
      <div className="card-title">🌍 Translation / Çeviri</div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Türkçe cümleleri İngilizce'ye çevir / Translate Turkish sentences to English
      </p>

      {exercises.map((ex, i) => (
        <div key={i} className="exercise-question">
          <p><strong>🇹🇷</strong> {ex.turkish}</p>
          <input
            type="text"
            className={`exercise-input ${checked ? (isCorrect(i) ? 'correct' : 'wrong') : ''}`}
            value={answers[i] || ''}
            onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
            placeholder="Write in English..."
            disabled={checked}
          />
          {checked && !isCorrect(i) && (
            <p style={{ color: '#ef4444', fontSize: 13, marginTop: 4 }}>
              Doğru cevap: <strong>{ex.english}</strong>
            </p>
          )}
          {checked && isCorrect(i) && (
            <p style={{ color: '#22c55e', fontSize: 13, marginTop: 4 }}>✓ Doğru! / Correct!</p>
          )}
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
