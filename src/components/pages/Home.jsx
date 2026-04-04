import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProgress } from '@/hooks/useProgress'
import units from '@/data/unitIndex'
import { BookOpen, Trophy, Brain, ArrowRight, CheckCircle, Flame, Target } from 'lucide-react'

export default function Home() {
  const { progress, isUnitCompleted, getScore, getUnitProgress } = useProgress()

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
        <p className="text-muted-foreground text-lg">A1'den C1'e adım adım İngilizce</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">{progress.currentLevel}</p>
              <p className="text-xs text-muted-foreground">Seviye</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{completedCount}<span className="text-sm font-normal text-muted-foreground">/{units.length}</span></p>
              <p className="text-xs text-muted-foreground">Ünite</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{progress.totalWordsLearned}</p>
              <p className="text-xs text-muted-foreground">Kelime</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{progress.streakDays}</p>
              <p className="text-xs text-muted-foreground">Gün serisi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      {completedCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" /> Genel İlerleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(completedCount / units.length) * 100} className="h-3 mb-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedCount} / {units.length} ünite tamamlandı</span>
              <span>Ortalama: %{avgScore}</span>
            </div>
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
          <CardContent className="space-y-1">
            {units.filter(u => isUnitCompleted(u.id)).map((unit, i) => (
              <div key={unit.id}>
                {i > 0 && <Separator className="my-1" />}
                <Link
                  to={`/unit/${unit.id}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{unit.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">%{getScore(unit.id)}</Badge>
                  </div>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
