import { useState } from 'react'

export default function VocabularyCard({ vocabulary }) {
  const [flipped, setFlipped] = useState({})

  const toggle = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div className="card">
      <div className="card-title">📚 Vocabulary / Kelimeler</div>
      <div className="vocab-grid">
        {vocabulary.map((item, i) => (
          <div key={i} className="vocab-card" onClick={() => toggle(i)}>
            <div className="word">{item.word}</div>
            <div className="pronunciation">{item.pronunciation}</div>
            {flipped[i] ? (
              <>
                <div className="turkish">{item.turkish}</div>
                <div className="example">"{item.example}"</div>
                <div className="example" style={{ color: '#64748b', fontSize: 12 }}>{item.exampleTr}</div>
              </>
            ) : (
              <div className="turkish" style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 13 }}>
                Çeviri için tıkla
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
