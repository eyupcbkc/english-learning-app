import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, BookOpen, Headphones, Video, PenLine } from 'lucide-react'

const TYPE_ICONS = {
  video: Video,
  article: BookOpen,
  audio: Headphones,
  practice: PenLine,
}

const TYPE_COLORS = {
  video: 'bg-red-100 text-red-700',
  article: 'bg-blue-100 text-blue-700',
  audio: 'bg-purple-100 text-purple-700',
  practice: 'bg-green-100 text-green-700',
}

export default function ResourcesSection({ resources }) {
  if (!resources || resources.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>📌</span> Extra Resources / Ek Kaynaklar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground mb-2">
          Bu konuyu pekiştirmek için önerilen ücretsiz kaynaklar
        </p>
        {resources.map((res, i) => {
          const Icon = TYPE_ICONS[res.type] || BookOpen
          return (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl border hover:border-primary/50 hover:bg-accent transition-all group"
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[res.type] || 'bg-muted text-muted-foreground'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{res.title}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{res.description}</p>
                <div className="flex gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-[10px]">{res.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{res.level}</Badge>
                  {res.free && <Badge className="text-[10px] bg-green-600">Free</Badge>}
                </div>
              </div>
            </a>
          )
        })}

        {/* Always show these general resources */}
        <div className="pt-3 border-t">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Genel Kaynaklar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', desc: 'Ücretsiz dersler ve videolar' },
              { name: 'Duolingo', url: 'https://www.duolingo.com', desc: 'Oyunlaştırılmış pratik' },
              { name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org', desc: 'Kelime anlamı + telaffuz' },
              { name: 'Lyrics Training', url: 'https://lyricstraining.com', desc: 'Şarkılarla İngilizce' },
            ].map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border hover:border-primary/50 hover:bg-accent transition-all text-xs">
                <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-muted-foreground">{r.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
