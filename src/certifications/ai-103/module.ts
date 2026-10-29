import type { CertificationPracticeModule, Domain } from '../../core/types'
import { diagnosticQuestionIds, questions } from './questions'

// Objective numbers are local study references, not official Microsoft numbering.
export const domains: Domain[] = [
  { id: 'D1', title: 'Plan and manage an Azure AI solution', weight: 28, weightLabel: '25–30%', objectives: ['1.1 Service and model selection', '1.2 Configuration and deployment', '1.3 Security, observability, and quotas', '1.4 Responsible AI'] },
  { id: 'D2', title: 'Implement generative AI and agentic solutions', weight: 32, weightLabel: '30–35%', objectives: ['2.1 Generative applications and RAG', '2.2 Agents, tools, and orchestration', '2.3 Optimization, evaluation, and operations'] },
  { id: 'D3', title: 'Implement computer vision solutions', weight: 14, weightLabel: '10–15%', objectives: ['3.1 Visual generation and editing', '3.2 Multimodal understanding', '3.3 Responsible visual AI'] },
  { id: 'D4', title: 'Implement text analysis solutions', weight: 12, weightLabel: '10–15%', objectives: ['4.1 Text analysis and translation', '4.2 Speech'] },
  { id: 'D5', title: 'Implement information extraction solutions', weight: 14, weightLabel: '10–15%', objectives: ['5.1 Search, grounding, and ingestion', '5.2 Document extraction and Content Understanding'] },
]

export const examFacts = { minutes: 120, passingScore: 700 }
export const examAllocation = { D1: 14, D2: 16, D3: 7, D4: 6, D5: 7 }
export const practiceScoreDisclaimer = 'App scores are raw practice percentages, not Microsoft scaled scores or a pass prediction. The app uses an illustrative 50 questions in 120 minutes; the real exam question count and formats may differ. Microsoft publishes domain ranges; the app samples within them. Objective numbers are local study references, not official Microsoft numbering.'
export const aiPracticeModule: CertificationPracticeModule = {
  code: 'AI-103', domains,
  exam: { questionCount: 50, minutes: examFacts.minutes, allocation: examAllocation },
  questions, diagnosticQuestionIds, practiceScoreDisclaimer,
}

export const serviceMap = [
  ['Model selection and project', 'Microsoft Foundry', 'Compare models, deploy an appropriate model, connect projects, and evaluate application behavior.'],
  ['Grounded retrieval', 'Azure AI Search', 'Index content and retrieve relevant passages with keyword, vector, hybrid, and semantic capabilities.'],
  ['Tool-using workflows', 'Foundry Agent Service', 'Build agents that can use configured knowledge and tools with appropriate permissions and oversight.'],
  ['Document and multimodal extraction', 'Azure Content Understanding', 'Analyze documents, images, audio, or video into structured outputs for downstream use.'],
  ['Dedicated document processing', 'Azure AI Document Intelligence', 'Extract document text, layout, and fields using document analysis models.'],
  ['Speech', 'Azure Speech', 'Convert speech to text, synthesize speech, and support speech translation and custom speech scenarios.'],
  ['Text translation', 'Azure Translator', 'Translate text using a dedicated translation service.'],
  ['Safety', 'Azure AI Content Safety and Foundry safety controls', 'Help detect unsafe content and apply configured safeguards; evaluate them in context.'],
  ['Identity and secrets', 'Microsoft Entra managed identity and Azure Key Vault', 'Use keyless authentication where supported; protect any remaining secrets.'],
  ['Monitoring', 'Azure Monitor and Foundry tracing', 'Observe latency, failures, usage and traces without unnecessarily logging sensitive content.'],
]

export const glossary = [
  ['Grounding', 'Supplying relevant external evidence to help constrain a model response; it does not guarantee correctness.'],
  ['RAG', 'Retrieval-augmented generation retrieves relevant content at query time and supplies it to a generation model.'],
  ['Embedding', 'A numeric vector representing content, used for similarity search in an appropriate embedding space.'],
  ['Hybrid search', 'Combines keyword and vector retrieval; semantic ranking can improve relevance when configured.'],
  ['Chunk', 'A segment of source content indexed for retrieval, ideally preserving useful context and provenance.'],
  ['Agent', 'A model-driven component that can use instructions, knowledge and tools to pursue a task within configured controls.'],
  ['Tool calling', 'A model requests a structured tool invocation; the application or platform controls and executes authorized actions.'],
  ['Prompt injection', 'Untrusted content attempts to change instructions or induce unauthorized behavior.'],
  ['Groundedness', 'The extent to which claims in a response are supported by the provided evidence.'],
  ['OCR', 'Optical character recognition extracts text from visual content; layout and field extraction add structure.'],
  ['Managed identity', 'A Microsoft Entra identity for an Azure workload that avoids application-managed credentials where supported.'],
  ['Quota', 'A service limit for capacity or throughput, distinct from a budget alert or a guarantee of available capacity.'],
]
