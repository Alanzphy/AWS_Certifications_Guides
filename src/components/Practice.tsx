import { useEffect, useState } from 'react'
import { domainResults, isQuestionCorrect, moveSequenceItem, navigateQuestion, practicePercent, selectExamQuestions, selectQuestions, selectRetryQuestions, tickTimer } from '../core/scoring'
import type { Attempt, AttemptAnswer, CertificationPracticeModule, Progress, Question } from '../core/types'

type Mode = Attempt['mode']

const stableOptions = (question: Question) => [...question.options].sort((a, b) => {
  const score = (value: string) => [...`${question.id}:${value}`].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return score(a) - score(b) || a.localeCompare(b)
})

function QuestionInput({ question, value, onChange, locked }: { question: Question; value: string[]; onChange: (value: string[]) => void; locked: boolean }) {
  const options = stableOptions(question)
  if (question.type === 'ordering') {
    const ordered = value.length ? value : options
    const move = (index: number, offset: number) => {
      onChange(moveSequenceItem(ordered, index, offset as -1 | 1))
    }
    return <ol className="order-list">{ordered.map((item, index) => <li key={item}><span>{item}</span><span className="order-actions"><button disabled={locked || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${item} up`}>↑</button><button disabled={locked || index === ordered.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${item} down`}>↓</button></span></li>)}</ol>
  }
  if (question.type === 'matching') {
    return <div className="matching">{question.matches?.map((left, index) => <label key={left}><span>{left}</span><select disabled={locked} value={value[index] ?? ''} onChange={(event) => { const next = [...value]; next[index] = event.target.value; onChange(next) }}><option value="">Choose a match</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}</div>
  }
  const isMultiple = question.type === 'multiple'
  return <fieldset className="options"><legend>{isMultiple ? 'Select all that apply' : 'Select one answer'}</legend>{options.map((option) => <label key={option}><input disabled={locked} type={isMultiple ? 'checkbox' : 'radio'} name={question.id} checked={value.includes(option)} onChange={(event) => onChange(isMultiple ? (event.target.checked ? [...value, option] : value.filter((item) => item !== option)) : [option])} /><span>{option}</span></label>)}</fieldset>
}

export function Practice({ certification, progress, setProgress }: { certification: CertificationPracticeModule; progress: Progress; setProgress: React.Dispatch<React.SetStateAction<Progress>> }) {
  const [session, setSession] = useState<{ mode: Mode; items: Question[]; startedAt: string } | null>(null)
  const [answers, setAnswers] = useState<Record<string, AttemptAnswer>>({})
  const [drafts, setDrafts] = useState<Record<string, string[]>>({})
  const [index, setIndex] = useState(0)
  const [flags, setFlags] = useState<string[]>([])
  const [confused, setConfused] = useState<Record<string, boolean>>({})
  const [remaining, setRemaining] = useState(certification.exam.minutes * 60)
  const [complete, setComplete] = useState<Attempt | null>(null)

  useEffect(() => {
    if (!session || session.mode !== 'exam' || complete) return
    const timer = window.setInterval(() => setRemaining(tickTimer), 1000)
    return () => window.clearInterval(timer)
  }, [session, complete])

  useEffect(() => {
    if (session?.mode === 'exam' && remaining === 0 && !complete) finish()
    // finish is intentionally triggered only when the countdown reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const start = (mode: Mode, retryAttempt?: Attempt) => {
    let items: Question[]
    if (mode === 'diagnostic') items = certification.diagnosticQuestionIds.map((id) => certification.questions.find((question) => question.id === id)!).filter(Boolean)
    else if (mode === 'exam') items = selectExamQuestions(certification.questions, certification.exam.allocation)
    else if (mode === 'retry') items = selectRetryQuestions(certification.questions, retryAttempt ?? progress.attempts.at(-1))
    else items = selectQuestions(certification.questions, 20)
    if (!items.length) return
    setSession({ mode, items, startedAt: new Date().toISOString() }); setAnswers({}); setDrafts({}); setIndex(0); setFlags([]); setConfused({}); setComplete(null); setRemaining(certification.exam.minutes * 60)
  }

  const submit = (question: Question) => {
    const selected = drafts[question.id] ?? (question.type === 'ordering' ? stableOptions(question) : [])
    if (!selected.length || (question.type === 'matching' && selected.length !== question.correct.length)) return
    const correct = isQuestionCorrect(question, selected)
    setAnswers((current) => ({ ...current, [question.id]: { selected, correct, confused: confused[question.id] } }))
  }

  const finish = () => {
    if (!session) return
    const finalAnswers = Object.fromEntries(session.items.map((question) => [question.id, { ...(answers[question.id] ?? { selected: [], correct: false }), confused: confused[question.id] }]))
    const attempt: Attempt = { id: `${session.mode}-${Date.now()}`, mode: session.mode, startedAt: session.startedAt, completedAt: new Date().toISOString(), questionIds: session.items.map((question) => question.id), answers: finalAnswers, practicePercent: practicePercent(finalAnswers, session.items.length) }
    setAnswers(finalAnswers); setComplete(attempt); setProgress((current) => ({ ...current, attempts: [...current.attempts, attempt] }))
  }

  const latestAttempt = progress.attempts.at(-1)
  const latestRetryCount = selectRetryQuestions(certification.questions, latestAttempt).length
  if (!session) return <section className="panel"><div className="section-heading"><div><p className="eyebrow">Original practice bank</p><h2>Choose a focused practice mode</h2></div><span className="count-badge">{certification.questions.length} questions</span></div><p className="callout">{certification.practiceScoreDisclaimer}</p><div className="mode-grid"><button className="mode-card" onClick={() => start('diagnostic')}><strong>Optional app diagnostic</strong><span>{certification.diagnosticQuestionIds.length} questions · not a required calendar block</span></button><button className="mode-card" onClick={() => start('study')}><strong>Study set</strong><span>20 mixed questions · explanations</span></button><button className="mode-card" onClick={() => start('exam')}><strong>Timed exam</strong><span>{certification.exam.questionCount} questions · {certification.exam.minutes} minutes</span></button><button className="mode-card" onClick={() => start('retry', latestAttempt)} disabled={!latestRetryCount}><strong>Retry missed or confused</strong><span>Adaptive review from the latest attempt</span></button></div><p className="source-note">These are independent educational questions, not real exam questions or exam dumps.</p></section>

  if (complete) {
    const results = domainResults(certification.domains, session.items, complete.answers)
    const review = session.items.filter((question) => !complete.answers[question.id]?.correct || complete.answers[question.id]?.confused)
    return <section className="panel"><p className="eyebrow">Practice result</p><h2>{complete.practicePercent}% practice score</h2><p className="callout">{certification.practiceScoreDisclaimer}</p><div className="result-grid">{certification.domains.map((domain) => <article key={domain.id}><strong>{domain.id}</strong><span>{results[domain.id].correct}/{results[domain.id].total} · {results[domain.id].percent}%</span></article>)}</div><h3>Adaptive weak-domain summary</h3><ul>{certification.domains.filter((domain) => results[domain.id].total && results[domain.id].percent < 75).map((domain) => <li key={domain.id}><strong>{domain.title}:</strong> revisit {domain.objectives.join(', ').toLowerCase()}.</li>)}</ul><h3>Final review: missed or confused topics</h3>{review.length ? <div className="review-list">{review.map((question) => <details key={question.id}><summary>{question.domain} · {question.objective} · {question.prompt}</summary><p><strong>Your answer:</strong> {complete.answers[question.id]?.selected.join(' · ') || 'Unanswered'}</p><p><strong>Correct:</strong> {question.correct.join(' → ')}</p><p>{question.explanation}</p></details>)}</div> : <p>No missed or confused topics in this attempt.</p>}<div className="actions"><button onClick={() => setSession(null)}>Back to practice modes</button><button className="primary" onClick={() => start('retry', complete)} disabled={!review.length}>Retry this weak set</button></div></section>
  }

  const question = session.items[index]
  const answered = answers[question.id]
  const immediate = session.mode !== 'exam'
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0')
  const seconds = (remaining % 60).toString().padStart(2, '0')
  return <section className="panel practice"><div className="practice-top"><div><span className="eyebrow">{session.mode} mode</span><h2>Question {index + 1} of {session.items.length}</h2></div>{session.mode === 'exam' && <div className="timer" role="timer" aria-live="polite">{minutes}:{seconds}</div>}</div><div className="question-nav" aria-label="Question navigation">{session.items.map((item, itemIndex) => <button key={item.id} className={`${itemIndex === index ? 'current' : ''} ${answers[item.id] ? 'answered' : ''} ${flags.includes(item.id) ? 'flagged' : ''}`} onClick={() => setIndex(navigateQuestion(index, itemIndex, session.items.length))} aria-label={`Question ${itemIndex + 1}${flags.includes(item.id) ? ', flagged' : ''}`}>{itemIndex + 1}</button>)}</div><article className="question-card"><div className="question-meta"><span>{question.domain}</span><span>Objective {question.objective}</span><span>{question.type}</span></div><h3>{question.prompt}</h3><QuestionInput question={question} value={drafts[question.id] ?? []} locked={Boolean(answered && immediate)} onChange={(value) => setDrafts((current) => ({ ...current, [question.id]: value }))} /><label className="confused"><input type="checkbox" checked={Boolean(confused[question.id])} onChange={(event) => setConfused((current) => ({ ...current, [question.id]: event.target.checked }))} />Mark this topic as confusing</label>{immediate && answered && <div className={`feedback ${answered.correct ? 'correct' : 'incorrect'}`} role="status"><strong>{answered.correct ? 'Correct' : 'Review this distinction'}</strong><p>{question.explanation}</p>{!answered.correct && <p><strong>Correct answer:</strong> {question.correct.join(' → ')}</p>}{question.rationales && answered.selected.filter((item) => !question.correct.includes(item)).map((item) => <p key={item}><strong>{item}:</strong> {question.rationales?.[item]}</p>)}</div>}</article><div className="actions"><button onClick={() => setFlags((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id])}>{flags.includes(question.id) ? 'Remove flag' : 'Flag question'}</button>{!answered && <button className="primary" onClick={() => submit(question)}>{immediate ? 'Check answer' : 'Save answer'}</button>}<button disabled={index === 0} onClick={() => setIndex((current) => navigateQuestion(current, current - 1, session.items.length))}>Previous</button><button disabled={index === session.items.length - 1} onClick={() => setIndex((current) => navigateQuestion(current, current + 1, session.items.length))}>Next</button><button className="danger" onClick={finish}>Finish attempt</button></div></section>
}
