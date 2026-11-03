import { describe, expect, it } from 'vitest'
import { shuffle } from './random'

describe('shuffle', () => {
  it('păstrează aceleași elemente și nu modifică lista originală', () => {
    const original = [1, 2, 3, 4, 5]
    const result = shuffle(original)
    expect([...result].sort()).toEqual(original)
    expect(original).toEqual([1, 2, 3, 4, 5])
  })
})
