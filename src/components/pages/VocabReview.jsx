import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProgress } from '@/hooks/useProgress'
import units from '@/data/unitIndex'
import { Volume2, ArrowLeft } from 'lucide-react'

function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

export default function VocabReview() {
  const { progress } = useProgress()
  const [showAnswer, setShowAnswer] = useState({})

  const allWords = useMemo(() => {
    return units
      .filter(u => progress.completedUnits.includes(u.id))
      .flatMap(u => u.vocabulary)
  }, [progress.completedUnits])

  if (allWords.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-lg font-medium">Henüz tamamlanan ünite yok</p>
          <p className="text-sm text-muted-foreground">Önce bir ünite bitir, sonra kelime tekrarı yapabilirsin.</p>
          <Button variant="outline" asChild>
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfa</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const toggle = (i) => setShowAnswer(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Kelime Tekrar</h1>
        <p className="text-muted-foreground">
          Toplam {allWords.length} kelime — Kartlara tıklayarak kendini test et!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allWords.map((item, i) => (
          <div key={i} onClick={() => toggle(i)}
            className="group border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-primary">{item.word}</p>
                <p className="text-xs text-muted-foreground">{item.pronunciation}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); speak(item.word) }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Volume2 className="h-4 w-4 text-primary" />
              </button>
            </div>
            {showAnswer[i] ? (
              <div className="mt-3 pt-3 border-t space-y-1">
                <p className="text-sm font-medium">{item.turkish}</p>
                <p className="text-sm text-muted-foreground italic">"{item.example}"</p>
              </div>
            ) : (
              <p className="mt-3 pt-3 border-t text-xs text-muted-foreground italic">
                Hatırlıyor musun? Tıkla!
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
