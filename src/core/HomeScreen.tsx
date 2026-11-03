import { useRef, useState } from 'react'
import { Mascot } from '@/ui'
import { playSound } from './audio'
import { games, panels } from './registry'
import { navigate } from './router'
import { useSettings } from './settings'

const HOLD_MS = 2000

/** Lacătul din colț: trebuie ținut apăsat 2 secunde, ca să nu intre copiii din greșeală. */
function TeacherLock() {
  const timer = useRef<number | undefined>(undefined)
  const [holding, setHolding] = useState(false)

  function start() {
    setHolding(true)
    timer.current = window.setTimeout(() => {
      setHolding(false)
      navigate({ name: 'teacher' })
    }, HOLD_MS)
  }

  function cancel() {
    setHolding(false)
    window.clearTimeout(timer.current)
  }

  return (
    <button
      type="button"
      className={`teacher-lock${holding ? ' is-holding' : ''}`}
      aria-label="Zona învățătoarei (țineți apăsat 2 secunde)"
      title="Zona învățătoarei (țineți apăsat 2 secunde)"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      🔒
    </button>
  )
}

export function HomeScreen() {
  const { disabledGames } = useSettings()
  const visibleGames = games.filter((game) => !disabledGames.includes(game.id))
  const kidPanels = panels.filter((panel) => panel.audience === 'copii')

  return (
    <div className="home">
      <header className="home-header">
        <Mascot mood="happy" size={96} className="ui-float" />
        <h1 className="home-logo">PrichiTech</h1>
        <TeacherLock />
      </header>
      <main className="home-grid">
        {visibleGames.map((game) => (
          <button
            key={game.id}
            type="button"
            className="tile"
            style={{ background: game.color }}
            onClick={() => {
              playSound('tap')
              navigate({ name: 'game', id: game.id })
            }}
          >
            <span className="tile-icon">{game.icon}</span>
            <span className="tile-label">{game.title}</span>
          </button>
        ))}
        {kidPanels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className="tile tile--panel"
            style={{ background: panel.color }}
            onClick={() => {
              playSound('tap')
              navigate({ name: 'panel', id: panel.id })
            }}
          >
            <span className="tile-icon">{panel.icon}</span>
            <span className="tile-label">{panel.title}</span>
          </button>
        ))}
        {visibleGames.length === 0 && (
          <p className="home-empty">Niciun joc activ. Învățătoarea le poate activa din 🔒.</p>
        )}
      </main>
    </div>
  )
}
