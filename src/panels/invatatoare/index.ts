import type { PanelModule } from '@/core'
import { TeacherPanel } from './Panel'

const panel: PanelModule = {
  id: 'invatatoare',
  title: 'Setări și rezultate',
  icon: '🍎',
  color: '#ffd6a5',
  audience: 'invatatoare',
  authors: ['SniperX11'],
  component: TeacherPanel,
}

export default panel
