import { useEffect, useState } from 'react'
import {
  pickRandom,
  playSound,
  randomInt,
  shuffle,
  useLater,
  type Difficulty,
  type GameProps,
  type Stars,
} from '@/core'
import { ProgressDots, TapHint } from '@/ui'
import styles from './Game.module.css'

/** Perechi de imagini care seamănă. La „greu”, intrusul e chiar perechea imaginii principale. */
const SIMILAR = [
  ['🍎', '🍐'],
  ['🐶', '🐺'],
  ['⭐', '🌙'],
  ['🚗', '🚕'],
  ['🌻', '🌼'],
  ['🐟', '🐠'],
  ['🍓', '🍒'],
  ['⚽', '🏀'],
  ['🐤', '🐧'],
  ['🍋', '🍊'],
]

const ROUNDS = 5
const ITEMS = { 1: 4, 2: 5, 3: 7 } as const
/** După câte secunde fără nicio atingere apare mânuța de ajutor. */
const HINT_AFTER_MS = 7000

interface Round {
  items: string[]
  oddIndex: number
}

function makeRound(difficulty: Difficulty): Round {
  const pair = pickRandom(SIMILAR)
  const [main, sibling] = shuffle(pair)
  // La „ușor”, intrusul vine dintr-o altă pereche, deci e foarte diferit.
  const odd = difficulty === 1 ? pickRandom(SIMILAR.filter((p) => p !== pair))[0] : sibling
  const count = ITEMS[difficulty]
  const oddIndex = randomInt(count)
  return { items: Array.from({ length: count }, (_, i) => (i === oddIndex ? odd : main)), oddIndex }
}

function starsFor(mistakes: number): Stars {
  if (mistakes <= 1) return 3
  if (mistakes <= 3) return 2
  return 1
}

export function OddOneOut({ difficulty, onFinish }: GameProps) {
  const [roundNumber, setRoundNumber] = useState(0)
  const [round, setRound] = useState(() => makeRound(difficulty))
  const [mistakes, setMistakes] = useState(0)
  const [wrongIndex, setWrongIndex] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const later = useLater()

  // Ajutor vizual dacă, după câteva secunde, copilul nu a atins nimic.
  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), HINT_AFTER_MS)
    return () => {
      window.clearTimeout(timer)
      setShowHint(false)
    }
  }, [roundNumber])

  function choose(index: number) {
    if (solved) return
    if (index !== round.oddIndex) {
      playSound('oops')
      setMistakes((n) => n + 1)
      setWrongIndex(index)
      later(() => setWrongIndex(null), 500)
      return
    }

    playSound('success')
    setSolved(true)
    later(() => {
      const next = roundNumber + 1
      if (next === ROUNDS) {
        onFinish({ stars: starsFor(mistakes), correct: ROUNDS, mistakes })
        return
      }
      setRoundNumber(next)
      setRound(makeRound(difficulty))
      setSolved(false)
    }, 900)
  }

  return (
    <div className={styles.layout}>
      <ProgressDots total={ROUNDS} done={roundNumber + (solved ? 1 : 0)} />
      <div className={styles.items}>
        {round.items.map((item, index) => {
          const isOdd = index === round.oddIndex
          const className = [
            styles.item,
            index === wrongIndex ? 'ui-shake' : '',
            solved && isOdd ? `${styles.correct} ui-pop` : '',
            solved && !isOdd ? styles.faded : '',
          ].join(' ')
          const button = (
            <button
              key={`${roundNumber}-${index}`}
              type="button"
              className={className}
              aria-label={item}
              onClick={() => choose(index)}
            >
              {item}
            </button>
          )
          return isOdd ? (
            <TapHint key={`${roundNumber}-${index}`} show={showHint && !solved}>
              {button}
            </TapHint>
          ) : (
            button
          )
        })}
      </div>
    </div>
  )
}
