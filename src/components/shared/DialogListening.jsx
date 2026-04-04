import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Eye, EyeOff, Volume2, Languages, ChevronDown } from 'lucide-react'
import TranslationToggle from './TranslationToggle'

// ─── Voice Engine ────────────────────────────────────────
let cachedVoices = null
function getVoices() {
  return new Promise(resolve => {
    if (cachedVoices) return resolve(cachedVoices)
    const voices = speechSynthesis.getVoices()
    if (voices.length) { cachedVoices = voices; return resolve(voices) }
    speechSynthesis.onvoiceschanged = () => {
      cachedVoices = speechSynthesis.getVoices()
      resolve(cachedVoices)
    }
  })
}

const CHARACTER_PROFILES = {
  'Eyüp':     { gender: 'male',   pitch: 0.8,  rate: 0.8  },
  'Mehmet':   { gender: 'male',   pitch: 0.75, rate: 0.78 },
  'Ali':      { gender: 'male',   pitch: 0.9,  rate: 0.85 },
  'Emma':     { gender: 'female', pitch: 1.15, rate: 0.82 },
  'Ayşe':     { gender: 'female', pitch: 1.05, rate: 0.8  },
  'Zeynep':   { gender: 'female', pitch: 1.1,  rate: 0.78 },
  'Secretary':{ gender: 'female', pitch: 1.0,  rate: 0.75 },
  'Manager':  { gender: 'male',   pitch: 0.85, rate: 0.75 },
  'Waiter':   { gender: 'male',   pitch: 0.9,  rate: 0.8  },
  'Teacher':  { gender: 'female', pitch: 1.05, rate: 0.72 },
  'Doctor':   { gender: 'male',   pitch: 0.85, rate: 0.72 },
  'Receptionist': { gender: 'female', pitch: 1.0, rate: 0.75 },
}

const DEFAULT_MALE   = { gender: 'male',   pitch: 0.85, rate: 0.8 }
const DEFAULT_FEMALE = { gender: 'female', pitch: 1.1,  rate: 0.8 }

function getCharacterProfile(speakerName, speaker, gender) {
  if (speakerName && CHARACTER_PROFILES[speakerName]) return CHARACTER_PROFILES[speakerName]
  if (gender === 'male') return DEFAULT_MALE
  if (gender === 'female') return DEFAULT_FEMALE
  return speaker === 'B' ? DEFAULT_MALE : DEFAULT_FEMALE
}

async function speakLine(text, profile) {
  return new Promise(async (resolve) => {
    speechSynthesis.cancel()
    const voices = await getVoices()
    const enVoices = voices.filter(v => v.lang.startsWith('en'))
    let voice = null
    if (profile.gender === 'male') {
      voice = enVoices.find(v => /male|david|george|james|mark|daniel|guy/i.test(v.name) && !/female/i.test(v.name))
      if (!voice) voice = enVoices.find(v => !/female|zira|hazel|susan|karen|samantha|fiona/i.test(v.name))
    } else {
      voice = enVoices.find(v => /female|zira|hazel|susan|karen|samantha|fiona|jenny/i.test(v.name))
    }
    if (!voice) voice = enVoices[0]
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = profile.rate
    u.pitch = profile.pitch
    if (voice) u.voice = voice
    u.onend = resolve
    u.onerror = resolve
    speechSynthesis.speak(u)
  })
}

