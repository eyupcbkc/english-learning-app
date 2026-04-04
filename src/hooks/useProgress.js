import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'english-learning-progress'
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
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return migrate(JSON.parse(saved))
    } catch {}
    return defaultProgress
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {}
  }, [progress])

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
