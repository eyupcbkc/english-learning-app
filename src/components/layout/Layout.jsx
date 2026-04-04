import { NavLink } from 'react-router-dom'
import units from '../../data/unitIndex'
import { useProgress } from '../../hooks/useProgress'

export default function Layout({ children }) {
  const { isUnitCompleted, progress } = useProgress()

  const modules = {}
  units.forEach(u => {
    if (!modules[u.module]) modules[u.module] = []
    modules[u.module].push(u)
  })

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">English Journey</div>
        <div className="sidebar-level">Level: {progress.currentLevel} | Words: {progress.totalWordsLearned}</div>

        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">🏠</span> Ana Sayfa
        </NavLink>

        <NavLink to="/vocab-review" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">🔄</span> Kelime Tekrar
        </NavLink>

        {Object.entries(modules).map(([modNum, modUnits]) => (
          <div key={modNum} className="sidebar-section">
            <div className="sidebar-section-title">Module {modNum}</div>
            {modUnits.map(unit => (
              <NavLink
                key={unit.id}
                to={`/unit/${unit.id}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''} ${isUnitCompleted(unit.id) ? 'completed' : ''}`
                }
              >
                <span className="icon">{isUnitCompleted(unit.id) ? '✅' : '📘'}</span>
                {unit.title}
              </NavLink>
            ))}
          </div>
        ))}
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
