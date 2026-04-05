import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { getRate, setRate, RATES, RATE_LABELS, speak } from '@/components/flashcard/speak'

export default function SpeedControl({ compact = false }) {
  const [currentRate, setCurrentRate] = useState(getRate)
  const currentIndex = RATES.indexOf(currentRate) !== -1 ? RATES.indexOf(currentRate) : 2

  const handleChange = (rate) => {
    setRate(rate)
    setCurrentRate(rate)
    speak('This is the speed.', rate)
  }

  if (compact) {
    // Cycle through speeds on click
    const next = () => {
      const nextIndex = (currentIndex + 1) % RATES.length
      handleChange(RATES[nextIndex])
    }
    return (
      <button
        onClick={next}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
        title="Konuşma hızını değiştir"
      >
        <Volume2 className="h-3.5 w-3.5" />
        {RATE_LABELS[currentIndex]}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex gap-1">
        {RATES.map((rate, i) => (
          <button
            key={rate}
            onClick={() => handleChange(rate)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              currentRate === rate
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            title={RATE_LABELS[i]}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  )
}
