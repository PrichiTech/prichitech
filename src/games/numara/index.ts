import type { GameModule } from '@/core'
import { CountingGame } from './Game'

const game: GameModule = {
  id: 'numara',
  title: 'Numără și alege',
  icon: '🔢',
  color: '#bde0fe',
  category: 'numere',
  instruction: 'Numără obiectele și atinge cifra corectă!',
  authors: ['daisy1237'],
  component: CountingGame,
}

export default game
