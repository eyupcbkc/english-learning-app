import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function MultipleChoice({ exercises }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const handleSelect = (qi, oi) => {
    if (checked) return
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const reset = () => { setAnswers({}); setChecked(false) }
  const score = exercises.reduce((acc, ex, i) => acc + (answers[i] === ex.correct ? 1 : 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🔘</span> Multiple Choice / Çoktan Seçmeli
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((ex, qi) => (
          <div key={qi} className="rounded-xl border p-4 space-y-3">
            <p className="text-sm font-medium"><span className="text-primary font-bold">{qi + 1}.</span> {ex.question}</p>
            <div className="grid grid-cols-2 gap-2">
              {ex.options.map((opt, oi) => {
                let cls = 'border rounded-lg px-4 py-2.5 text-sm text-left transition-all cursor-pointer '
                if (checked && oi === ex.correct) cls += 'border-green-500 bg-green-50 text-green-700'
                else if (checked && answers[qi] === oi && oi !== ex.correct) cls += 'border-red-500 bg-red-50 text-red-700'
                else if (answers[qi] === oi) cls += 'border-primary bg-primary/5 text-primary'
                else cls += 'border-border hover:border-primary/50 hover:bg-accent'
                return (
                  <button key={oi} className={cls} onClick={() => handleSelect(qi, oi)}>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          {!checked ? (
            <Button onClick={() => setChecked(true)} disabled={Object.keys(answers).length < exercises.length}>
              Kontrol Et / Check
            </Button>
          ) : (
            <Button variant="outline" onClick={reset}>Tekrar Dene / Retry</Button>
          )}
        </div>

        {checked && (
          <div className={`flex items-center gap-4 rounded-xl p-4 ${score >= exercises.length / 2 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <span className="text-3xl font-bold">{score}/{exercises.length}</span>
            <span className="text-sm">{score === exercises.length ? 'Mükemmel! / Perfect!' : 'Tekrar dene! / Try again!'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
