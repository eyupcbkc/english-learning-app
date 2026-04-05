import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFlashcards } from '@/hooks/useFlashcards'
import {
  ArrowLeft, Eye, Keyboard, Zap, Timer, Sparkles, X, Volume2, Hand,
} from 'lucide-react'
import { BOX_LABELS, speak } from '@/components/flashcard/speak'
import StatsBar from '@/components/flashcard/StatsBar'
import { BoxDistribution } from '@/components/flashcard/BoxIndicator'
import ReviewSession from '@/components/flashcard/ReviewSession'
import TypeSession from '@/components/flashcard/TypeSession'
import SwipeSession from '@/components/flashcard/SwipeSession'

export default function FlashcardPage() {
  const {
    dueCards, activeCards, loaded,
    getCardData, markAnswer, initializeAllUnits, stats,
  } = useFlashcards()

  const [mode, setMode] = useState(null)
  const [filter, setFilter] = useState('due')
  const [levelFilter, setLevelFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [timedLevel, setTimedLevel] = useState(null)
  const [timedDuration, setTimedDuration] = useState(null)

  // Initialize ALL unit words into flashcards — runs after Firestore data is loaded
  useEffect(() => {
    if (loaded) initializeAllUnits()
  }, [loaded, initializeAllUnits])

  // Available units for filter
  const availableUnits = useMemo(() => {
    let cards = activeCards
    if (levelFilter !== 'all') cards = cards.filter(v => v.level === levelFilter)
    const unitSet = new Map()
    cards.forEach(v => { if (!unitSet.has(v.unitId)) unitSet.set(v.unitId, v.unitTitle) })
    return [['all', 'Tüm Üniteler'], ...Array.from(unitSet.entries())]
  }, [activeCards, levelFilter])

  // Level stats
  const levelStats = useMemo(() => {
    const map = {}
    activeCards.forEach(v => {
      const card = getCardData(v.word)
      if (!map[v.level]) map[v.level] = { total: 0, learned: 0, due: 0 }
      map[v.level].total++
      if (card?.box === 5) map[v.level].learned++
    })
    dueCards.forEach(v => { if (map[v.level]) map[v.level].due++ })
    return map
  }, [activeCards, dueCards, getCardData])

  // Filtered cards
  const filteredCards = useMemo(() => {
    let cards = filter === 'due' ? dueCards : filter === 'all' ? activeCards : activeCards.filter(v => {
      const card = getCardData(v.word)
      return card && card.box === parseInt(filter.split('-')[1])
    })
    if (levelFilter !== 'all') cards = cards.filter(v => v.level === levelFilter)
    if (unitFilter !== 'all') cards = cards.filter(v => v.unitId === unitFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      cards = cards.filter(v => v.word.toLowerCase().includes(q) || v.turkish.toLowerCase().includes(q))
    }
    return cards
  }, [filter, levelFilter, unitFilter, search, dueCards, activeCards, getCardData])

  // Timed session cards
  const timedCards = useMemo(() => {
    if (!timedLevel) return []
    return activeCards.filter(v => v.level === timedLevel)
  }, [timedLevel, activeCards])

  // ── Loading State ──
  if (!loaded) {
    return (
      <div className="space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Kartlar yükleniyor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Timed Setup Screen ──
  if (mode === 'timed-setup') {
    const levels = [...new Set(activeCards.map(v => v.level))].sort()
    const durations = [
      { seconds: 60, label: '1 dk', icon: '⚡' },
      { seconds: 180, label: '3 dk', icon: '🔥' },
      { seconds: 300, label: '5 dk', icon: '💪' },
      { seconds: 600, label: '10 dk', icon: '🧠' },
    ]
    return (
      <div className="space-y-6 max-w-lg mx-auto animate-fade-in-up">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mx-auto">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Zamanlı Oturum</h2>
          <p className="text-sm text-muted-foreground">Seviye ve süre seç, kaç kelime bilebileceğini gör!</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold">Seviye Seç</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {levels.map(level => {
              const count = activeCards.filter(v => v.level === level).length
              return (
                <button key={level} onClick={() => setTimedLevel(level)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${timedLevel === level ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'}`}>
                  <p className="text-lg font-bold">{level}</p>
                  <p className="text-xs text-muted-foreground">{count} kelime</p>
                </button>
              )
            })}
          </div>
        </div>
        {timedLevel && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-sm font-semibold">Süre Seç</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {durations.map(d => (
                <button key={d.seconds} onClick={() => setTimedDuration(d.seconds)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${timedDuration === d.seconds ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'}`}>
                  <p className="text-2xl mb-1">{d.icon}</p>
                  <p className="text-sm font-bold">{d.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {timedLevel && timedDuration && (
          <Button size="lg" className="w-full text-lg py-6 animate-fade-in-up" onClick={() => setMode('timed')}>
            <Timer className="mr-2 h-5 w-5" /> {timedLevel} — {timedDuration / 60} dakika Başla!
          </Button>
        )}
      </div>
    )
  }

  // ── Active Sessions ──
  if (mode === 'timed' && timedCards.length > 0 && timedDuration) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Çık
        </button>
        <ReviewSession cards={timedCards} getCardData={getCardData} markAnswer={markAnswer}
          onFinish={() => { setMode(null); setTimedLevel(null); setTimedDuration(null) }} timeLimit={timedDuration} />
      </div>
    )
  }

  if (mode === 'swipe' && filteredCards.length > 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <SwipeSession cards={filteredCards} allCards={activeCards} markAnswer={markAnswer} onFinish={() => setMode(null)} />
      </div>
    )
  }

  if (mode === 'flip' && filteredCards.length > 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <ReviewSession cards={filteredCards} getCardData={getCardData} markAnswer={markAnswer} onFinish={() => setMode(null)} />
      </div>
    )
  }

  if (mode === 'type' && filteredCards.length > 0) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Geri Dön
        </button>
        <TypeSession cards={filteredCards} getCardData={getCardData} markAnswer={markAnswer} onFinish={() => setMode(null)} />
      </div>
    )
  }

  // ── Lobby ──
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Ana Sayfa
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Hafıza Kartları</h1>
        <p className="text-muted-foreground text-sm">Leitner sistemi ile kelime ezberle — her gün tekrar et, kalıcı öğren</p>
      </div>

      <StatsBar stats={stats} />

      {/* Box Distribution */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Kutu dağılımı</span>
          <span>{stats.totalCards} kart</span>
        </div>
        <BoxDistribution boxCounts={stats.boxCounts} totalCards={stats.totalCards} />
        <div className="flex justify-between px-1">
          {[1, 2, 3, 4, 5].map(box => (
            <div key={box} className="text-center">
              <div className={`text-[10px] font-medium ${BOX_LABELS[box].textColor}`}>{stats.boxCounts[box] || 0}</div>
              <div className="text-[10px] text-muted-foreground">{BOX_LABELS[box].label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Due Cards CTA */}
      {dueCards.length > 0 && (
        <Card className="border-primary/30 bg-primary/5 border-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Bugün {dueCards.length} kart tekrar bekliyor</p>
                <p className="text-sm text-muted-foreground">Hedef: {stats.dailyGoal} kart/gün</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button onClick={() => { setFilter('due'); setMode('swipe') }}>
                <Hand className="mr-1.5 h-4 w-4" /> Kaydır
              </Button>
              <Button variant="outline" onClick={() => { setFilter('due'); setMode('flip') }}>
                <Eye className="mr-1.5 h-4 w-4" /> Çevir
              </Button>
              <Button variant="outline" onClick={() => { setFilter('due'); setMode('type') }}>
                <Keyboard className="mr-1.5 h-4 w-4" /> Yaz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {dueCards.length === 0 && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-5 text-center space-y-2">
            <div className="text-4xl">✅</div>
            <p className="font-semibold text-green-700">Bugünlük tekrar tamamlandı!</p>
            <p className="text-sm text-muted-foreground">Tüm kartları tekrar ettiniz. Yarın tekrar gelin.</p>
          </CardContent>
        </Card>
      )}

      {/* Timed Challenge */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30 hover:shadow-lg transition-all cursor-pointer" onClick={() => setMode('timed-setup')}>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base">Zamanlı Oturum</p>
              <p className="text-sm text-muted-foreground">Seviye ve süre seç, kendini test et!</p>
            </div>
            <div className="flex gap-1.5">
              {['1dk', '3dk', '5dk', '10dk'].map(t => (
                <span key={t} className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">{t}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Overview */}
      {Object.keys(levelStats).length > 1 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Seviye Bazlı İlerleme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(levelStats).sort().map(([level, s]) => (
              <button key={level} onClick={() => { setLevelFilter(level === levelFilter ? 'all' : level); setUnitFilter('all') }}
                className={`p-3 rounded-xl border text-left transition-all ${levelFilter === level ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-primary/30 hover:bg-accent/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={levelFilter === level ? 'default' : 'outline'} className="text-[10px]">{level}</Badge>
                  <span className="text-[10px] text-muted-foreground">{s.total} kelime</span>
                </div>
                <Progress value={(s.learned / s.total) * 100} className="h-1.5 mb-1" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{s.learned} öğrenildi</span>
                  {s.due > 0 && <span className="text-orange-600 font-medium">{s.due} bekliyor</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Filtrele ve Pratik Yap</h2>

        <div className="relative">
          <input type="text" placeholder="Kelime veya anlam ara..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50" />
          {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
        </div>

        <div className="flex gap-1.5 p-1 rounded-lg bg-muted overflow-x-auto">
          {[
            { key: 'due', label: `Bekleyen (${dueCards.length})` },
            { key: 'all', label: `Tümü (${activeCards.length})` },
            ...([1,2,3,4,5].map(b => ({ key: `box-${b}`, label: `Kutu ${b}` }))),
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {availableUnits.length > 2 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {availableUnits.map(([key, label]) => (
              <button key={key} onClick={() => setUnitFilter(key)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${unitFilter === key ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-muted-foreground hover:bg-accent'}`}>
                {key === 'all' ? 'Tüm Üniteler' : label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{filteredCards.length} kelime bulundu</p>
          {filteredCards.length > 0 && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setMode('swipe')}><Hand className="mr-1.5 h-3.5 w-3.5" /> Kaydır</Button>
              <Button size="sm" variant="outline" onClick={() => setMode('flip')}><Eye className="mr-1.5 h-3.5 w-3.5" /> Çevir</Button>
              <Button size="sm" variant="outline" onClick={() => setMode('type')}><Keyboard className="mr-1.5 h-3.5 w-3.5" /> Yaz</Button>
            </div>
          )}
        </div>

        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {filteredCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Bu filtrede kart yok</p>
          ) : (
            filteredCards.map((v, i) => {
              const card = getCardData(v.word)
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border hover:border-primary/30 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                    <button onClick={() => speak(v.word)} className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all shrink-0">
                      <Volume2 className="h-3.5 w-3.5 text-primary" />
                    </button>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{v.word}</p>
                      <p className="text-xs text-muted-foreground">{v.turkish}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card && (
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${BOX_LABELS[card.box].bgLight} ${BOX_LABELS[card.box].textColor} border ${BOX_LABELS[card.box].borderColor}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${BOX_LABELS[card.box].color}`} />
                        {card.box}
                      </div>
                    )}
                    <Badge variant="outline" className="text-[10px] hidden sm:flex">{v.level}</Badge>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
