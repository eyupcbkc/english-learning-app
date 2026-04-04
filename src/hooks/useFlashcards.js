import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/contexts/AuthContext'
import units from '@/data/unitIndex'

// Leitner box intervals (in days)
const BOX_INTERVALS = {
  1: 1,   // Every day
  2: 2,   // Every 2 days
  3: 4,   // Every 4 days
  4: 7,   // Every 7 days
  5: 14,  // Every 14 days (learned!)
}

const defaultData = {
  cards: {},
  settings: {
    dailyGoal: 10,
    newWordsPerDay: 5,
  },
  stats: {
    totalReviewed: 0,
    todayReviewed: 0,
    todayDate: null,
  },
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function useFlashcards() {
  const { user } = useAuth()
  const [data, setData] = useState(defaultData)
  const [loaded, setLoaded] = useState(false)
  const saveTimeoutRef = useRef(null)

  // Load from Firestore on mount / user change
  useEffect(() => {
    if (!user) {
      setData(defaultData)
      setLoaded(false)
      return
    }

    async function load() {
      try {
        const ref = doc(db, 'users', user.uid, 'data', 'flashcards')
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const parsed = snap.data()
          // Reset today counter if new day
          const today = getToday()
          if (parsed.stats.todayDate !== today) {
            parsed.stats.todayReviewed = 0
            parsed.stats.todayDate = today
          }
          setData(parsed)
        } else {
          // First time — check if there's localStorage data to migrate
          const localData = localStorage.getItem('english-flashcards')
          if (localData) {
            const parsed = JSON.parse(localData)
            const today = getToday()
            if (parsed.stats.todayDate !== today) {
              parsed.stats.todayReviewed = 0
              parsed.stats.todayDate = today
            }
            setData(parsed)
            await setDoc(ref, parsed)
          } else {
            setData(defaultData)
          }
        }
      } catch (err) {
        console.warn('Firestore flashcards load failed:', err)
        setData(defaultData)
      }
      setLoaded(true)
    }

    load()
  }, [user])

  // Debounced save to Firestore
  useEffect(() => {
    if (!user || !loaded) return

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'data', 'flashcards')
        await setDoc(ref, data)
      } catch (err) {
        console.warn('Firestore flashcards save failed:', err)
      }
    }, 500)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [data, user, loaded])

  // Get all vocabulary from all units
  const allVocabulary = useMemo(() => {
    return units.flatMap(unit =>
      unit.vocabulary.map(v => ({
        ...v,
        unitId: unit.id,
        unitTitle: unit.title,
        level: unit.level,
      }))
    )
  }, [])

  // Initialize cards for words that don't have an entry yet
  const initializeWords = useCallback((unitId) => {
    const unit = units.find(u => u.id === unitId)
    if (!unit) return

    setData(prev => {
      const cards = { ...prev.cards }
      let changed = false

      unit.vocabulary.forEach(v => {
        const key = v.word.toLowerCase()
        if (!cards[key]) {
          cards[key] = {
            box: 1,
            lastReview: null,
            nextReview: getToday(),
            timesCorrect: 0,
            timesWrong: 0,
            addedFrom: unitId,
            addedDate: getToday(),
          }
          changed = true
        }
      })

      if (!changed) return prev
      return { ...prev, cards }
    })
  }, [])

  // Initialize all completed unit words
  const initializeFromProgress = useCallback((completedUnits) => {
    completedUnits.forEach(unitId => initializeWords(unitId))
  }, [initializeWords])

  // Initialize ALL units (not just completed)
  const initializeAllUnits = useCallback(() => {
    units.forEach(unit => initializeWords(unit.id))
  }, [initializeWords])

  // Get cards due for review today
  const dueCards = useMemo(() => {
    const today = getToday()
    return allVocabulary.filter(v => {
      const card = data.cards[v.word.toLowerCase()]
      if (!card) return false
      return card.nextReview <= today
    })
  }, [allVocabulary, data.cards])

  // Get all active cards (initialized)
  const activeCards = useMemo(() => {
    return allVocabulary.filter(v => data.cards[v.word.toLowerCase()])
  }, [allVocabulary, data.cards])

  // Get card data for a word
  const getCardData = useCallback((word) => {
    return data.cards[word.toLowerCase()] || null
  }, [data.cards])

  // Mark answer
  const markAnswer = useCallback((word, correct) => {
    const key = word.toLowerCase()
    setData(prev => {
      const card = prev.cards[key]
      if (!card) return prev

      const today = getToday()
      let newBox

      if (correct) {
        newBox = Math.min(card.box + 1, 5)
      } else {
        newBox = 1
      }

      const nextReview = addDays(today, BOX_INTERVALS[newBox])

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [key]: {
            ...card,
            box: newBox,
            lastReview: today,
            nextReview,
            timesCorrect: card.timesCorrect + (correct ? 1 : 0),
            timesWrong: card.timesWrong + (correct ? 0 : 1),
          },
        },
        stats: {
          ...prev.stats,
          totalReviewed: prev.stats.totalReviewed + 1,
          todayReviewed: (prev.stats.todayDate === today ? prev.stats.todayReviewed : 0) + 1,
          todayDate: today,
        },
      }
    })
  }, [])

  // Stats
  const stats = useMemo(() => {
    const cards = Object.values(data.cards)
    const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    cards.forEach(c => { boxCounts[c.box] = (boxCounts[c.box] || 0) + 1 })

    return {
      totalCards: cards.length,
      dueToday: dueCards.length,
      todayReviewed: data.stats.todayReviewed,
      totalReviewed: data.stats.totalReviewed,
      learned: boxCounts[5],
      boxCounts,
      dailyGoal: data.settings.dailyGoal,
    }
  }, [data, dueCards])

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }))
  }, [])

  return {
    data,
    loaded,
    dueCards,
    activeCards,
    allVocabulary,
    getCardData,
    markAnswer,
    initializeWords,
    initializeFromProgress,
    initializeAllUnits,
    stats,
    updateSettings,
  }
}
