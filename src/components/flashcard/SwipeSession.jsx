import { useState, useEffect, useCallback, memo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Check, X } from 'lucide-react'
import SwipeCard from './SwipeCard'
import SessionResult from './SessionResult'
import TimerBar from './TimerBar'

function getWrongAnswer(currentWord, allCards) {
  const pool = allCards.filter(c => c.word !== currentWord.word && c.level === currentWord.level)
  const candidates = pool.length >= 3 ? pool : allCards.filter(c => c.word !== currentWord.word)
  return candidates[Math.floor(Math.random() * candidates.length)]?.turkish || '—'
}

export default memo(function SwipeSession({ cards, allCards, markAnswer, onFinish, timeLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [timeLeft, setTimeLeft] = useState(timeLimit || null)
  const [lastFeedback, setLastFeedback] = useState(null) // 'correct' | 'wrong' | null

  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5))
  const [cardConfigs] = useState(() =>
    shuffledCards.map(card => ({
      wrongLabel: getWrongAnswer(card, allCards || cards),
      correctSide: Math.random() > 0.5 ? 'right' : 'left',
    }))
  )

  const total = shuffledCards.length
  const currentCard = shuffledCards[currentIndex]
  const correctCount = sessionResults.filter(r => r.correct).length
  const wrongCount = sessionResults.filter(r => !r.correct).length

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
    setSessionResults(prev => [...prev, { word: card.word, turkish: card.turkish, correct: isCorrect, skipped: false }])

    // Brief feedback flash
    setLastFeedback(isCorrect ? 'correct' : 'wrong')
    if (navigator.vibrate) navigator.vibrate(isCorrect ? 50 : [50, 30, 50])

    setTimeout(() => {
      setLastFeedback(null)
      if (currentIndex + 1 >= total) {
        setIsComplete(true)
      } else {
        setCurrentIndex(prev => prev + 1)
      }
    }, 400)
  }, [currentIndex, total, shuffledCards, markAnswer])

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
  const resetSession = () => {
    setCurrentIndex(0); setSessionResults([]); setIsComplete(false); setTimeLeft(timeLimit || null); setLastFeedback(null)
  }

  if (isComplete) return <SessionResult results={sessionResults} timeElapsed={timeElapsed} onFinish={onFinish} onRetry={resetSession} />
  if (!currentCard) return null

  const config = cardConfigs[currentIndex]

  return (
    <div className="space-y-4">
      {/* Timer */}
      {timeLimit && timeLeft !== null && <TimerBar timeLeft={timeLeft} totalTime={timeLimit} />}

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <Check className="h-3 w-3" /> {correctCount}
            </span>
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <X className="h-3 w-3" /> {wrongCount}
            </span>
          </div>
        </div>
        <Progress value={(currentIndex / total) * 100} className="h-1.5" />
      </div>

      {/* Feedback flash */}
      {lastFeedback && (
        <div className={`text-center py-2 rounded-xl text-sm font-medium animate-fade-in-up ${
          lastFeedback === 'correct' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {lastFeedback === 'correct' ? '✓ Doğru!' : '✗ Yanlış'}
        </div>
      )}

      {/* Swipe Card */}
      {!lastFeedback && (
        <SwipeCard
          key={currentIndex}
          word={currentCard}
          correctSide={config.correctSide}
          wrongLabel={config.wrongLabel}
          onSwipe={handleSwipe}
        />
      )}

      {/* Simple instruction */}
      {!lastFeedback && (
        <p className="text-center text-xs text-muted-foreground">
          Doğru anlama doğru kaydır
        </p>
      )}
    </div>
  )
})
