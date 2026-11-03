import { useCallback, useEffect, useRef } from 'react'

/**
 * Ca `setTimeout`, dar se anulează singur când jocul se închide.
 * Folosiți-l în jocuri în loc de `setTimeout`, ca să evitați erori după ce copilul apasă 🏠.
 *
 *   const later = useLater()
 *   later(() => setOpen([]), 900)
 */
export function useLater() {
  const timers = useRef(new Set<number>())

  useEffect(() => {
    const active = timers.current
    return () => {
      active.forEach((id) => window.clearTimeout(id))
      active.clear()
    }
  }, [])

  return useCallback((callback: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id)
      callback()
    }, ms)
    timers.current.add(id)
  }, [])
}
