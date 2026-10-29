# Certification Study Lab

A public, client-only study platform for AWS and Microsoft certifications: concise guides, original practice, error-driven correction, hands-on Azure labs, and final weak-point review.

| Module | Study route | App timed practice |
|---|---|---|
| AWS Certified Cloud Practitioner (CLF-C02) | Flexible milestones; no exam date supplied | 65 questions, 90 minutes |
| Microsoft Azure AI Apps and Agents Developer (AI-103) | December 2026 target; exact day not supplied | 50 questions, 120 minutes |
| Microsoft Security, Compliance, and Identity Fundamentals (SC-900) | December 2026 target; exact day not supplied | 40 questions, 45 minutes |
| AWS Certified AI Practitioner (AIF-C01) | Existing September 2026 dated plan, exam guide v1.1 | 65 questions, 90 minutes |

> This independent educational project is not affiliated with or endorsed by AWS or Microsoft. It contains no exam dumps or copied third-party questions.

## Quick start

Requirements: Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

The project uses React 19, TypeScript, and Vite 8. The implementation environment runs Node 24.20.0, which satisfies Vite 8's documented engine requirement, so no compatibility downgrade was needed.

## Navigation

Choose a certification, then use Dashboard, Guide, Plan, Practice, or Progress. The breadcrumb and highlighted navigation item show the current location. Section URLs are shareable and survive reloads and browser Back/Forward; for example, `#/ai-103/plan` opens the AI-103 study plan. Progress remains local to each browser and is not included in a shared link.

## Learning workflow

The catalog and each flexible plan show an adjustable joint route: prioritize CLF-C02 through mid-November while beginning Python, Foundry and SC-900 identity; increase AI-103 RAG, agents, vision, language and extraction work and SC-900 security/compliance work later in November; complete timed practice and weak-point review before each December exam. If an exam is early in December, move its review earlier. No AWS exam date, exact Microsoft dates, or available study hours were supplied.

One starting example is 3 hours per week for CLF-C02, 1½ for AI-103, and ½ for SC-900; after CLF-C02 or as December approaches, shift to 3½ hours for AI-103 and 1½ for SC-900. These are adjustable starting points, not a readiness guarantee. Reserve longer sessions for simulations and labs.

