import { useEffect, useMemo, useState } from 'react'
import { Practice } from './components/Practice'
import { loadProgress, saveProgress } from './core/progress'
import { readRoute, routeHref, views } from './core/navigation'
import type { Certification, View } from './core/navigation'
import type { CertificationPracticeModule, GuideSection, OfficialResource, Progress, Resource, StudyDay, StudyMilestone } from './core/types'
import { guide as aifGuide } from './certifications/aif-c01/guide'
import { aifPracticeModule, azureTransfers, examFacts as aifFacts, glossary as aifGlossary, serviceMap as aifServiceMap } from './certifications/aif-c01/module'
import { resources as aifResources, studyPlan as aifPlan } from './certifications/aif-c01/plan'
import { clfPracticeModule, examFacts as clfFacts, glossary as clfGlossary, serviceMap as clfServiceMap } from './certifications/clf-c02/module'
import { guide as clfGuide } from './certifications/clf-c02/guide'
import { resources as clfResources, studyPlan as clfPlan } from './certifications/clf-c02/plan'
import { aiPracticeModule, examFacts as aiFacts, glossary as aiGlossary, serviceMap as aiServiceMap } from './certifications/ai-103/module'
import { guide as aiGuide } from './certifications/ai-103/guide'
import { resources as aiResources, studyPlan as aiPlan } from './certifications/ai-103/plan'
import { scPracticeModule, examFacts as scFacts, glossary as scGlossary, serviceMap as scServiceMap } from './certifications/sc-900/module'
import { guide as scGuide } from './certifications/sc-900/guide'
import { resources as scResources, studyPlan as scPlan } from './certifications/sc-900/plan'


type CertificationContent = {
  title: string
  cardDetail: string
  examDetail: string
  facts: [string, string | number][]
  module: CertificationPracticeModule
  guide: GuideSection[]
  plan: (StudyDay | StudyMilestone)[]
  resources: (Resource | OfficialResource)[]
  glossary: string[][]
  serviceMap: string[][]
}

const certifications: Record<Certification, CertificationContent> = {
  'CLF-C02': {
    title: 'AWS Certified Cloud Practitioner', cardDetail: 'Current official guide', examDetail: 'No exam date supplied · Flexible study route',
    facts: [['Questions', clfFacts.questions], ['Time', `${clfFacts.minutes} min`], ['Scored', clfFacts.scored], ['Unscored', clfFacts.unscored], ['Passing score', clfFacts.passingScore], ['Scaled score', '100–1,000']],
    module: clfPracticeModule, guide: clfGuide, plan: clfPlan, resources: clfResources, glossary: clfGlossary, serviceMap: clfServiceMap,
  },
  'AI-103': {
    title: 'Microsoft Azure AI Apps and Agents Developer', cardDetail: 'AI applications and agents · Official guide', examDetail: 'December 2026 target · Exact exam date not supplied',
    facts: [['Official exam time', `${aiFacts.minutes} min`], ['Passing score', aiFacts.passingScore], ['App simulation', `${aiPracticeModule.exam.questionCount} questions`]],
    module: aiPracticeModule, guide: aiGuide, plan: aiPlan, resources: aiResources, glossary: aiGlossary, serviceMap: aiServiceMap,
  },
  'SC-900': {
    title: 'Microsoft Security, Compliance, and Identity Fundamentals', cardDetail: 'Current official guide', examDetail: 'December 2026 target · Exact exam date not supplied',
    facts: [['Official exam time', `${scFacts.minutes} min`], ['Passing score', scFacts.passingScore], ['App simulation', `${scPracticeModule.exam.questionCount} questions`]],
    module: scPracticeModule, guide: scGuide, plan: scPlan, resources: scResources, glossary: scGlossary, serviceMap: scServiceMap,
  },
  'AIF-C01': {
    title: 'AWS Certified AI Practitioner', cardDetail: 'Exam guide v1.1', examDetail: 'Existing plan · September 27, 2026 exam date',
    facts: [['Questions', aifFacts.questions], ['Time', `${aifFacts.minutes} min`], ['Scored', aifFacts.scored], ['Unscored', aifFacts.unscored], ['Passing score', aifFacts.passingScore]],
    module: aifPracticeModule, guide: aifGuide, plan: aifPlan, resources: aifResources, glossary: aifGlossary, serviceMap: aifServiceMap,
  },
}

const viewLabels: Record<View, string> = {
  catalog: 'Certifications', dashboard: 'Dashboard', guide: 'Guide',
  plan: 'Plan', practice: 'Practice', progress: 'Progress',
}

const planKey = (item: StudyDay | StudyMilestone) => 'date' in item ? item.date : item.id

