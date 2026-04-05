import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { speak } from './speak'

export default function SwipeCard({ word, correctSide, wrongLabel, onSwipe, onSkip }) {
  const [exited, setExited] = useState(false)
  const x = useMotionValue(0)

  // Visual transforms based on drag position
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const leftOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0])
  const rightOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1])
  const borderColor = useTransform(
    x,
    [-150, -30, 0, 30, 150],
    ['rgb(239,68,68)', 'rgb(229,231,235)', 'rgb(229,231,235)', 'rgb(229,231,235)', 'rgb(34,197,94)']
  )
  const bgColor = useTransform(
    x,
    [-150, -30, 0, 30, 150],
    ['rgba(254,226,226,0.3)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(220,252,231,0.3)']
  )

  const handleDragEnd = (_, info) => {
    const threshold = 80
    const velocity = 300

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      const direction = info.offset.x > 0 ? 'right' : 'left'
      const isCorrect = direction === correctSide
      setExited(true)

      // Fly off screen
      animate(x, direction === 'right' ? 500 : -500, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        onComplete: () => onSwipe(isCorrect),
      })
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
    }
  }

  if (exited) return null

  // Determine which label goes where
  const leftLabel = correctSide === 'left' ? word.turkish : wrongLabel
  const rightLabel = correctSide === 'right' ? word.turkish : wrongLabel
  const leftIsCorrect = correctSide === 'left'
  const rightIsCorrect = correctSide === 'right'

  return (
    <motion.div
      className="touch-none select-none cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="relative w-full max-w-sm mx-auto rounded-3xl border-2 p-6 sm:p-8 shadow-lg"
        style={{ borderColor, backgroundColor: bgColor }}
      >
        {/* Swipe direction indicators */}
        <motion.div
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-red-300 bg-red-50 text-red-600 text-xs font-bold"
          style={{ opacity: leftOpacity }}
        >
          {leftIsCorrect ? '✓' : '✗'} {leftLabel}
        </motion.div>
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-green-300 bg-green-50 text-green-600 text-xs font-bold"
          style={{ opacity: rightOpacity }}
        >
          {rightIsCorrect ? '✓' : '✗'} {rightLabel}
        </motion.div>

        {/* Card content */}
        <div className="text-center space-y-5 pt-8 pb-4">
          {/* Level badge */}
          {word.level && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
              {word.level}
            </span>
          )}

          {/* English word */}
          <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{word.word}</p>

          {/* Pronunciation */}
          <p className="text-sm text-muted-foreground">{word.pronunciation}</p>

          {/* Speaker */}
          <button
            onClick={(e) => { e.stopPropagation(); speak(word.word) }}
            className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all"
          >
            <Volume2 className="h-5 w-5 text-primary" />
          </button>

          {/* Answer hints at bottom */}
          <div className="flex justify-between items-end pt-4 px-2">
            <div className={`text-center ${leftIsCorrect ? 'text-green-600' : 'text-red-400'}`}>
              <p className="text-[10px] text-muted-foreground mb-1">← Sola kaydır</p>
              <p className="text-sm font-semibold">{leftLabel}</p>
            </div>
            <div className="text-[10px] text-muted-foreground">kaydır</div>
            <div className={`text-center ${rightIsCorrect ? 'text-green-600' : 'text-red-400'}`}>
              <p className="text-[10px] text-muted-foreground mb-1">Sağa kaydır →</p>
              <p className="text-sm font-semibold">{rightLabel}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
