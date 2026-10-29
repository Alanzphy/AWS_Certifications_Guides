import { guide } from '../src/certifications/aif-c01/guide.ts'
import { aifPracticeModule, domains, examAllocation, examFacts, glossary, practiceScoreDisclaimer, requiredV11Topics, serviceMap } from '../src/certifications/aif-c01/module.ts'
import { resources, studyPlan } from '../src/certifications/aif-c01/plan.ts'
import { diagnosticQuestionIds, questions } from '../src/certifications/aif-c01/questions.ts'
import { clfPracticeModule, domains as clfDomains, examAllocation as clfAllocation, examFacts as clfFacts, glossary as clfGlossary, serviceMap as clfServiceMap, examGuideUrl, inScopeServicesUrl, certificationUrl } from '../src/certifications/clf-c02/module.ts'
import { guide as clfGuide } from '../src/certifications/clf-c02/guide.ts'
import { resources as clfResources, studyPlan as clfPlan } from '../src/certifications/clf-c02/plan.ts'
import { diagnosticQuestionIds as clfDiagnosticIds, questions as clfQuestions } from '../src/certifications/clf-c02/questions.ts'
import { aiPracticeModule, examFacts as aiFacts, glossary as aiGlossary, serviceMap as aiServiceMap } from '../src/certifications/ai-103/module.ts'
import { guide as aiGuide } from '../src/certifications/ai-103/guide.ts'
import { resources as aiResources, studyPlan as aiPlan } from '../src/certifications/ai-103/plan.ts'
import { scPracticeModule, examFacts as scFacts, glossary as scGlossary, serviceMap as scServiceMap } from '../src/certifications/sc-900/module.ts'
import { guide as scGuide } from '../src/certifications/sc-900/guide.ts'
import { resources as scResources, studyPlan as scPlan } from '../src/certifications/sc-900/plan.ts'

const errors: string[] = []
const require = (condition: boolean, message: string) => { if (!condition) errors.push(message) }
const sameEntries = (actual: Record<string, number>, expected: Record<string, number>) =>
  JSON.stringify(Object.entries(actual).sort()) === JSON.stringify(Object.entries(expected).sort())

// The public v1.1 guide publishes task statements and objective descriptions,
// but does not number every objective. The bank's final segment is therefore
// a local reference, not an AWS-issued objective number.
const officialTaskStatements: Record<string, string> = {
  D1: 'Explain basic AI concepts and terminologies|Identify practical use cases for AI|Describe the AI/ML development lifecycle',
  D2: 'Explain the basic concepts of generative AI|Understand the capabilities and limitations of GenAI for solving business problems|Describe AWS infrastructure and technologies for building GenAI applications',
  D3: 'Describe design considerations for applications that use foundation models|Choose effective prompt engineering techniques|Describe the training and fine-tuning process for FMs|Describe methods to evaluate FM performance',
  D4: 'Explain the development of AI systems that are responsible|Recognize the importance of transparent and explainable models',
  D5: 'Explain methods to secure AI systems|Recognize governance and compliance regulations for AI systems',
}
const objectiveTaskById = Object.fromEntries(domains.flatMap((domain) =>
  officialTaskStatements[domain.id].split('|').map((statement, index) => [`${domain.id}.${index + 1}`, statement]),
))

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
  const objectiveMatch = /^([1-5])\.(\d+)\.(\d+)$/.exec(question.objective)
  require(Boolean(objectiveMatch), `${question.id} objective must use the bank reference N.N.N format.`)
  if (objectiveMatch) {
    const [domainNumber, taskNumber] = objectiveMatch.slice(1, 3)
    const taskId = `D${domainNumber}.${taskNumber}`
    require(question.domain === `D${domainNumber}`, `${question.id} objective ${question.objective} belongs to ${taskId}, not ${question.domain}.`)
    require(Boolean(objectiveTaskById[taskId]), `${question.id} objective ${question.objective} references no official v1.1 task statement.`)
  }
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
for (const section of guide) {
  require(section.decisions.length >= 1, `${section.domain} guide must include a decision table.`)
  require(section.decisions.length <= 8, `${section.domain} decision table must stay within 8 rows; found ${section.decisions.length}.`)
  for (const row of section.decisions) {
    require(Boolean(row.if.trim()) && Boolean(row.use.trim()) && Boolean(row.notThis.trim()), `${section.domain} has a decision row with an empty column.`)
  }
  for (const concept of section.concepts) {
    require(Boolean(concept.body.trim()), `${section.domain} concept "${concept.title}" needs a body.`)
    require(Boolean(concept.example?.trim()), `${section.domain} concept "${concept.title}" needs an example.`)
  }
}

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