export default function App() {
  const [current, setCurrent] = useState(() => {
    const route = readRoute(window.location.hash)
    return { route, progress: loadProgress(route.certification) }
  })
  const { view, certification } = current.route
  const progress = current.progress
  const setProgress: React.Dispatch<React.SetStateAction<Progress>> = (update) => {
    setCurrent((previous) => ({
      ...previous,
      progress: typeof update === 'function' ? update(previous.progress) : update,
    }))
  }
  const [storageOk, setStorageOk] = useState(true)
  const content = certifications[certification]
  const { module, guide, plan, resources, glossary, serviceMap } = content
  const isAif = certification === 'AIF-C01'
  const isMicrosoft = certification === 'AI-103' || certification === 'SC-900'
  useEffect(() => setStorageOk(saveProgress(progress, certification)), [progress, certification])
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash
      setCurrent((previous) => {
        const route = readRoute(hash, previous.route.certification)
        return {
          route,
          progress: route.certification === previous.route.certification ? previous.progress : loadProgress(route.certification),
        }
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])
  useEffect(() => {
    document.title = view === 'catalog' ? 'Certifications · Study Lab' : `${viewLabels[view]} · ${certification} · Study Lab`
  }, [view, certification])

  const totalMinutes = plan.flatMap((item) => item.activities).reduce((sum, activity) => sum + activity.durationMinutes, 0)
  const plannedDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
  const completedCount = plan.filter((item) => progress.completedPlanItems.includes(planKey(item))).length
  const latest = progress.attempts.at(-1)
  const missedTopics = useMemo(() => new Set(progress.attempts.flatMap((attempt) => attempt.questionIds.filter((id) => !attempt.answers[id]?.correct || attempt.answers[id]?.confused))).size, [progress.attempts])
  const togglePlan = (key: string) => setProgress((current) => ({ ...current, completedPlanItems: current.completedPlanItems.includes(key) ? current.completedPlanItems.filter((item) => item !== key) : [...current.completedPlanItems, key] }))

  return <div className="app-shell">
    <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus() }}>Skip to main content</a>
    <header><div className="brand"><span className="brand-mark">LAB</span><div><strong>Certification Study Lab</strong><small>{view === 'catalog' ? 'Learn distinctions. Correct errors. Build confidence.' : `${certification} · ${viewLabels[view]}`}</small></div></div><nav aria-label="Primary navigation">{views.map((item) => <a key={item} href={routeHref(certification, item)} className={view === item ? 'active' : ''} aria-current={view === item ? 'page' : undefined}>{viewLabels[item]}</a>)}</nav></header>
    {!storageOk && <div className="storage-warning" role="alert">Progress could not be saved. Your browser may be blocking storage or have no available space.</div>}
    <main id="main" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {view === 'catalog' ? <span aria-current="page">Certifications</span> : <>
          <a href={routeHref(certification, 'catalog')}>Certifications</a><span aria-hidden="true">/</span>
          {view === 'dashboard' ? <span aria-current="page">{certification}</span> : <>
            <a href={routeHref(certification, 'dashboard')}>{certification}</a><span aria-hidden="true">/</span><span aria-current="page">{viewLabels[view]}</span>
          </>}
        </>}
      </nav>
      {view === 'catalog' && <>
        <section className="hero"><div className="hero-copy"><p className="eyebrow">Public · local-first · no account</p><h1>Study the decision, not just the service name.</h1><p>Build cloud, AI and security knowledge with concise guides, original practice, error-driven correction, and hands-on work.</p></div>
          <div className="catalog-grid">{(Object.entries(certifications) as [Certification, CertificationContent][]).map(([code, entry]) => {
            const cardProgress = code === certification ? progress : loadProgress(code)
            const count = entry.plan.filter((item) => cardProgress.completedPlanItems.includes(planKey(item))).length
            return <a className="cert-card active-cert" key={code} href={routeHref(code, 'dashboard')}><span className="status-pill">Available</span><h2>{entry.title}</h2><p>{code} · {entry.cardDetail}</p><small>{count}/{entry.plan.length} study plan items complete</small></a>
          })}</div>
        </section>
        <StudyRoadmap />
      </>}
      {view === 'dashboard' && <>
        <section className="dashboard-hero"><div><p className="eyebrow">{certification} · {isAif ? `Exam guide v${aifFacts.version} · Published ${aifFacts.publicationDate}` : 'Official exam guide'}</p><h1>{content.title}</h1><p>{content.examDetail} · <strong>{plannedDuration} suggested study time</strong></p></div><a className="primary" href={routeHref(certification, 'practice')}>{progress.attempts.length ? 'Continue practice' : 'Start optional app diagnostic'}</a></section>
        <section className="fact-grid">{content.facts.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</section><p className="callout">{module.practiceScoreDisclaimer}</p>
        <section className="panel"><div className="section-heading"><div><p className="eyebrow">Exam blueprint</p><h2>Spend time where the exam does</h2></div></div>{isMicrosoft && <p>Microsoft publishes ranges, not exact domain percentages. The app's question allocation is only an illustrative sample.</p>}<div className="domain-list">{module.domains.map((domain) => <article key={domain.id}><div className={domain.weightLabel ? 'weight weight-range' : 'weight'} style={{ '--weight': `${domain.weight}%` } as React.CSSProperties}><strong>{domain.weightLabel ?? `${domain.weight}%`}</strong></div><div><h3>{domain.id} · {domain.title}</h3><p>{domain.objectives.join(' · ')}</p></div></article>)}</div></section>
        <section className="quick-grid"><a href={routeHref(certification, 'guide')}><strong>Read the concise guide</strong><span>Domains, decisions, and service distinctions</span></a><a href={routeHref(certification, 'plan')}><strong>Follow the study route</strong><span>{isAif ? 'Existing dated plan' : 'Flexible milestones'}</span></a><a href={routeHref(certification, 'progress')}><strong>Review weak points</strong><span>{missedTopics} missed or confused topics in history</span></a></section>
      </>}
      {view === 'guide' && <><section className="page-title"><p className="eyebrow">{certification} · concise guide</p><h1>Recognize the requirement, then choose the boundary.</h1><p>Use this guide to correct errors after practice. {isAif ? 'v1.1 markers highlight materially changed scope.' : 'The official exam guide remains the source of truth.'}</p></section>{guide.map((section) => { const domain = module.domains.find((item) => item.id === section.domain)!; return <section className="panel guide-domain" key={section.domain}><div className="domain-title"><span>{domain.weightLabel ?? `${domain.weight}%`}</span><div><p className="eyebrow">{section.domain}</p><h2>{domain.title}</h2></div></div><p className="lead">{section.summary}</p>{isAif && <div className="v11"><strong>What changed in v1.1</strong><ul>{section.v11.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className="table-wrap decision-table"><table><caption>{domain.title} decision guide</caption><thead><tr><th>If the question says…</th><th>Use</th><th>Not this</th></tr></thead><tbody>{section.decisions.map((row) => <tr key={row.if}><td>{row.if}</td><td>{row.use}</td><td>{row.notThis}</td></tr>)}</tbody></table></div><div className="concept-grid">{section.concepts.map((concept) => <article key={concept.title}><h3>{concept.title}</h3><p>{concept.body}</p>{concept.example && <p className="example"><strong>Example:</strong> {concept.example}</p>}{concept.cue && <p className="cue"><strong>If the question says… think…</strong> {concept.cue}</p>}</article>)}</div></section>})}<ReferenceTables serviceMap={serviceMap} glossary={glossary} azureTransfers={isAif ? azureTransfers : undefined} provider={isMicrosoft ? 'Microsoft' : 'AWS'} /></>}
      {view === 'plan' && <section><div className="page-title"><p className="eyebrow">{isAif ? `September 12–27, 2026 · ${plannedDuration} planned` : `${certification} · flexible milestones · ${plannedDuration} suggested`}</p><h1>{isAif ? 'An error-driven study plan' : `A flexible ${certification} study route`}</h1><p>{isAif ? 'Keep a concise guide, practice questions, correct the guide from errors, and finish on weak points rather than passive rereading.' : 'Move through the milestones at your own pace. Suggested minutes are guidance, not calendar commitments.'}</p>{isAif && <p className="callout">The AWS Skill Builder official 20-question set is the required calendar baseline on September 12. The app’s original diagnostic remains an optional extra.</p>}</div>
        {!isAif && <StudyRoadmap />}
        <div className="plan-list">{plan.map((item) => {
          const key = planKey(item)
          const checked = progress.completedPlanItems.includes(key)
          const itemResources = resources.filter((resource) => item.resourceIds.includes(resource.id))
          return <article className={checked ? 'done' : ''} key={key}><label className="plan-check"><input type="checkbox" checked={checked} onChange={() => togglePlan(key)} /><span><strong>{'date' in item ? new Date(`${item.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : item.title}</strong><small>{'date' in item ? item.duration : `${item.activities.reduce((sum, activity) => sum + activity.durationMinutes, 0)} suggested min`}</small></span></label><div><h2>{item.focus}</h2><p>{item.outcome}</p><ul className="activity-list">{item.activities.map((activity) => <li key={activity.id}>{activity.durationMinutes} min · {activity.type === 'full-exam' ? 'Timed practice simulation' : activity.type}</li>)}</ul>{itemResources.map((resource) => <div className="resource" key={resource.id}><span className={resource.kind === 'Third-party practice' ? 'third-party' : 'official'}>{resource.kind}</span><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} ↗</a><small>{resource.outcome}</small></div>)}</div></article>
        })}</div>
      </section>}
      {view === 'practice' && <Practice key={certification} certification={module} progress={progress} setProgress={setProgress} />}
      {view === 'progress' && <section><div className="page-title"><p className="eyebrow">Stored locally for {certification}</p><h1>Progress and attempt history</h1><p>{completedCount}/{plan.length} plan items complete · {progress.attempts.length} attempts · {missedTopics} current review topics.</p></div>{latest ? <div className="history-list">{[...progress.attempts].reverse().map((attempt) => <article key={attempt.id}><div><strong>{attempt.mode}</strong><span>{new Date(attempt.completedAt).toLocaleString()}</span></div><strong>{attempt.practicePercent}%</strong><small>{Object.values(attempt.answers).filter((answer) => answer.correct).length}/{attempt.questionIds.length} correct · practice percentage</small></article>)}</div> : <div className="empty-state"><h2>No completed attempts yet</h2><p>The optional app diagnostic can create an adaptive weak-domain baseline.</p><a className="primary" href={routeHref(certification, 'practice')}>Open practice</a></div>}<details className="data-controls"><summary>Local data controls</summary><p>Only {certification} progress is cleared; progress for other certifications remains untouched.</p><button className="danger" onClick={() => { if (window.confirm(`Clear locally stored ${certification} study progress?`)) setProgress({ version: 1, attempts: [], completedPlanItems: [], resourceNotes: {} }) }}>Clear {certification} progress</button></details></section>}
    </main><footer><p>Independent educational project. AWS and Microsoft names and trademarks belong to their respective owners. Not affiliated with or endorsed by AWS or Microsoft.</p><p>{module.questions.length} original {certification} questions · No exam dumps · Official provider documentation is the source of truth.</p><a className="switch-cert" href={routeHref(certification, 'catalog')}>Switch certification</a></footer>
  </div>
}

function StudyRoadmap() {
  return <section className="panel roadmap"><p className="eyebrow">One combined route · December 2026 target</p><h2>Balance AWS now with both Microsoft exams</h2><p>No exact exam dates or weekly availability were supplied. This is an adjustable example, not a booking or a promise of readiness. Schedule the exams first and move the final-review blocks before the actual dates.</p><div className="table-wrap"><table><thead><tr><th>When</th><th>Priority and concrete work</th></tr></thead><tbody>
    <tr><td>Now through mid-November</td><td>Prioritize CLF-C02: cloud foundations, shared responsibility, services and billing. Keep AI-103 active with Python and a Foundry model or agent exercise; begin SC-900 identity and Zero Trust.</td></tr>
    <tr><td>Mid to late November</td><td>Take the CLF-C02 app simulation and correct mistakes; do not assume an AWS exam date. Build and evaluate AI-103 RAG and agent workflows, then practice vision, language and document extraction; cover SC-900 Defender and Purview.</td></tr>
    <tr><td>December, before each exam</td><td>Prioritize whichever Microsoft exam comes first. Complete each app simulation, revisit weak domains, use the official practice assessments and Microsoft sandbox; reserve longer blocks for AI-103 coding exercises. Shift this work earlier if an exam is at the start of December.</td></tr>
    <tr><td>Last 48 hours before each exam</td><td>Review errors, service distinctions and logistics; avoid new topics. Keep CLF-C02 revision in the mix if it is still pending.</td></tr>
  </tbody></table></div><p className="source-note">Example weekly starting point: 3 h CLF-C02, 1½ h AI-103, ½ h SC-900. After CLF-C02 or as December approaches, shift to 3½ h AI-103 and 1½ h SC-900; adjust to your dates and experience. Allow separate longer blocks for timed practice and coding labs. Azure resources can incur charges: check pricing, budgets and permissions, and delete lab resources afterward.</p></section>
}

function ReferenceTables({ serviceMap, glossary, azureTransfers, provider }: { serviceMap: string[][]; glossary: string[][]; azureTransfers?: string[][]; provider: 'AWS' | 'Microsoft' }) {
  return <><section className="panel"><p className="eyebrow">Recognition over recall</p><h2>{provider} service map</h2><div className="table-wrap"><table><thead><tr><th>Need</th><th>Think</th><th>Boundary</th></tr></thead><tbody>{serviceMap.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>{azureTransfers && <section className="panel"><p className="eyebrow">Use prior knowledge carefully</p><h2>Azure-to-AWS transfer notes</h2><div className="table-wrap"><table><thead><tr><th>Azure anchor</th><th>AWS anchor</th><th>Transfer note</th></tr></thead><tbody>{azureTransfers.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>}<section className="panel"><p className="eyebrow">Quick reference</p><h2>Glossary</h2><dl className="glossary">{glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section></>
}
