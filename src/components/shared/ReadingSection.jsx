import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ReadingSection({ reading }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (qIndex, optIndex) => {
    if (showResults) return
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }))
  }

  const score = reading.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>📖</span> Reading / Okuma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Text */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5">
          <p className="text-sm leading-relaxed">{reading.text}</p>
        </div>
        <p className="text-xs text-muted-foreground italic leading-relaxed">{reading.textTr}</p>

        {/* Questions */}
        {reading.questions.map((q, qi) => (
          <div key={qi} className="rounded-xl border p-5 space-y-3">
            <p className="font-medium text-sm"><span className="text-primary font-bold">{qi + 1}.</span> {q.question}</p>
            <p className="text-xs text-muted-foreground">{q.questionTr}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                let cls = 'border rounded-lg px-4 py-2.5 text-sm text-left transition-all cursor-pointer '
                if (showResults && oi === q.correct) cls += 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700'
                else if (showResults && answers[qi] === oi && oi !== q.correct) cls += 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700'
                else if (answers[qi] === oi) cls += 'border-primary bg-primary/5 text-primary'
                else cls += 'border-border hover:border-primary/50 hover:bg-accent'
                return (
                  <button key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {Object.keys(answers).length === reading.questions.length && !showResults && (
          <Button onClick={() => setShowResults(true)}>Kontrol Et / Check</Button>
        )}

        {showResults && (
          <div className={`flex items-center gap-4 rounded-xl p-4 ${score >= reading.questions.length / 2 ? 'bg-green-50 dark:bg-green-950/20 border border-green-200' : 'bg-red-50 dark:bg-red-950/20 border border-red-200'}`}>
            <span className="text-3xl font-bold">{score}/{reading.questions.length}</span>
            <span className="text-sm">{score === reading.questions.length ? 'Mükemmel! / Perfect!' : 'Tekrar dene! / Try again!'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
