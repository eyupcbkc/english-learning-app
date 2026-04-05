import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

        {/* Table — responsive: horizontal scroll on mobile */}
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {['Olumlu (+)', 'Olumsuz (−)', 'Soru (?)', 'Kısa Cevap'].map((h, i) => (
                  <th key={i} className="text-left p-3 font-semibold text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grammar.table.map((row, i) => (
                <tr key={i} className={`border-t ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-xs leading-relaxed align-top">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips — clean card layout, no badge abuse */}
        {grammar.tips && grammar.tips.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
            <p className="font-semibold text-amber-800 text-sm mb-4 flex items-center gap-2">
              <span className="text-base">💡</span> Tips / İpuçları
            </p>
            <div className="space-y-3">
              {grammar.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{tip.en}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{tip.tr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
