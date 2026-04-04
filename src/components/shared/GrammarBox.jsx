import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TranslationToggle from './TranslationToggle'

export default function GrammarBox({ grammar }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>📐</span> Grammar / Dilbilgisi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Explanation */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-5">
          <h3 className="font-semibold text-primary mb-2">{grammar.title}</h3>
          <p className="text-sm leading-relaxed mb-3">{grammar.explanation}</p>
          <TranslationToggle label="Türkçe Açıklamayı Göster">
            <p className="text-sm text-muted-foreground leading-relaxed">{grammar.explanationTr}</p>
          </TranslationToggle>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-3 font-semibold">Pronoun</th>
                <th className="text-left p-3 font-semibold">Be</th>
                <th className="text-left p-3 font-semibold">Türkçe</th>
                <th className="text-left p-3 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              {grammar.table.map((row, i) => (
                <tr key={i} className="border-t hover:bg-accent/50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className={`p-3 ${j === 0 ? 'font-semibold' : ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
        {grammar.tips && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-5">
            <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-3">💡 Tips / İpuçları</p>
            <ul className="space-y-2">
              {grammar.tips.map((tip, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <Badge variant="secondary" className="shrink-0 mt-0.5">{tip.en}</Badge>
                  <span className="text-muted-foreground">{tip.tr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
