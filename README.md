# AWS Certification Study Lab

A public, client-only study platform that teaches AWS service distinctions through a concise guide, original practice, error-driven correction, and a final weak-point review. The first active module is **AWS Certified AI Practitioner (AIF-C01), exam guide v1.1 published April 30, 2026**; the catalog is ready for a future **Cloud Practitioner (CLF-C02)** module.

> This independent educational project is not affiliated with or endorsed by Amazon Web Services. It contains no exam dumps or copied third-party questions.

## Quick start

Requirements: Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

The project uses React 19, TypeScript, and Vite 8. The implementation environment runs Node 24.20.0, which satisfies Vite 8's documented engine requirement, so no compatibility downgrade was needed.

## Learning workflow

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
├── core/                         # Shared scoring, persistence, and domain types
├── components/Practice.tsx      # Shared study, diagnostic, exam, retry, and review engine
└── certifications/aif-c01/      # Certification-specific module data
    ├── module.ts                 # Exam facts, domains, glossary, service maps
    ├── guide.ts                  # Weighted guide and v1.1 markers
    ├── plan.ts                   # Dated workflow and external resource assignments
    └── questions.ts              # Original tagged practice bank
scripts/validate-content.ts       # Structural and completeness checks
```

Certification data is separate from shared behavior. The shared practice boundary receives a module's domains, diagnostic IDs, question bank, exam duration, question allocation, and score disclaimer. A later CLF-C02 module can supply those values plus its guide and plan without changing shared practice or scoring logic.

Progress is versioned and stored in browser `localStorage`. Invalid or corrupt data falls back safely to an empty state, and storage failures are surfaced without breaking study sessions. There is no backend, authentication, analytics, or cross-device synchronization.

## Practice design

- Officially documented formats: single-answer multiple choice, multiple response, ordering, and matching.
- Immediate explanations in diagnostic, study, and retry modes.
- Timed mode: 65 questions in 90 minutes, with blueprint-aligned domain selection, navigation, and flags.
- Domain summaries, answer review, missed/confused retry, and local attempt history.
- All app results are labeled **raw practice percentages**. They are not AWS scaled-score estimates.

The bank contains 75 distinct, original questions. This intentionally favors an honest smaller bank over padding toward 191 with repetitive templates.

## Verification

Run after all source-mutating formatting:

```bash
npm run validate:content
npm test -- --run
npm run build
```

The content validator checks question count and structure, the exact 20-question diagnostic, complete dated plan coverage, and external-resource assignments.

## GitHub Pages deployment

The included workflow builds and deploys the static `dist/` artifact using GitHub's official Pages actions. Vite uses a relative asset base, so the same build works at a repository subpath.

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Push to `main` or run the workflow manually.

The repository does not attempt to enable Pages remotely. The workflow has only the permissions required by GitHub Pages deployment and uses no secrets beyond GitHub's deployment token.

## Data, source, and license policy

- Official AWS exam-guide, revision, in-scope-service, and service documentation links are preserved in the app and are the source of truth.
- CloudCertPrep and Tutorials Dojo are linked as external practice resources; their content is neither scraped nor imported.
- Practice questions and explanations in this repository are original educational material and must never be represented as real AWS exam questions.
- AWS names and trademarks remain the property of Amazon Web Services, Inc.
- Source code is licensed under the [MIT License](LICENSE). Original authored study content is available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with attribution to this project. Linked third-party and AWS content retain their respective owners' terms.

## Accessibility

The interface uses semantic headings, fieldsets, labels, keyboard-operable controls, visible focus, non-hover status cues, responsive layouts, and a reduced-motion media query. Ordering questions provide labeled move buttons, and matching uses labeled native selects.
