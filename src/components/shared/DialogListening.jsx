import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Eye, EyeOff, Volume2 } from 'lucide-react'

function getVoices() {
  return new Promise(resolve => {
    const voices = speechSynthesis.getVoices()
    if (voices.length) return resolve(voices)
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices())
  })
}

async function speakLine(text, rate = 0.8, gender = 'female') {
  return new Promise(async (resolve) => {
    speechSynthesis.cancel()
    const voices = await getVoices()
    const enVoices = voices.filter(v => v.lang.startsWith('en'))

    let voice = null
    if (gender === 'male') {
      voice = enVoices.find(v => /male|david|george|james|mark|daniel/i.test(v.name) && !/female/i.test(v.name))
    } else {
      voice = enVoices.find(v => /female|zira|hazel|susan|karen|samantha|fiona/i.test(v.name))
    }
    if (!voice && gender === 'male') {
      // fallback: pick a different voice than default to simulate male
      voice = enVoices.find(v => !/female|zira|hazel|susan|karen|samantha|fiona/i.test(v.name))
    }
    if (!voice) voice = enVoices[0]

    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    if (voice) u.voice = voice
    if (gender === 'male') u.pitch = 0.85
    else u.pitch = 1.1
    u.onend = resolve
    u.onerror = resolve
    speechSynthesis.speak(u)
  })
}

export default function DialogListening({ dialog, onScore }) {
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showText, setShowText] = useState(false)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const stopRef = useRef(false)

  const playDialog = async () => {
    if (playing) {
      speechSynthesis.cancel()
      stopRef.current = true
      setPlaying(false)
      setCurrentLine(-1)
      return
    }

    stopRef.current = false
    setPlaying(true)

    for (let i = 0; i < dialog.lines.length; i++) {
      if (stopRef.current) break
      setCurrentLine(i)
      const line = dialog.lines[i]
      const gender = line.gender || (line.speaker === 'B' ? 'male' : 'female')
      await speakLine(line.text, 0.8, gender)
      await new Promise(r => setTimeout(r, 500))
    }

    setPlaying(false)
    setCurrentLine(-1)
  }

  const playLine = async (i) => {
    speechSynthesis.cancel()
    setCurrentLine(i)
    const line = dialog.lines[i]
    const gender = line.gender || (line.speaker === 'B' ? 'male' : 'female')
    await speakLine(line.text, 0.75, gender)
    setCurrentLine(-1)
  }

  const handleAnswer = (qi, oi) => {
    if (checked) return
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const score = dialog.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)

  const check = () => {
    setChecked(true)
    const s = dialog.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    onScore?.(s, dialog.questions.length)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🎧</span> Dialog Listening / Diyalog Dinleme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Context */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm font-medium mb-1">{dialog.title}</p>
          <p className="text-xs text-muted-foreground">{dialog.titleTr}</p>
          <p className="text-xs text-muted-foreground mt-2 italic">{dialog.context}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button onClick={playDialog} variant={playing ? 'destructive' : 'default'} size="sm">
            {playing ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
            {playing ? 'Durdur' : 'Diyaloğu Dinle'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowText(t => !t)}>
            {showText ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
            {showText ? 'Metni Gizle' : 'Metni Göster'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTranslation(t => !t)}>
            {showTranslation ? 'Çeviriyi Gizle' : 'Çeviriyi Göster'}
          </Button>
        </div>

        {/* Dialog lines */}
        <div className="space-y-2">
          {dialog.lines.map((line, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-accent ${
                currentLine === i ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'
              } ${line.speaker === 'A' ? '' : 'flex-row-reverse text-right'}`}
              onClick={() => playLine(i)}
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                line.speaker === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {line.speakerName?.[0] || line.speaker}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">{line.speakerName || `Person ${line.speaker}`}</span>
                  <Volume2 className="h-3 w-3 text-muted-foreground" />
                </div>
                {showText ? (
                  <>
                    <p className="text-sm">{line.text}</p>
                    {showTranslation && <p className="text-xs text-muted-foreground mt-0.5">{line.textTr}</p>}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {currentLine === i ? '🔊 Dinliyorsun...' : 'Dinlemek için tıkla'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comprehension Questions */}
        <div className="pt-2">
          <p className="text-sm font-semibold mb-3">🤔 Anladın mı? / Did you understand?</p>
          {dialog.questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border p-4 space-y-3 mb-3">
              <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
              <p className="text-xs text-muted-foreground">{q.questionTr}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => {
                  let cls = 'border rounded-lg px-4 py-2.5 text-sm text-left transition-all cursor-pointer '
                  if (checked && oi === q.correct) cls += 'border-green-500 bg-green-50 text-green-700'
                  else if (checked && answers[qi] === oi && oi !== q.correct) cls += 'border-red-500 bg-red-50 text-red-700'
                  else if (answers[qi] === oi) cls += 'border-primary bg-primary/5 text-primary'
                  else cls += 'border-border hover:border-primary/50 hover:bg-accent'
                  return <button key={oi} className={cls} onClick={() => handleAnswer(qi, oi)}>{opt}</button>
                })}
              </div>
            </div>
          ))}

          {Object.keys(answers).length === dialog.questions.length && !checked && (
            <Button onClick={check}>Kontrol Et</Button>
          )}

          {checked && (
            <div className={`flex items-center gap-4 rounded-xl p-4 ${score >= dialog.questions.length / 2 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <span className="text-3xl font-bold">{score}/{dialog.questions.length}</span>
              <span className="text-sm">{score === dialog.questions.length ? 'Harika anladın!' : 'Tekrar dinle!'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
