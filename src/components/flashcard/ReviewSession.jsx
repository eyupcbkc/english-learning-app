import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, X, ChevronRight, Keyboard, SkipForward } from 'lucide-react'
import FlipCard from './FlipCard'
import BoxIndicator from './BoxIndicator'
import SessionResult from './SessionResult'
import TimerBar from './TimerBar'

export default function ReviewSession({ cards, getCardData, markAnswer, onFinish, timeLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('front')
  const [lastResult, setLastResult] = useState(null)
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeLeft, setTimeLeft] = useState(timeLimit || null)

  const shuffledCards = useMemo(() => {
    return [...cards].sort(() => Math.random() - 0.5)
  }, [cards])

  const currentCard = shuffledCards[currentIndex]
  const cardData = currentCard ? getCardData(currentCard.word) : null
  const total = shuffledCards.length
  const progressPct = total > 0 ? (currentIndex / total) * 100 : 0

  // Timer countdown
  useEffect(() => {
    if (!timeLimit || isComplete) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLimit, isComplete])

  const handleFlip = useCallback(() => {
    if (phase === 'front') setPhase('back')
  }, [phase])

  const handleAnswer = useCallback((correct) => {
    if (phase !== 'back') return
    setPhase('answered')
    setLastResult(correct)
    markAnswer(currentCard.word, correct)
    setSessionResults(prev => [...prev, { word: currentCard.word, turkish: currentCard.turkish, correct, skipped: false }])
  }, [phase, currentCard, markAnswer])

  const handleSkip = useCallback(() => {
    if (phase !== 'front' && phase !== 'back') return
    setSessionResults(prev => [...prev, { word: currentCard.word, turkish: currentCard.turkish, correct: false, skipped: true }])
    if (currentIndex + 1 >= total) { setIsComplete(true); return }
    setPhase('transitioning')
    setTimeout(() => { setCurrentIndex(prev => prev + 1); setLastResult(null); setPhase('front') }, 100)
  }, [phase, currentCard, currentIndex, total])

  const handleNext = useCallback(() => {
    if (phase !== 'answered') return
    if (currentIndex + 1 >= total) { setIsComplete(true); return }
    setPhase('transitioning')
    setTimeout(() => { setCurrentIndex(prev => prev + 1); setLastResult(null); setPhase('front') }, 100)
  }, [phase, currentIndex, total])

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (phase === 'front') setPhase('back'); else if (phase === 'answered') handleNext() }
      if (phase === 'back') { if (e.key === 'ArrowRight' || e.key === '1') handleAnswer(true); if (e.key === 'ArrowLeft' || e.key === '2') handleAnswer(false) }
      if ((e.key === 's' || e.key === 'S') && (phase === 'front' || phase === 'back')) handleSkip()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, handleAnswer, handleNext, handleSkip])

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
  const resetSession = () => {
    setCurrentIndex(0); setPhase('front'); setLastResult(null); setSessionResults([]); setIsComplete(false); setTimeLeft(timeLimit || null)
  }

  if (isComplete) return <SessionResult results={sessionResults} timeElapsed={timeElapsed} onFinish={onFinish} onRetry={resetSession} />
  if (!currentCard || phase === 'transitioning') return null

  return (
    <div className="space-y-6">
      {timeLimit && timeLeft !== null && <TimerBar timeLeft={timeLeft} totalTime={timeLimit} />}

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          {cardData && <BoxIndicator box={cardData.box} />}
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      <FlipCard key={currentIndex} word={currentCard} isFlipped={phase !== 'front'} onFlip={handleFlip} />

      {phase === 'front' && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Space</kbd> çevir
          </p>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
            <SkipForward className="mr-1.5 h-3.5 w-3.5" /> Pas Geç (S)
          </Button>
        </div>
      )}

      {phase === 'back' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-3 w-full max-w-sm">
            <Button variant="outline" size="lg" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 active:scale-95 transition-all" onClick={() => handleAnswer(false)}>
              <X className="mr-2 h-5 w-5" /> Bilmiyorum
            </Button>
            <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 transition-all" onClick={() => handleAnswer(true)}>
              <Check className="mr-2 h-5 w-5" /> Biliyorum
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
            <SkipForward className="mr-1.5 h-3.5 w-3.5" /> Pas Geç
          </Button>
        </div>
      )}

      {phase === 'answered' && (
        <div className="flex flex-col items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            lastResult ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {lastResult ? <><Check className="h-4 w-4" /> Kutu yükseldi</> : <><X className="h-4 w-4" /> Kutu 1'e döndü</>}
          </div>
          <Button size="lg" onClick={handleNext} className="active:scale-95 transition-all">
            {currentIndex + 1 >= total ? 'Sonuçları Gör' : 'Sonraki Kart'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap text-[11px] text-muted-foreground">
        <span><Keyboard className="h-3 w-3 inline" /> Space: Çevir</span>
        <span>←: Bilmiyorum</span>
        <span>→: Biliyorum</span>
        <span>S: Pas</span>
      </div>
    </div>
  )
}
