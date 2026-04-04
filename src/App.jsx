import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './components/pages/Home'
import UnitPage from './components/pages/UnitPage'
import QuizPage from './components/pages/QuizPage'
import VocabReview from './components/pages/VocabReview'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unit/:unitId" element={<UnitPage />} />
        <Route path="/quiz/:moduleId" element={<QuizPage />} />
        <Route path="/vocab-review" element={<VocabReview />} />
      </Routes>
    </Layout>
  )
}
