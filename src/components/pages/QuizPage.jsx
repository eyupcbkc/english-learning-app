import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function QuizPage() {
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-4">
        <p className="text-lg font-medium">Quiz sayfası yakında aktif olacak</p>
        <p className="text-sm text-muted-foreground">Daha fazla ünite tamamlandıktan sonra seviye testleri burada görünecek.</p>
        <Button variant="outline" asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfa</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
