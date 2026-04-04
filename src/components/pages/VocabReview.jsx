import { Navigate } from 'react-router-dom'

// Kelime tekrar sayfası artık Flashcard sayfasına yönlendiriyor
export default function VocabReview() {
  return <Navigate to="/flashcards" replace />
}
