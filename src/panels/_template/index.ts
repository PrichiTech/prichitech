import type { PanelModule } from '@/core'
import { TemplatePanel } from './Panel'

// Folderele care încep cu „_” nu apar în aplicație. Creați un panou nou cu:
//   npm run new-panel -- nume-panou "Titlul panoului"
const panel: PanelModule = {
  id: '_template',
  title: 'Titlul panoului',
  icon: '📒',
  color: '#ffc6ff',
  // 'copii' = apare pe ecranul de start; 'invatatoare' = apare după PIN
  audience: 'copii',
  authors: ['username-github'],
  component: TemplatePanel,
}

export default panel
