import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { IconButton } from '@/ui'
import { playSound, speak } from './audio'
import { ErrorBoundary } from './ErrorBoundary'
import { saveResult } from './progress'
import { ResultScreen } from './ResultScreen'
import { goHome } from './router'
import { useSettings } from './settings'
import type { GameModule, GameResult } from './types'

/** Rama comună a tuturor jocurilor: bara de sus, rostirea instrucțiunii, salvarea rezultatului. */
export function GameHost({ game }: { game: GameModule }) {
  const { difficulty, sound } = useSettings()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)
  const startedAt = useRef(0)
  const finished = useRef(false)

  useEffect(() => {
    startedAt.current = Date.now()
    finished.current = false
    speak(game.instruction, { auto: true })
  }, [game, attempt])

  function handleFinish(gameResult: GameResult) {
    if (finished.current) return
    finished.current = true
    saveResult({
      ...gameResult,
      gameId: game.id,
      difficulty,
      durationMs: Date.now() - startedAt.current,
      at: new Date().toISOString(),
    })
    playSound('win')
    setResult(gameResult)
  }

  function playAgain() {
    setResult(null)
    setAttempt((n) => n + 1)
  }

  const Game = game.component

  return (
    <div className="host" style={{ '--accent': game.color } as CSSProperties}>
      <header className="host-bar">
        <IconButton icon="🏠" label="Acasă" onClick={goHome} />
        <span className="host-icon" aria-hidden>
          {game.icon}
        </span>
        {sound !== 'oprit' ? (
          <IconButton icon="🔊" label="Ascultă din nou" onClick={() => speak(game.instruction)} />
        ) : (
          <span className="host-spacer" />
        )}
      </header>
      <main className="host-stage">
        <ErrorBoundary onHome={goHome}>
          <Game key={attempt} difficulty={difficulty} onFinish={handleFinish} />
        </ErrorBoundary>
      </main>
      {result && <ResultScreen stars={result.stars} onAgain={playAgain} onHome={goHome} />}
    </div>
  )
}
