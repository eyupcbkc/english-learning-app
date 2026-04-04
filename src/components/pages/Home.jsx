import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProgress } from '@/hooks/useProgress'
import units from '@/data/unitIndex'
import { BookOpen, Trophy, Brain, ArrowRight, CheckCircle, Flame, Lock, Play } from 'lucide-react'

export default function Home() {
  const { progress, isUnitCompleted, getScore } = useProgress()

  const nextUnit = units.find(u => !isUnitCompleted(u.id))
  const completedCount = progress.completedUnits.length
  const avgScore = completedCount > 0
    ? Math.round(Object.values(progress.scores).reduce((a, b) => a + b, 0) / completedCount)
    : 0

  // Group units by module
  const modules = {}
  units.forEach(u => {
    if (!modules[u.module]) modules[u.module] = { units: [], level: u.level }
    modules[u.module].units.push(u)
  })

  return (
    <div className="space-y-8">
      {/* Hero - compact */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-2xl font-bold tracking-tight mb-1">English Learning Journey</h1>
        <p className="text-muted-foreground">A1'den C1'e adım adım İngilizce</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{progress.currentLevel}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Seviye</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{completedCount}<span className="text-xs font-normal text-muted-foreground">/{units.length}</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Ünite</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Brain className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{progress.totalWordsLearned}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Kelime</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{progress.streakDays}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Gün serisi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      {completedCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Genel ilerleme</span>
            <span>%{Math.round((completedCount / units.length) * 100)} — Ort. skor: %{avgScore}</span>
          </div>
          <Progress value={(completedCount / units.length) * 100} className="h-2" />
        </div>
      )}

      {/* Continue CTA */}
      {nextUnit && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge>Sıradaki</Badge>
                <Badge variant="outline">{nextUnit.level}</Badge>
              </div>
              <p className="font-semibold">{nextUnit.title}</p>
              <p className="text-sm text-muted-foreground">{nextUnit.descriptionTr}</p>
            </div>
            <Button asChild size="lg" className="shrink-0 ml-4">
              <Link to={`/unit/${nextUnit.id}`}>
                Başla <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Units by Module */}
      {Object.entries(modules).map(([modNum, mod]) => {
        const modCompleted = mod.units.filter(u => isUnitCompleted(u.id)).length
        return (
          <div key={modNum}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Module {modNum}</h2>
                <Badge variant="outline" className="text-[10px]">{mod.level}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{modCompleted}/{mod.units.length} tamamlandı</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {mod.units.map((unit, i) => {
                const done = isUnitCompleted(unit.id)
                const isNext = nextUnit?.id === unit.id
                const score = getScore(unit.id)

                return (
                  <Link
                    key={unit.id}
                    to={`/unit/${unit.id}`}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isNext
                        ? 'border-primary/40 bg-primary/5 shadow-sm'
                        : done
                          ? 'border-green-200 bg-green-50/30 hover:border-green-300'
                          : 'border-border hover:border-primary/30 hover:bg-accent/50'
                    }`}
                  >
                    {/* Number */}
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                      done
                        ? 'bg-green-100 text-green-600'
                        : isNext
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {done ? <CheckCircle className="h-5 w-5" /> : isNext ? <Play className="h-4 w-4" /> : String(i + 1).padStart(2, '0')}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isNext ? 'text-primary' : ''}`}>{unit.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{unit.descriptionTr}</p>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                      {done && score && (
                        <Badge variant="secondary" className="text-xs">%{score}</Badge>
                      )}
                      {isNext && (
                        <Badge className="text-xs">Başla</Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
