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

  it('keeps AIF legacy progress and CLF progress in separate storage keys', () => {
    const values = new Map<string, string>([['aws-study-platform:v1', JSON.stringify({ version: 1, attempts: [{ id: 'legacy' }], completedPlanItems: ['2026-09-12'] })]])
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
    const clf = { version: 1 as const, attempts: [], completedPlanItems: ['foundations'], resourceNotes: {} }
    expect(loadProgress('AIF-C01', storage).attempts[0]?.id).toBe('legacy')
    saveProgress(clf, 'CLF-C02', storage)
    expect(loadProgress('CLF-C02', storage).completedPlanItems).toEqual(['foundations'])
    expect(loadProgress('AIF-C01', storage).attempts[0]?.id).toBe('legacy')
    expect(values.has('aws-study-platform:clf-c02:v1')).toBe(true)
  })

  it('isolates Microsoft progress from each other and from Cloud Practitioner', () => {
    const values = new Map<string, string>()
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
    for (const code of ['CLF-C02', 'AI-103', 'SC-900']) {
      saveProgress({ version: 1, attempts: [], completedPlanItems: [code], resourceNotes: {} }, code, storage)
    }
    saveProgress({ version: 1, attempts: [], completedPlanItems: [], resourceNotes: {} }, 'AI-103', storage)
    expect(loadProgress('AI-103', storage).completedPlanItems).toEqual([])
    expect(loadProgress('SC-900', storage).completedPlanItems).toEqual(['SC-900'])
    expect(loadProgress('CLF-C02', storage).completedPlanItems).toEqual(['CLF-C02'])
  })
})
