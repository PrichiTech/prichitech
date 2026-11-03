import { useResults, type PanelProps } from '@/core'
import { StarsView } from '@/ui'
import styles from './Panel.module.css'

/** PANOU EXEMPLU: arată câte stele s-au strâns în total. Înlocuiți cu panoul vostru. */
export function TemplatePanel({ games }: PanelProps) {
  const results = useResults()
  const totalStars = results.reduce((sum, result) => sum + result.stars, 0)

  return (
    <div className={styles.layout}>
      <StarsView count={3} />
      <p className={styles.total}>{totalStars}</p>
      <p className={styles.note}>
        {games.length} jocuri, {results.length} terminate
      </p>
    </div>
  )
}
