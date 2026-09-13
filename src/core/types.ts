export type DomainId = string
export type QuestionType = 'single' | 'multiple' | 'ordering' | 'matching'

export interface Domain {
  id: DomainId
  title: string
  weight: number
  objectives: string[]
}

export interface ExamConfig {
  questionCount: number
  minutes: number
  allocation: Record<DomainId, number>
}

export interface CertificationPracticeModule {
  code: string
  domains: Domain[]
  exam: ExamConfig
  questions: Question[]
  diagnosticQuestionIds: string[]
  practiceScoreDisclaimer: string
}

export interface Question {
  id: string
  type: QuestionType
  domain: DomainId
  objective: string
  prompt: string
  options: string[]
  correct: string[]
  explanation: string
  rationales?: Record<string, string>
  matches?: string[]
}

export interface AttemptAnswer {
  selected: string[]
  correct: boolean
  confused?: boolean
}

export interface Attempt {
  id: string
  mode: 'diagnostic' | 'study' | 'exam' | 'retry'
  startedAt: string
  completedAt: string
  questionIds: string[]
  answers: Record<string, AttemptAnswer>
  practicePercent: number
}

export interface Progress {
  version: 1
  completedPlanItems: string[]
  resourceNotes: Record<string, string>
  attempts: Attempt[]
}

export interface GuideConcept {
  title: string
  body: string
  cue?: string
  notThis?: string
  example?: string
}

export interface GuideDecision {
  if: string
  use: string
  notThis: string
}

export interface GuideSection {
  domain: DomainId
  summary: string
  markers: string[]
  v11: string[]
  concepts: GuideConcept[]
  decisions: GuideDecision[]
}

export interface StudyDay {
  date: string
  duration: string
  capacityMinutes: number
  focus: string
  outcome: string
  resourceIds: string[]
  activities: { id: string; type: 'study' | 'practice' | 'full-exam'; durationMinutes: number }[]
}

export interface Resource {
  id: string
  title: string
  url: string
  kind: 'Official AWS' | 'Third-party practice'
  assignedDate: string
  duration: string
  outcome: string
}
