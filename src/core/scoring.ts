import type { Attempt, AttemptAnswer, Domain, DomainId, Question } from './types'

export const sameAnswer = (selected: string[], correct: string[]) =>
  selected.length === correct.length && [...selected].sort().every((value, index) => value === [...correct].sort()[index])

export const sameSequence = (selected: string[], correct: string[]) =>
  selected.length === correct.length && selected.every((value, index) => value === correct[index])

export const isQuestionCorrect = (question: Question, selected: string[]) =>
  question.type === 'ordering' || question.type === 'matching'
    ? sameSequence(selected, question.correct)
    : sameAnswer(selected, question.correct)

export const moveSequenceItem = (items: string[], index: number, offset: -1 | 1) => {
  const target = index + offset
  if (target < 0 || target >= items.length) return items
  const moved = [...items]
  ;[moved[index], moved[target]] = [moved[target], moved[index]]
  return moved
}

export const navigateQuestion = (current: number, target: number, total: number) =>
  Math.min(Math.max(target, 0), Math.max(total - 1, 0))

export const tickTimer = (remainingSeconds: number) => Math.max(0, remainingSeconds - 1)

export function practicePercent(answers: Record<string, AttemptAnswer>, total: number) {
  if (!total) return 0
  return Math.round((Object.values(answers).filter((answer) => answer.correct).length / total) * 100)
}

export function domainResults(domains: Domain[], questions: Question[], answers: Record<string, AttemptAnswer>) {
  const initial = Object.fromEntries(domains.map((domain) => [domain.id, { correct: 0, total: 0, percent: 0 }]))
  return questions.reduce<Record<DomainId, { correct: number; total: number; percent: number }>>(
    (results, question) => {
      results[question.domain].total += 1
      if (answers[question.id]?.correct) results[question.domain].correct += 1
      results[question.domain].percent = Math.round((results[question.domain].correct / results[question.domain].total) * 100)
      return results
    },
    initial,
  )
}

export function selectQuestions(bank: Question[], count: number, seed = Date.now()) {
  const shuffled = [...bank]
  let state = seed >>> 0
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const target = state % (index + 1)
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function selectExamQuestions(bank: Question[], allocation: Record<DomainId, number>, seed = Date.now()) {
  const selected = Object.entries(allocation).flatMap(([domain, count], index) =>
    selectQuestions(bank.filter((question) => question.domain === domain), count, seed + index),
  )
  return selectQuestions(selected, selected.length, seed + 10)
}

export function selectRetryQuestions(bank: Question[], attempt?: Attempt) {
  if (!attempt) return []
  const byId = new Map(bank.map((question) => [question.id, question]))
  return attempt.questionIds
    .filter((id) => !attempt.answers[id]?.correct || attempt.answers[id]?.confused)
    .map((id) => byId.get(id))
    .filter((question): question is Question => Boolean(question))
}
