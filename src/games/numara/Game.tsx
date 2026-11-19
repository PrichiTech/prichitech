import { useEffect, useState } from 'react'
import {
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

const EMOJIS = ['🍎', '🍓', '⭐', '🐟', '🌸', '🍋', '🐞', '🦋', '🚗', '🍪']

const ROUNDS = { 1: 3, 2: 5, 3: 7 } as const

const RANGES = {
  1: { min: 1, max: 4 },
  2: { min: 2, max: 9 },
  3: { min: 4, max: 15 },
} as const

const HINT_AFTER_MS = 7000

interface Round {
  emoji: string
  count: number
  options: number[]
}

function makeRound(difficulty: Difficulty): Round {
  const { min, max } = RANGES[difficulty]
  const count = min + randomInt(max - min + 1)
  const emoji = EMOJIS[randomInt(EMOJIS.length)]

  // Variante apropiate de raspunsul corect, dar strict pozitive.
  const wrongOptions = shuffle([count - 1, count + 1, count + 2].filter((n) => n > 0)).slice(0, 2)

  return {
    emoji,
    count,
    options: shuffle([count, ...wrongOptions]),
  }
}

function starsFor(mistakes: number): Stars {
  if (mistakes <= 1) return 3
  if (mistakes <= 3) return 2
  return 1
}

export function CountingGame({ difficulty, onFinish }: GameProps) {
  const rounds = ROUNDS[difficulty]

  const [roundNumber, setRoundNumber] = useState(0)
  const [round, setRound] = useState(() => makeRound(difficulty))
  const [marked, setMarked] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [wrongOption, setWrongOption] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const later = useLater()

  // Indiciu vizual dupa cateva secunde de inactivitate.
  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), HINT_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [roundNumber])

  function markObject(index: number) {
    if (solved) return

    playSound('tap')
    setShowHint(false)

    setMarked((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    )
  }

  function choose(number: number) {
    if (solved) return

    setShowHint(false)

    if (number !== round.count) {
      playSound('oops')
      setMistakes((n) => n + 1)
      setWrongOption(number)
      later(() => setWrongOption(null), 500)
      return
    }

    playSound('success')
    setSolved(true)

    later(() => {
      const next = roundNumber + 1

      if (next === rounds) {
        onFinish({
          stars: starsFor(mistakes),
          correct: rounds,
          mistakes,
        })
        return
      }

      setRoundNumber(next)
      setRound(makeRound(difficulty))
      setMarked([])
      setWrongOption(null)
      setShowHint(false)
      setSolved(false)
    }, 1500)
  }

  return (
    <div className={styles.layout}>
      <ProgressDots total={rounds} done={roundNumber + (solved ? 1 : 0)} />

      <div className={styles.objects}>
        {Array.from({ length: round.count }, (_, index) => (
          <button
            key={`${roundNumber}-${index}`}
            type="button"
            className={[
              styles.object,
              marked.includes(index) ? styles.marked : '',
              solved ? styles.celebrate : '',
            ].join(' ')}
            style={solved ? { animationDelay: `${index * 0.06}s` } : undefined}
            aria-label={`Obiect ${index + 1}`}
            aria-pressed={marked.includes(index)}
            disabled={solved}
            onClick={() => markObject(index)}
          >
            <span aria-hidden>{round.emoji}</span>
            {marked.includes(index) && (
              <span className={styles.check} aria-hidden>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.options}>
        {round.options.map((number) => {
          const isCorrect = number === round.count

          const button = (
            <button
              key={`${roundNumber}-${number}`}
              type="button"
              className={[
                styles.option,
                wrongOption === number ? 'ui-shake' : '',
                solved && isCorrect ? styles.correct : '',
              ].join(' ')}
              disabled={solved}
              onClick={() => choose(number)}
            >
              {number}
            </button>
          )

          return isCorrect ? (
            <TapHint key={`${roundNumber}-${number}`} show={showHint && !solved}>
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
