import { describe, expect, it } from 'vitest'
import { games, panels, problems } from './registry'

describe('registrul de jocuri și panouri', () => {
  it('toate modulele sunt descrise corect', () => {
    expect(problems).toEqual([])
  })

  it('există cel puțin un joc', () => {
    expect(games.length).toBeGreaterThan(0)
  })

  it('id-urile sunt unice', () => {
    const ids = [...games, ...panels].map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('există un panou pentru învățătoare', () => {
    expect(panels.some((panel) => panel.audience === 'invatatoare')).toBe(true)
  })
})
