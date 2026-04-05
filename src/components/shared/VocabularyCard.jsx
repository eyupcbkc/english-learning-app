import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Volume2, ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { speak } from '@/components/flashcard/speak'

export default function VocabularyCard({ vocabulary }) {
  const [flipped, setFlipped] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'single'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const toggle = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))
  const viewedCount = Object.keys(flipped).filter(k => flipped[k]).length

  const goNext = () => setCurrentIndex(i => Math.min(i + 1, vocabulary.length - 1))
  const goPrev = () => setCurrentIndex(i => Math.max(i - 1, 0))

  const toggleAll = () => {
    if (showAll) {
      setFlipped({})
      setShowAll(false)
    } else {
      const all = {}
      vocabulary.forEach((_, i) => { all[i] = true })
      setFlipped(all)
      setShowAll(true)
    }
  }

  const renderCard = (item, i) => (
    <div
      key={i}
      onClick={() => toggle(i)}
      className={`group border rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        flipped[i]
          ? 'border-primary/30 bg-primary/[0.02] shadow-sm'
          : 'border-border hover:border-primary/40'
      }`}
    >
      {/* Word header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-primary">{item.word}</p>
            <Badge variant="outline" className="text-[10px] font-normal">{item.pronunciation}</Badge>
          </div>
          {!flipped[i] && (
            <p className="text-xs text-muted-foreground mt-1">Anlamı görmek için tıkla</p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); speak(item.word) }}
          className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Volume2 className="h-4 w-4 text-primary" />
        </button>
      </div>

      {/* Expanded content */}
      {flipped[i] && (
        <div className="mt-3 pt-3 border-t border-dashed space-y-3 animate-fade-in-up">
          <p className="text-base font-semibold">{item.turkish}</p>

          {/* Example 1 */}
          <div className="rounded-xl bg-muted/50 p-3 space-y-1">
            <div className="flex items-start gap-2">
              <p className="text-sm flex-1">"{item.example}"</p>
              <button
                onClick={(e) => { e.stopPropagation(); speak(item.example) }}
                className="shrink-0 h-7 w-7 rounded-lg bg-background border flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{item.exampleTr}</p>
          </div>

          {/* Example 2 */}
          {item.extra && (
            <div className="rounded-xl bg-muted/50 p-3 space-y-1">
              <div className="flex items-start gap-2">
                <p className="text-sm flex-1">"{item.extra}"</p>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(item.extra) }}
                  className="shrink-0 h-7 w-7 rounded-lg bg-background border flex items-center justify-center hover:bg-primary/10 transition-colors"
                >
                  <Volume2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{item.extraTr}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <span>📚</span> Vocabulary / Kelimeler
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{viewedCount}/{vocabulary.length} görüldü</Badge>
            {/* View mode toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  viewMode === 'single' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                Tek Kart
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <Progress value={(viewedCount / vocabulary.length) * 100} className="h-1.5" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            Kartlara tıklayarak anlamını ve örnekleri gör.
          </p>
          <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs h-7 px-2">
            {showAll ? <EyeOff className="h-3 w-3 mr-1.5" /> : <Eye className="h-3 w-3 mr-1.5" />}
            {showAll ? 'Hepsini Kapat' : 'Hepsini Aç'}
          </Button>
        </div>

        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vocabulary.map((item, i) => renderCard(item, i))}
          </div>
        ) : (
          /* Single Card View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={goPrev} disabled={currentIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Önceki
              </Button>
              <span className="text-sm font-medium">{currentIndex + 1} / {vocabulary.length}</span>
              <Button variant="outline" size="sm" onClick={goNext} disabled={currentIndex === vocabulary.length - 1}>
                Sonraki <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="max-w-md mx-auto">
              {renderCard(vocabulary[currentIndex], currentIndex)}
            </div>

            {/* Mini word strip */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {vocabulary.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                    i === currentIndex
                      ? 'bg-primary text-primary-foreground'
                      : flipped[i]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
