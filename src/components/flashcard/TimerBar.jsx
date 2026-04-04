import { Timer } from 'lucide-react'

export default function TimerBar({ timeLeft, totalTime }) {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100
  const isLow = timeLeft <= 10

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={`font-mono font-bold ${isLow ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
        <span className="text-muted-foreground flex items-center gap-1">
          <Timer className="h-3 w-3" /> Kalan süre
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
