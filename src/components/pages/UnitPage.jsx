import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import units, { getUnit } from '@/data/unitIndex'
import { useProgress } from '@/hooks/useProgress'
import VocabularyCard from '../shared/VocabularyCard'
import GrammarBox from '../shared/GrammarBox'
import ReadingSection from '../shared/ReadingSection'
import FillBlanks from '../shared/FillBlanks'
import MultipleChoice from '../shared/MultipleChoice'
import MatchExercise from '../shared/MatchExercise'
import SentenceOrder from '../shared/SentenceOrder'
import TranslationExercise from '../shared/TranslationExercise'
import { ArrowLeft, ArrowRight, BookOpen, PenLine, CheckCircle2, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'

const STEPS = [
  { key: 'vocab', label: 'Kelimeler', labelEn: 'Vocabulary', icon: BookOpen },
  { key: 'grammar', label: 'Dilbilgisi', labelEn: 'Grammar', icon: PenLine },
  { key: 'reading', label: 'Okuma', labelEn: 'Reading', icon: BookOpen },
  { key: 'exercises', label: 'Alıştırmalar', labelEn: 'Exercises', icon: CheckCircle2 },
  { key: 'complete', label: 'Tamamla', labelEn: 'Complete', icon: Trophy },
]

export default function UnitPage() {
  const { unitId } = useParams()
  const navigate = useNavigate()
  const unit = getUnit(unitId)
  const { completeUnit, addWords, isUnitCompleted: checkCompleted, saveExerciseScore } = useProgress()
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState({})
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    setStep(0)
    setScores({})
    setCompleted(false)
    window.scrollTo(0, 0)
  }, [unitId])

  useEffect(() => {
    if (unit) setCompleted(checkCompleted(unit.id))
  }, [unit, checkCompleted])

  if (!unit) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Ünite bulunamadı</h2>
          <Button variant="outline" asChild><Link to="/">Ana Sayfaya Dön</Link></Button>
        </CardContent>
      </Card>
    )
  }

  const currentIdx = units.findIndex(u => u.id === unitId)
  const prevUnit = currentIdx > 0 ? units[currentIdx - 1] : null
  const nextUnit = currentIdx < units.length - 1 ? units[currentIdx + 1] : null

  const handleScore = (type, score, total) => {
    setScores(prev => ({ ...prev, [type]: { score, total } }))
  }

  const totalScore = Object.values(scores).reduce((a, s) => a + s.score, 0)
  const totalPossible = Object.values(scores).reduce((a, s) => a + s.total, 0)
  const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0

  const handleComplete = () => {
    addWords(unit.vocabulary.map(v => v.word))
    completeUnit(unit.id, percentage || 100)
    Object.entries(scores).forEach(([type, { score, total }]) => {
      saveExerciseScore(unit.id, type, score, total)
    })
    setCompleted(true)
    setStep(4)
  }

  const goNext = () => { setStep(s => Math.min(s + 1, STEPS.length - 1)); window.scrollTo(0, 0) }
  const goPrev = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo(0, 0) }

  const progressPercent = ((step + 1) / STEPS.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{unit.title}</h1>
            <p className="text-muted-foreground text-sm">{unit.descriptionTr}</p>
            <div className="flex gap-2 mt-2">
              <Badge>{unit.level}</Badge>
              <Badge variant="outline">Module {unit.module}</Badge>
              {completed && <Badge className="bg-green-600 text-white">Tamamlandı</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Step progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i === step
                    ? 'bg-primary text-primary-foreground'
                    : i < step
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                <s.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Step Content */}
      {step === 0 && <VocabularyCard vocabulary={unit.vocabulary} />}
      {step === 1 && <GrammarBox grammar={unit.grammar} />}
      {step === 2 && <ReadingSection reading={unit.reading} />}
      {step === 3 && (
        <div className="space-y-6">
          <FillBlanks exercises={unit.exercises.fillBlanks} onScore={(s, t) => handleScore('fillBlanks', s, t)} />
          <MultipleChoice exercises={unit.exercises.multipleChoice} onScore={(s, t) => handleScore('multipleChoice', s, t)} />
          <MatchExercise exercises={unit.exercises.matching} onScore={(s, t) => handleScore('matching', s, t)} />
          <SentenceOrder exercises={unit.exercises.sentenceOrder} onScore={(s, t) => handleScore('sentenceOrder', s, t)} />
          <TranslationExercise exercises={unit.exercises.translation} onScore={(s, t) => handleScore('translation', s, t)} />
        </div>
      )}
      {step === 4 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mx-auto">
              <Sparkles className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {completed ? 'Ünite Tamamlandı!' : 'Hazır mısın?'}
              </h2>
              <p className="text-muted-foreground">
                {completed
                  ? `${unit.title} ünitesini başarıyla tamamladın!`
                  : 'Tüm bölümleri gözden geçirdin. Üniteyi tamamlayabilirsin.'}
              </p>
            </div>

            {totalPossible > 0 && (
              <div className="space-y-3">
                <div className="text-5xl font-bold text-green-600">%{percentage}</div>
                <p className="text-sm text-muted-foreground">{totalScore} / {totalPossible} doğru</p>
                <Progress value={percentage} className="h-3 max-w-xs mx-auto" />
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {Object.entries(scores).map(([type, { score, total }]) => (
                    <Badge key={type} variant={score === total ? 'default' : 'secondary'} className="text-xs">
                      {type === 'fillBlanks' && 'Boşluk Doldurma'}
                      {type === 'multipleChoice' && 'Çoktan Seçmeli'}
                      {type === 'matching' && 'Eşleştirme'}
                      {type === 'sentenceOrder' && 'Cümle Sıralama'}
                      {type === 'translation' && 'Çeviri'}
                      : {score}/{total}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!completed && (
              <Button size="lg" onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Üniteyi Tamamla
              </Button>
            )}

            {completed && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => { setStep(0); setScores({}) }}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Çalış
                </Button>
                {nextUnit && (
                  <Button asChild>
                    <Link to={`/unit/${nextUnit.id}`}>
                      Sonraki: {nextUnit.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          {step > 0 ? (
            <Button variant="outline" onClick={goPrev} size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" /> {STEPS[step - 1].label}
            </Button>
          ) : prevUnit ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/unit/${prevUnit.id}`}>
                <ChevronLeft className="mr-1 h-4 w-4" /> {prevUnit.title}
              </Link>
            </Button>
          ) : <div />}
        </div>
        <div>
          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} size="sm">
              {STEPS[step + 1].label} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : nextUnit && completed ? (
            <Button size="sm" asChild>
              <Link to={`/unit/${nextUnit.id}`}>
                {nextUnit.title} <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
