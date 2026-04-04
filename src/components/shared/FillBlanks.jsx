import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function FillBlanks({ exercises }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const isCorrect = (i) => answers[i]?.trim().toLowerCase() === exercises[i].answer.toLowerCase()
  const score = exercises.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)
  const reset = () => { setAnswers({}); setChecked(false) }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>✏️</span> Fill in the Blanks / Boşluk Doldurma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercises.map((ex, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2">
            <p className="text-sm font-medium">{ex.sentence.replace('___', '______')}</p>
            <p className="text-xs text-muted-foreground">İpucu: {ex.hint}</p>
            <Input
              value={answers[i] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
              placeholder="Cevabını yaz..."
              disabled={checked}
              className={checked ? (isCorrect(i) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}
            />
            {checked && !isCorrect(i) && (
              <p className="text-xs text-red-600">Doğru cevap: <strong>{ex.answer}</strong></p>
            )}
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
            <span className="text-sm">{score === exercises.length ? 'Harika! / Excellent!' : 'Pratik yap! / Keep practicing!'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
