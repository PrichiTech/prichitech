import type { GameModule } from '@/core'
import { OddOneOut } from './Game'

const game: GameModule = {
  id: 'intrusul',
  title: 'Găsește intrusul',
  icon: '🔍',
  color: '#caffbf',
  category: 'atentie',
  instruction: 'Atinge ce este diferit!',
  authors: ['SniperX11'],
  component: OddOneOut,
}

export default game
