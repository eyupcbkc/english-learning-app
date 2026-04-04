import { BOX_LABELS } from './speak'

export default function BoxIndicator({ box }) {
  const info = BOX_LABELS[box]
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.bgLight} ${info.textColor} ${info.borderColor} border`}>
      <div className={`h-2 w-2 rounded-full ${info.color}`} />
      Kutu {box}: {info.label}
    </div>
  )
}

export function BoxDistribution({ boxCounts, totalCards }) {
  return (
    <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
      {[1, 2, 3, 4, 5].map(box => {
        const count = boxCounts[box] || 0
        const pct = totalCards > 0 ? (count / totalCards) * 100 : 0
        if (pct === 0) return null
        return (
          <div
            key={box}
            className={`${BOX_LABELS[box].color} transition-all duration-500`}
            style={{ width: `${pct}%` }}
            title={`Kutu ${box}: ${count} kelime`}
          />
        )
      })}
    </div>
  )
}
