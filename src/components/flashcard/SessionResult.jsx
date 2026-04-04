import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, SkipForward, Clock, ArrowLeft, RotateCcw } from 'lucide-react'

export default function SessionResult({ results, timeElapsed, onFinish, onRetry }) {
  const correctCount = results.filter(r => r.correct).length
  const skippedCount = results.filter(r => r.skipped).length
  const answeredCount = results.filter(r => !r.skipped).length
  const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className={`border-2 ${pct >= 50 ? 'border-green-200 bg-gradient-to-b from-green-50/50 to-emerald-50/30' : 'border-red-200 bg-gradient-to-b from-red-50/50 to-orange-50/30'}`}>
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          <div className="text-5xl animate-score-pop">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
          <p className="text-4xl font-bold animate-score-pop">{pct}%</p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-green-600 font-medium">{correctCount} doğru</span>
            <span className="text-red-500 font-medium">{answeredCount - correctCount} yanlış</span>
            {skippedCount > 0 && <span className="text-muted-foreground">{skippedCount} pas</span>}
          </div>
          {timeElapsed != null && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" /> {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')} sürdü
            </p>
          )}
          {pct >= 80 && <p className="text-green-600 font-medium">Harika gidiyorsun!</p>}
          {pct < 50 && pct > 0 && <p className="text-amber-600 font-medium">Tekrar et, gelişeceksin!</p>}
        </CardContent>
      </Card>

      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
        {results.map((r, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
            r.skipped ? 'border-border bg-muted/30' : r.correct ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
          }`}>
            <div className="flex items-center gap-3">
              {r.skipped ? <SkipForward className="h-4 w-4 text-muted-foreground" /> : r.correct ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
              <span className="font-medium text-sm">{r.word}</span>
              <span className="text-xs text-muted-foreground">— {r.turkish}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="outline" onClick={onFinish}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
        </Button>
        <Button onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Et
        </Button>
      </div>
    </div>
  )
}
