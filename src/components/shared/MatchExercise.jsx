import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Volume2, Check, X, RotateCcw, Shuffle, Zap } from 'lucide-react'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function speak(text) {
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

// ─── Inline Toast Notification ───────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-sm font-medium ${
        type === 'success'
          ? 'bg-green-50 border-green-200 text-green-700'
          : type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
      }`}>
        {type === 'success' && <Check className="h-4 w-4" />}
        {type === 'error' && <X className="h-4 w-4" />}
        {type === 'info' && <Zap className="h-4 w-4" />}
        {message}
      </div>
    </div>
  )
}

// ─── Match Card ──────────────────────────────────────────
function MatchCard({ text, side, state, onClick, shaking }) {
  const isEnglish = side === 'left'

  const stateClasses = {
    default: 'border-border bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm',
    selected: 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-md scale-[1.02]',
    matched: 'border-green-400 bg-green-50 text-green-700 shadow-sm',
    wrong: 'border-red-400 bg-red-50 text-red-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={state === 'matched'}
      className={`
        group relative w-full border-2 rounded-xl px-4 py-3.5 text-sm font-medium
        transition-all duration-200 ease-out
        ${stateClasses[state] || stateClasses.default}
        ${state === 'matched' ? 'cursor-default' : 'cursor-pointer'}
        ${shaking ? 'animate-shake' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        {/* Match indicator */}
        {state === 'matched' && (
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <Check className="h-3 w-3 text-white" />
          </div>
        )}

        {/* Text */}
        <span className={`flex-1 ${isEnglish ? 'text-left' : 'text-right'}`}>
          {text}
        </span>

        {/* Speak button for English side */}
        {isEnglish && state !== 'matched' && (
          <button
            onClick={(e) => { e.stopPropagation(); speak(text) }}
            className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-primary/20"
          >
            <Volume2 className="h-3.5 w-3.5 text-primary" />
          </button>
        )}
      </div>

      {/* Side label */}
      <span className={`absolute -top-2 ${isEnglish ? 'left-3' : 'right-3'} text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
        state === 'matched' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
      }`}>
        {isEnglish ? 'EN' : 'TR'}
      </span>
    </button>
  )
}

