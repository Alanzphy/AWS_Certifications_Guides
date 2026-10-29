import { describe, expect, it } from 'vitest'
import { readRoute, routeHref } from './navigation'

describe('certification routes', () => {
  it('opens a bookmarked section of the requested certification', () => {
    expect(readRoute('#/ai-103/guide')).toEqual({ certification: 'AI-103', view: 'guide' })
    expect(readRoute('#/sc-900')).toEqual({ certification: 'SC-900', view: 'dashboard' })
    expect(readRoute('#/CLF-C02/PLAN/')).toEqual({ certification: 'CLF-C02', view: 'plan' })
  })

  it('returns to the catalog for unknown or malformed links without changing the active certification', () => {
    expect(readRoute('#/unknown/guide', 'SC-900')).toEqual({ certification: 'SC-900', view: 'catalog' })
    expect(readRoute('#/ai-103/guide/extra', 'SC-900')).toEqual({ certification: 'SC-900', view: 'catalog' })
    expect(readRoute('#main', 'SC-900')).toEqual({ certification: 'SC-900', view: 'catalog' })
  })

  it('produces a shareable section link and a common catalog link', () => {
    expect(routeHref('AI-103', 'practice')).toBe('#/ai-103/practice')
    expect(routeHref('SC-900', 'catalog')).toBe('#/')
  })
})
