import { describe, expect, it } from 'vitest'
import { domainResults, isQuestionCorrect, moveSequenceItem, navigateQuestion, practicePercent, sameAnswer, sameSequence, selectExamQuestions, selectQuestions, selectRetryQuestions, tickTimer } from './scoring'
import type { Attempt, Domain, Question } from './types'

const questions = [
  { id: 'a', domain: 'FOUNDATIONS', type: 'single', objective: '1.1.1', prompt: 'p', options: ['x'], correct: ['x'], explanation: 'e' },
  { id: 'b', domain: 'SECURITY', type: 'single', objective: '2.1.1', prompt: 'p', options: ['x'], correct: ['x'], explanation: 'e' },
] as Question[]
const domains = [
  { id: 'FOUNDATIONS', title: 'One', weight: 50, objectives: [] },
  { id: 'SECURITY', title: 'Two', weight: 50, objectives: [] },
] as Domain[]

describe('practice scoring', () => {
  it('compares set-like answers and calculates a practice percentage', () => {
    expect(sameAnswer(['b', 'a'], ['a', 'b'])).toBe(true)
    expect(sameSequence(['b', 'a'], ['a', 'b'])).toBe(false)
    expect(sameSequence(['a', 'b'], ['a', 'b'])).toBe(true)
    expect(practicePercent({ a: { selected: ['x'], correct: true }, b: { selected: [], correct: false } }, 2)).toBe(50)
  })

  it('summarizes domains and selects deterministically', () => {
    const answers = { a: { selected: ['x'], correct: true }, b: { selected: [], correct: false } }
    expect(domainResults(domains, questions, answers).FOUNDATIONS.percent).toBe(100)
    expect(domainResults(domains, questions, answers).SECURITY.percent).toBe(0)
    expect(selectQuestions(questions, 1, 4)).toEqual(selectQuestions(questions, 1, 4))
  })

  it('selects a 65-question exam with blueprint-aligned domain counts', () => {
    const bank = ['CORE', 'PLATFORM', 'OPERATIONS', 'COST', 'SECURITY'].flatMap((domain) =>
      Array.from({ length: 20 }, (_, index) => ({ ...questions[0], id: `${domain}-${index}`, domain })),
    )
    const allocation = { CORE: 13, PLATFORM: 16, OPERATIONS: 18, COST: 9, SECURITY: 9 }
    const exam = selectExamQuestions(bank, allocation, 12)
    expect(exam).toHaveLength(65)
    expect(exam.filter((question) => question.domain === 'CORE')).toHaveLength(13)
    expect(exam.filter((question) => question.domain === 'OPERATIONS')).toHaveLength(18)
  })

  it('uses the explicitly supplied attempt for retry without falling back to older history', () => {
    const firstAttempt = {
      id: 'first', mode: 'diagnostic', startedAt: '2026-09-12', completedAt: '2026-09-12', questionIds: ['a', 'b'],
      answers: { a: { selected: [], correct: false }, b: { selected: ['x'], correct: true } }, practicePercent: 50,
    } satisfies Attempt
    const laterRetry = {
      ...firstAttempt, id: 'later', mode: 'retry', questionIds: ['a'], answers: { a: { selected: ['x'], correct: true } }, practicePercent: 100,
    } satisfies Attempt
    expect(selectRetryQuestions(questions, firstAttempt).map((question) => question.id)).toEqual(['a'])
    expect(selectRetryQuestions(questions, laterRetry)).toEqual([])
  })

  it('covers timer, bounded navigation, ordering movement, and format-aware scoring', () => {
    expect(tickTimer(1)).toBe(0)
    expect(tickTimer(0)).toBe(0)
    expect(navigateQuestion(1, -4, 3)).toBe(0)
    expect(navigateQuestion(1, 8, 3)).toBe(2)
    expect(moveSequenceItem(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c'])
    expect(moveSequenceItem(['a', 'b'], 0, -1)).toEqual(['a', 'b'])

    const ordered = { ...questions[0], type: 'ordering', options: ['a', 'b'], correct: ['a', 'b'] } satisfies Question
    const matched = { ...questions[0], type: 'matching', options: ['one', 'two'], correct: ['one', 'two'], matches: ['1', '2'] } satisfies Question
    expect(isQuestionCorrect(ordered, ['b', 'a'])).toBe(false)
    expect(isQuestionCorrect(ordered, ['a', 'b'])).toBe(true)
    expect(isQuestionCorrect(matched, ['two', 'one'])).toBe(false)
  })
})
