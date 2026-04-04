import { Card, CardContent } from '@/components/ui/card'
import { Target, Layers, Brain, Trophy } from 'lucide-react'

export default function StatsBar({ stats }) {
  const items = [
    { icon: Target, value: `${stats.todayReviewed}/${stats.dailyGoal}`, label: 'Bugün', color: 'bg-blue-500/10 text-blue-600' },
    { icon: Layers, value: stats.dueToday, label: 'Bekleyen', color: 'bg-orange-500/10 text-orange-600' },
    { icon: Brain, value: stats.totalCards, label: 'Toplam Kart', color: 'bg-purple-500/10 text-purple-600' },
    { icon: Trophy, value: stats.learned, label: 'Öğrenildi', color: 'bg-green-500/10 text-green-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ icon: Icon, value, label, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
