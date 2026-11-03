import { playSound } from '@/core'

interface Props {
  /** Un emoji. Copiii înțeleg imaginea, nu textul. */
  icon: string
  /** Textul pentru adulți și cititoare de ecran. */
  label: string
  onClick: () => void
  size?: 'md' | 'lg'
  color?: string
}

/** Buton rotund și mare (minim 2 cm pe tabletă). */
export function IconButton({ icon, label, onClick, size = 'md', color }: Props) {
  return (
    <button
      type="button"
      className={`ui-icon-btn ui-icon-btn--${size}`}
      style={color ? { background: color } : undefined}
      aria-label={label}
      title={label}
      onClick={() => {
        playSound('tap')
        onClick()
      }}
    >
      <span aria-hidden>{icon}</span>
    </button>
  )
}
