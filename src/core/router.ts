import { useSyncExternalStore } from 'react'

/*
 * Navigare simplă prin „#” din adresă (merge și pe GitHub Pages, și offline):
 *   #/                 ecranul de start
 *   #/joc/perechi      un joc
 *   #/panou/album      un panou
 *   #/invatatoare      zona învățătoarei (cere PIN)
 */
export type Route =
  | { name: 'home' }
  | { name: 'game'; id: string }
  | { name: 'panel'; id: string }
  | { name: 'teacher' }

function parse(hash: string): Route {
  const [, section, id] = hash.replace(/^#/, '').split('/')
  if (section === 'joc' && id) return { name: 'game', id: decodeURIComponent(id) }
  if (section === 'panou' && id) return { name: 'panel', id: decodeURIComponent(id) }
  if (section === 'invatatoare') return { name: 'teacher' }
  return { name: 'home' }
}

function toHash(route: Route) {
  switch (route.name) {
    case 'game':
      return `#/joc/${encodeURIComponent(route.id)}`
    case 'panel':
      return `#/panou/${encodeURIComponent(route.id)}`
    case 'teacher':
      return '#/invatatoare'
    default:
      return '#/'
  }
}

let cached = { hash: window.location.hash, route: parse(window.location.hash) }

function getRoute() {
  const hash = window.location.hash
  if (hash !== cached.hash) cached = { hash, route: parse(hash) }
  return cached.route
}

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

export function useRoute() {
  return useSyncExternalStore(subscribe, getRoute)
}

export function navigate(route: Route) {
  window.location.hash = toHash(route)
}

export function goHome() {
  navigate({ name: 'home' })
}
