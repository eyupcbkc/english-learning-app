import { useState, useEffect, useCallback, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Check, X, ChevronRight } from 'lucide-react'
import BoxIndicator from './BoxIndicator'
import SessionResult from './SessionResult'

export default memo(function TypeSession({ cards, getCardData, markAnswer, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [phase, setPhase] = useState('typing')
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionResults, setSessionResults] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(() => Date.now())

  const [shuffledCards] = useState(() => [...cards].sort(() => Math.random() - 0.5))
  const currentCard = shuffledCards[currentIndex]
  const total = shuffledCards.length

  const handleCheck = useCallback(() => {
    if (!answer.trim() || phase !== 'typing') return
    const correct = answer.trim().toLowerCase() === currentCard.word.toLowerCase()
    setIsCorrect(correct)
    setPhase('checked')
    markAnswer(currentCard.word, correct)
    setSessionResults(prev => [...prev, { word: currentCard.word, turkish: currentCard.turkish, correct, skipped: false, userAnswer: answer.trim() }])
  }, [answer, phase, currentCard, markAnswer])

  const handleNext = useCallback(() => {
    if (phase !== 'checked') return
    if (currentIndex + 1 >= total) { setIsComplete(true); return }
    setPhase('transitioning')
    setTimeout(() => { setCurrentIndex(prev => prev + 1); setAnswer(''); setIsCorrect(false); setPhase('typing') }, 100)
  }, [phase, currentIndex, total])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); if (phase === 'typing') handleCheck(); else if (phase === 'checked') handleNext() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, handleCheck, handleNext])

  const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
  const resetSession = () => {
    setCurrentIndex(0); setAnswer(''); setPhase('typing'); setIsCorrect(false); setSessionResults([]); setIsComplete(false)
  }

  if (isComplete) return <SessionResult results={sessionResults} timeElapsed={timeElapsed} onFinish={onFinish} onRetry={resetSession} />
  if (!currentCard || phase === 'transitioning') return null

  const cardData = getCardData(currentCard.word)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1} / {total}</span>
          {cardData && <BoxIndicator box={cardData.box} />}
        </div>
        <Progress value={(currentIndex / total) * 100} className="h-2" />
      </div>

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
                  <p className="flex items-center justify-center gap-2 font-medium"><Check className="h-4 w-4" /> Doğru!</p>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="flex items-center justify-center gap-2 font-medium"><X className="h-4 w-4" /> Yanlış</p>
                    <p className="text-sm">Doğru cevap: <strong>{currentCard.word}</strong></p>
                  </div>
                )}
              </div>
            )}

            {phase === 'typing' ? (
              <Button className="w-full" onClick={handleCheck} disabled={!answer.trim()}>Kontrol Et</Button>
            ) : phase === 'checked' ? (
              <Button className="w-full" onClick={handleNext}>
                {currentIndex + 1 >= total ? 'Sonuçları Gör' : 'Sonraki'} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
