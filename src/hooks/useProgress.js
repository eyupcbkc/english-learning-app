import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/contexts/AuthContext'

const VERSION = 2

const LEVEL_THRESHOLDS = {
  'A1': { minUnits: 0 },
  'A2': { minUnits: 8 },
  'B1': { minUnits: 24 },
  'B2': { minUnits: 40 },
  'C1': { minUnits: 56 },
}

const defaultProgress = {
  version: VERSION,
  completedUnits: [],
  scores: {},
  exerciseScores: {},
  vocabularyBank: [],
  currentLevel: 'A1',
  totalWordsLearned: 0,
  streakDays: 0,
  lastStudyDate: null,
  totalStudyTime: 0,
  createdAt: new Date().toISOString(),
}

function migrate(data) {
  if (!data.version || data.version < 2) {
    return { ...defaultProgress, ...data, version: VERSION }
  }
  return data
}

function calculateLevel(completedCount) {
  const levels = Object.entries(LEVEL_THRESHOLDS).reverse()
  for (const [level, { minUnits }] of levels) {
    if (completedCount >= minUnits) return level
  }
  return 'A1'
}

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState(defaultProgress)
  const [loaded, setLoaded] = useState(false)
  const saveTimeoutRef = useRef(null)

  // Firestore document reference for this user
  const getDocRef = useCallback(() => {
    if (!user) return null
    return doc(db, 'users', user.uid, 'data', 'progress')
  }, [user])

  // Load from Firestore on mount / user change
  useEffect(() => {
    if (!user) {
      setProgress(defaultProgress)
      setLoaded(false)
      return
    }

    async function load() {
      try {
        const ref = doc(db, 'users', user.uid, 'data', 'progress')
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProgress(migrate(snap.data()))
        } else {
          // First time — check if there's localStorage data to migrate
          const localData = localStorage.getItem('english-learning-progress')
          if (localData) {
            const parsed = migrate(JSON.parse(localData))
            setProgress(parsed)
            // Save migrated data to Firestore
            await setDoc(ref, parsed)
          } else {
            setProgress(defaultProgress)
          }
        }
      } catch (err) {
        console.warn('Firestore load failed, using defaults:', err)
        setProgress(defaultProgress)
      }
      setLoaded(true)
    }

    load()
  }, [user])

  // Debounced save to Firestore on progress change
  useEffect(() => {
    if (!user || !loaded) return

    // Clear previous timeout
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    // Debounce: save after 500ms of no changes
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const ref = doc(db, 'users', user.uid, 'data', 'progress')
        await setDoc(ref, progress)
      } catch (err) {
        console.warn('Firestore save failed:', err)
      }
    }, 500)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [progress, user, loaded])

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setProgress(prev => {
      if (prev.lastStudyDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      return {
        ...prev,
        lastStudyDate: today,
        streakDays: prev.lastStudyDate === yesterday ? prev.streakDays + 1 : 1,
      }
    })
  }, [])

  const completeUnit = useCallback((unitId, score) => {
    updateStreak()
    setProgress(prev => {
      const completedUnits = prev.completedUnits.includes(unitId)
        ? prev.completedUnits
        : [...prev.completedUnits, unitId]
      return {
        ...prev,
        completedUnits,
        scores: { ...prev.scores, [unitId]: Math.max(score, prev.scores[unitId] || 0) },
        currentLevel: calculateLevel(completedUnits.length),
      }
    })
  }, [updateStreak])

  const saveExerciseScore = useCallback((unitId, exerciseType, score, total) => {
    updateStreak()
    setProgress(prev => ({
      ...prev,
      exerciseScores: {
        ...prev.exerciseScores,
        [unitId]: {
          ...(prev.exerciseScores[unitId] || {}),
          [exerciseType]: { score, total, percentage: Math.round((score / total) * 100), date: new Date().toISOString() },
        },
      },
    }))
  }, [updateStreak])

  const addWords = useCallback((words) => {
    setProgress(prev => {
      const newWords = words.filter(w => !prev.vocabularyBank.includes(w))
      if (newWords.length === 0) return prev
      const bank = [...prev.vocabularyBank, ...newWords]
      return { ...prev, vocabularyBank: bank, totalWordsLearned: bank.length }
    })
  }, [])

  const getUnitProgress = useCallback((unitId) => {
    const exercises = progress.exerciseScores[unitId] || {}
    const types = Object.values(exercises)
    if (types.length === 0) return 0
    return Math.round(types.reduce((sum, t) => sum + t.percentage, 0) / types.length)
  }, [progress.exerciseScores])

  const isUnitCompleted = (unitId) => progress.completedUnits.includes(unitId)
  const getScore = (unitId) => progress.scores[unitId] || null

  const exportProgress = () => JSON.stringify(progress, null, 2)
  const importProgress = (json) => {
    try {
      const data = JSON.parse(json)
      setProgress(migrate(data))
      return true
    } catch { return false }
  }

  const resetProgress = () => setProgress(defaultProgress)

  return {
    progress,
    loaded,
    completeUnit,
    saveExerciseScore,
    addWords,
    isUnitCompleted,
    getScore,
    getUnitProgress,
    exportProgress,
    importProgress,
    resetProgress,
  }
}
