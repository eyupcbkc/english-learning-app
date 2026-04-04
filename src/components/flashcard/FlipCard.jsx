import { Badge } from '@/components/ui/badge'
import { Volume2 } from 'lucide-react'
import { speak } from './speak'

// Bold the target word within a sentence
function BoldWord({ text, word }) {
  if (!text || !word) return <>{text}</>
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => regex.test(part) ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part)}</>
}

export default function FlipCard({ word, isFlipped, onFlip }) {
  return (
    <div
      className="w-full max-w-md mx-auto cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          minHeight: '320px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-primary/15 bg-gradient-to-br from-white via-primary/[0.02] to-primary/[0.08] p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center space-y-5">
            {word.level && (
              <Badge variant="outline" className="text-[10px] font-normal">{word.level}</Badge>
            )}
            <p className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">{word.word}</p>
            <p className="text-sm text-muted-foreground font-medium">{word.pronunciation}</p>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.word) }}
              className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <Volume2 className="h-6 w-6 text-primary" />
            </button>
            <p className="text-[11px] text-muted-foreground/60">tıkla veya Space bas</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-green-200/60 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 p-6 sm:p-8 flex flex-col items-center justify-center shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-center space-y-4 w-full">
            {/* English word badge on back */}
            <Badge variant="outline" className="text-xs font-medium">{word.word}</Badge>
            {/* Turkish meaning */}
            <div className="inline-block px-5 py-2 rounded-2xl bg-green-100/60 border border-green-200/50">
              <p className="text-xl sm:text-2xl font-bold text-green-700">{word.turkish}</p>
            </div>
            {/* Example 1 — word is bold */}
            <div className="rounded-2xl bg-white/60 border border-green-100 p-3 space-y-1.5 text-left">
              <div className="flex items-start gap-2">
                <p className="text-sm flex-1 text-muted-foreground">"<BoldWord text={word.example} word={word.word} />"</p>
                <button onClick={(e) => { e.stopPropagation(); speak(word.example) }} className="shrink-0 h-7 w-7 rounded-lg bg-green-50 border border-green-200/50 flex items-center justify-center hover:bg-green-100 transition-colors">
                  <Volume2 className="h-3 w-3 text-green-600" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{word.exampleTr}</p>
            </div>
            {/* Example 2 — word is bold */}
            {word.extra && (
              <div className="rounded-2xl bg-white/60 border border-green-100 p-3 space-y-1.5 text-left">
                <div className="flex items-start gap-2">
                  <p className="text-sm flex-1 text-muted-foreground">"<BoldWord text={word.extra} word={word.word} />"</p>
                  <button onClick={(e) => { e.stopPropagation(); speak(word.extra) }} className="shrink-0 h-7 w-7 rounded-lg bg-green-50 border border-green-200/50 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <Volume2 className="h-3 w-3 text-green-600" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{word.extraTr}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
