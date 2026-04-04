import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchExercise({ exercises }) {
  const shuffledRight = useMemo(() => shuffle(exercises.map(e => e.right)), [exercises])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState([])

  const tryMatch = (side, value) => {
    if (matched.includes(value)) return
    let left = selectedLeft, right = selectedRight
    if (side === 'left') left = value
    else right = value

    if (left && right) {
      const pair = exercises.find(e => e.left === left)
      if (pair && pair.right === right) {
        setMatched(prev => [...prev, left, right])
      }
      setSelectedLeft(null)
      setSelectedRight(null)
    } else {
      setSelectedLeft(left)
      setSelectedRight(right)
    }
  }

  const allMatched = matched.length === exercises.length * 2

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🔗</span> Matching / Eşleştirme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Soldan bir kelime, sağdan Türkçe karşılığını seç</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {exercises.map((ex, i) => (
              <button
                key={i}
                onClick={() => tryMatch('left', ex.left)}
                className={`w-full text-center border rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  matched.includes(ex.left)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedLeft === ex.left
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                {ex.left}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {shuffledRight.map((right, i) => (
              <button
                key={i}
                onClick={() => tryMatch('right', right)}
                className={`w-full text-center border rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  matched.includes(right)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedRight === right
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                {right}
              </button>
            ))}
          </div>
        </div>

        {allMatched && (
          <div className="flex items-center gap-3 rounded-xl p-4 mt-4 bg-green-50 border border-green-200">
            <span className="text-2xl">✓</span>
            <span className="text-sm font-medium">Hepsini eşleştirdin! / All matched!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
