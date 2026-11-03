import type { ReactElement } from 'react'

export type MascotMood = 'happy' | 'cheer' | 'think' | 'oops'

interface Props {
  mood?: MascotMood
  size?: number
  className?: string
}

const MOUTHS: Record<MascotMood, ReactElement> = {
  happy: (
    <path
      d="M48 68 Q60 79 72 68"
      fill="none"
      stroke="#2b2d42"
      strokeWidth="4"
      strokeLinecap="round"
    />
  ),
  cheer: (
    <path
      d="M46 66 Q60 86 74 66 Z"
      fill="#2b2d42"
      stroke="#2b2d42"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  ),
  think: (
    <path d="M50 72 L70 69" fill="none" stroke="#2b2d42" strokeWidth="4" strokeLinecap="round" />
  ),
  oops: <ellipse cx="60" cy="72" rx="6" ry="7" fill="#2b2d42" />,
}

/** Prichi, mascota aplicației. Arată copilului ce se întâmplă fără cuvinte. */
export function Mascot({ mood = 'happy', size = 120, className }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Prichi"
    >
      <line
        x1="60"
        y1="24"
        x2="60"
        y2="10"
        stroke="#2b2d42"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="9" r="7" fill="#ef6f6c" stroke="#2b2d42" strokeWidth="3" />
      <rect
        x="6"
        y="50"
        width="14"
        height="26"
        rx="7"
        fill="#219ebc"
        stroke="#2b2d42"
        strokeWidth="3"
      />
      <rect
        x="100"
        y="50"
        width="14"
        height="26"
        rx="7"
        fill="#219ebc"
        stroke="#2b2d42"
        strokeWidth="3"
      />
      <rect
        x="16"
        y="24"
        width="88"
        height="80"
        rx="32"
        fill="#ffb703"
        stroke="#2b2d42"
        strokeWidth="4"
      />
      <rect x="28" y="36" width="64" height="56" rx="22" fill="#fff8e7" />
      <circle cx="46" cy="56" r="8" fill="#2b2d42" />
      <circle cx="74" cy="56" r="8" fill="#2b2d42" />
      <circle cx="49" cy="53" r="2.5" fill="#fff" />
      <circle cx="77" cy="53" r="2.5" fill="#fff" />
      <ellipse cx="36" cy="70" rx="5" ry="3" fill="#ff9aa2" />
      <ellipse cx="84" cy="70" rx="5" ry="3" fill="#ff9aa2" />
      {MOUTHS[mood]}
    </svg>
  )
}
