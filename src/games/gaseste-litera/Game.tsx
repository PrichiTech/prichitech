import { useEffect, useRef, useState } from 'react'
import {
  pickRandom,
  playSound,
  randomInt,
  shuffle,
  speak,
  useLater,
  type Difficulty,
  type GameProps,
  type Stars,
} from '@/core'
import { ProgressDots, TapHint } from '@/ui'
import styles from './Game.module.css'

/**
 * Doar literele pe care copiii le-au învățat deja (de actualizat după discuția cu învățătoarea).
 * Fără diacritice: semnul de sub Ș/Ț și căciula lui Ă/Â/Î abia se văd în balon.
 */
const KNOWN_LETTERS = ['A', 'E', 'I', 'O', 'U', 'M']

/** Perechi care seamănă; când se adaugă litere noi, se adaugă și perechile lor. */
const SIMILAR = [
  ['A', 'M'],
  ['A', 'V'],
  ['B', 'R'],
  ['C', 'G'],
  ['D', 'O'],
  ['E', 'F'],
  ['I', 'L'],
  ['M', 'N'],
  ['O', 'Q'],
  ['O', 'U'],
  ['P', 'R'],
  ['U', 'V'],
]

const ROUNDS = { 1: 4, 2: 5, 3: 6 } as const
const BALLOONS = { 1: 4, 2: 6, 3: 8 } as const

const HINT_AFTER_MS = 7000

interface Round {
  target: string
  letters: string[]
  targetCount: number
}

function areSimilar(first: string, second: string) {
  return SIMILAR.some(([a, b]) => (a === first && b === second) || (a === second && b === first))
}

function makeRound(
  difficulty: Difficulty,
  target: string,
  availableLetters: readonly string[],
): Round {
  const count = BALLOONS[difficulty]
  const targetCount = 1 + randomInt(3)

  const others = availableLetters.filter((letter) => letter !== target)

  const preferred =
    difficulty === 1
      ? others.filter((letter) => !areSimilar(target, letter))
      : difficulty === 3
        ? others.filter((letter) => areSimilar(target, letter))
        : others

  const pool = preferred.length > 0 ? preferred : others

  const letters = [
    ...Array.from({ length: targetCount }, () => target),
    ...Array.from({ length: count - targetCount }, () => pickRandom(pool)),
  ]

  return {
    target,
    letters: shuffle(letters),
    targetCount,
  }
}

function makeRounds(difficulty: Difficulty) {
  const targets = shuffle(KNOWN_LETTERS)

  return Array.from({ length: ROUNDS[difficulty] }, (_, index) =>
    makeRound(difficulty, targets[index % targets.length], KNOWN_LETTERS),
  )
}

function starsFor(mistakes: number): Stars {
  if (mistakes <= 1) return 3
  if (mistakes <= 3) return 2
  return 1
}

export function LetterGame({ difficulty, onFinish }: GameProps) {
  const [rounds] = useState(() => makeRounds(difficulty))
  const [roundNumber, setRoundNumber] = useState(0)
  const [popped, setPopped] = useState<number[]>([])
  const [gone, setGone] = useState<number[]>([])
  const [wrongAttempts, setWrongAttempts] = useState<Record<number, number>>({})
  const [showHint, setShowHint] = useState(false)
  const [activity, setActivity] = useState(0)

  const mistakes = useRef(0)
  const hitIds = useRef(new Set<number>())
  const locked = useRef(false)

  const speechVersion = useRef(0)
  const hintVersion = useRef(0)

  const later = useLater()
  const round = rounds[roundNumber]
  const solved = popped.length === round.targetCount

  // Instrucțiunea audio specifică fiecărei runde.
  useEffect(() => {
    const version = ++speechVersion.current

    later(() => {
      if (speechVersion.current === version) {
        speak(`Găsește litera ${round.target}`, { auto: true })
      }
    }, 0)

    return () => {
      speechVersion.current += 1
    }
  }, [roundNumber, round.target, later])

  // Ajutor vizual după câteva secunde de inactivitate.
  useEffect(() => {
    if (solved) return

    const version = ++hintVersion.current

    later(() => {
      if (hintVersion.current === version && !locked.current) {
        setShowHint(true)
      }
    }, HINT_AFTER_MS)

    return () => {
      hintVersion.current += 1
    }
  }, [roundNumber, activity, solved, later])

  function choose(index: number) {
    if (locked.current || hitIds.current.has(index)) return

    setShowHint(false)
    setActivity((n) => n + 1)

    if (round.letters[index] !== round.target) {
      playSound('oops')
      mistakes.current += 1

      setWrongAttempts((current) => ({
        ...current,
        [index]: (current[index] ?? 0) + 1,
      }))

      return
    }

    // Balonul corect se sparge și dispare.
    playSound('success')
    hitIds.current.add(index)
    setPopped((current) => [...current, index])

    later(() => {
      setGone((current) => [...current, index])
    }, 450)

    // Mai există baloane corecte în această rundă.
    if (hitIds.current.size < round.targetCount) return

    locked.current = true

    later(() => {
      const next = roundNumber + 1

      if (next === rounds.length) {
        onFinish({
          stars: starsFor(mistakes.current),
          correct: rounds.length,
          mistakes: mistakes.current,
        })
        return
      }

      hitIds.current.clear()
      locked.current = false

      setRoundNumber(next)
      setPopped([])
      setGone([])
      setWrongAttempts({})
      setShowHint(false)
    }, 800)
  }

  const hintIndex = round.letters.findIndex(
    (letter, index) => letter === round.target && !popped.includes(index),
  )

  return (
    <div className={styles.layout}>
      <ProgressDots total={rounds.length} done={roundNumber + (solved ? 1 : 0)} />

      <div
        className={`${styles.target} ui-pop`}
        key={roundNumber}
        role="img"
        aria-label={`Litera căutată: ${round.target}`}
      >
        {round.target}
      </div>

      <div className={styles.balloons}>
        {round.letters.map((letter, index) => (
          <div key={`${roundNumber}-${index}`} className={styles.slot}>
            {!gone.includes(index) && (
              <TapHint show={showHint && !solved && index === hintIndex}>
                <button
                  type="button"
                  className={styles.balloon}
                  aria-label={`Litera ${letter}`}
                  disabled={solved || popped.includes(index)}
                  onClick={() => choose(index)}
                >
                  <span
                    key={wrongAttempts[index] ?? 0}
                    className={[
                      styles.balloonFace,
                      wrongAttempts[index] ? 'ui-shake' : '',
                      popped.includes(index) ? `${styles.popping} ui-pop` : '',
                    ].join(' ')}
                    aria-hidden
                  >
                    {letter}
                  </span>
                </button>
              </TapHint>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
