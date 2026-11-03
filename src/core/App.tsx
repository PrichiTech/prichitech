import { GameHost } from './GameHost'
import { HomeScreen } from './HomeScreen'
import { PanelHost, TeacherHub } from './PanelHost'
import { findGame, findPanel, panels } from './registry'
import { useRoute, type Route } from './router'
import './core.css'

function Screen({ route }: { route: Route }) {
  if (route.name === 'game') {
    const game = findGame(route.id)
    if (game) return <GameHost key={game.id} game={game} />
  }
  if (route.name === 'panel') {
    const panel = findPanel(route.id)
    if (panel) return <PanelHost key={panel.id} panel={panel} />
  }
  if (route.name === 'teacher') {
    const teacherPanels = panels.filter((panel) => panel.audience === 'invatatoare')
    if (teacherPanels.length === 1) return <PanelHost panel={teacherPanels[0]} />
    return <TeacherHub panels={teacherPanels} />
  }
  return <HomeScreen />
}

export function App() {
  const route = useRoute()
  return (
    <>
      <Screen route={route} />
      <div className="rotate-hint" aria-hidden>
        <span className="rotate-hint-icon">📱</span>
        <span className="rotate-hint-arrow">↻</span>
      </div>
    </>
  )
}
