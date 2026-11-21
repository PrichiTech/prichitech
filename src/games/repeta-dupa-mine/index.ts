import type { GameModule } from '@/core'
import { SequenceGame } from './Game'

const game: GameModule = {
  id: 'repeta-dupa-mine',
  title: 'Repetă după mine',
  icon: '🧠',
  color: '#cdb4db',
  category: 'memorie',
  instruction: 'Privește formele și atinge-le în aceeași ordine!',
  authors: ['daisy1237'],
  component: SequenceGame,
}

export default game
