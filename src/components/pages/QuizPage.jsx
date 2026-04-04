import { Link } from 'react-router-dom'

export default function QuizPage() {
  return (
    <div className="card">
      <div className="card-title">📝 Quiz</div>
      <p>Quiz sayfası daha fazla ünite tamamlandıktan sonra aktif olacak.</p>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
        Quizzes will be available after completing more units.
      </p>
      <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
        ← Ana Sayfa / Home
      </Link>
    </div>
  )
}
