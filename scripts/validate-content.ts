import { guide } from '../src/certifications/aif-c01/guide.ts'
import { aifPracticeModule, domains, examAllocation, examFacts, practiceScoreDisclaimer, requiredV11Topics } from '../src/certifications/aif-c01/module.ts'
import { resources, studyPlan } from '../src/certifications/aif-c01/plan.ts'
import { diagnosticQuestionIds, questions } from '../src/certifications/aif-c01/questions.ts'

const errors: string[] = []
const require = (condition: boolean, message: string) => { if (!condition) errors.push(message) }
const sameEntries = (actual: Record<string, number>, expected: Record<string, number>) =>
  JSON.stringify(Object.entries(actual).sort()) === JSON.stringify(Object.entries(expected).sort())

require(aifPracticeModule.code === 'AIF-C01', 'Certification metadata must identify AIF-C01.')
require(examFacts.version === '1.1', 'Exam metadata must identify guide version 1.1.')
require(examFacts.publicationDate === '2026-04-30', 'Exam guide v1.1 publication date must be 2026-04-30.')
require(examFacts.questions === 65 && examFacts.minutes === 90, 'Exam metadata must define 65 questions in 90 minutes.')
require(examFacts.scored === 50 && examFacts.unscored === 15 && examFacts.passingScore === 700, 'Exam scoring metadata is incomplete or incorrect.')
require(domains.reduce((sum, domain) => sum + domain.weight, 0) === 100, 'Domain weights must total 100%.')
require(sameEntries(Object.fromEntries(domains.map((domain) => [domain.id, domain.weight])), { D1: 20, D2: 24, D3: 28, D4: 14, D5: 14 }), 'Domain weights must match the official 20/24/28/14/14 blueprint.')
require(/practice percentages/i.test(practiceScoreDisclaimer) && /not AWS scaled scores/i.test(practiceScoreDisclaimer), 'Practice-score disclaimer must distinguish practice percentages from AWS scaled scores.')

const ids = new Set(questions.map((question) => question.id))
const normalizedPrompts = questions.map((question) => question.prompt.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' '))
require(questions.length >= 70, `Question bank has ${questions.length}; expected at least 70.`)
require(ids.size === questions.length, 'Question IDs must be unique.')
require(new Set(normalizedPrompts).size === normalizedPrompts.length, 'Question prompts must be unique after normalization.')
require(diagnosticQuestionIds.length === 20 && new Set(diagnosticQuestionIds).size === 20, 'Diagnostic must contain exactly 20 unique questions.')
for (const id of diagnosticQuestionIds) require(ids.has(id), `Diagnostic references missing question ${id}.`)

const domainIds = new Set(domains.map((domain) => domain.id))
for (const question of questions) {
  require(domainIds.has(question.domain), `${question.id} references unknown domain ${question.domain}.`)
  require(/^[1-5]\.\d+\.\d+$/.test(question.objective), `${question.id} objective must use the N.N.N format.`)
  require(question.explanation.length >= 45, `${question.id} needs a substantive explanation.`)
  require(new Set(question.options).size === question.options.length, `${question.id} repeats an option.`)
  require(question.correct.every((answer) => question.options.includes(answer)), `${question.id} has a correct answer outside its options.`)
  require(question.type !== 'single' || question.correct.length === 1, `${question.id} must have one correct answer.`)
  require(question.type !== 'multiple' || question.correct.length >= 2, `${question.id} must have multiple correct answers.`)
  require(!['ordering', 'matching'].includes(question.type) || question.correct.length >= 3, `${question.id} needs at least three ordered or matched responses.`)
  require(question.type !== 'matching' || question.matches?.length === question.correct.length, `${question.id} has mismatched prompt and answer counts.`)
}

require(Object.values(examAllocation).reduce((sum, count) => sum + count, 0) === examFacts.questions, 'Exam allocation must total 65 questions.')
for (const [domain, count] of Object.entries(examAllocation)) {
  require(domainIds.has(domain), `Exam allocation references unknown domain ${domain}.`)
  require(questions.filter((question) => question.domain === domain).length >= count, `Question bank cannot supply ${count} questions for ${domain}.`)
}
require(sameEntries(aifPracticeModule.exam.allocation, examAllocation), 'Practice module must expose the validated exam allocation.')
require(aifPracticeModule.questions === questions && aifPracticeModule.diagnosticQuestionIds === diagnosticQuestionIds, 'Practice module must expose the validated bank and diagnostic.')

const guideMarkers = guide.flatMap((section) => section.markers)
require(new Set(guideMarkers).size === guideMarkers.length, 'Guide v1.1 topic markers must be unique.')
for (const marker of requiredV11Topics) require(guideMarkers.includes(marker), `Guide is missing required v1.1 topic marker ${marker}.`)
for (const marker of guideMarkers) require((requiredV11Topics as readonly string[]).includes(marker), `Guide has unknown v1.1 topic marker ${marker}.`)
for (const domain of domains) require(guide.some((section) => section.domain === domain.id), `Guide is missing domain ${domain.id}.`)

