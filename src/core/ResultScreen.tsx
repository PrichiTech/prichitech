import { Confetti, IconButton, Mascot, StarsView } from '@/ui'
import type { Stars } from './types'

interface Props {
  stars: Stars
  onAgain: () => void
  onHome: () => void
}

export function ResultScreen({ stars, onAgain, onHome }: Props) {
  return (
    <div className="result-overlay" role="dialog" aria-label="Joc terminat">
      <Confetti />
      <div className="result-card ui-pop">
        <Mascot mood="cheer" size={150} />
        <p className="result-title">Bravo!</p>
        <StarsView count={stars} />
        <div className="result-actions">
          <IconButton icon="🔁" label="Din nou" size="lg" color="var(--green)" onClick={onAgain} />
          <IconButton icon="🏠" label="Acasă" size="lg" color="var(--blue)" onClick={onHome} />
        </div>
      </div>
    </div>
  )
}
