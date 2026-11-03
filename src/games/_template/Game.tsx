import { useState } from 'react'
import { playSound, randomInt, useLater, type GameProps, type Stars } from '@/core'
import { ProgressDots, TapHint } from '@/ui'
import styles from './Game.module.css'

/*
 * JOC EXEMPLU: steluța apare într-un loc aleator, copilul o atinge de câteva ori.
 * Înlocuiți logica de aici cu jocul vostru, dar păstrați regulile:
 *   - fără text pentru copii (doar imagini, emoji, animații);
 *   - fără timer și fără „ai pierdut”;
 *   - feedback la fiecare atingere: playSound('success') sau playSound('oops');
 *   - la final se apelează o singură dată onFinish({ stars, correct, mistakes }).
 */

/** Câte runde are jocul la fiecare nivel de dificultate. */
const ROUNDS = { 1: 4, 2: 6, 3: 8 } as const

function randomSpot() {
  return { top: 10 + randomInt(70), left: 10 + randomInt(80) }
}

function starsFor(mistakes: number): Stars {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

export function TemplateGame({ difficulty, onFinish }: GameProps) {
  const rounds = ROUNDS[difficulty]
  const [done, setDone] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [spot, setSpot] = useState(randomSpot)
  const later = useLater()

  function hitStar() {
    playSound('success')
    const next = done + 1
    setDone(next)
    if (next === rounds) {
      later(() => onFinish({ stars: starsFor(mistakes), correct: rounds, mistakes }), 500)
    } else {
      setSpot(randomSpot())
    }
  }

  function missStar() {
    playSound('oops')
    setMistakes((n) => n + 1)
  }

  return (
    <div className={styles.layout}>
      <ProgressDots total={rounds} done={done} />
      <div className={styles.field} onClick={missStar}>
        <div className={styles.spot} style={{ top: `${spot.top}%`, left: `${spot.left}%` }}>
          <TapHint show={done === 0}>
            <button
              type="button"
              className={`${styles.star} ui-pop`}
              key={done}
              aria-label="Steluță"
              onClick={(event) => {
                event.stopPropagation()
                hitStar()
              }}
            >
              ⭐
            </button>
          </TapHint>
        </div>
      </div>
    </div>
  )
}
