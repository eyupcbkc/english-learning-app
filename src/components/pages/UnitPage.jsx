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
import DialogListening from '../shared/DialogListening'
import ResourcesSection from '../shared/ResourcesSection'
import { ArrowLeft, ArrowRight, BookOpen, PenLine, CheckCircle2, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Trophy, Headphones, LinkIcon, Brain } from 'lucide-react'

const STEPS = [
  { key: 'vocab', label: 'Kelimeler', labelEn: 'Vocabulary', icon: BookOpen },
  { key: 'grammar', label: 'Dilbilgisi', labelEn: 'Grammar', icon: PenLine },
  { key: 'reading', label: 'Okuma', labelEn: 'Reading', icon: BookOpen },
  { key: 'dialog', label: 'Dinleme', labelEn: 'Listening', icon: Headphones },
  { key: 'exercises', label: 'Alıştırmalar', labelEn: 'Exercises', icon: CheckCircle2 },
  { key: 'resources', label: 'Kaynaklar', labelEn: 'Resources', icon: LinkIcon },
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
      <div className="space-y-3">
        {/* Step pills — scrollable on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                i === step
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : i < step
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {i < step ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <s.icon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.labelEn.slice(0, 4)}</span>
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <Progress value={progressPercent} className="h-1.5 progress-shimmer" />
      </div>

      {/* Step Content */}
      {step === 0 && <VocabularyCard vocabulary={unit.vocabulary} />}
      {step === 1 && <GrammarBox grammar={unit.grammar} />}
      {step === 2 && <ReadingSection reading={unit.reading} />}
      {step === 3 && unit.dialog && (
        <DialogListening dialog={unit.dialog} onScore={(s, t) => handleScore('dialog', s, t)} />
      )}
      {step === 4 && (
        <div className="space-y-6">
          <FillBlanks exercises={unit.exercises.fillBlanks} onScore={(s, t) => handleScore('fillBlanks', s, t)} />
          <MultipleChoice exercises={unit.exercises.multipleChoice} onScore={(s, t) => handleScore('multipleChoice', s, t)} />
          <MatchExercise exercises={unit.exercises.matching} onScore={(s, t) => handleScore('matching', s, t)} />
          <SentenceOrder exercises={unit.exercises.sentenceOrder} onScore={(s, t) => handleScore('sentenceOrder', s, t)} />
          <TranslationExercise exercises={unit.exercises.translation} onScore={(s, t) => handleScore('translation', s, t)} />
        </div>
      )}
      {step === 5 && <ResourcesSection resources={unit.resources} />}
      {step === 6 && (
        <Card className="border-green-200 bg-gradient-to-b from-green-50/50 to-emerald-50/30 overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mx-auto animate-score-pop">
              {completed ? (
                <Trophy className="h-10 w-10 text-green-600" />
              ) : (
                <Sparkles className="h-10 w-10 text-green-600" />
              )}
            </div>

            <div className="animate-fade-in-up">
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
              <div className="space-y-4 animate-fade-in-up">
                {/* Big score */}
                <div className="animate-score-pop">
                  <div className={`text-6xl font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    %{percentage}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{totalScore} / {totalPossible} dogru</p>
                </div>

                {/* Score bar */}
                <Progress value={percentage} className="h-3 max-w-xs mx-auto progress-shimmer" />

                {/* Score breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto mt-4">
                  {Object.entries(scores).map(([type, { score, total }]) => {
                    const pct = Math.round((score / total) * 100)
                    const labels = {
                      fillBlanks: 'Boşluk Doldurma',
                      multipleChoice: 'Çoktan Seçmeli',
                      matching: 'Eşleştirme',
                      sentenceOrder: 'Cümle Sıralama',
                      translation: 'Çeviri',
                      dialog: 'Diyalog',
                    }
                    return (
                      <div key={type} className={`rounded-xl p-3 border ${
                        pct === 100 ? 'bg-green-50 border-green-200' : 'bg-background border-border'
                      }`}>
                        <p className="text-[10px] text-muted-foreground mb-1">{labels[type] || type}</p>
                        <p className={`text-sm font-bold ${pct === 100 ? 'text-green-600' : ''}`}>{score}/{total}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Vocabulary badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-medium">{unit.vocabulary.length} yeni kelime</span>
              <span className="text-muted-foreground">hafıza kartlarına eklendi</span>
            </div>

            {!completed && (
              <Button size="lg" onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 shadow-lg shadow-green-600/20">
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
                  <Button asChild size="lg" className="shadow-md">
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
