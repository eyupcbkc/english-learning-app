import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import units from '../../data/unitIndex'

export default function VocabReview() {
  const { progress } = useProgress()
  const [showAnswer, setShowAnswer] = useState({})

  const allWords = useMemo(() => {
    const completed = progress.completedUnits
    return units
      .filter(u => completed.includes(u.id))
      .flatMap(u => u.vocabulary)
  }, [progress.completedUnits])

  if (allWords.length === 0) {
    return (
      <div className="card">
        <div className="card-title">🔄 Kelime Tekrar / Vocabulary Review</div>
        <p>Henüz tamamlanan ünite yok. Önce bir ünite bitir!</p>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
          No completed units yet. Complete a unit first!
        </p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
          ← Ana Sayfa / Home
        </Link>
      </div>
    )
  }

  const toggle = (i) => setShowAnswer(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🔄 Kelime Tekrar / Vocabulary Review</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Toplam {allWords.length} kelime — Kartlara tıklayarak kendini test et!
      </p>

      <div className="vocab-grid">
        {allWords.map((item, i) => (
          <div key={i} className="vocab-card" onClick={() => toggle(i)}>
            <div className="word">{item.word}</div>
            <div className="pronunciation">{item.pronunciation}</div>
            {showAnswer[i] ? (
              <>
                <div className="turkish">{item.turkish}</div>
                <div className="example">"{item.example}"</div>
              </>
            ) : (
              <div className="turkish" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
                Hatırlıyor musun? Tıkla! / Remember? Click!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
