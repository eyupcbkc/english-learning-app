import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/hooks/useProgress'
import units from '@/data/unitIndex'
import { BookOpen, Trophy, Brain, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  const { progress, isUnitCompleted, getScore } = useProgress()

  const nextUnit = units.find(u => !isUnitCompleted(u.id))
  const completedCount = progress.completedUnits.length
  const avgScore = completedCount > 0
    ? Math.round(Object.values(progress.scores).reduce((a, b) => a + b, 0) / completedCount)
    : 0

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">English Learning Journey</h1>
        <p className="text-muted-foreground text-lg">
          A1'den C1'e adım adım İngilizce
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.currentLevel}</p>
              <p className="text-sm text-muted-foreground">Mevcut Seviye</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}<span className="text-base font-normal text-muted-foreground">/{units.length}</span></p>
              <p className="text-sm text-muted-foreground">Tamamlanan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.totalWordsLearned}</p>
              <p className="text-sm text-muted-foreground">Öğrenilen Kelime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {completedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Genel İlerleme</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(completedCount / units.length) * 100} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {completedCount} / {units.length} ünite tamamlandı — Ortalama skor: %{avgScore}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Next Unit CTA */}
      {nextUnit && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge>Sıradaki</Badge>
              <Badge variant="outline">{nextUnit.level}</Badge>
            </div>
            <CardTitle>{nextUnit.title}</CardTitle>
            <CardDescription>{nextUnit.descriptionTr}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link to={`/unit/${nextUnit.id}`}>
                Başla <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed units */}
      {completedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tamamlanan Üniteler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {units.filter(u => isUnitCompleted(u.id)).map(unit => (
              <Link
                key={unit.id}
                to={`/unit/${unit.id}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{unit.title}</span>
                </div>
                <Badge variant="secondary">%{getScore(unit.id)}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
