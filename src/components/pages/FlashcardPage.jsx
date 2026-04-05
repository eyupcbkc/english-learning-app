import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFlashcards } from '@/hooks/useFlashcards'
import {
  ArrowLeft, Eye, Keyboard, Timer, Volume2, Hand, ChevronRight,
  Target, Layers, Brain, Trophy,
} from 'lucide-react'
import { BOX_LABELS, speak } from '@/components/flashcard/speak'
import { BoxDistribution } from '@/components/flashcard/BoxIndicator'
import SpeedControl from '@/components/shared/SpeedControl'
import ReviewSession from '@/components/flashcard/ReviewSession'
import TypeSession from '@/components/flashcard/TypeSession'
import SwipeSession from '@/components/flashcard/SwipeSession'

// ─── Mode Card ───────────────────────────────────────────
function ModeCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border hover:border-primary/40 hover:shadow-sm active:scale-[0.99] transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </button>
  )
}

// ─── Setup Screen (seviye + süre seçimi) ─────────────────
function SetupScreen({ activeCards, onStart, onBack, title, icon: Icon }) {
  const [level, setLevel] = useState(null)
  const [duration, setDuration] = useState(null) // null = sınırsız

  const levels = useMemo(() => {
    const map = {}
    activeCards.forEach(v => {
      if (!map[v.level]) map[v.level] = 0
      map[v.level]++
    })
    return Object.entries(map).sort()
  }, [activeCards])

  const cards = useMemo(() => {
    if (!level) return []
    return activeCards.filter(v => v.level === level)
  }, [level, activeCards])

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Geri
      </button>

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      {/* Seviye */}
      <div>
        <p className="text-sm font-medium mb-2">Seviye</p>
        <div className="grid grid-cols-3 gap-2">
          {levels.map(([lv, count]) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                level === lv
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <p className="text-sm font-bold">{lv}</p>
              <p className="text-[10px] text-muted-foreground">{count} kelime</p>
            </button>
          ))}
        </div>
      </div>

      {/* Süre */}
      {level && (
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium mb-2">Süre</p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { val: null, label: 'Sınırsız' },
              { val: 60, label: '1 dk' },
              { val: 180, label: '3 dk' },
              { val: 300, label: '5 dk' },
              { val: 600, label: '10 dk' },
            ].map(d => (
              <button
                key={String(d.val)}
                onClick={() => setDuration(d.val)}
                className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                  duration === d.val
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <p className="text-xs font-semibold">{d.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Başla */}
      {level && (
        <Button
          size="lg"
          className="w-full py-5 text-sm animate-fade-in-up"
          onClick={() => onStart(cards, duration)}
        >
          Başla — {cards.length} kelime
          {duration && ` · ${duration / 60} dk`}
        </Button>
      )}
    </div>
  )
}

// ─── Session Wrapper ─────────────────────────────────────
function SessionWrapper({ children, onExit }) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Çık
      </button>
      {children}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────
export default function FlashcardPage() {
  const {
    dueCards, activeCards, loaded,
    getCardData, markAnswer, initializeAllUnits, stats,
  } = useFlashcards()

  const [mode, setMode] = useState(null)
  const [sessionCards, setSessionCards] = useState([])
  const [sessionTime, setSessionTime] = useState(null)

  useEffect(() => {
    if (loaded) initializeAllUnits()
  }, [loaded, initializeAllUnits])

  const startSession = (cards, time) => {
    setSessionCards(cards)
    setSessionTime(time)
  }

  const exitSession = () => {
    setMode(null)
    setSessionCards([])
    setSessionTime(null)
  }

  // ── Loading ──
  if (!loaded) {
    return (
      <div className="space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <div className="p-12 text-center">
          <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // ── Setup Screens ──
  if (mode === 'swipe-setup') {
    return <SetupScreen activeCards={activeCards} icon={Hand} title="Kaydırarak Öğren"
      onBack={() => setMode(null)}
      onStart={(c, t) => { startSession(c, t); setMode('swipe') }} />
  }
  if (mode === 'flip-setup') {
    return <SetupScreen activeCards={activeCards} icon={Eye} title="Çevirerek Öğren"
      onBack={() => setMode(null)}
      onStart={(c, t) => { startSession(c, t); setMode('flip') }} />
  }
  if (mode === 'type-setup') {
    return <SetupScreen activeCards={activeCards} icon={Keyboard} title="Yazarak Öğren"
      onBack={() => setMode(null)}
      onStart={(c, t) => { startSession(c, t); setMode('type') }} />
  }

  // ── Active Sessions ──
  if (mode === 'swipe' && sessionCards.length > 0) {
    return (
      <SessionWrapper onExit={exitSession}>
        <SwipeSession cards={sessionCards} allCards={activeCards} markAnswer={markAnswer}
          onFinish={exitSession} timeLimit={sessionTime} />
      </SessionWrapper>
    )
  }
  if (mode === 'flip' && sessionCards.length > 0) {
    return (
      <SessionWrapper onExit={exitSession}>
        <ReviewSession cards={sessionCards} getCardData={getCardData} markAnswer={markAnswer}
          onFinish={exitSession} timeLimit={sessionTime} />
      </SessionWrapper>
    )
  }
  if (mode === 'type' && sessionCards.length > 0) {
    return (
      <SessionWrapper onExit={exitSession}>
        <TypeSession cards={sessionCards} getCardData={getCardData} markAnswer={markAnswer}
          onFinish={exitSession} />
      </SessionWrapper>
    )
  }

  // ── Lobby ──
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Ana Sayfa
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hafıza Kartları</h1>
          <p className="text-sm text-muted-foreground mt-1">Seviye seç, mod seç, öğrenmeye başla</p>
        </div>
        <SpeedControl compact />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Target, value: stats.todayReviewed, label: 'Bugün', color: 'text-blue-600' },
          { icon: Layers, value: stats.dueToday, label: 'Bekleyen', color: 'text-orange-600' },
          { icon: Brain, value: stats.totalCards, label: 'Toplam', color: 'text-purple-600' },
          { icon: Trophy, value: stats.learned, label: 'Bilen', color: 'text-green-600' },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="text-center p-3 rounded-xl border">
            <Icon className={`h-4 w-4 mx-auto mb-1.5 ${color}`} />
            <p className="text-base font-bold leading-none">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Box Distribution */}
      <div>
        <BoxDistribution boxCounts={stats.boxCounts} totalCards={stats.totalCards} />
        <div className="flex justify-between px-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map(box => (
            <div key={box} className="text-center">
              <span className={`text-[10px] font-medium ${BOX_LABELS[box].textColor}`}>{stats.boxCounts[box] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mod Seçimi */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Nasıl çalışmak istersin?</h2>
        <div className="space-y-2">
          <ModeCard
            icon={Hand}
            title="Kaydırarak Öğren"
            desc="Doğru anlama kaydır — hızlı ve eğlenceli"
            onClick={() => setMode('swipe-setup')}
          />
          <ModeCard
            icon={Eye}
            title="Çevirerek Öğren"
            desc="Kartı çevir, biliyorum / bilmiyorum seç"
            onClick={() => setMode('flip-setup')}
          />
          <ModeCard
            icon={Keyboard}
            title="Yazarak Öğren"
            desc="Türkçe'yi gör, İngilizce'sini yaz"
            onClick={() => setMode('type-setup')}
          />
        </div>
      </div>

      {/* Kelime Listesi */}
      <details className="group">
        <summary className="text-sm font-semibold cursor-pointer flex items-center gap-2 py-2 select-none">
          Tüm Kelimeler
          <Badge variant="secondary" className="text-[10px]">{activeCards.length}</Badge>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-open:rotate-90 transition-transform ml-auto" />
        </summary>
        <div className="space-y-1 mt-2 max-h-[400px] overflow-y-auto">
          {activeCards.slice(0, 60).map((v, i) => {
            const card = getCardData(v.word)
            return (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => speak(v.word)}
                    className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all shrink-0"
                  >
                    <Volume2 className="h-3 w-3 text-primary" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{v.word}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{v.turkish}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {card && (
                    <div className={`h-2 w-2 rounded-full ${BOX_LABELS[card.box].color}`} title={`Kutu ${card.box}`} />
                  )}
                  <span className="text-[9px] text-muted-foreground">{v.level}</span>
                </div>
              </div>
            )
          })}
          {activeCards.length > 60 && (
            <p className="text-[11px] text-muted-foreground text-center py-3">
              +{activeCards.length - 60} kelime daha
            </p>
          )}
        </div>
      </details>
    </div>
  )
}
