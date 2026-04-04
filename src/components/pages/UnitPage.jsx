import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnit } from '@/data/unitIndex'
import { useProgress } from '@/hooks/useProgress'
import VocabularyCard from '../shared/VocabularyCard'
import GrammarBox from '../shared/GrammarBox'
import ReadingSection from '../shared/ReadingSection'
import FillBlanks from '../shared/FillBlanks'
import MultipleChoice from '../shared/MultipleChoice'
import MatchExercise from '../shared/MatchExercise'
import SentenceOrder from '../shared/SentenceOrder'
import TranslationExercise from '../shared/TranslationExercise'
import { ArrowLeft, BookOpen, PenLine, CheckCircle2 } from 'lucide-react'

export default function UnitPage() {
  const { unitId } = useParams()
  const unit = getUnit(unitId)
  const { completeUnit, addWords, isUnitCompleted: checkCompleted } = useProgress()

  if (!unit) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Ünite bulunamadı</h2>
          <Button variant="outline" asChild>
            <Link to="/">Ana Sayfaya Dön</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const completed = checkCompleted(unit.id)

  const handleComplete = () => {
    addWords(unit.vocabulary.map(v => v.word))
    completeUnit(unit.id, 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Ana Sayfa
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{unit.title}</h1>
            <p className="text-muted-foreground">{unit.descriptionTr}</p>
            <div className="flex gap-2 mt-3">
              <Badge>{unit.level}</Badge>
              <Badge variant="outline">Module {unit.module}</Badge>
              {completed && <Badge className="bg-green-500">Tamamlandı</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vocab" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vocab" className="gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Kelimeler</span>
          </TabsTrigger>
          <TabsTrigger value="grammar" className="gap-1.5">
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Dilbilgisi</span>
          </TabsTrigger>
          <TabsTrigger value="reading" className="gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Okuma</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">Alıştırmalar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vocab" className="mt-6">
          <VocabularyCard vocabulary={unit.vocabulary} />
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          <GrammarBox grammar={unit.grammar} />
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <ReadingSection reading={unit.reading} />
        </TabsContent>

        <TabsContent value="exercises" className="mt-6 space-y-6">
          <FillBlanks exercises={unit.exercises.fillBlanks} />
          <MultipleChoice exercises={unit.exercises.multipleChoice} />
          <MatchExercise exercises={unit.exercises.matching} />
          <SentenceOrder exercises={unit.exercises.sentenceOrder} />
          <TranslationExercise exercises={unit.exercises.translation} />

          {!completed && (
            <div className="text-center pt-4">
              <Button size="lg" onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Üniteyi Tamamla
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