// ─── Main Component ──────────────────────────────────────
export default function MatchExercise({ exercises, onScore }) {
  const [shuffledRight, setShuffledRight] = useState(() => shuffleArray(exercises.map(e => e.right)))
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState({}) // { leftValue: rightValue }
  const [wrongPair, setWrongPair] = useState(null) // { left, right }
  const [toast, setToast] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const wrongTimeoutRef = useRef(null)

  const matchedCount = Object.keys(matched).length
  const totalPairs = exercises.length
  const allMatched = matchedCount === totalPairs
  const progressPct = (matchedCount / totalPairs) * 100

  // Report score when all matched
  useEffect(() => {
    if (allMatched) {
      const score = Math.max(totalPairs - wrongAttempts, Math.ceil(totalPairs * 0.5))
      onScore?.(score, totalPairs)
    }
  }, [allMatched, totalPairs, wrongAttempts, onScore])

  // Clear wrong highlight after delay
  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current)
    }
  }, [])

  const showToast = useCallback((message, type) => {
    setToast({ message, type, key: Date.now() })
  }, [])

  const getLeftState = useCallback((left) => {
    if (matched[left]) return 'matched'
    if (wrongPair?.left === left) return 'wrong'
    if (selectedLeft === left) return 'selected'
    return 'default'
  }, [matched, wrongPair, selectedLeft])

  const getRightState = useCallback((right) => {
    if (Object.values(matched).includes(right)) return 'matched'
    if (wrongPair?.right === right) return 'wrong'
    if (selectedRight === right) return 'selected'
    return 'default'
  }, [matched, wrongPair, selectedRight])

  const tryMatch = useCallback((side, value) => {
    // Can't select matched items
    if (side === 'left' && matched[value]) return
    if (side === 'right' && Object.values(matched).includes(value)) return

    let left = selectedLeft
    let right = selectedRight

    if (side === 'left') {
      // If same item clicked, deselect
      if (left === value) { setSelectedLeft(null); return }
      left = value
      setSelectedLeft(value)
    } else {
      if (right === value) { setSelectedRight(null); return }
      right = value
      setSelectedRight(value)
    }

    // Both selected? Check match
    if (left && right) {
      setAttempts(a => a + 1)
      const pair = exercises.find(e => e.left === left)

      if (pair && pair.right === right) {
        // ✅ Correct match
        setMatched(prev => ({ ...prev, [left]: right }))
        const newStreak = streak + 1
        setStreak(newStreak)
        if (newStreak > bestStreak) setBestStreak(newStreak)

        // Pronounce the word
        speak(left)

        // Toast
        if (matchedCount + 1 === totalPairs) {
          showToast('Tebrikler! Hepsini eşleştirdin! 🎉', 'success')
        } else if (newStreak >= 3) {
          showToast(`${newStreak} seri! Harika gidiyorsun! 🔥`, 'success')
        } else {
          showToast('Doğru! ✓', 'success')
        }
      } else {
        // ❌ Wrong match
        setWrongAttempts(w => w + 1)
        setStreak(0)
        setWrongPair({ left, right })
        showToast(`Yanlış eşleşme — tekrar dene`, 'error')

        // Clear wrong state after animation
        wrongTimeoutRef.current = setTimeout(() => {
          setWrongPair(null)
        }, 800)
      }

      // Reset selection
      setSelectedLeft(null)
      setSelectedRight(null)
    }
  }, [selectedLeft, selectedRight, matched, exercises, streak, bestStreak, matchedCount, totalPairs, showToast])

  const handleReset = () => {
    setShuffledRight(shuffleArray(exercises.map(e => e.right)))
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatched({})
    setWrongPair(null)
    setAttempts(0)
    setWrongAttempts(0)
    setStreak(0)
    setBestStreak(0)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🔗</span> Matching / Eşleştirme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Toast */}
        {toast && (
          <Toast
            key={toast.key}
            message={toast.message}
            type={toast.type}
            onDone={() => setToast(null)}
          />
        )}

        {/* Instructions + Stats */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Soldan İngilizce kelimeyi, sağdan Türkçe karşılığını seç
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {streak >= 2 && (
              <Badge className="bg-orange-500 text-white text-[10px] gap-1">
                🔥 {streak} seri
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {matchedCount}/{totalPairs}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress value={progressPct} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{matchedCount} eşleşme</span>
            {wrongAttempts > 0 && <span className="text-red-500">{wrongAttempts} yanlış</span>}
          </div>
        </div>

        {/* Match Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left Column - English */}
          <div className="space-y-2">
            {exercises.map((ex, i) => (
              <MatchCard
                key={`left-${i}`}
                text={ex.left}
                side="left"
                state={getLeftState(ex.left)}
                onClick={() => tryMatch('left', ex.left)}
                shaking={wrongPair?.left === ex.left}
              />
            ))}
          </div>

          {/* Right Column - Turkish */}
          <div className="space-y-2">
            {shuffledRight.map((right, i) => (
              <MatchCard
                key={`right-${i}`}
                text={right}
                side="right"
                state={getRightState(right)}
                onClick={() => tryMatch('right', right)}
                shaking={wrongPair?.right === right}
              />
            ))}
          </div>
        </div>

        {/* Completion State */}
        {allMatched && (
          <div className="rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Hepsini eşleştirdin!</p>
                <p className="text-sm text-green-600">
                  {attempts} denemede tamamladın
                  {wrongAttempts === 0 ? ' — Mükemmel! Hiç yanlış yok! 🏆' : ` (${wrongAttempts} yanlış)`}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-white/80">
                <p className="text-lg font-bold text-green-700">{totalPairs}</p>
                <p className="text-[10px] text-muted-foreground">Eşleşme</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/80">
                <p className="text-lg font-bold text-green-700">{attempts}</p>
                <p className="text-[10px] text-muted-foreground">Deneme</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/80">
                <p className="text-lg font-bold text-orange-600">{bestStreak}</p>
                <p className="text-[10px] text-muted-foreground">En İyi Seri</p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Tekrar Oyna
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
