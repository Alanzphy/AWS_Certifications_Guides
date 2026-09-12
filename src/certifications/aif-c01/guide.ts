import type { GuideSection } from '../../core/types'

export const guide: GuideSection[] = [
  {
    domain: 'D1',
    markers: ['agentic-ai', 'inference-patterns', 'traditional-ml-vs-fm', 'pipeline-differentiation', 'aurora-in-scope'],
    summary: 'Choose the simplest AI approach that fits the business outcome, data, explainability, latency, and operational constraints.',
    v11: ['Agentic AI is now explicit.', 'Inference types include asynchronous and serverless.', 'Traditional ML versus FM selection is a new objective.', 'Pipeline wording now emphasizes differentiating stages; Amazon Aurora entered the in-scope list.'],
    concepts: [
      { title: 'Learning types', body: 'Supervised learning uses labeled examples; unsupervised learning finds structure in unlabeled data; reinforcement learning learns from rewards. Classification predicts categories, regression predicts numbers, and clustering discovers groups.', cue: 'If the question says labeled outcomes, think supervised learning.', notThis: 'Do not choose an FM for a stable tabular prediction merely because it is newer.' },
      { title: 'Inference patterns', body: 'Real-time inference prioritizes low latency, batch inference processes many records together, asynchronous inference handles long-running requests, and serverless inference suits intermittent traffic without managing capacity.', cue: 'If the request is large and can finish later, think asynchronous inference.' },
      { title: 'Pipeline: know each handoff', body: 'Collection acquires raw data; exploratory analysis finds patterns and quality issues; preprocessing cleans or transforms; feature engineering creates useful signals; training learns parameters; tuning changes hyperparameters; evaluation measures generalization; deployment serves inference; monitoring detects drift and operational failures.', cue: 'If the question asks what happens after deployment, think monitoring—not evaluation on the original test set.' },
      { title: 'Metrics', body: 'Accuracy can hide class imbalance; precision limits false positives, recall limits false negatives, and F1 balances both. Business metrics such as ROI, cost per user, and customer feedback determine whether technical quality creates value.', cue: 'If missing fraud is costly, prioritize recall; if false alarms are costly, prioritize precision.' },
      { title: 'AWS boundary', body: 'Use SageMaker AI for custom ML lifecycle work and Bedrock for managed foundation-model applications. JumpStart provides pretrained models and solution templates. Prebuilt services solve bounded tasks such as Textract OCR or Comprehend NLP.', notThis: 'Bedrock is not the answer to every AI workload.' },
      { title: 'Agentic AI', body: 'An agent combines a model with goals, reasoning, memory, tools, and orchestration. Agents can decompose work and act; conventional chat generation may only answer once.', cue: 'If a system must plan, call APIs, observe results, and continue, think agent.' },
      { title: 'Aurora in scope', body: 'Amazon Aurora is the managed relational database added to the v1.1 in-scope list. Treat it as a durable application data service; Aurora PostgreSQL can also participate in vector-aware application patterns.', notThis: 'Aurora is not a replacement name for Amazon Bedrock or SageMaker AI.' },
    ],
  },
  {
    domain: 'D2',
    markers: ['genai-benefits', 'token-pricing', 'context-engineering', 'mcp', 'agentcore', 'strands-agents', 'kiro', 'amazon-quick', 'aws-transform'],
    summary: 'Understand how FMs generate content, why context and tokens matter, and which AWS entry point fits the builder or business user.',
    v11: ['Token-based pricing and context engineering are new.', 'MCP, multi-agent patterns, and memory are explicit.', 'GenAI benefits now explicitly include responsiveness, conversation, and content generation.', 'AgentCore, Strands Agents, Kiro, Amazon Quick, and AWS Transform entered scope.'],
    concepts: [
      { title: 'Tokens and context windows', body: 'Models process tokens, not words. Input and output tokens can have different prices. Longer prompts consume context, raise cost and often latency, and leave less room for output.', cue: 'If cost grows with prompt and response length, think token pricing.', notThis: 'A token is not always one word.' },
      { title: 'Context engineering', body: 'Prompt engineering shapes an instruction; context engineering shapes the whole model environment: system rules, examples, conversation, retrieved evidence, tools, memory, and token budget.', cue: 'If the question mentions selecting history, tools, and retrieved facts, think context engineering.' },
      { title: 'MCP and agents', body: 'MCP standardizes how AI applications connect to tools and data sources. It does not itself provide model intelligence, authorization, or guaranteed safety. Multi-agent systems divide work but add coordination cost.', notThis: 'MCP is not a foundation model or an AWS-only protocol.' },
      { title: 'New v1.1 builders', body: 'AgentCore supplies production agent infrastructure; Strands Agents is an open-source SDK; Kiro is an agentic IDE; Amazon Quick is an AI workspace for business insight and action; AWS Transform modernizes applications and infrastructure.', cue: 'If the need is secure runtime, memory, identity, and observability for any agent framework, think AgentCore.' },
      { title: 'Benefits and value', body: 'GenAI adapts to varied natural-language tasks, responds interactively, supports conversational experiences, and generates text, images, code, summaries, and other content. Measure whether those capabilities improve task completion, satisfaction, conversion, cost per interaction, and ROI.', cue: 'If the requirement is flexible content generation or conversation, think GenAI capability—not a fixed classifier.' },
      { title: 'Limits', body: 'GenAI can hallucinate, vary across runs, amplify bias, expose data, and cost more at scale. Responsiveness is a benefit only when latency, quality, and safety remain acceptable for the use case.' },
    ],
  },
  {
    domain: 'D3',
    markers: ['distillation', 'prompt-management', 'human-in-loop-evaluation', 'llm-as-judge', 'business-alignment-metrics'],
    summary: 'Domain 3 has the highest weight: select, adapt, ground, prompt, evaluate, and operate foundation models deliberately.',
    v11: ['Distillation, Prompt Management, and LLM-as-a-judge are emphasized.', 'Human-in-the-loop evaluation is explicit.', 'Agents remain central while MCP moved into foundational agentic concepts.', 'Business-alignment metrics are explicit.'],
    concepts: [
      { title: 'Customization ladder', body: 'Start with prompt engineering. Add RAG for current or private facts. Fine-tune when behavior, style, or task patterns must change. Continued pre-training adds domain knowledge at greater cost. Distillation transfers behavior to a smaller model for lower latency and cost.', cue: 'If knowledge changes often and citations matter, think RAG.', notThis: 'Fine-tuning is not the normal way to inject frequently changing documents.' },
      { title: 'Prompt craft and management', body: 'Give role, task, context, constraints, examples, and output format. Zero-shot gives no examples; few-shot supplies examples; chain-of-thought requests reasoning but should not be treated as proof. Bedrock Prompt Management versions and reuses prompts.', cue: 'If teams need repeatable prompt versions and variables, think Prompt Management.' },
      { title: 'RAG and vectors', body: 'Chunk documents, create embeddings, store vectors, retrieve semantically relevant chunks, and place them in context. Knowledge Bases for Bedrock manage this flow. S3 Vectors offers purpose-built vector storage with S3-scale economics.', cue: 'If semantic similarity over a large low-cost vector corpus matters, consider S3 Vectors.' },
      { title: 'Evaluation', body: 'Use representative benchmarks, Bedrock Model Evaluation, task metrics, and human-in-the-loop evaluation. Humans apply a defined rubric to quality, safety, and nuanced usefulness, especially for high-impact or subjective outputs. BLEU fits translation overlap, ROUGE emphasizes recall for summaries, and BERTScore compares semantics.', notThis: 'One automatic metric does not prove business value or factuality.' },
      { title: 'LLM-as-a-judge', body: 'A model judge can scale rubric-based comparisons, but its preferences, position bias, and inconsistency require calibration against trusted human judgments. Keep the evaluation rubric and business objective explicit.', cue: 'If evaluation volume is high but nuance matters, think calibrated LLM-as-a-judge plus human checks.' },
      { title: 'Hallucination controls', body: 'Ground with trusted RAG sources, ask for citations, validate outputs, use confidence or abstention thresholds, and retain human review for high-impact decisions. Evaluate factual consistency against source evidence.' },
    ],
  },
  {
    domain: 'D4',
    markers: ['open-source-data-licensing', 'explainability-tools', 'human-centered-design'],
    summary: 'Responsible AI is a lifecycle discipline: fairness, explainability, privacy, robustness, safety, transparency, and accountability.',
    v11: ['Clarify and Bedrock Model Evaluations are named explainability tools.', 'Open-source models, data provenance, and licensing remain explicit transparency considerations.', 'User feedback and decision transparency are explicit human-centered design examples.'],
    concepts: [
      { title: 'Bias and fairness', body: 'Inspect whether data represents affected groups, choose relevant fairness metrics, test slices instead of averages alone, document limitations, and monitor drift after deployment.', cue: 'If overall accuracy is good but one group is harmed, think disaggregated evaluation.' },
      { title: 'Transparency tools', body: 'SageMaker Clarify detects bias and explains predictions; Model Cards document model purpose, risk, evaluation, and limitations; Bedrock Model Evaluation compares FM quality and responsibility dimensions.' },
      { title: 'Open-source, data, and licensing', body: 'Transparency includes model provenance, architecture or documentation where available, training-data disclosures, dataset quality and consent, model and data licenses, permitted uses, attribution duties, and redistribution limits. Open source improves inspectability but does not automatically make a model unbiased, safe, or license-free.', cue: 'If reuse rights or provenance are uncertain, inspect both the model license and the data terms.' },
      { title: 'Human-centered controls', body: 'Tell users when AI is involved, explain consequential decisions in useful language, provide feedback and appeal paths, and keep accountable humans for high-impact outcomes.', notThis: 'A disclaimer alone does not make a system responsible.' },
    ],
  },
  {
    domain: 'D5',
    markers: ['shared-responsibility', 'encryption-in-transit', 'data-leakage-prevention', 'ai-interaction-logging', 'guardrails', 'hallucination-detection'],
    summary: 'Apply least privilege, data protection, auditability, policy enforcement, and continuous governance across the AI lifecycle.',
    v11: ['AgentCore Identity and Policy and Bedrock Guardrails are named.', 'Shared responsibility, encryption in transit, leakage prevention, output validation, interaction logging, and toxicity controls are explicit.', 'Hallucination detection and grounding are a new objective.'],
    concepts: [
      { title: 'Shared responsibility', body: 'AWS secures the cloud infrastructure; customers remain responsible for their data, identities, permissions, configurations, application code, prompts, retrieved sources, and how model outputs are used. The exact split varies with the managed service.', cue: 'If the question asks who protects customer data and IAM policy, think customer responsibility.' },
      { title: 'Security foundations', body: 'Use IAM roles and least privilege, KMS-backed encryption at rest, TLS encryption in transit, Secrets Manager for secrets, PrivateLink for private connectivity, CloudTrail for API audit, and CloudWatch for operational telemetry. Macie discovers sensitive data in S3.', cue: 'If the question asks who called an AWS API, think CloudTrail.' },
      { title: 'GenAI threats', body: 'Treat prompts, retrieved content, tool outputs, and model outputs as untrusted. Defend against prompt injection with separation of instructions and data, scoped tools, allowlists, validation, least privilege, and human approval for sensitive actions.' },
      { title: 'Guardrails and agent controls', body: 'Bedrock Guardrails can filter harmful content, denied topics, sensitive information, and grounding problems. AgentCore Identity helps agents access resources with appropriate identities; AgentCore Policy sets deterministic boundaries on tool use.', notThis: 'Guardrails complement IAM and application controls; they do not replace them.' },
      { title: 'Leakage prevention and interaction logs', body: 'Minimize sensitive prompt data, redact or tokenize where appropriate, restrict retrieval sources, filter outputs, validate tool arguments, and prevent secrets from entering context. Log AI interactions, retrieved evidence, tool calls, policy decisions, model or prompt versions, and approvals with access controls and retention that respect privacy.', cue: 'If an investigation must reconstruct what the agent saw and did, think protected end-to-end interaction logging.' },
      { title: 'Governance', body: 'Maintain inventories, ownership, approved use cases, data lineage, risk classification, testing evidence, change control, and audit trails. AWS Artifact provides compliance reports; AWS Config evaluates resource configuration. Hallucination detection combines trusted grounding, contextual grounding checks, source validation, confidence or abstention, and human review.' },
    ],
  },
]
