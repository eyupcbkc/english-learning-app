import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/hooks/useProgress'
import { useFlashcards } from '@/hooks/useFlashcards'
import { useAuth } from '@/contexts/AuthContext'
import units from '@/data/unitIndex'
import moduleInfo from '@/data/moduleInfo'
import { BookOpen, Trophy, Brain, ArrowRight, CheckCircle, Flame, Play, ChevronDown, ChevronUp, Sparkles, Layers, Target, TrendingUp } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'İyi geceler'
  if (h < 12) return 'Günaydın'
  if (h < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

function getMotivation(streak, completed) {
  if (streak >= 7) return 'Harika bir seri! Devam et! 🔥'
  if (completed > 0) return 'Kaldığın yerden devam et!'
  return "Bugün yeni bir şey öğrenmeye hazır mısın?"
}

export default function Home() {
  const { progress, isUnitCompleted, getScore } = useProgress()
  const { stats, initializeAllUnits, loaded: flashcardsLoaded } = useFlashcards()
  const { user } = useAuth()
  const [expandedModule, setExpandedModule] = useState(null)

  useEffect(() => {
    if (flashcardsLoaded) initializeAllUnits()
  }, [flashcardsLoaded, initializeAllUnits])

  const nextUnit = units.find(u => !isUnitCompleted(u.id))
  const completedCount = progress.completedUnits.length
  const avgScore = completedCount > 0
    ? Math.round(Object.values(progress.scores).reduce((a, b) => a + b, 0) / completedCount)
    : 0

  const modules = {}
  units.forEach(u => {
    if (!modules[u.module]) modules[u.module] = { units: [], level: u.level }
    modules[u.module].units.push(u)
  })

  const toggleModule = (num) => {
    setExpandedModule(prev => prev === num ? null : num)
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Öğrenci'

  return (
    <div className="space-y-8">
      {/* Hero — Personal greeting */}
      <div className="animate-fade-in-up pt-2 pb-1">
        <p className="text-sm text-muted-foreground mb-1">{getGreeting()}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Merhaba, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          {getMotivation(progress.streakDays, completedCount)}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        {[
          { icon: Trophy, value: progress.currentLevel, label: 'Seviye', color: 'bg-blue-500/10 text-blue-600', accent: 'border-blue-100' },
          { icon: BookOpen, value: `${completedCount}/${units.length}`, label: 'Ünite', color: 'bg-green-500/10 text-green-600', accent: 'border-green-100' },
          { icon: Brain, value: progress.totalWordsLearned, label: 'Kelime', color: 'bg-purple-500/10 text-purple-600', accent: 'border-purple-100' },
          { icon: Flame, value: progress.streakDays, label: 'Gün serisi', color: 'bg-orange-500/10 text-orange-500', accent: 'border-orange-100' },
        ].map(({ icon: Icon, value, label, color, accent }) => (
          <Card key={label} className={`${accent} hover:shadow-md transition-all duration-200`}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      {completedCount > 0 && (
        <div className="space-y-2 animate-fade-in-up">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" /> Genel ilerleme
            </span>
            <span>%{Math.round((completedCount / units.length) * 100)} — Ort. skor: %{avgScore}</span>
          </div>
          <Progress value={(completedCount / units.length) * 100} className="h-2.5 progress-shimmer" />
        </div>
      )}

      {/* Continue CTA + Flashcard CTA side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Continue CTA */}
        {nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="block group">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 h-full hover:shadow-lg hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                      <Play className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-[10px]">{nextUnit.level}</Badge>
                    </div>
                    <Badge className="ml-auto text-[10px]">Sıradaki</Badge>
                  </div>
                  <p className="font-bold text-base mb-1">{nextUnit.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{nextUnit.descriptionTr}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium text-primary">
                  Derse Başla <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Flashcard CTA */}
        {stats.totalCards > 0 && (
          <Link to="/flashcards" className="block group">
            <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
              stats.dueToday > 0
                ? 'border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50 hover:border-orange-300'
                : 'border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 hover:border-green-300'
            }`}>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      stats.dueToday > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'
                    }`}>
                      <Layers className={`h-5 w-5 ${stats.dueToday > 0 ? 'text-orange-600' : 'text-green-600'}`} />
                    </div>
                    {stats.dueToday > 0 && (
                      <span className="h-6 min-w-6 px-2 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {stats.dueToday}
                      </span>
                    )}
                  </div>
                  {stats.dueToday > 0 ? (
                    <>
                      <p className="font-bold text-base mb-1">{stats.dueToday} kelime tekrar bekliyor</p>
                      <p className="text-sm text-muted-foreground">Bugün {stats.todayReviewed}/{stats.dailyGoal} tekrar yapıldı</p>
                      <Progress value={(stats.todayReviewed / stats.dailyGoal) * 100} className="h-1.5 mt-3" />
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-base mb-1 text-green-700">Bugünkü tekrarlar tamam!</p>
                      <p className="text-sm text-muted-foreground">{stats.learned} kelime öğrenildi, {stats.totalCards} kart aktif</p>
                    </>
                  )}
                </div>
                <div className={`flex items-center gap-2 mt-4 text-sm font-medium ${
                  stats.dueToday > 0 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {stats.dueToday > 0 ? 'Tekrar Et' : 'Kartlara Git'} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

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
              <Card className={`transition-all duration-200 hover:shadow-md ${modCompleted === mod.units.length ? 'border-green-200 bg-green-50/20' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 text-2xl">
                      {info?.emoji || '📘'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-bold">Module {modNum}</h2>
                        <Badge variant="outline" className="text-[10px]">{info?.level || mod.level}</Badge>
                        {modCompleted === mod.units.length && mod.units.length > 0 && (
                          <Badge className="bg-green-600 text-white text-[10px]">Tamamlandı</Badge>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">{modCompleted}/{mod.units.length}</span>
                      </div>

                      <p className="font-semibold text-sm mb-0.5">
                        {info?.titleTr || `Module ${modNum}`}
                        {info?.title && <span className="text-muted-foreground font-normal"> — {info.title}</span>}
                      </p>

                      <p className="text-xs text-muted-foreground">{info?.summary}</p>

                      <div className="mt-3">
                        <Progress value={modProgress} className="h-1.5" />
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && info && (
                    <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in-up">
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
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      isNext
                        ? 'border-primary/40 bg-primary/5 shadow-sm hover:shadow-md'
                        : done
                          ? 'border-green-200 bg-green-50/30 hover:border-green-300'
                          : 'border-border hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                      done
                        ? 'bg-green-100 text-green-600'
                        : isNext
                          ? 'bg-primary text-primary-foreground animate-pulse-glow'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {done ? <CheckCircle className="h-5 w-5" /> : isNext ? <Play className="h-4 w-4" /> : String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isNext ? 'text-primary' : ''}`}>{unit.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{unit.descriptionTr}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {done && score && (
                        <Badge variant="secondary" className="text-xs font-semibold">%{score}</Badge>
                      )}
                      {isNext && <Badge className="text-xs">Başla</Badge>}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
