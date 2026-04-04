import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUnit } from '../../data/unitIndex'
import { useProgress } from '../../hooks/useProgress'
import VocabularyCard from '../shared/VocabularyCard'
import GrammarBox from '../shared/GrammarBox'
import ReadingSection from '../shared/ReadingSection'
import FillBlanks from '../shared/FillBlanks'
import MultipleChoice from '../shared/MultipleChoice'
import MatchExercise from '../shared/MatchExercise'
import SentenceOrder from '../shared/SentenceOrder'
import TranslationExercise from '../shared/TranslationExercise'

const TABS = [
  { key: 'vocab', label: '📚 Kelimeler' },
  { key: 'grammar', label: '📐 Dilbilgisi' },
  { key: 'reading', label: '📖 Okuma' },
  { key: 'exercises', label: '✏️ Alıştırmalar' },
]

export default function UnitPage() {
  const { unitId } = useParams()
  const unit = getUnit(unitId)
  const [activeTab, setActiveTab] = useState('vocab')
  const { completeUnit, addWords } = useProgress()

  if (!unit) {
    return (
      <div className="card">
        <h2>Ünite bulunamadı / Unit not found</h2>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>Ana Sayfaya Dön</Link>
      </div>
    )
  }

  const handleComplete = () => {
    addWords(unit.vocabulary.map(v => v.word))
    completeUnit(unit.id, 100)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link to="/" style={{ fontSize: 13, color: '#64748b' }}>← Ana Sayfa</Link>
        <h1 style={{ fontSize: 24, marginTop: 8 }}>{unit.title}</h1>
        <p style={{ color: '#64748b' }}>{unit.descriptionTr}</p>
        <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', background: '#eef2ff', color: '#4f46e5', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          {unit.level} — Module {unit.module}
        </span>
      </div>

      <div className="unit-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`unit-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vocab' && <VocabularyCard vocabulary={unit.vocabulary} />}

      {activeTab === 'grammar' && <GrammarBox grammar={unit.grammar} />}

      {activeTab === 'reading' && <ReadingSection reading={unit.reading} />}

      {activeTab === 'exercises' && (
        <div className="exercise-section">
          <FillBlanks exercises={unit.exercises.fillBlanks} />
          <MultipleChoice exercises={unit.exercises.multipleChoice} />
          <MatchExercise exercises={unit.exercises.matching} />
          <SentenceOrder exercises={unit.exercises.sentenceOrder} />
          <TranslationExercise exercises={unit.exercises.translation} />

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn btn-success" onClick={handleComplete} style={{ fontSize: 16, padding: '14px 32px' }}>
              ✅ Üniteyi Tamamla / Complete Unit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
