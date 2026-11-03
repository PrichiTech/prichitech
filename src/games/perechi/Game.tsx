import { useState, type CSSProperties } from 'react'
import { playSound, shuffle, useLater, type GameProps, type Stars } from '@/core'
import { TapHint } from '@/ui'
import styles from './Game.module.css'

const PICTURES = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🦁', '🐷']

/** Câte perechi are jocul la fiecare nivel de dificultate. */
const PAIRS = { 1: 3, 2: 4, 3: 6 } as const

interface Card {
  id: number
  picture: string
}

function makeDeck(pairs: number): Card[] {
  const pictures = shuffle(PICTURES).slice(0, pairs)
  return shuffle([...pictures, ...pictures]).map((picture, id) => ({ id, picture }))
}

function starsFor(mistakes: number, pairs: number): Stars {
  if (mistakes <= pairs) return 3
  if (mistakes <= pairs * 2) return 2
  return 1
}

export function MemoryPairs({ difficulty, onFinish }: GameProps) {
  const pairs = PAIRS[difficulty]
  const [deck] = useState(() => makeDeck(pairs))
  /** Cartonașele întoarse acum (maxim două). */
  const [open, setOpen] = useState<number[]>([])
  /** Imaginile deja potrivite. */
  const [found, setFound] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [touched, setTouched] = useState(false)
  const later = useLater()

  function flip(card: Card) {
    if (open.length === 2 || open.includes(card.id) || found.includes(card.picture)) return
    playSound('tap')
    setTouched(true)
    const nowOpen = [...open, card.id]
    setOpen(nowOpen)
    if (nowOpen.length < 2) return

    const [first, second] = nowOpen.map((id) => deck[id])
    if (first.picture === second.picture) {
      const nowFound = [...found, first.picture]
      later(() => {
        playSound('success')
        setFound(nowFound)
        setOpen([])
        if (nowFound.length === pairs) {
          later(() => onFinish({ stars: starsFor(mistakes, pairs), correct: pairs, mistakes }), 700)
        }
      }, 400)
    } else {
      setMistakes((n) => n + 1)
      // Lăsăm cartonașele întoarse puțin, ca copilul să le poată memora.
      later(() => {
        playSound('oops')
        setOpen([])
      }, 1000)
    }
  }

  return (
    <div className={styles.board} style={{ '--cols': pairs } as CSSProperties}>
      {deck.map((card, index) => {
        const isFound = found.includes(card.picture)
        const isFaceUp = isFound || open.includes(card.id)
        const button = (
          <button
            type="button"
            className={`${styles.card} ${isFaceUp ? styles.faceUp : ''} ${isFound ? styles.found : ''}`}
            aria-label={isFaceUp ? card.picture : 'Cartonaș întors'}
            onClick={() => flip(card)}
          >
            <span className={styles.back} aria-hidden>
              ?
            </span>
            <span className={`${styles.front} ${isFound ? 'ui-pop' : ''}`} aria-hidden>
              {card.picture}
            </span>
          </button>
        )
        return index === 0 ? (
          <TapHint key={card.id} show={!touched}>
            {button}
          </TapHint>
        ) : (
          <div key={card.id} className={styles.slot}>
            {button}
          </div>
        )
      })}
    </div>
  )
}
