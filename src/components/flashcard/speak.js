// Speech rate state — persisted in localStorage
const RATE_KEY = 'english-speech-rate'
const RATES = [0.5, 0.7, 0.85, 1.0, 1.2]
const RATE_LABELS = ['Çok Yavaş', 'Yavaş', 'Normal', 'Hızlı', 'Çok Hızlı']

export function getRate() {
  const saved = localStorage.getItem(RATE_KEY)
  return saved ? parseFloat(saved) : 0.85
}

export function setRate(rate) {
  localStorage.setItem(RATE_KEY, String(rate))
}

export { RATES, RATE_LABELS }

export function speak(text, rateOverride) {
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rateOverride ?? getRate()
  speechSynthesis.speak(u)
}

export const BOX_LABELS = {
  1: { label: 'Yeni', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50', borderColor: 'border-red-200' },
  2: { label: 'Öğreniyor', color: 'bg-orange-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' },
  3: { label: 'Tanıdık', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', borderColor: 'border-amber-200' },
  4: { label: 'İyi', color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' },
  5: { label: 'Öğrenildi', color: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50', borderColor: 'border-green-200' },
}