// CLF-C02 remains an independent module: validate its published blueprint and
// original bank without weakening the AIF-C01 invariants above.
require(clfPracticeModule.code === 'CLF-C02', 'Certification metadata must identify CLF-C02.')
require(clfFacts.questions === 65 && clfFacts.scored === 50 && clfFacts.unscored === 15 && clfFacts.minutes === 90, 'CLF-C02 exam facts must match the official guide.')
require(clfFacts.scoreMinimum === 100 && clfFacts.scoreMaximum === 1000 && clfFacts.passingScore === 700, 'CLF-C02 scaled score facts are incomplete or incorrect.')
require(JSON.stringify(clfFacts.formats) === JSON.stringify(['single', 'multiple']), 'CLF-C02 must use only multiple-choice and multiple-response formats.')
require(clfDomains.length === 4 && sameEntries(Object.fromEntries(clfDomains.map((domain) => [domain.id, domain.weight])), { D1: 24, D2: 30, D3: 34, D4: 12 }), 'CLF-C02 domains and weights must match the official 24/30/34/12 blueprint.')
require(clfDomains.reduce((sum, domain) => sum + domain.weight, 0) === 100, 'CLF-C02 domain weights must total 100%.')
require(sameEntries(clfAllocation, { D1: 16, D2: 19, D3: 22, D4: 8 }), 'CLF-C02 practice allocation must use the declared approximate 16/19/22/8 sample.')
require(Object.values(clfAllocation).reduce((sum, count) => sum + count, 0) === 65, 'CLF-C02 practice allocation must total 65.')
require(clfPracticeModule.exam.questionCount === 65 && clfPracticeModule.exam.minutes === 90, 'CLF-C02 practice module must expose the 65-question/90-minute simulation.')
require(clfPracticeModule.questions === clfQuestions && clfPracticeModule.diagnosticQuestionIds === clfDiagnosticIds, 'CLF-C02 practice module must expose its validated bank and diagnostic.')
require(/not AWS scaled scores/i.test(clfPracticeModule.practiceScoreDisclaimer), 'CLF-C02 disclaimer must distinguish app percentages from AWS scaled scores.')
const clfIds = new Set(clfQuestions.map((question) => question.id))
const clfPrompts = clfQuestions.map((question) => question.prompt.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' '))
require(clfQuestions.length >= 70, `CLF-C02 bank has ${clfQuestions.length}; expected at least 70.`)
require(clfIds.size === clfQuestions.length, 'CLF-C02 question IDs must be unique.')
require(new Set(clfPrompts).size === clfPrompts.length, 'CLF-C02 question prompts must be unique after normalization.')
require(clfDiagnosticIds.length === 20 && new Set(clfDiagnosticIds).size === 20, 'CLF-C02 diagnostic must contain exactly 20 unique questions.')
for (const id of clfDiagnosticIds) require(clfIds.has(id), `CLF-C02 diagnostic references missing question ${id}.`)
const clfDomainIds = new Set(clfDomains.map((domain) => domain.id))
const clfTaskCounts = { D1: 4, D2: 4, D3: 8, D4: 3 }
for (const domain of clfDomains) require(domain.objectives.length === clfTaskCounts[domain.id as keyof typeof clfTaskCounts], `${domain.id} must list every official CLF-C02 task statement.`)
for (const question of clfQuestions) {
  require(clfDomainIds.has(question.domain), `${question.id} references unknown CLF-C02 domain ${question.domain}.`)
  const match = /^(\d+)\.(\d+)$/.exec(question.objective)
  require(Boolean(match), `${question.id} objective must use the CLF task-reference N.N format.`)
  if (match) {
    const domainNumber = Number(match[1])
    const taskNumber = Number(match[2])
    require(question.domain === `D${domainNumber}`, `${question.id} objective belongs to D${domainNumber}, not ${question.domain}.`)
    require(taskNumber >= 1 && taskNumber <= clfTaskCounts[question.domain as keyof typeof clfTaskCounts], `${question.id} maps to no official CLF-C02 task statement.`)
    require(Boolean(clfDomains.find((domain) => domain.id === question.domain)?.objectives[taskNumber - 1]), `${question.id} has no mapped domain task statement.`)
  }
  require(['single', 'multiple'].includes(question.type), `${question.id} uses a question type not allowed for CLF-C02.`)
  require(question.prompt.trim().length >= 20, `${question.id} prompt needs a substantive scenario or decision.`)
  require(question.explanation.length >= 45, `${question.id} needs a substantive explanation.`)
  require(question.options.length >= (question.type === 'multiple' ? 5 : 4) && new Set(question.options).size === question.options.length, `${question.id} has too few or duplicate response options.`)
  require(question.correct.every((answer) => question.options.includes(answer)), `${question.id} has a correct answer outside its options.`)
  require(question.type !== 'single' || question.correct.length === 1, `${question.id} must have one correct answer.`)
  require(question.type !== 'multiple' || question.correct.length >= 2, `${question.id} must have multiple correct answers.`)
}
for (const [domain, count] of Object.entries(clfAllocation)) require(clfQuestions.filter((question) => question.domain === domain).length >= count, `CLF-C02 bank cannot supply ${count} allocated questions for ${domain}.`)
// The bank is curated practice content, not an official domain item count.
// Allow a ±3 percentage-point deviation so reasonable bank-size changes do
// not require exact counts while material sampling skew is still caught.
const clfDistributionTolerance = 3
for (const domain of clfDomains) {
  const share = clfQuestions.filter((question) => question.domain === domain.id).length / clfQuestions.length * 100
  require(Math.abs(share - domain.weight) <= clfDistributionTolerance,
    `CLF-C02 ${domain.id} bank share ${share.toFixed(1)}% is more than ${clfDistributionTolerance} percentage points from its ${domain.weight}% official weight.`)
}
require(clfGuide.length === 4 && clfDomains.every((domain) => clfGuide.some((section) => section.domain === domain.id)), 'CLF-C02 guide must cover all four official domains.')
for (const section of clfGuide) {
  require(section.decisions.length > 0 && section.concepts.length > 0, `${section.domain} CLF-C02 guide needs decisions and concepts.`)
  for (const row of section.decisions) require(Boolean(row.if.trim() && row.use.trim() && row.notThis.trim()), `${section.domain} has an incomplete decision row.`)
  for (const concept of section.concepts) require(Boolean(concept.title.trim() && concept.body.trim() && concept.example?.trim()), `${section.domain} concept "${concept.title}" needs a description and example.`)
}
require(clfServiceMap.length >= 25, 'CLF-C02 service map needs at least 25 curated service distinctions.')
for (const row of clfServiceMap) require(row.length === 3 && row.every((cell) => cell.trim()), 'CLF-C02 service map rows need three non-empty cells.')
require(new Set(clfServiceMap.map((row) => row[1])).size === clfServiceMap.length, 'CLF-C02 service map services must be unique.')
require(clfGlossary.length >= 20 && new Set(clfGlossary.map(([term]) => term)).size === clfGlossary.length, 'CLF-C02 glossary needs at least 20 unique terms.')
for (const [term, definition] of clfGlossary) require(Boolean(term.trim() && definition.trim()), `CLF-C02 glossary entry "${term}" is incomplete.`)
const expectedClfResources = [examGuideUrl, inScopeServicesUrl, certificationUrl]
require(expectedClfResources.every((url) => clfResources.some((resource) => resource.url === url)), 'CLF-C02 official guide, service scope, and certification resources are required.')
for (const resource of clfResources) require(/^https:\/\//.test(resource.url) && Boolean(resource.title && resource.outcome), `CLF-C02 resource ${resource.id} is incomplete.`)
require(clfPlan.length >= 6, 'CLF-C02 date-free route needs at least six usable milestones.')
const clfMilestoneIds = new Set<string>()
for (const milestone of clfPlan) {
  require(!('date' in milestone), `CLF-C02 milestone ${milestone.id} must not invent a date.`)
  require(!clfMilestoneIds.has(milestone.id), `CLF-C02 milestone ID ${milestone.id} is duplicated.`)
  clfMilestoneIds.add(milestone.id)
  require(Boolean(milestone.title && milestone.focus && milestone.outcome && milestone.activities.length), `CLF-C02 milestone ${milestone.id} is incomplete.`)
  for (const id of milestone.resourceIds) require(clfResources.some((resource) => resource.id === id), `CLF-C02 milestone ${milestone.id} references missing resource ${id}.`)
  for (const activity of milestone.activities) require(activity.durationMinutes > 0, `CLF-C02 activity ${activity.id} needs a positive suggested duration.`)
}

// Microsoft publishes domain ranges; the simulator uses an illustrative allocation,
// not a claimed official item count or a prediction of the scaled score.
const microsoftModules = [
  { module: aiPracticeModule, facts: aiFacts, guide: aiGuide, plan: aiPlan, resources: aiResources, glossary: aiGlossary, serviceMap: aiServiceMap, ranges: [[25, 30], [30, 35], [10, 15], [10, 15], [10, 15]], minutes: 120, simulation: 50, minimumBank: 70 },
  { module: scPracticeModule, facts: scFacts, guide: scGuide, plan: scPlan, resources: scResources, glossary: scGlossary, serviceMap: scServiceMap, ranges: [[10, 15], [25, 30], [35, 40], [20, 25]], minutes: 45, simulation: 40, minimumBank: 55 },
]
for (const entry of microsoftModules) {
  const { module, facts, guide: sections, plan, resources: links } = entry
  const code = module.code
  const ids = new Set(module.questions.map((question) => question.id))
  const prompts = module.questions.map((question) => question.prompt.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' '))
  const domainIds = new Set(module.domains.map((domain) => domain.id))
  require(facts.minutes === entry.minutes && facts.passingScore === 700, `${code} official time or passing score is incorrect.`)
  require(module.exam.minutes === entry.minutes && module.exam.questionCount === entry.simulation, `${code} simulation configuration is incorrect.`)
  require(module.questions.length >= entry.minimumBank, `${code} needs at least ${entry.minimumBank} original questions.`)
  require(ids.size === module.questions.length && new Set(prompts).size === prompts.length, `${code} has duplicate question IDs or prompts.`)
  require(module.diagnosticQuestionIds.length === 20 && new Set(module.diagnosticQuestionIds).size === 20 && module.diagnosticQuestionIds.every((id) => ids.has(id)), `${code} diagnostic must reference 20 unique existing questions.`)
  require(module.domains.length === entry.ranges.length && domainIds.size === entry.ranges.length, `${code} must contain all official domains exactly once.`)
  require(module.domains.reduce((sum, domain) => sum + domain.weight, 0) === 100, `${code} practice weights must total 100%.`)
  require(Object.values(module.exam.allocation).reduce((sum, count) => sum + count, 0) === module.exam.questionCount && Object.keys(module.exam.allocation).every((id) => domainIds.has(id)), `${code} simulation allocation must cover only its domains and total the simulation size.`)
  for (const [index, domain] of module.domains.entries()) {
    const [minimum, maximum] = entry.ranges[index] ?? []
    const allocation = module.exam.allocation[domain.id] ?? 0
    const share = allocation / module.exam.questionCount * 100
    require(domain.weightLabel === `${minimum}–${maximum}%`, `${code} ${domain.id} must show the published range.`)
    require(share >= minimum && share <= maximum, `${code} ${domain.id} practice allocation is outside the published range.`)
    require(domain.objectives.length > 0 && module.questions.filter((question) => question.domain === domain.id).length >= allocation, `${code} ${domain.id} needs objectives and sufficient questions for its allocation.`)
    if (code === 'AI-103') for (const objective of domain.objectives) {
      const reference = objective.split(' ')[0]
      require(module.questions.some((question) => question.domain === domain.id && question.objective === reference), `${code} ${domain.id} has no practice for local objective ${reference}.`)
    }
    require(module.diagnosticQuestionIds.some((id) => module.questions.some((question) => question.id === id && question.domain === domain.id)), `${code} diagnostic must cover ${domain.id}.`)
  }
  for (const question of module.questions) {
    require(domainIds.has(question.domain) && Boolean(question.objective.trim()), `${code} ${question.id} needs a valid domain and objective.`)
    if (code === 'AI-103') require(Boolean(module.domains.find((domain) => domain.id === question.domain)?.objectives.some((objective) => objective.startsWith(`${question.objective} `))), `${code} ${question.id} references an unknown local objective.`)
    require(question.prompt.trim().length >= 20 && question.explanation.trim().length >= 40, `${code} ${question.id} needs a substantive prompt and explanation.`)
    require(['single', 'multiple'].includes(question.type) && question.options.length >= 4 && new Set(question.options).size === question.options.length, `${code} ${question.id} needs a supported choice format and distinct options.`)
    require((question.type === 'single' ? question.correct.length === 1 : question.correct.length >= 2) && question.correct.every((answer) => question.options.includes(answer)), `${code} ${question.id} must identify valid correct choices.`)
  }
  require(sections.length === module.domains.length && module.domains.every((domain) => sections.some((section) => section.domain === domain.id)), `${code} guide must cover every domain.`)
  for (const section of sections) require(Boolean(section.summary && section.decisions.length && section.concepts.length), `${code} ${section.domain} guide needs a summary, decisions, and concepts.`)
  require(entry.serviceMap.length >= 10 && entry.serviceMap.every((row) => row.length === 3 && row.every((cell) => cell.trim())), `${code} needs a useful three-column service map.`)
  require(entry.glossary.length >= 10 && entry.glossary.every(([term, definition]) => term.trim() && definition.trim()), `${code} needs a useful glossary.`)
  require(links.length >= 3 && links.every((resource) => resource.kind === 'Official Microsoft' && /^https:\/\//.test(resource.url) && resource.title && resource.outcome), `${code} needs official Microsoft resources.`)
  require(plan.length >= 6 && new Set(plan.map((milestone) => milestone.id)).size === plan.length, `${code} needs at least six uniquely identified milestones.`)
  for (const milestone of plan) {
    require(!('date' in milestone) && Boolean(milestone.title && milestone.focus && milestone.outcome && milestone.activities.length), `${code} milestone ${milestone.id} must be complete and undated.`)
    require(milestone.resourceIds.every((id) => links.some((resource) => resource.id === id)), `${code} milestone ${milestone.id} references a missing resource.`)
    require(milestone.activities.every((activity) => activity.durationMinutes > 0), `${code} milestone ${milestone.id} has an invalid activity duration.`)
  }
  require(plan.some((milestone) => milestone.activities.some((activity) => activity.type === 'full-exam')), `${code} plan needs a timed practice simulation.`)
}

require(glossary.length >= 50, `Glossary has ${glossary.length} entries; expected at least 50.`)
require(new Set(glossary.map(([term]) => term)).size === glossary.length, 'Glossary terms must be unique.')
for (const [term, definition] of glossary) {
  require(Boolean(term.trim()) && Boolean(definition.trim()), `Glossary entry "${term}" needs a non-empty term and definition.`)
}
require(serviceMap.length >= 20, `Service map has ${serviceMap.length} rows; expected at least 20.`)
for (const row of serviceMap) {
  require(row.length === 3 && row.every((cell) => Boolean(cell.trim())), 'Service map rows must contain exactly three non-empty columns.')
}
require(new Set(serviceMap.map((row) => row[1])).size === serviceMap.length, 'Service map service names must be unique.')

const countBy = (bank: typeof questions) => (key: 'type' | 'domain') => Object.fromEntries([...new Set(bank.map((question) => question[key]))].sort().map((value) => [value, bank.filter((question) => question[key] === value).length]))
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'))
  process.exit(1)
}
console.log(`Validated ${questions.length} original questions.`)
console.log(`AIF-C01 by type: ${JSON.stringify(countBy(questions)('type'))}`)
console.log(`AIF-C01 by domain: ${JSON.stringify(countBy(questions)('domain'))}`)
console.log(`CLF-C02: ${clfQuestions.length} original questions.`)
console.log(`CLF-C02 by type: ${JSON.stringify(countBy(clfQuestions)('type'))}`)
console.log(`CLF-C02 by domain: ${JSON.stringify(countBy(clfQuestions)('domain'))}`)
for (const { module } of microsoftModules) console.log(`${module.code}: ${module.questions.length} original questions; ${module.exam.questionCount}-question practice simulation.`)
console.log(`CLF-C02 distribution tolerance: ±${clfDistributionTolerance} percentage points from official domain weights.`)
console.log(`Validated exam metadata, ${requiredV11Topics.length} v1.1 markers, ${studyPlan.length} budgeted study days, ${scheduledMinutes} planned minutes, ${resources.length} linked resources, ${glossary.length} glossary entries, and ${serviceMap.length} service map rows.`)
