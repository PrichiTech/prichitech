import type { GameModule } from '@/core'
import { TemplateGame } from './Game'

// Folderele care încep cu „_” nu apar în aplicație. Creați un joc nou cu:
//   npm run new-game -- nume-joc "Titlul jocului"
const game: GameModule = {
  id: '_template',
  title: 'Titlul jocului',
  icon: '⭐',
  color: '#ffd6a5',
  category: 'atentie',
  instruction: 'Atinge steluța!',
  authors: ['username-github'],
  component: TemplateGame,
}

export default game
