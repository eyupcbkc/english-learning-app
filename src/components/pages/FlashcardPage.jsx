import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useFlashcards } from '@/hooks/useFlashcards'
import { useProgress } from '@/hooks/useProgress'
import {
  Volume2, ArrowLeft, Check, X, RotateCcw, Brain,
  Box, ChevronRight, Layers, Trophy, Target, Sparkles,
  Keyboard, Eye, Shuffle,
} from 'lucide-react'

function speak(text) {
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

const BOX_LABELS = {
  1: { label: 'Yeni', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50', borderColor: 'border-red-200' },
  2: { label: 'Öğreniyor', color: 'bg-orange-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' },
  3: { label: 'Tanıdık', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', borderColor: 'border-amber-200' },
  4: { label: 'İyi', color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' },
  5: { label: 'Öğrenildi', color: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50', borderColor: 'border-green-200' },
}

// ─── Flip Card Component ─────────────────────────────────
function FlipCard({ word, isFlipped, onFlip }) {
  return (
    <div
      className="w-full max-w-md mx-auto cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '300px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 p-6 sm:p-8 flex flex-col items-center justify-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center space-y-4">
            <p className="text-2xl sm:text-3xl font-bold text-primary">{word.word}</p>
            <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.word) }}
              className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors active:scale-95"
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </button>
            <p className="text-xs text-muted-foreground pt-2">Kartı çevirmek için tıkla</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50 p-6 sm:p-8 flex flex-col items-center justify-center shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-center space-y-3 w-full">
            <p className="text-xl sm:text-2xl font-bold text-green-700">{word.turkish}</p>
            <div className="border-t pt-3 space-y-2">
              <p className="text-sm text-muted-foreground italic">"{word.example}"</p>
              <p className="text-xs text-muted-foreground">{word.exampleTr}</p>
            </div>
            {word.extra && (
              <div className="border-t pt-3 space-y-1">
                <p className="text-sm text-muted-foreground italic">"{word.extra}"</p>
                <p className="text-xs text-muted-foreground">{word.extraTr}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Box Indicator ───────────────────────────────────────
function BoxIndicator({ box }) {
  const info = BOX_LABELS[box]
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.bgLight} ${info.textColor} ${info.borderColor} border`}>
      <div className={`h-2 w-2 rounded-full ${info.color}`} />
      Kutu {box}: {info.label}
    </div>
  )
}

// ─── Stats Bar ───────────────────────────────────────────
function StatsBar({ stats }) {
  const goalProgress = stats.dailyGoal > 0
    ? Math.min((stats.todayReviewed / stats.dailyGoal) * 100, 100)
    : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: Target, value: `${stats.todayReviewed}/${stats.dailyGoal}`, label: 'Bugün', color: 'bg-blue-500/10 text-blue-600' },
        { icon: Layers, value: stats.dueToday, label: 'Bekleyen', color: 'bg-orange-500/10 text-orange-600' },
        { icon: Brain, value: stats.totalCards, label: 'Toplam Kart', color: 'bg-purple-500/10 text-purple-600' },
        { icon: Trophy, value: stats.learned, label: 'Öğrenildi', color: 'bg-green-500/10 text-green-600' },
      ].map(({ icon: Icon, value, label, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Box Distribution ────────────────────────────────────
function BoxDistribution({ boxCounts, totalCards }) {
  return (
    <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
      {[1, 2, 3, 4, 5].map(box => {
        const count = boxCounts[box] || 0
        const pct = totalCards > 0 ? (count / totalCards) * 100 : 0
        if (pct === 0) return null
        return (
          <div
            key={box}
            className={`${BOX_LABELS[box].color} transition-all duration-500`}
            style={{ width: `${pct}%` }}
            title={`Kutu ${box}: ${count} kelime`}
          />
        )
      })}
    </div>
  )
}

// ─── Review Session ──────────────────────────────────────
// Phase state machine: 'front' → 'back' → 'answered' → 'front' (next card)
function ReviewSession({ cards, getCardData, markAnswer, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('front') // 'front' | 'back' | 'answered'
  const [lastResult, setLastResult] = useState(null) // true | false | null
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)

  const shuffledCards = useMemo(() => {
    return [...cards].sort(() => Math.random() - 0.5)
  }, [cards])

  const currentCard = shuffledCards[currentIndex]
  const cardData = currentCard ? getCardData(currentCard.word) : null
  const total = shuffledCards.length
  const progressPct = total > 0 ? (currentIndex / total) * 100 : 0

  const handleFlip = useCallback(() => {
    if (phase === 'front') setPhase('back')
  }, [phase])

  const handleAnswer = useCallback((correct) => {
    if (phase !== 'back') return
    setPhase('answered')
    setLastResult(correct)
    markAnswer(currentCard.word, correct)
    setSessionResults(prev => [...prev, { word: currentCard.word, turkish: currentCard.turkish, correct }])
  }, [phase, currentCard, markAnswer])

  const handleNext = useCallback(() => {
    if (phase !== 'answered') return
    if (currentIndex + 1 >= total) {
      setIsComplete(true)
      return
    }
    // Reset to front phase, then advance index after a tick
    setPhase('transitioning')
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setLastResult(null)
      setPhase('front')
    }, 100)
  }, [phase, currentIndex, total])

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (phase === 'front') setPhase('back')
        else if (phase === 'answered') handleNext()
      }
      if (phase === 'back') {
        if (e.key === 'ArrowRight' || e.key === '1') handleAnswer(true)
        if (e.key === 'ArrowLeft' || e.key === '2') handleAnswer(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, handleAnswer, handleNext])

  // ── Complete Screen ──
  if (isComplete) {
    const correctCount = sessionResults.filter(r => r.correct).length
    const pct = Math.round((correctCount / sessionResults.length) * 100)
    return (
      <div className="space-y-6">
        <Card className={`border-2 ${pct >= 50 ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <CardContent className="p-6 sm:p-8 text-center space-y-4">
            <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-muted-foreground">
              {sessionResults.length} karttan {correctCount} doğru
            </p>
            {pct >= 80 && <p className="text-green-600 font-medium">Harika gidiyorsun!</p>}
            {pct < 50 && <p className="text-amber-600 font-medium">Tekrar et, gelişeceksin!</p>}
          </CardContent>
        </Card>

        <div className="space-y-2">
          {sessionResults.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.correct ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
              <div className="flex items-center gap-3">
                {r.correct ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                <span className="font-medium text-sm">{r.word}</span>
                <span className="text-xs text-muted-foreground">— {r.turkish}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="outline" onClick={onFinish}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
          </Button>
          <Button onClick={() => {
            setCurrentIndex(0)
            setPhase('front')
            setLastResult(null)
            setSessionResults([])
            setIsComplete(false)
          }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Et
          </Button>
        </div>
      </div>
    )
  }

  if (!currentCard || phase === 'transitioning') return null

  // ── Card View ──
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          {cardData && <BoxIndicator box={cardData.box} />}
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Flip Card — key forces full remount on index change */}
      <FlipCard
        key={currentIndex}
        word={currentCard}
        isFlipped={phase !== 'front'}
        onFlip={handleFlip}
      />

      {/* Phase: FRONT — prompt to flip */}
      {phase === 'front' && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Kartı çevirmek için tıkla veya{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Space</kbd> bas
          </p>
        </div>
      )}

      {/* Phase: BACK — answer buttons */}
      {phase === 'back' && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">Bu kelimeyi biliyor musun?</p>
          <div className="flex gap-3 w-full max-w-sm">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 active:scale-95 transition-all"
              onClick={() => handleAnswer(false)}
            >
              <X className="mr-2 h-5 w-5" /> Bilmiyorum
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
              onClick={() => handleAnswer(true)}
            >
              <Check className="mr-2 h-5 w-5" /> Biliyorum
            </Button>
          </div>
        </div>
      )}

      {/* Phase: ANSWERED — feedback + next */}
      {phase === 'answered' && (
        <div className="flex flex-col items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            lastResult
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {lastResult
              ? <><Check className="h-4 w-4" /> Harika! Kutu yükseldi</>
              : <><X className="h-4 w-4" /> Kutu 1'e döndü — tekrar göreceksin</>
            }
          </div>
          <Button size="lg" onClick={handleNext} className="active:scale-95 transition-all">
            {currentIndex + 1 >= total ? 'Sonuçları Gör' : 'Sonraki Kart'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Keyboard hints */}
      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Keyboard className="h-3 w-3" /> Space: Çevir</span>
        <span>←: Bilmiyorum</span>
        <span>→: Biliyorum</span>
        <span>Enter: Sonraki</span>
      </div>
    </div>
  )
}

// ─── Type Answer Mode ────────────────────────────────────
// Phase: 'typing' → 'checked' → 'typing' (next card)
function TypeSession({ cards, getCardData, markAnswer, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' | 'checked' | 'transitioning'
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)

  const shuffledCards = useMemo(() => {
    return [...cards].sort(() => Math.random() - 0.5)
  }, [cards])

  const currentCard = shuffledCards[currentIndex]
  const total = shuffledCards.length

  const handleCheck = useCallback(() => {
    if (!answer.trim() || phase !== 'typing') return
    const correct = answer.trim().toLowerCase() === currentCard.word.toLowerCase()
    setIsCorrect(correct)
    setPhase('checked')
    markAnswer(currentCard.word, correct)
    setSessionResults(prev => [...prev, { word: currentCard.word, turkish: currentCard.turkish, correct, userAnswer: answer.trim() }])
  }, [answer, phase, currentCard, markAnswer])

  const handleNext = useCallback(() => {
    if (phase !== 'checked') return
    if (currentIndex + 1 >= total) {
      setIsComplete(true)
      return
    }
    setPhase('transitioning')
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setAnswer('')
      setIsCorrect(false)
      setPhase('typing')
    }, 100)
  }, [phase, currentIndex, total])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (phase === 'typing') handleCheck()
        else if (phase === 'checked') handleNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, handleCheck, handleNext])

  if (isComplete) {
    const correctCount = sessionResults.filter(r => r.correct).length
    const pct = Math.round((correctCount / sessionResults.length) * 100)
    return (
      <div className="space-y-6">
        <Card className={`border-2 ${pct >= 50 ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-muted-foreground">
              {sessionResults.length} karttan {correctCount} doğru
            </p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {sessionResults.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.correct ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
              <div className="flex items-center gap-3">
                {r.correct ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                <span className="font-medium text-sm">{r.word}</span>
                <span className="text-xs text-muted-foreground">— {r.turkish}</span>
              </div>
              {!r.correct && <span className="text-xs text-red-500">Senin cevabın: {r.userAnswer}</span>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onFinish}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
          </Button>
          <Button onClick={() => {
            setCurrentIndex(0)
            setAnswer('')
            setPhase('typing')
            setIsCorrect(false)
            setSessionResults([])
            setIsComplete(false)
          }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Et
          </Button>
        </div>
      </div>
    )
  }

  if (!currentCard || phase === 'transitioning') return null
  const cardData = getCardData(currentCard.word)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          {cardData && <BoxIndicator box={cardData.box} />}
        </div>
        <Progress value={(currentIndex / total) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card key={currentIndex} className="border-2 border-primary/20">
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Türkçesi aşağıda, İngilizcesini yaz</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary">{currentCard.turkish}</p>
          <p className="text-sm text-muted-foreground italic">{currentCard.exampleTr}</p>

          <div className="max-w-xs mx-auto space-y-3">
            <Input
              key={currentIndex}
              placeholder="İngilizce karşılığını yaz..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={phase !== 'typing'}
              className={`text-center text-lg ${phase === 'checked' ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}`}
              autoFocus
            />

            {phase === 'checked' && (
              <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {isCorrect ? (
                  <p className="flex items-center justify-center gap-2 font-medium">
                    <Check className="h-4 w-4" /> Doğru!
                  </p>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="flex items-center justify-center gap-2 font-medium">
                      <X className="h-4 w-4" /> Yanlış
                    </p>
                    <p className="text-sm">Doğru cevap: <strong>{currentCard.word}</strong></p>
                  </div>
                )}
              </div>
            )}

            {phase === 'typing' ? (
              <Button className="w-full" onClick={handleCheck} disabled={!answer.trim()}>
                Kontrol Et
              </Button>
            ) : phase === 'checked' ? (
              <Button className="w-full" onClick={handleNext}>
                {currentIndex + 1 >= total ? 'Sonuçları Gör' : 'Sonraki'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────
export default function FlashcardPage() {
  const { progress } = useProgress()
  const {
    dueCards, activeCards, allVocabulary,
    getCardData, markAnswer, initializeAllUnits, stats,
  } = useFlashcards()

  const [mode, setMode] = useState(null) // null = lobby, 'flip', 'type'
  const [filter, setFilter] = useState('due') // 'due', 'all', 'box-1'...'box-5'

  // Initialize words from ALL units
  useEffect(() => {
    initializeAllUnits()
  }, [initializeAllUnits])

  // Get cards based on filter
  const filteredCards = useMemo(() => {
    if (filter === 'due') return dueCards
    if (filter === 'all') return activeCards
    const boxNum = parseInt(filter.split('-')[1])
    return activeCards.filter(v => {
      const card = getCardData(v.word)
      return card && card.box === boxNum
    })
  }, [filter, dueCards, activeCards, getCardData])

  // No cards state
  if (activeCards.length === 0) {
    return (
      <div className="space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl">🃏</div>
            <p className="text-lg font-medium">Henüz flashcard yok</p>
            <p className="text-sm text-muted-foreground">
              Önce bir ünite tamamla, kelimelerin otomatik olarak buraya eklenir.
            </p>
            <Button asChild>
              <Link to="/">Ünitelere Git</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active session
  if (mode === 'flip' && filteredCards.length > 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <ReviewSession
          cards={filteredCards}
          getCardData={getCardData}
          markAnswer={markAnswer}
          onFinish={() => setMode(null)}
        />
      </div>
    )
  }

  if (mode === 'type' && filteredCards.length > 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <TypeSession
          cards={filteredCards}
          getCardData={getCardData}
          markAnswer={markAnswer}
          onFinish={() => setMode(null)}
        />
      </div>
    )
  }

  // ─── Lobby (Main View) ─────────────────────────────────
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Ana Sayfa
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Hafıza Kartları</h1>
        <p className="text-muted-foreground text-sm">Leitner sistemi ile kelime ezberle — her gün tekrar et, kalıcı öğren</p>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Box Distribution */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Kutu dağılımı</span>
          <span>{stats.totalCards} kart</span>
        </div>
        <BoxDistribution boxCounts={stats.boxCounts} totalCards={stats.totalCards} />
        <div className="flex justify-between px-1">
          {[1, 2, 3, 4, 5].map(box => (
            <div key={box} className="text-center">
              <div className={`text-[10px] font-medium ${BOX_LABELS[box].textColor}`}>{stats.boxCounts[box] || 0}</div>
              <div className="text-[10px] text-muted-foreground">{BOX_LABELS[box].label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Review CTA */}
      {dueCards.length > 0 && (
        <Card className="border-primary/30 bg-primary/5 border-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Bugün {dueCards.length} kart tekrar bekliyor</p>
                  <p className="text-sm text-muted-foreground">Hedef: {stats.dailyGoal} kart/gün</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={() => { setFilter('due'); setMode('flip') }}>
                <Eye className="mr-2 h-4 w-4" /> Çevirerek Tekrar
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { setFilter('due'); setMode('type') }}>
                <Keyboard className="mr-2 h-4 w-4" /> Yazarak Tekrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {dueCards.length === 0 && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-5 text-center space-y-2">
            <div className="text-4xl">✅</div>
            <p className="font-semibold text-green-700">Bugünlük tekrar tamamlandı!</p>
            <p className="text-sm text-muted-foreground">Tüm kartları tekrar ettiniz. Yarın tekrar gelin.</p>
          </CardContent>
        </Card>
      )}

      {/* Filter & Practice */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Pratik Yap</h2>
        <div className="flex gap-1.5 p-1 rounded-lg bg-muted">
          {[
            { key: 'due', label: `Bekleyen (${dueCards.length})` },
            { key: 'all', label: `Tümü (${activeCards.length})` },
            { key: 'box-1', label: `Kutu 1 (${stats.boxCounts[1] || 0})` },
            { key: 'box-5', label: `Kutu 5 (${stats.boxCounts[5] || 0})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtered card list */}
        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          {filteredCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Bu filtrede kart yok</p>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <Button size="sm" onClick={() => setMode('flip')}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Çevir ({filteredCards.length})
                </Button>
                <Button size="sm" variant="outline" onClick={() => setMode('type')}>
                  <Keyboard className="mr-1.5 h-3.5 w-3.5" /> Yaz ({filteredCards.length})
                </Button>
              </div>
              {filteredCards.map((v, i) => {
                const card = getCardData(v.word)
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => speak(v.word)}
                        className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
                      >
                        <Volume2 className="h-3.5 w-3.5 text-primary" />
                      </button>
                      <div>
                        <p className="text-sm font-medium">{v.word}</p>
                        <p className="text-xs text-muted-foreground">{v.turkish}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card && <BoxIndicator box={card.box} />}
                      <Badge variant="outline" className="text-[10px]">{v.unitTitle}</Badge>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
