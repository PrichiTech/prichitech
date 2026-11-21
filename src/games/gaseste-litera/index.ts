import type { GameModule } from '@/core'
import { LetterGame } from './Game'

const game: GameModule = {
  id: 'gaseste-litera',
  title: 'Găsește litera',
  icon: '🔠',
  color: '#ffc6ff',
  category: 'litere',
  instruction: 'Atinge toate baloanele cu litera de sus!',
  authors: ['daisy1237'],
  component: LetterGame,
}

export default game
