import { useState, useEffect, useCallback, memo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Flame, Zap } from 'lucide-react'
import SwipeCard from './SwipeCard'
import SessionResult from './SessionResult'
import TimerBar from './TimerBar'

// Generate a wrong answer from the same level/unit vocabulary
function getWrongAnswer(currentWord, allCards) {
  const sameLevel = allCards.filter(c => c.word !== currentWord.word && c.level === currentWord.level)
  const pool = sameLevel.length >= 3 ? sameLevel : allCards.filter(c => c.word !== currentWord.word)
  return pool[Math.floor(Math.random() * pool.length)]?.turkish || 'yanlış cevap'
}

export default memo(function SwipeSession({ cards, allCards, markAnswer, onFinish, timeLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeLeft, setTimeLeft] = useState(timeLimit || null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [comboFlash, setComboFlash] = useState(null)

  // Shuffle once at session start
  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5))

  // Pre-generate wrong answers and correct sides for all cards
  const [cardConfigs] = useState(() =>
    shuffledCards.map(card => ({
      wrongLabel: getWrongAnswer(card, allCards || cards),
      correctSide: Math.random() > 0.5 ? 'right' : 'left',
    }))
  )

  const total = shuffledCards.length
  const currentCard = shuffledCards[currentIndex]

  // Timer
  useEffect(() => {
    if (!timeLimit || isComplete) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); setIsComplete(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLimit, isComplete])

  const handleSwipe = useCallback((isCorrect) => {
    const card = shuffledCards[currentIndex]
    markAnswer(card.word, isCorrect)

    setSessionResults(prev => [...prev, {
      word: card.word,
      turkish: card.turkish,
      correct: isCorrect,
      skipped: false,
    }])

    // Streak tracking
    if (isCorrect) {
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) setBestStreak(newStreak)
        // Combo milestones
        if (newStreak === 5 || newStreak === 10 || newStreak === 20) {
          setComboFlash(newStreak)
          setTimeout(() => setComboFlash(null), 1500)
        }
        return newStreak
      })
    } else {
      setStreak(0)
    }

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 50 : [50, 30, 50])

    // Next card or complete
    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        setIsComplete(true)
      } else {
        setCurrentIndex(prev => prev + 1)
      }
    }, 300)
  }, [currentIndex, total, shuffledCards, markAnswer, bestStreak])

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
  const resetSession = () => {
    setCurrentIndex(0)
    setSessionResults([])
    setIsComplete(false)
    setStreak(0)
    setBestStreak(0)
    setTimeLeft(timeLimit || null)
  }

  if (isComplete) {
    return <SessionResult results={sessionResults} timeElapsed={timeElapsed} onFinish={onFinish} onRetry={resetSession} />
  }

  if (!currentCard) return null
  const config = cardConfigs[currentIndex]

  return (
    <div className="space-y-5">
      {/* Timer */}
      {timeLimit && timeLeft !== null && <TimerBar timeLeft={timeLeft} totalTime={timeLimit} />}

      {/* Progress + Streak */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          <div className="flex items-center gap-3">
            {streak >= 3 && (
              <span className="flex items-center gap-1 text-orange-500 font-bold animate-pulse">
                <Flame className="h-3.5 w-3.5" /> {streak} seri
              </span>
            )}
          </div>
        </div>
        <Progress value={(currentIndex / total) * 100} className="h-2" />
      </div>

      {/* Combo flash */}
      {comboFlash && (
        <div className="text-center animate-score-pop">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold text-sm border border-amber-200">
            <Zap className="h-4 w-4" /> {comboFlash} COMBO!
          </span>
        </div>
      )}

      {/* Swipe Card */}
      <SwipeCard
        key={currentIndex}
        word={currentCard}
        correctSide={config.correctSide}
        wrongLabel={config.wrongLabel}
        onSwipe={handleSwipe}
      />

      {/* Instructions */}
      <p className="text-center text-xs text-muted-foreground">
        Doğru anlama doğru kaydır
      </p>
    </div>
  )
})
