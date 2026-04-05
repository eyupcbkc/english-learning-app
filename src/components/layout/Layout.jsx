import { NavLink, useLocation } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import units from '@/data/unitIndex'
import moduleInfo from '@/data/moduleInfo'
import { useProgress } from '@/hooks/useProgress'
import { useFlashcards } from '@/hooks/useFlashcards'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home, GraduationCap, Layers,
  CheckCircle, ChevronDown, ChevronUp, Flame,
  Menu, X, LogOut, User,
} from 'lucide-react'
import { useState, useEffect } from 'react'

// ─── Reusable Sidebar Link ──────────────────────────────
function SidebarLink({ to, children, icon: Icon, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`
      }
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="h-5 min-w-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

// ─── Reusable Section Header ─────────────────────────────
function SidebarSection({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-2">
        {title}
      </p>
      {children}
    </div>
  )
}

// ─── Sidebar Content (shared between desktop & mobile) ───
function SidebarContent({ onNavigate }) {
  const { isUnitCompleted, progress, getScore } = useProgress()
  const { stats } = useFlashcards()
  const { user, logout } = useAuth()
  const completedCount = progress.completedUnits.length
  const totalUnits = units.length
  const progressPercent = totalUnits > 0 ? (completedCount / totalUnits) * 100 : 0

  const modules = {}
  units.forEach(u => {
    if (!modules[u.module]) modules[u.module] = []
    modules[u.module].push(u)
  })

  const [expandedModules, setExpandedModules] = useState(() => {
    const nextUnit = units.find(u => !isUnitCompleted(u.id))
    return nextUnit ? { [nextUnit.module]: true } : { 1: true }
  })

  const toggleModule = (mod) => {
    setExpandedModules(prev => ({ ...prev, [mod]: !prev[mod] }))
  }

  return (
    <div className="p-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-4">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-none">English Journey</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">A1'den C1'e</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl bg-muted/50 border p-3 mb-4">
        {user && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium truncate">{user.displayName || user.email}</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className="text-xs">{progress.currentLevel}</Badge>
            <span className="text-xs text-muted-foreground">{progress.totalWordsLearned} kelime</span>
          </div>
          {progress.streakDays > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">{progress.streakDays}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>İlerleme</span>
            <span>{completedCount}/{totalUnits} ünite</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Main Navigation */}
      <SidebarSection title="Genel">
        <div className="space-y-0.5">
          <SidebarLink to="/" icon={Home} onClick={onNavigate}>Ana Sayfa</SidebarLink>
          <SidebarLink to="/flashcards" icon={Layers} badge={stats.dueToday} onClick={onNavigate}>
            Hafıza Kartları
          </SidebarLink>
        </div>
      </SidebarSection>

      <Separator className="mb-4" />

      {/* Modules & Units */}
      <SidebarSection title="Dersler">
        <div className="space-y-1">
          {Object.entries(modules).map(([modNum, modUnits]) => {
            const info = moduleInfo[modNum]
            const modCompleted = modUnits.filter(u => isUnitCompleted(u.id)).length
            const allDone = modCompleted === modUnits.length && modUnits.length > 0
            const isExpanded = expandedModules[modNum]

            return (
              <div key={modNum}>
                <button
                  onClick={() => toggleModule(modNum)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent/50 ${
                    allDone ? 'text-green-600' : 'text-foreground'
                  }`}
                >
                  <span className="text-base leading-none">{info?.emoji || '📘'}</span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold leading-tight truncate">
                        {info?.titleTr || `Module ${modNum}`}
                      </p>
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground">
                        {info?.level || 'A1'}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{modCompleted}/{modUnits.length} ünite</p>
                  </div>
                  {allDone ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  ) : (
                    isExpanded
                      ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-3 pl-3 border-l space-y-0.5 mt-0.5 mb-2">
                    {modUnits.map((unit, i) => {
                      const done = isUnitCompleted(unit.id)
                      const score = getScore(unit.id)
                      return (
                        <NavLink
                          key={unit.id}
                          to={`/unit/${unit.id}`}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all ${
                              isActive
                                ? 'bg-primary text-primary-foreground font-medium'
                                : done
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`
                          }
                        >
                          {done ? (
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                          ) : (
                            <span className="h-3 w-3 rounded-full border border-muted-foreground/30 shrink-0 flex items-center justify-center text-[8px]">
                              {i + 1}
                            </span>
                          )}
                          <span className="truncate flex-1">{unit.title}</span>
                          {done && score && (
                            <span className="text-[10px] text-green-500 font-medium">%{score}</span>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SidebarSection>

      <Separator className="mb-4" />

      {/* Quick Stats */}
      <SidebarSection title="İstatistikler">
        <div className="grid grid-cols-2 gap-2 px-1">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground leading-none">{progress.totalWordsLearned}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Kelime</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground leading-none">{stats.learned}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Ezberlenmiş</p>
          </div>
        </div>
      </SidebarSection>

      <Separator className="mb-4" />

      {/* Logout */}
      <div className="px-1">
        <button
          onClick={async () => { await logout(); onNavigate?.() }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}

// ─── Main Layout ─────────────────────────────────────────
export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r bg-card fixed top-0 left-0 bottom-0 overflow-y-auto">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">English Journey</span>
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <aside className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card border-l overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-end p-3">
              <button
                onClick={closeMobile}
                className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent onNavigate={closeMobile} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 pt-16 md:pt-0 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
