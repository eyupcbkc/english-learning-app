import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { speak } from './speak'

export default function SwipeCard({ word, correctSide, wrongLabel, onSwipe }) {
  const [exited, setExited] = useState(false)
  const x = useMotionValue(0)

  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const leftBg = useTransform(x, [-120, 0], [1, 0])
  const rightBg = useTransform(x, [0, 120], [0, 1])

  const handleDragEnd = (_, info) => {
    const threshold = 80
    const velocity = 400

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      const direction = info.offset.x > 0 ? 'right' : 'left'
      const isCorrect = direction === correctSide
      setExited(true)
      animate(x, direction === 'right' ? 500 : -500, {
        type: 'spring', stiffness: 300, damping: 30,
        onComplete: () => onSwipe(isCorrect),
      })
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
    }
  }

  if (exited) return null

  const leftLabel = correctSide === 'left' ? word.turkish : wrongLabel
  const rightLabel = correctSide === 'right' ? word.turkish : wrongLabel

  return (
    <div className="relative">
      {/* Left/Right hint backgrounds */}
      <motion.div className="absolute inset-0 rounded-3xl bg-red-100 border-2 border-red-200 flex items-center justify-start pl-6" style={{ opacity: leftBg }}>
        <span className="text-red-500 font-bold text-lg">✗</span>
      </motion.div>
      <motion.div className="absolute inset-0 rounded-3xl bg-green-100 border-2 border-green-200 flex items-center justify-end pr-6" style={{ opacity: rightBg }}>
        <span className="text-green-500 font-bold text-lg">✓</span>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        className="relative touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-lg">
          <div className="text-center space-y-4">
            {/* Word */}
            <p className="text-3xl sm:text-4xl font-bold tracking-tight">{word.word}</p>
            <p className="text-sm text-muted-foreground">{word.pronunciation}</p>

            {/* Speaker */}
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.word) }}
              className="mx-auto h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all"
            >
              <Volume2 className="h-5 w-5 text-primary" />
            </button>
          </div>

          {/* Two options at bottom */}
          <div className="flex justify-between mt-6 pt-4 border-t border-dashed">
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground">← sola</p>
              <p className="text-sm font-semibold mt-0.5">{leftLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">sağa →</p>
              <p className="text-sm font-semibold mt-0.5">{rightLabel}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