The AI-103 route covers developing AI apps and agents with Python and Microsoft Foundry, grounded retrieval, vision, text, speech and document extraction. It links [Microsoft's AI-103 course](https://learn.microsoft.com/en-us/training/courses/ai-103t00) and [a hands-on agent and Python lab](https://microsoftlearning.github.io/mslearn-agent-quickstart/Instructions/Labs/01-get-started-in-foundry.html). Use an authorized isolated subscription; estimate costs and delete lab resources. Budgets alert but do not cap charges, and retained resources can still cost money.

### Existing AIF-C01 dated plan

The built-in September 12–27, 2026 plan contains **1,230 planned minutes (20 hours 30 minutes)**. Weekdays stay within 1 hour, weekend work stays within 2 hours, and exam day intentionally uses only 30 minutes:

| Date | Planned work |
|---|---|
| Sep 12 | AWS Skill Builder official 20-question baseline and full error review |
| Sep 13–14 | Domain 3: FM selection, RAG, customization, inference, prompts, evaluation, and metrics |
| Sep 15–18 | Domains 2, 1, 4, and 5 respectively |
| Sep 19 | First app 65-question/90-minute simulator and 30-minute error classification |
| Sep 20–21 | CloudCertPrep 65-question simulation, review, and targeted official documentation |
| Sep 22 | Official v1.1 revisions and in-scope service checklist; exam guide as source of truth |
| Sep 23–24 | Tutorials Dojo timed sampler, then CloudCertPrep weakest-domain practice |
| Sep 25 | Adaptive cues, glossary, and accumulated-mistake review |
| Sep 26 | Second hard app 65-question/90-minute simulator and 30-minute review |
| Sep 27 | 30 minutes of light final review only; no new material |

The app’s original 20-question diagnostic remains available as an optional feature. It is not an additional required calendar block; the external official Skill Builder set is the scheduled baseline.

This adapts the learning loop described by Javier López: maintain a concise guide, learn through question practice, feed errors back into the guide, and perform a final weak-point review. The app makes each stage explicit rather than optimizing for passive reading or raw question volume.

## Architecture and content layout

```text
src/
├── core/                    # Shared scoring, persistence, and domain types
├── components/Practice.tsx # Shared study, diagnostic, simulation, retry, and review
└── certifications/
    ├── aif-c01/             # AIF guide, dated plan, and practice bank
    ├── clf-c02/             # CLF guide, flexible milestones, and practice bank
    ├── ai-103/              # Azure AI apps and agents guide, labs, and practice bank
    └── sc-900/              # Security, compliance, identity guide and practice bank
```

Each module supplies `module.ts`, `guide.ts`, `plan.ts`, and `questions.ts`. `scripts/validate-content.ts` checks the content. All four modules reuse the same practice and scoring engine; their banks, plans, and score disclaimers remain separate.

Progress is versioned and stored in browser `localStorage` with a separate key per certification. The existing AIF-C01 key is retained so its local attempts and dated plan completion are preserved. Clearing progress affects only the selected certification. Invalid or corrupt data falls back safely to an empty state, and storage failures are surfaced without breaking study sessions. There is no backend, authentication, analytics, or cross-device synchronization.

CLF-C02's exam has 65 questions (50 scored and 15 unscored), 90 minutes, and a scaled score from 100 to 1,000 with 700 passing. Its scored-content domains are Cloud Concepts (24%), Security and Compliance (30%), Cloud Technology and Services (34%), and Billing, Pricing, and Support (12%). The suggested app simulation allocation is an approximation for practice sampling; AWS does not publish exact per-domain item counts including unscored questions. CLF study milestones have no dates because no exam date was supplied.

Microsoft's official guides publish **ranges**, not exact domain percentages: [AI-103, skills measured from April 16, 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103), and [SC-900, skills measured from October 21, 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-900). The app displays those ranges and uses an illustrative allocation for practice. AI-103 objective numbers in the app are local study references, not official Microsoft numbering. Microsoft lists 120 minutes for AI-103 and 45 for SC-900; the app's question counts and choice formats are not a guaranteed replica of either exam. Microsoft may update localized exam versions later than English; check the current guide and exam details before booking.

## Practice design

- Official CLF-C02 formats: multiple choice and multiple response. AIF-C01's bank may also use ordering and matching; those are not represented as CLF-C02 exam formats.
- AI-103 and SC-900 app questions are single-choice practice. Use the official Microsoft exam sandbox to explore other possible interactions.
- Immediate explanations in diagnostic, study, and retry modes; timed simulations have navigation, flags, and review after completion.
- Domain summaries, missed/confused retry, and local attempt history.
- All app results are **raw practice percentages**, not AWS or Microsoft scaled scores or pass predictions.

## Verification

Run after all source-mutating formatting:

```bash
npm run validate:content
npm test -- --run
npm run build
```

The content validator checks all four modules, their exam metadata, domains, question bank integrity and simulation capacity, guides, resources, service maps, glossaries, and dated or flexible study routes.

## GitHub Pages deployment

The included workflow builds and deploys the static `dist/` artifact using GitHub's official Pages actions. Vite uses a relative asset base, so the same build works at a repository subpath.

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push to `main` or run the workflow manually.

The repository does not attempt to enable Pages remotely. The workflow has only the permissions required by GitHub Pages deployment and uses no secrets beyond GitHub's deployment token.

## Data, source, and license policy

- Official AWS and Microsoft exam guides and service documentation are the source of truth; linked practice assessments and sandbox may require sign-in.
- CloudCertPrep and Tutorials Dojo are linked as external practice resources; their content is neither scraped nor imported.
- Practice questions and explanations are original educational material and must never be represented as real exam questions.
- AWS and Microsoft names and trademarks remain the property of their respective owners.
- Source code is licensed under the [MIT License](LICENSE). Original authored study content is available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with attribution to this project. Linked third-party content retains its owners' terms.

## Accessibility

The interface uses semantic headings, fieldsets, labels, keyboard-operable controls, visible focus, non-hover status cues, responsive layouts, and a reduced-motion media query. Ordering questions provide labeled move buttons, and matching uses labeled native selects.
