import { NavLink } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import units from '@/data/unitIndex'
import { useProgress } from '@/hooks/useProgress'
import { BookOpen, Home, RotateCcw, GraduationCap } from 'lucide-react'

function SidebarLink({ to, children, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`
      }
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const { isUnitCompleted, progress } = useProgress()
  const completedCount = progress.completedUnits.length
  const progressPercent = units.length > 0 ? (completedCount / units.length) * 100 : 0

  const modules = {}
  units.forEach(u => {
    if (!modules[u.module]) modules[u.module] = []
    modules[u.module].push(u)
  })

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-card fixed top-0 left-0 bottom-0 overflow-y-auto">
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">English Journey</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{progress.currentLevel}</Badge>
            <span className="text-xs text-muted-foreground">{progress.totalWordsLearned} kelime</span>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>İlerleme</span>
              <span>{completedCount}/{units.length}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <Separator className="mb-4" />

          {/* Nav */}
          <div className="space-y-1 mb-4">
            <SidebarLink to="/" icon={Home}>Ana Sayfa</SidebarLink>
            <SidebarLink to="/vocab-review" icon={RotateCcw}>Kelime Tekrar</SidebarLink>
          </div>

          <Separator className="mb-4" />

          {/* Units */}
          {Object.entries(modules).map(([modNum, modUnits]) => (
            <div key={modNum} className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                Module {modNum}
              </p>
              <div className="space-y-0.5">
                {modUnits.map(unit => (
                  <NavLink
                    key={unit.id}
                    to={`/unit/${unit.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : isUnitCompleted(unit.id)
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    {isUnitCompleted(unit.id) ? (
                      <span className="text-green-500 text-base">✓</span>
                    ) : (
                      <BookOpen className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{unit.title}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="ml-72 flex-1 p-8 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
