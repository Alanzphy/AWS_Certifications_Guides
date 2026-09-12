import type { Progress } from './types'

const KEY = 'aws-study-platform:v1'
export const emptyProgress = (): Progress => ({ version: 1, completedPlanItems: [], resourceNotes: {}, attempts: [] })

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): Progress {
  try {
    const raw = storage.getItem(KEY)
    if (!raw) return emptyProgress()
    const value = JSON.parse(raw) as Partial<Progress>
    if (value.version !== 1 || !Array.isArray(value.attempts) || !Array.isArray(value.completedPlanItems)) return emptyProgress()
    return { ...emptyProgress(), ...value, resourceNotes: value.resourceNotes ?? {} }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress, storage: Pick<Storage, 'setItem'> = localStorage) {
  try {
    storage.setItem(KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}