// ─── Speaker Avatar ──────────────────────────────────────
const SPEAKER_COLORS = {
  A: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' },
  B: { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200' },
}

function SpeakerAvatar({ speaker, speakerName, isActive }) {
  const colors = SPEAKER_COLORS[speaker] || SPEAKER_COLORS.A
  return (
    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all ${colors.bg} ${colors.text} ${isActive ? `ring-2 ${colors.ring} scale-110` : ''}`}>
      {speakerName?.[0] || speaker}
    </div>
  )
}

// ─── Single Dialog Line ──────────────────────────────────
function DialogLine({ line, index, isActive, onPlay }) {
  const [showText, setShowText] = useState(false)
  const [showTr, setShowTr] = useState(false)
  const isRight = line.speaker === 'B'
  const colors = SPEAKER_COLORS[line.speaker] || SPEAKER_COLORS.A

  return (
    <div className={`flex gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
      <SpeakerAvatar
        speaker={line.speaker}
        speakerName={line.speakerName}
        isActive={isActive}
      />

      <div className={`flex-1 max-w-[80%] ${isRight ? 'items-end' : ''}`}>
        {/* Speaker name */}
        <p className={`text-[11px] font-semibold text-muted-foreground mb-1 ${isRight ? 'text-right' : ''}`}>
          {line.speakerName || `Person ${line.speaker}`}
        </p>

        {/* Bubble */}
        <div
          className={`group relative rounded-2xl p-3.5 transition-all cursor-pointer ${
            isActive
              ? `${colors.bg} border-2 border-${line.speaker === 'A' ? 'blue' : 'violet'}-300 shadow-md`
              : 'bg-muted/60 border border-transparent hover:border-border hover:shadow-sm'
          } ${isRight ? 'rounded-tr-md' : 'rounded-tl-md'}`}
          onClick={() => onPlay(index)}
          onMouseEnter={() => setShowText(true)}
          onMouseLeave={() => { if (!isActive) setShowText(false) }}
        >
          {/* Always visible: play hint or text */}
          {showText || isActive ? (
            <div className={isRight ? 'text-right' : ''}>
              <p className="text-sm leading-relaxed">{line.text}</p>

              {/* Turkish translation toggle */}
              {showTr && (
                <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-dashed">{line.textTr}</p>
              )}
            </div>
          ) : (
            <p className={`text-xs text-muted-foreground italic flex items-center gap-1.5 ${isRight ? 'justify-end' : ''}`}>
              <Volume2 className="h-3 w-3" />
              <span>Üzerine gel veya tıkla</span>
            </p>
          )}

          {/* Play indicator */}
          {isActive && (
            <div className={`absolute -top-1 ${isRight ? '-left-1' : '-right-1'}`}>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          )}
        </div>

        {/* Action buttons below bubble */}
        {(showText || isActive) && (
          <div className={`flex gap-2 mt-1 ${isRight ? 'justify-end' : ''}`}>
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(index) }}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-accent"
            >
              <Volume2 className="h-3 w-3" /> Dinle
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTr(t => !t) }}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-accent"
            >
              <Languages className="h-3 w-3" /> {showTr ? 'Gizle' : 'Türkçe'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────
export default function DialogListening({ dialog, onScore }) {
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [showAllText, setShowAllText] = useState(false)
  const [showAllTr, setShowAllTr] = useState(false)
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
      const profile = getCharacterProfile(line.speakerName, line.speaker, line.gender)
      await speakLine(line.text, profile)
      await new Promise(r => setTimeout(r, 600))
    }
    setPlaying(false)
    setCurrentLine(-1)
  }

  const playLine = async (i) => {
    speechSynthesis.cancel()
    setCurrentLine(i)
    const line = dialog.lines[i]
    const profile = getCharacterProfile(line.speakerName, line.speaker, line.gender)
    await speakLine(line.text, { ...profile, rate: profile.rate * 0.9 })
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

  // Unique speakers for legend
  const speakers = [...new Map(dialog.lines.map(l => [l.speaker, l])).values()]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🎧</span> Dialog Listening / Diyalog Dinleme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* ── Section 1: Context ── */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
          <p className="text-sm font-semibold">{dialog.title}</p>
          <TranslationToggle label="Türkçe Başlık">
            <p className="text-xs text-muted-foreground">{dialog.titleTr}</p>
          </TranslationToggle>
          <p className="text-xs text-muted-foreground italic">{dialog.context}</p>
        </div>

        <Separator />

        {/* ── Section 2: Controls + Speaker Legend ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diyalog</p>
            <div className="flex items-center gap-3">
              {speakers.map(s => (
                <div key={s.speaker} className="flex items-center gap-1.5">
                  <SpeakerAvatar speaker={s.speaker} speakerName={s.speakerName} isActive={false} />
                  <span className="text-xs font-medium text-muted-foreground">{s.speakerName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={playDialog} variant={playing ? 'destructive' : 'default'} size="sm">
              {playing ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
              {playing ? 'Durdur' : 'Tümünü Dinle'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAllText(t => !t)}>
              {showAllText ? <EyeOff className="mr-1.5 h-3.5 w-3.5" /> : <Eye className="mr-1.5 h-3.5 w-3.5" />}
              {showAllText ? 'Metinleri Gizle' : 'Tüm Metinleri Aç'}
            </Button>
            {showAllText && (
              <Button variant="outline" size="sm" onClick={() => setShowAllTr(t => !t)}>
                <Languages className="mr-1.5 h-3.5 w-3.5" />
                {showAllTr ? 'Çevirileri Gizle' : 'Tüm Çevirileri Aç'}
              </Button>
            )}
          </div>
        </div>

        {/* ── Section 3: Chat Bubbles ── */}
        <div className="space-y-4 py-2">
          {dialog.lines.map((line, i) => (
            showAllText ? (
              // All text visible mode
              <div key={i} className={`flex gap-3 ${line.speaker === 'B' ? 'flex-row-reverse' : ''}`}>
                <SpeakerAvatar
                  speaker={line.speaker}
                  speakerName={line.speakerName}
                  isActive={currentLine === i}
                />
                <div className={`flex-1 max-w-[80%]`}>
                  <p className={`text-[11px] font-semibold text-muted-foreground mb-1 ${line.speaker === 'B' ? 'text-right' : ''}`}>
                    {line.speakerName}
                  </p>
                  <div
                    className={`rounded-2xl p-3.5 cursor-pointer transition-all ${
                      currentLine === i
                        ? `${SPEAKER_COLORS[line.speaker].bg} border-2 shadow-md`
                        : 'bg-muted/60 border border-transparent hover:border-border hover:shadow-sm'
                    } ${line.speaker === 'B' ? 'rounded-tr-md' : 'rounded-tl-md'}`}
                    onClick={() => playLine(i)}
                  >
                    <div className={line.speaker === 'B' ? 'text-right' : ''}>
                      <p className="text-sm leading-relaxed">{line.text}</p>
                      {showAllTr && (
                        <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-dashed">{line.textTr}</p>
                      )}
                    </div>
                  </div>
                  <div className={`mt-0.5 ${line.speaker === 'B' ? 'text-right' : ''}`}>
                    <button
                      onClick={() => playLine(i)}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-accent"
                    >
                      <Volume2 className="h-3 w-3" /> Dinle
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Interactive hover mode
              <DialogLine
                key={i}
                line={line}
                index={i}
                isActive={currentLine === i}
                onPlay={playLine}
              />
            )
          ))}
        </div>

        <Separator />

        {/* ── Section 4: Comprehension Questions ── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anlama Soruları</p>

          {dialog.questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border p-4 space-y-3">
              <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
              <TranslationToggle label="Soruyu Türkçe Gör">
                <p className="text-xs text-muted-foreground">{q.questionTr}</p>
              </TranslationToggle>
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
