import { Link } from 'react-router-dom'
import { useProgress } from '../../hooks/useProgress'
import units from '../../data/unitIndex'

export default function Home() {
  const { progress, isUnitCompleted, getScore } = useProgress()

  const nextUnit = units.find(u => !isUnitCompleted(u.id))
  const completedCount = progress.completedUnits.length
  const avgScore = completedCount > 0
    ? Math.round(Object.values(progress.scores).reduce((a, b) => a + b, 0) / completedCount)
    : 0

  return (
    <div>
      <div className="home-hero">
        <h1>English Learning Journey</h1>
        <p>A1'den C1'e adım adım İngilizce / Step by step English from A1 to C1</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{progress.currentLevel}</div>
          <div className="stat-label">Mevcut Seviye / Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedCount}/{units.length}</div>
          <div className="stat-label">Tamamlanan / Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{progress.totalWordsLearned}</div>
          <div className="stat-label">Öğrenilen Kelime / Words Learned</div>
        </div>
      </div>

      {completedCount > 0 && (
        <div className="card">
          <div className="card-title">📊 İlerleme / Progress</div>
          <div className="progress-bar-container" style={{ marginBottom: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${(completedCount / units.length) * 100}%` }} />
          </div>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            {completedCount} / {units.length} ünite tamamlandı — Ortalama skor: %{avgScore}
          </p>
        </div>
      )}

      {nextUnit && (
        <div className="card" style={{ borderColor: '#818cf8', background: '#eef2ff' }}>
          <div className="card-title">🎯 Sıradaki Ünite / Next Unit</div>
          <h3 style={{ marginBottom: 4 }}>{nextUnit.title}</h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{nextUnit.descriptionTr}</p>
          <Link to={`/unit/${nextUnit.id}`} className="btn btn-primary">
            Başla / Start →
          </Link>
        </div>
      )}

      {completedCount > 0 && (
        <div className="card">
          <div className="card-title">📋 Tamamlanan Üniteler / Completed Units</div>
          {units.filter(u => isUnitCompleted(u.id)).map(unit => (
            <div key={unit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              <Link to={`/unit/${unit.id}`} style={{ fontSize: 14 }}>
                ✅ {unit.title}
              </Link>
              <span style={{ fontSize: 13, color: '#64748b' }}>Skor: %{getScore(unit.id)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
