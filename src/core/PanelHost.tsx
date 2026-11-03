import { useState } from 'react'
import { IconButton } from '@/ui'
import { ErrorBoundary } from './ErrorBoundary'
import { PinGate } from './PinGate'
import { games } from './registry'
import { goHome, navigate } from './router'
import { isTeacherUnlocked, setTeacherUnlocked } from './settings'
import type { PanelModule } from './types'

function leave(panel: PanelModule) {
  if (panel.audience === 'invatatoare') setTeacherUnlocked(false)
  goHome()
}

export function PanelHost({ panel }: { panel: PanelModule }) {
  const [unlocked, setUnlocked] = useState(() => panel.audience === 'copii' || isTeacherUnlocked())
  const close = () => leave(panel)

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} onCancel={close} />

  const Panel = panel.component
  return (
    <div className={`panel-host panel-host--${panel.audience}`}>
      <header className="host-bar">
        <IconButton icon="⬅️" label="Înapoi" onClick={close} />
        <h1 className="panel-title">
          <span aria-hidden>{panel.icon}</span> {panel.title}
        </h1>
        <span className="host-spacer" />
      </header>
      <main className="panel-stage">
        <ErrorBoundary onHome={close}>
          <Panel games={games} onClose={close} />
        </ErrorBoundary>
      </main>
    </div>
  )
}

/** Dacă există mai multe panouri pentru învățătoare, le arătăm ca listă după PIN. */
export function TeacherHub({ panels }: { panels: PanelModule[] }) {
  const [unlocked, setUnlocked] = useState(isTeacherUnlocked)
  const close = () => {
    setTeacherUnlocked(false)
    goHome()
  }

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} onCancel={close} />

  return (
    <div className="panel-host panel-host--invatatoare">
      <header className="host-bar">
        <IconButton icon="⬅️" label="Înapoi" onClick={close} />
        <h1 className="panel-title">Zona învățătoarei</h1>
        <span className="host-spacer" />
      </header>
      <main className="home-grid">
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            className="tile"
            style={{ background: panel.color }}
            onClick={() => navigate({ name: 'panel', id: panel.id })}
          >
            <span className="tile-icon">{panel.icon}</span>
            <span className="tile-label">{panel.title}</span>
          </button>
        ))}
      </main>
    </div>
  )
}
