import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function TranslationExercise({ exercises, onScore }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const normalize = (s) => s.trim().toLowerCase().replace(/[.,!?']/g, '')
  const isCorrect = (i) => {
    const ans = normalize(answers[i] || '')
    const ex = exercises[i]
    return [ex.english, ...(ex.acceptAlso || [])].map(normalize).includes(ans)
  }

  const score = exercises.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)

  const check = () => {
    setChecked(true)
    const s = exercises.reduce((acc, _, i) => acc + (isCorrect(i) ? 1 : 0), 0)
    onScore?.(s, exercises.length)
  }

  const reset = () => { setAnswers({}); setChecked(false) }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🌍</span> Translation / Çeviri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">Türkçe cümleleri İngilizce'ye çevir</p>
        {exercises.map((ex, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2">
            <p className="text-sm font-medium">🇹🇷 {ex.turkish}</p>
            <Input
              value={answers[i] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
              placeholder="Write in English..."
              disabled={checked}
              className={checked ? (isCorrect(i) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''}
            />
            {checked && !isCorrect(i) && <p className="text-xs text-red-600">Doğru cevap: <strong>{ex.english}</strong></p>}
            {checked && isCorrect(i) && <p className="text-xs text-green-600 font-medium">✓ Doğru!</p>}
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          {!checked ? (
            <Button onClick={check} disabled={Object.keys(answers).length < exercises.length}>Kontrol Et</Button>
          ) : (
            <Button variant="outline" onClick={reset}>Tekrar Dene</Button>
          )}
        </div>
        {checked && (
          <div className={`flex items-center gap-4 rounded-xl p-4 ${score >= exercises.length / 2 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <span className="text-3xl font-bold">{score}/{exercises.length}</span>
            <span className="text-sm">{score === exercises.length ? 'Mükemmel!' : 'Tekrar dene!'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
