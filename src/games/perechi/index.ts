import type { GameModule } from '@/core'
import { MemoryPairs } from './Game'

const game: GameModule = {
  id: 'perechi',
  title: 'Perechi',
  icon: '🃏',
  color: '#a0c4ff',
  category: 'memorie',
  instruction: 'Găsește perechile! Întoarce câte două cartonașe.',
  authors: ['SniperX11'],
  component: MemoryPairs,
}

export default game
