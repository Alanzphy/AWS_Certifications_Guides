import type { Progress } from './types'

const LEGACY_AIF_KEY = 'aws-study-platform:v1'
const keyFor = (certificationCode: string) => certificationCode === 'AIF-C01' ? LEGACY_AIF_KEY : `aws-study-platform:${certificationCode.toLowerCase()}:v1`
export const emptyProgress = (): Progress => ({ version: 1, completedPlanItems: [], resourceNotes: {}, attempts: [] })

export function loadProgress(certificationCodeOrStorage: string | Pick<Storage, 'getItem'> = 'AIF-C01', suppliedStorage?: Pick<Storage, 'getItem'>): Progress {
  const certificationCode = typeof certificationCodeOrStorage === 'string' ? certificationCodeOrStorage : 'AIF-C01'
  const storage = (typeof certificationCodeOrStorage === 'string' ? suppliedStorage : certificationCodeOrStorage) ?? (typeof localStorage === 'undefined' ? undefined : localStorage)
  try {
    if (!storage) return emptyProgress()
    const raw = storage.getItem(keyFor(certificationCode))
    if (!raw) return emptyProgress()
    const value = JSON.parse(raw) as Partial<Progress>
    if (value.version !== 1 || !Array.isArray(value.attempts) || !Array.isArray(value.completedPlanItems)) return emptyProgress()
    return { ...emptyProgress(), ...value, resourceNotes: value.resourceNotes ?? {} }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress, certificationCodeOrStorage: string | Pick<Storage, 'setItem'> = 'AIF-C01', suppliedStorage?: Pick<Storage, 'setItem'>) {
  const certificationCode = typeof certificationCodeOrStorage === 'string' ? certificationCodeOrStorage : 'AIF-C01'
  const storage = (typeof certificationCodeOrStorage === 'string' ? suppliedStorage : certificationCodeOrStorage) ?? (typeof localStorage === 'undefined' ? undefined : localStorage)
  try {
    if (!storage) return false
    storage.setItem(keyFor(certificationCode), JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}
