import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SentenceOrder({ exercises }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const shuffledWords = useMemo(() => shuffle(exercises[current].words), [current, exercises])

  const addWord = (word) => {
    if (checked || selected.includes(word)) return
    setSelected(prev => [...prev, word])
  }
  const removeWord = (word) => {
    if (checked) return
    setSelected(prev => prev.filter(w => w !== word))
  }

  const check = () => {
    if (selected.join(' ') === exercises[current].correct) setScore(s => s + 1)
    setChecked(true)
  }
  const next = () => { setSelected([]); setChecked(false); setCurrent(c => c + 1) }

  const isLast = current >= exercises.length - 1
  const isCorrect = selected.join(' ') === exercises[current].correct

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🔤</span> Sentence Order / Cümle Sıralama
          <Badge variant="secondary" className="ml-auto">{current + 1}/{exercises.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Builder area */}
        <div className="min-h-[52px] p-3 border-2 border-dashed rounded-xl flex flex-wrap gap-2 items-center">
          {selected.length === 0 && <span className="text-sm text-muted-foreground">Kelimelere tıkla...</span>}
          {selected.map((word, i) => (
            <button key={i} onClick={() => removeWord(word)}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/80 transition-colors">
              {word}
            </button>
          ))}
        </div>

        {/* Word chips */}
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((word, i) => (
            <button key={i} onClick={() => addWord(word)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selected.includes(word)
                  ? 'opacity-30 cursor-default bg-muted'
                  : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer'
              }`}>
              {word}
            </button>
          ))}
        </div>

        {checked && (
          <p className={`text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '✓ Doğru! / Correct!' : `✗ Doğru cevap: ${exercises[current].correct}`}
          </p>
        )}

        <div className="flex gap-2">
          {!checked ? (
            <Button onClick={check} disabled={selected.length !== exercises[current].words.length}>
              Kontrol Et / Check
            </Button>
          ) : !isLast ? (
            <Button onClick={next}>Sonraki / Next →</Button>
          ) : (
            <div className={`flex items-center gap-4 rounded-xl p-4 w-full ${score >= exercises.length / 2 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <span className="text-3xl font-bold">{score}/{exercises.length}</span>
              <span className="text-sm">{score === exercises.length ? 'Harika!' : 'Pratik yap!'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
