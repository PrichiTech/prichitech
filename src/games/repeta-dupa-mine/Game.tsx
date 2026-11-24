import { useEffect, useRef, useState } from 'react'
import { playSound, randomInt, useLater, type GameProps, type Stars } from '@/core'
import { Mascot, ProgressDots } from '@/ui'
import styles from './Game.module.css'

const BUTTONS = [
  { shape: 'circle', color: 'var(--red)', label: 'Cerc roșu' },
  { shape: 'diamond', color: 'var(--blue)', label: 'Romb albastru' },
  { shape: 'square', color: 'var(--green)', label: 'Pătrat verde' },
  { shape: 'star', color: 'var(--yellow)', label: 'Stea galbenă' },
] as const

const LEVELS = {
  1: { buttons: 3, min: 2, max: 3 },
  2: { buttons: 4, min: 2, max: 4 },
  3: { buttons: 4, min: 3, max: 5 },
} as const

const LIGHT_MS = 600
const PAUSE_MS = 300
const START_DELAY_MS = 500

type Phase = 'watch' | 'play' | 'wrong' | 'success'
type Shape = (typeof BUTTONS)[number]['shape']

function makeSequence(length: number, buttons: number) {
  return Array.from({ length }, () => randomInt(buttons))
}

function starsFor(mistakes: number): Stars {
  if (mistakes === 0) return 3
  if (mistakes <= 2) return 2
  return 1
}

/** Formele permit identificarea butoanelor și fără perceperea culorilor. */
function ShapeIcon({ shape, color }: { shape: Shape; color: string }) {
  return (
    <svg
      className={styles.shape}
      viewBox="0 0 120 120"
      fill={color}
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
      aria-hidden
    >
      {shape === 'circle' && <circle cx="60" cy="60" r="49" />}

      {shape === 'diamond' && <polygon points="60,6 114,60 60,114 6,60" />}

      {shape === 'square' && <rect x="13" y="13" width="94" height="94" rx="8" />}

      {shape === 'star' && (
        <polygon points="60,6 76,40 114,45 86,72 93,111 60,93 27,111 34,72 6,45 44,40" />
      )}
    </svg>
  )
}

export function SequenceGame({ difficulty, onFinish }: GameProps) {
  const level = LEVELS[difficulty]

  const [sequence, setSequence] = useState(() => makeSequence(level.min, level.buttons))
  const [phase, setPhase] = useState<Phase>('watch')
  const [lit, setLit] = useState<number | null>(null)

  const mistakes = useRef(0)
  const position = useRef(0)
  const phaseRef = useRef<Phase>('watch')
  const playbackVersion = useRef(0)
  const flashVersion = useRef(0)

  const later = useLater()

  // Aplicația prezintă secvența înaintea fiecărei încercări.
  useEffect(() => {
    if (phase !== 'watch') return

    const version = ++playbackVersion.current

    sequence.forEach((button, index) => {
      const start = START_DELAY_MS + index * (LIGHT_MS + PAUSE_MS)

      later(() => {
        if (playbackVersion.current === version) {
          setLit(button)
        }
      }, start)

      later(() => {
        if (playbackVersion.current === version) {
          setLit(null)
        }
      }, start + LIGHT_MS)
    })

    // După prezentare, copilul poate reproduce secvența.
    later(
      () => {
        if (playbackVersion.current !== version) return

        position.current = 0
        phaseRef.current = 'play'
        setPhase('play')
      },
      START_DELAY_MS + sequence.length * (LIGHT_MS + PAUSE_MS),
    )

    return () => {
      playbackVersion.current += 1
    }
  }, [phase, sequence, later])

  function choose(index: number) {
    if (phaseRef.current !== 'play') return

    // Fiecare atingere iluminează forma selectată.
    const version = ++flashVersion.current
    setLit(index)

    later(() => {
      if (flashVersion.current === version) {
        setLit(null)
      }
    }, 250)

    // Răspuns greșit: reluăm aceeași secvență.
    if (index !== sequence[position.current]) {
      playSound('oops')
      mistakes.current += 1

      phaseRef.current = 'wrong'
      setPhase('wrong')

      later(() => {
        setLit(null)
        phaseRef.current = 'watch'
        setPhase('watch')
      }, 800)

      return
    }

    position.current += 1

    // Copilul mai are forme de selectat.
    if (position.current < sequence.length) {
      playSound('tap')
      return
    }

    // Secvența a fost reprodusă integral.
    playSound('success')
    phaseRef.current = 'success'
    setPhase('success')

    later(() => {
      if (sequence.length === level.max) {
        onFinish({
          stars: starsFor(mistakes.current),
          correct: level.max - level.min + 1,
          mistakes: mistakes.current,
        })
        return
      }

      // Păstrăm secvența și adăugăm încă o formă.
      setSequence([...sequence, randomInt(level.buttons)])
      setLit(null)
      phaseRef.current = 'watch'
      setPhase('watch')
    }, 1000)
  }

  return (
    <div className={styles.layout}>
      <ProgressDots
        total={level.max - level.min + 1}
        done={sequence.length - level.min + (phase === 'success' ? 1 : 0)}
      />

      <Mascot
        size={145}
        mood={
          phase === 'watch'
            ? 'think'
            : phase === 'wrong'
              ? 'oops'
              : phase === 'success'
                ? 'cheer'
                : 'happy'
        }
      />

      <div
        className={[
          styles.board,
          phase === 'watch' ? styles.watching : '',
          phase === 'wrong' ? 'ui-shake' : '',
        ].join(' ')}
      >
        {BUTTONS.slice(0, level.buttons).map((button, index) => (
          <button
            key={button.shape}
            type="button"
            className={[styles.button, lit === index ? styles.lit : ''].join(' ')}
            disabled={phase !== 'play'}
            aria-label={button.label}
            onClick={() => choose(index)}
          >
            <ShapeIcon shape={button.shape} color={button.color} />
          </button>
        ))}
      </div>
    </div>
  )
}
