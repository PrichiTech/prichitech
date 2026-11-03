import { useState } from 'react'

const COLORS = ['#ffb703', '#219ebc', '#52b788', '#ef6f6c', '#9b5de5', '#f15bb5']

function makePieces(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.8 + Math.random() * 1.4,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }))
}

/** Confetti care cad o singură dată (doar CSS, fără biblioteci). */
export function Confetti({ count = 40 }: { count?: number }) {
  const [pieces] = useState(() => makePieces(count))
  return (
    <div className="ui-confetti" aria-hidden>
      {pieces.map((piece, i) => (
        <span
          key={i}
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            rotate: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>
  )
}
