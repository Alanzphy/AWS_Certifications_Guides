import type { CertificationPracticeModule, Domain } from '../../core/types'
import { diagnosticQuestionIds, questions } from './questions'

export const domains: Domain[] = [
  { id: 'D1', title: 'Fundamentals of AI and ML', weight: 20, objectives: ['AI concepts', 'Use cases', 'ML lifecycle and metrics'] },
  { id: 'D2', title: 'Fundamentals of Generative AI', weight: 24, objectives: ['GenAI concepts', 'Capabilities and limits', 'AWS GenAI services'] },
  { id: 'D3', title: 'Applications of Foundation Models', weight: 28, objectives: ['Model selection and customization', 'Prompt engineering', 'RAG and agents', 'Evaluation'] },
  { id: 'D4', title: 'Guidelines for Responsible AI', weight: 14, objectives: ['Responsible dimensions', 'Transparent and explainable AI'] },
  { id: 'D5', title: 'Security, Compliance, and Governance', weight: 14, objectives: ['Secure AI systems', 'Governance and compliance'] },
]

export const examFacts = {
  version: '1.1', publicationDate: '2026-04-30', questions: 65, minutes: 90, scored: 50, unscored: 15, passingScore: 700,
}

export const examAllocation = { D1: 13, D2: 16, D3: 18, D4: 9, D5: 9 }
export const practiceScoreDisclaimer = 'Scores are raw practice percentages. They are not AWS scaled scores and do not predict a pass.'

export const requiredV11Topics = [
  'agentic-ai', 'inference-patterns', 'traditional-ml-vs-fm', 'pipeline-differentiation',
  'genai-benefits', 'token-pricing', 'context-engineering', 'mcp', 'agentcore', 'strands-agents',
  'kiro', 'amazon-quick', 'aws-transform', 'distillation', 'prompt-management', 'human-in-loop-evaluation',
  'llm-as-judge', 'business-alignment-metrics', 'open-source-data-licensing', 'explainability-tools',
  'human-centered-design', 'shared-responsibility', 'encryption-in-transit', 'data-leakage-prevention',
  'ai-interaction-logging', 'guardrails', 'hallucination-detection', 'aurora-in-scope',
] as const

export const aifPracticeModule: CertificationPracticeModule = {
  code: 'AIF-C01',
  domains,
  exam: { questionCount: examFacts.questions, minutes: examFacts.minutes, allocation: examAllocation },
  questions,
  diagnosticQuestionIds,
  practiceScoreDisclaimer,
}

export const serviceMap = [
  ['Build with foundation models', 'Amazon Bedrock', 'Managed access to FMs, Knowledge Bases, Agents, Guardrails, evaluation, and Prompt Management.'],
  ['Build and train ML', 'Amazon SageMaker AI', 'End-to-end ML development, training, deployment, monitoring, Clarify, Model Cards, and JumpStart.'],
  ['Enterprise assistance', 'Amazon Q', 'Role-aware generative assistance for business and developer work.'],
  ['Business insights', 'Amazon Quick', 'AI-powered workspace for search, research, business intelligence, and automation.'],
  ['Agent runtime controls', 'Amazon Bedrock AgentCore', 'Deploy and operate agents with runtime, memory, identity, gateway, observability, and policy capabilities.'],
  ['Agent SDK', 'Strands Agents', 'Open-source model-driven SDK for composing agents and tools.'],
  ['AI development environment', 'Kiro', 'Agentic IDE focused on specification-driven software development.'],
  ['Modernization', 'AWS Transform', 'Agentic AI service for transforming applications and infrastructure at scale.'],
  ['Vector storage', 'Amazon S3 Vectors', 'Purpose-built vector storage with S3 economics for semantic search and RAG.'],
  ['Relational and vector-aware data', 'Amazon Aurora', 'Managed relational database in scope; Aurora PostgreSQL can support vector-oriented application patterns.'],
  ['Classical language AI', 'Comprehend / Translate / Transcribe / Polly / Lex', 'Prebuilt NLP, translation, speech-to-text, text-to-speech, and conversational interfaces.'],
  ['Vision and documents', 'Rekognition / Textract', 'Image-video analysis and structured extraction from documents.'],
]

export const azureTransfers = [
  ['Azure AI Foundry / Azure OpenAI', 'Amazon Bedrock', 'Transfer the managed-model-catalog intuition, but learn Bedrock-specific features and names.'],
  ['Azure Machine Learning', 'Amazon SageMaker AI', 'Both cover the ML lifecycle; exam answers depend on the AWS product boundary.'],
  ['Microsoft Entra ID / RBAC', 'AWS IAM', 'Transfer least privilege and role-based access; use AWS principals, policies, and roles.'],
  ['Azure Key Vault', 'AWS KMS + Secrets Manager', 'KMS manages encryption keys; Secrets Manager stores and rotates secrets.'],
  ['Azure Monitor / Activity Log', 'CloudWatch / CloudTrail', 'CloudWatch covers metrics and logs; CloudTrail records API activity.'],
]

export const glossary = [
  ['Agentic AI', 'AI systems that plan and use tools to pursue goals across multiple steps.'],
  ['BERTScore', 'Semantic text evaluation based on contextual embeddings.'],
  ['BLEU', 'N-gram precision-oriented metric commonly used for translation.'],
  ['Context engineering', 'Designing the complete information environment supplied to a model, including instructions, history, tools, and retrieved data.'],
  ['Distillation', 'Training a smaller student model to reproduce useful behavior from a larger teacher model.'],
  ['Embedding', 'Numeric vector representing semantic meaning.'],
  ['FM', 'Foundation model: a broad model adaptable to many downstream tasks.'],
  ['Hallucination', 'A fluent output that is unsupported, incorrect, or fabricated.'],
  ['LLM-as-a-judge', 'Using a language model to score outputs against a defined rubric; it still needs calibration and bias checks.'],
  ['MCP', 'Model Context Protocol: an open protocol connecting AI applications to tools and contextual data.'],
  ['RAG', 'Retrieval-Augmented Generation: retrieve relevant evidence and include it in model context before generation.'],
  ['ROUGE', 'Recall-oriented overlap metric often used for summarization.'],
  ['Token', 'A unit of model input or output; token volume affects context use, latency, and cost.'],
]
