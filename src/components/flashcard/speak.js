export function speak(text) {
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

export const BOX_LABELS = {
  1: { label: 'Yeni', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50', borderColor: 'border-red-200' },
  2: { label: 'Öğreniyor', color: 'bg-orange-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' },
  3: { label: 'Tanıdık', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', borderColor: 'border-amber-200' },
  4: { label: 'İyi', color: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' },
  5: { label: 'Öğrenildi', color: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50', borderColor: 'border-green-200' },
}
