import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Volume2 } from 'lucide-react'

function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  speechSynthesis.speak(u)
}

export default function VocabularyCard({ vocabulary }) {
  const [flipped, setFlipped] = useState({})
  const toggle = (i) => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>📚</span> Vocabulary / Kelimeler
          <Badge variant="secondary" className="ml-auto">{vocabulary.length} kelime</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Kartlara tıklayarak anlamını ve örnekleri gör. Ses ikonuna basarak telaffuzu dinle.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vocabulary.map((item, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              className="group border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-primary">{item.word}</p>
                  <p className="text-xs text-muted-foreground">{item.pronunciation}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); speak(item.word) }}
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Volume2 className="h-4 w-4 text-primary" />
                </button>
              </div>

              {flipped[i] ? (
                <div className="mt-3 pt-3 border-t space-y-2">
                  <p className="text-sm font-semibold">{item.turkish}</p>

                  {/* Example 1 */}
                  <div className="rounded-lg bg-accent/50 p-2.5">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm">"{item.example}"</p>
                      <button onClick={(e) => { e.stopPropagation(); speak(item.example) }} className="shrink-0">
                        <Volume2 className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.exampleTr}</p>
                  </div>

                  {/* Example 2 (extra) */}
                  {item.extra && (
                    <div className="rounded-lg bg-accent/50 p-2.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm">"{item.extra}"</p>
                        <button onClick={(e) => { e.stopPropagation(); speak(item.extra) }} className="shrink-0">
                          <Volume2 className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.extraTr}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 pt-3 border-t text-xs text-muted-foreground italic">
                  Çeviri ve örnekler için tıkla
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
