export const views = ['catalog', 'dashboard', 'guide', 'plan', 'practice', 'progress'] as const
export type View = typeof views[number]

export const certificationCodes = ['AIF-C01', 'CLF-C02', 'AI-103', 'SC-900'] as const
export type Certification = typeof certificationCodes[number]

export type Route = { certification: Certification; view: View }

export function routeHref(certification: Certification, view: View): string {
  return view === 'catalog' ? '#/' : `#/${certification.toLowerCase()}/${view}`
}

export function readRoute(hash: string, fallback: Certification = 'CLF-C02'): Route {
  const catalog: Route = { certification: fallback, view: 'catalog' }
  if (!hash.startsWith('#/')) return catalog
  const segments = hash.slice(2).replace(/\/+$/, '').split('/')
  if (!segments[0]) return catalog
  if (segments.length > 2) return catalog

  const certification = certificationCodes.find((code) => code.toLowerCase() === segments[0].toLowerCase())
  const view = (segments[1] || 'dashboard').toLowerCase()
  if (!certification || view === 'catalog' || !views.some((candidate) => candidate === view)) return catalog
  return { certification, view: view as View }
}