const expectedDates = Array.from({ length: 16 }, (_, offset) => {
  const date = new Date('2026-09-12T12:00:00Z'); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10)
})
require(studyPlan.map((day) => day.date).join(',') === expectedDates.join(','), 'Study plan must cover every date from 2026-09-12 through 2026-09-27.')
const activityIds = new Set<string>()
let scheduledMinutes = 0
for (const day of studyPlan) {
  const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay()
  const expectedCapacity = weekday === 0 || weekday === 6 ? 120 : 60
  require(day.capacityMinutes === expectedCapacity, `${day.date} must use the ${expectedCapacity}-minute ${expectedCapacity === 120 ? 'weekend' : 'weekday'} budget.`)
  const plannedMinutes = day.activities.reduce((sum, activity) => sum + activity.durationMinutes, 0)
  const expectedDurationLabel = plannedMinutes === 120 ? '2h' : plannedMinutes === 60 ? '1h' : `${plannedMinutes} min`
  scheduledMinutes += plannedMinutes
  require(day.duration === expectedDurationLabel, `${day.date} duration label must represent ${plannedMinutes} planned minutes.`)
  require(plannedMinutes <= day.capacityMinutes, `${day.date} activities exceed the study budget.`)
  for (const activity of day.activities) {
    require(!activityIds.has(activity.id), `Activity ID ${activity.id} is duplicated.`)
    activityIds.add(activity.id)
    require(activity.durationMinutes > 0, `${activity.id} must have a positive duration.`)
    if (activity.type === 'full-exam') {
      require(activity.durationMinutes === examFacts.minutes, `${activity.id} must reserve the full ${examFacts.minutes}-minute exam duration.`)
      require(day.capacityMinutes === 120, `Full exam ${activity.id} cannot be scheduled on a one-hour weekday.`)
    }
  }
}
require(scheduledMinutes === 1230, `Study plan must contain exactly 1,230 planned minutes; found ${scheduledMinutes}.`)
const fullExamDates = studyPlan.filter((day) => day.activities.some((activity) => activity.type === 'full-exam')).map((day) => day.date)
require(fullExamDates.join(',') === '2026-09-19,2026-09-26', 'App 65-question simulations must occur exactly on 2026-09-19 and 2026-09-26.')
const expectedActivities: Record<string, string[]> = {
  '2026-09-12': ['official-20-question-baseline:45', 'official-baseline-error-review:75'],
  '2026-09-13': ['domain-3-selection-rag-customization:120'],
  '2026-09-14': ['domain-3-prompts-evaluation:60'],
  '2026-09-15': ['domain-2-genai-tokens-context:60'],
  '2026-09-16': ['domain-1-lifecycle-learning-metrics:60'],
  '2026-09-17': ['domain-4-responsible-ai:60'],
  '2026-09-18': ['domain-5-security-governance:60'],
  '2026-09-19': ['first-own-65-question-exam:90', 'first-own-exam-error-classification:30'],
  '2026-09-20': ['cloudcertprep-65-question-exam:90', 'cloudcertprep-initial-review:30'],
  '2026-09-21': ['cloudcertprep-error-review:35', 'targeted-official-documentation:25'],
  '2026-09-22': ['official-v11-scope-checklist:60'],
  '2026-09-23': ['dojo-20-question-timed-sampler:60'],
  '2026-09-24': ['cloudcertprep-weakest-domain-practice:60'],
  '2026-09-25': ['adaptive-cues-glossary-mistakes:60'],
  '2026-09-26': ['second-own-hard-65-question-exam:90', 'second-own-exam-review:30'],
  '2026-09-27': ['light-final-review:30'],
}
for (const day of studyPlan) {
  const actual = day.activities.map((activity) => `${activity.id}:${activity.durationMinutes}`)
  require(actual.join(',') === expectedActivities[day.date]?.join(','), `${day.date} activities do not match the approved schedule.`)
}

const requiredResources = {
  'exam-guide': ['https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html', '2026-09-22'],
  revisions: ['https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html', '2026-09-22'],
  scope: ['https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html', '2026-09-22'],
  skillbuilder: ['https://skillbuilder.aws/learn/4URFGY63KV/official-practice-question-set-aws-certified-ai-practitioner--aifc01--english/FVG43Y1PAX', '2026-09-12'],
  cloudcertprep: ['https://www.cloudcertprep.io/aws/aif-c01', '2026-09-20'],
  dojo: ['https://portal.tutorialsdojo.com/courses/free-aws-certified-ai-practitioner-practice-exams-aif-c01-sampler/', '2026-09-23'],
  's3-vectors': ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html', '2026-09-21'],
  guardrails: ['https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html', '2026-09-21'],
  agentcore: ['https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html', '2026-09-21'],
} as const
require(resources.length === Object.keys(requiredResources).length, 'External resource catalog must contain exactly the required resources.')
const resourceIds = new Set(resources.map((resource) => resource.id))
for (const [id, [url, assignedDate]] of Object.entries(requiredResources)) {
  const resource = resources.find((item) => item.id === id)
  require(Boolean(resource), `Required resource ${id} is missing.`)
  require(resource?.url === url && resource.assignedDate === assignedDate, `${id} URL or assigned date changed unexpectedly.`)
  require(studyPlan.some((day) => day.date === assignedDate && day.resourceIds.includes(id)), `${id} is not assigned on ${assignedDate}.`)
}
for (const day of studyPlan) for (const id of day.resourceIds) require(resourceIds.has(id), `${day.date} references missing resource ${id}.`)
for (const resource of resources) {
  require(/^https:\/\//.test(resource.url), `${resource.id} must use an HTTPS URL.`)
  require(Boolean(resource.duration && resource.outcome), `${resource.id} needs duration and expected outcome metadata.`)
}

const countBy = (key: 'type' | 'domain') => Object.fromEntries([...new Set(questions.map((question) => question[key]))].sort().map((value) => [value, questions.filter((question) => question[key] === value).length]))
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'))
  process.exit(1)
}
console.log(`Validated ${questions.length} original questions.`)
console.log(`By type: ${JSON.stringify(countBy('type'))}`)
console.log(`By domain: ${JSON.stringify(countBy('domain'))}`)
console.log(`Validated exam metadata, ${requiredV11Topics.length} v1.1 markers, ${studyPlan.length} budgeted study days, ${scheduledMinutes} planned minutes, and ${resources.length} linked resources.`)
