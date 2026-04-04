import { useState, useEffect } from 'react'

const STORAGE_KEY = 'english-learning-progress'

const defaultProgress = {
  completedUnits: [],
  scores: {},
  vocabularyBank: [],
  currentLevel: 'A1',
  totalWordsLearned: 0,
}

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultProgress
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const completeUnit = (unitId, score) => {
    setProgress(prev => ({
      ...prev,
      completedUnits: prev.completedUnits.includes(unitId)
        ? prev.completedUnits
        : [...prev.completedUnits, unitId],
      scores: { ...prev.scores, [unitId]: Math.max(score, prev.scores[unitId] || 0) },
    }))
  }

  const addWords = (words) => {
    setProgress(prev => {
      const newWords = words.filter(w => !prev.vocabularyBank.includes(w))
      return {
        ...prev,
        vocabularyBank: [...prev.vocabularyBank, ...newWords],
        totalWordsLearned: prev.vocabularyBank.length + newWords.length,
      }
    })
  }

  const isUnitCompleted = (unitId) => progress.completedUnits.includes(unitId)
  const getScore = (unitId) => progress.scores[unitId] || null

  return { progress, completeUnit, addWords, isUnitCompleted, getScore }
}
