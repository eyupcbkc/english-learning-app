import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/hooks/useProgress'
import units from '@/data/unitIndex'
import moduleInfo from '@/data/moduleInfo'
import { BookOpen, Trophy, Brain, ArrowRight, CheckCircle, Flame, Play, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

export default function Home() {
  const { progress, isUnitCompleted, getScore } = useProgress()
  const [expandedModule, setExpandedModule] = useState(null)

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

  const toggleModule = (num) => {
    setExpandedModule(prev => prev === num ? null : num)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-2xl font-bold tracking-tight mb-1">English Learning Journey</h1>
        <p className="text-muted-foreground">A1'den C1'e adım adım İngilizce</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Trophy, value: progress.currentLevel, label: 'Seviye', color: 'bg-primary/10 text-primary' },
          { icon: BookOpen, value: `${completedCount}/${units.length}`, label: 'Ünite', color: 'bg-green-500/10 text-green-600' },
          { icon: Brain, value: progress.totalWordsLearned, label: 'Kelime', color: 'bg-amber-500/10 text-amber-600' },
          { icon: Flame, value: progress.streakDays, label: 'Gün serisi', color: 'bg-orange-500/10 text-orange-500' },
        ].map(({ icon: Icon, value, label, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
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

      {/* Modules & Units */}
      {Object.entries(modules).map(([modNum, mod]) => {
        const info = moduleInfo[modNum]
        const modCompleted = mod.units.filter(u => isUnitCompleted(u.id)).length
        const isExpanded = expandedModule === Number(modNum)
        const modProgress = (modCompleted / mod.units.length) * 100

        return (
          <div key={modNum} className="space-y-3">
            {/* Module Header */}
            <button
              onClick={() => toggleModule(Number(modNum))}
              className="w-full text-left"
            >
              <Card className={`transition-all hover:shadow-md ${modCompleted === mod.units.length ? 'border-green-200 bg-green-50/20' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Module emoji */}
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 text-2xl">
                      {info?.emoji || '📘'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-bold">Module {modNum}</h2>
                        <Badge variant="outline" className="text-[10px]">{info?.level || mod.level}</Badge>
                        {modCompleted === mod.units.length && mod.units.length > 0 && (
                          <Badge className="bg-green-600 text-white text-[10px]">Tamamlandı</Badge>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">{modCompleted}/{mod.units.length}</span>
                      </div>

                      {/* Module name */}
                      <p className="font-semibold text-sm mb-0.5">
                        {info?.titleTr || `Module ${modNum}`}
                        {info?.title && <span className="text-muted-foreground font-normal"> — {info.title}</span>}
                      </p>

                      {/* Summary */}
                      <p className="text-xs text-muted-foreground">{info?.summary}</p>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <Progress value={modProgress} className="h-1.5" />
                      </div>
                    </div>

                    {/* Expand arrow */}
                    <div className="shrink-0 pt-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Expanded: module description + skills */}
                  {isExpanded && info && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <div>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          Bu modülde neler yapabileceksin:
                        </p>
                        <ul className="space-y-1.5">
                          {info.skills.map((skill, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </button>

            {/* Unit List */}
            <div className="grid grid-cols-1 gap-2 pl-2">
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
                    {/* Icon */}
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

                    {/* Right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {done && score && <Badge variant="secondary" className="text-xs">%{score}</Badge>}
                      {isNext && <Badge className="text-xs">Başla</Badge>}
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
