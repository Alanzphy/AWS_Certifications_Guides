import { describe, expect, it } from 'vitest'
import { loadProgress, saveProgress } from './progress'

describe('progress persistence', () => {
  it('recovers from corrupt and incompatible local data', () => {
    expect(loadProgress({ getItem: () => '{broken' }).attempts).toEqual([])
    expect(loadProgress({ getItem: () => JSON.stringify({ version: 2 }) }).version).toBe(1)
  })

  it('reports quota failures without crashing', () => {
    expect(saveProgress({ version: 1, attempts: [], completedPlanItems: [], resourceNotes: {} }, { setItem: () => { throw new Error('quota') } })).toBe(false)
  })
})
