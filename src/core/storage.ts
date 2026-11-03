import { useSyncExternalStore } from 'react'

/**
 * O valoare salvată în localStorage, la care se pot abona componentele React.
 * Datele rămân doar pe tabletă: nu trimitem nimic pe internet.
 */
export interface Store<T> {
  get: () => T
  set: (next: T | ((prev: T) => T)) => void
  use: () => T
}

export function createStore<T>(key: string, revive: (stored: unknown) => T): Store<T> {
  const listeners = new Set<() => void>()
  let value = revive(readJson(key))

  function get() {
    return value
  }

  function set(next: T | ((prev: T) => T)) {
    value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Stocare indisponibilă (mod privat): păstrăm valoarea doar în memorie.
    }
    listeners.forEach((listener) => listener())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function use() {
    return useSyncExternalStore(subscribe, get)
  }

  return { get, set, use }
}

function readJson(key: string): unknown {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
    return raw === null ? undefined : JSON.parse(raw)
  } catch {
    return undefined
  }
}
