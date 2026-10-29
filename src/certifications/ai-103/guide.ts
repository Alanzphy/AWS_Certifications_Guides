import type { GuideSection } from '../../core/types'

// Objective references are local to this app; consult the official guide for measured skills.
export const guide: GuideSection[] = [
  {
    domain: 'D1', markers: [], v11: [],
    summary: 'Plan, deploy, secure, monitor and govern Azure AI solutions; the official range is 25–30%.',
    decisions: [
      { if: 'choosing a model for a constrained task', use: 'compare quality, modality, latency, cost, safety and deployment availability against requirements', notThis: 'assuming the largest model is always best' },
      { if: 'authenticating an Azure-hosted workload', use: 'managed identity and scoped roles where supported', notThis: 'embedding a shared key in source code' },
      { if: 'restricting sensitive data paths', use: 'supported private networking plus identity and authorization controls', notThis: 'assuming a private endpoint alone grants correct permissions' },
      { if: 'tracking potential spending', use: 'budgets, alerts, usage monitoring and operational controls', notThis: 'assuming a budget automatically stops charges' },
    ],
    concepts: [
      { title: '1.1 Choose services and models', body: 'Define the task, inputs, outputs, data sensitivity and quality targets. Compare LLMs, smaller models, code and multimodal models with Foundry Tools for specialized tasks. Select search and indexing for grounding, and choose appropriate knowledge, memory and tools for agents. Verify model, region, capacity and feature availability before committing to a design.', cue: 'Match capabilities and constraints to the task, not the marketing category.', example: 'Use a smaller model for a narrow classification task if an evaluation shows adequate quality and better latency; use a multimodal model when image evidence is needed.' },
      { title: '1.2 Project setup and deployment', body: 'Design the Foundry resource and project, dependencies, region, network and deployment capacity for the workload. Deploy a model or agent using an available option that meets throughput and isolation needs. Configure project connections and separate environments. Integrate infrastructure and application configuration into CI/CD, with versioned artifacts and controlled promotion.', cue: 'A project connection and a model deployment solve different configuration needs.', example: 'A development project deploys a model for testing; a pipeline promotes reviewed configuration to a separately permissioned production environment.' },
      { title: '1.3 Security, capacity and monitoring', body: 'Assign least-privilege roles to users and workload identities, prefer keyless credentials and use private networking where supported. Monitor quota, rate limits, throughput, latency, token consumption and cost. Track model drift, safety signals and grounding quality alongside ingestion failures, index health and search relevance. Quota and cost controls need operational review as workloads change.', cue: 'A successful model call can still have poor retrieval or unsafe output.', example: 'Alert on rising throttles and examine index freshness when grounded answers become stale.' },
      { title: '1.4 Responsible AI and oversight', body: 'Identify harms, apply configured safety filters, risk detection and content moderation, then evaluate effectiveness using representative and adversarial cases. Record appropriate traces, source provenance, decisions and approvals while protecting sensitive data. Constrain tool permissions and require human approval for consequential actions; no filter replaces governance or testing.', cue: 'Auditing shows what happened; tool restrictions and approvals reduce what can happen.', example: 'An agent can draft a payment request but a separate authorized person must approve the transaction.' },
    ],
  },
  {
    domain: 'D2', markers: [], v11: [],
    summary: 'Build, evaluate and operate generative applications and agents with Foundry; the official range is 30–35%.',
    decisions: [
      { if: 'answers must use current internal knowledge', use: 'RAG with access-controlled retrieval and citations', notThis: 'assuming model training contains current private documents' },
      { if: 'an agent proposes an external action', use: 'validate the tool arguments, authorize the caller and apply approval as needed', notThis: 'executing model-generated commands with unrestricted privileges' },
      { if: 'response quality declines', use: 'evaluate retrieval, groundedness, safety and generation separately', notThis: 'changing temperature without diagnosing the failure' },
      { if: 'a task requires predictable validation', use: 'combine model output with explicit rules and schema validation', notThis: 'trusting every model response as valid structured data' },
    ],
    concepts: [
      { title: '2.1 Python, Foundry and grounded applications', body: 'Connect a Python application to its Foundry project using the current documented SDK, endpoint and credential flow; select a deployed model and send a task with explicit instructions. Follow the linked official Python lab for current package names and calls rather than assuming APIs stay fixed. For RAG, ingest and index authorized sources, retrieve relevant chunks for the user query, provide evidence to the model and return citations. Check missing evidence, access rights and source freshness.', cue: 'Retrieval precedes generation; citations must actually support claims.', example: 'A support assistant retrieves the current approved troubleshooting page, answers from it and indicates when no relevant source was found.' },
      { title: '2.2 Agents and orchestration', body: 'Define an agent role, goal, conversation tracking, memory policy and tool schemas. Integrate search, knowledge stores, APIs, content understanding or custom functions as appropriate. Validate structured tool inputs, scope credentials and isolate untrusted tool outputs. Orchestrate multiple agents with explicit responsibilities and handoffs; set step limits, oversight and approval gates for autonomous or semiautonomous actions. Trace tool calls and evaluate behavior and errors, not just the final text.', cue: 'A tool request is not itself permission to execute an action.', example: 'A research agent retrieves policy, while a separate workflow validates an expense and requests approval before submitting it.' },
      { title: '2.3 Optimization, evaluation and operations', body: 'Establish a representative test set and baseline. Tune prompts and generation parameters, compare model choices and inspect retrieval before considering further optimization. Evaluate relevance, groundedness, fabrication, safety and task quality with automated evaluators and human review; inspect failures by slice. Reflection and self-critique can provide another check but may repeat the original error; evaluate any reasoning-based technique rather than assuming it is reliable. Instrument traces, token usage, safety signals and latency by stage; orchestrate multiple models or rules when appropriate.', cue: 'Quality, safety, latency and cost are separate measurements.', example: 'Compare two prompt versions on the same questions, inspect unsupported claims and trace whether the relevant passage was retrieved.' },
    ],
  },
  {
    domain: 'D3', markers: [], v11: [],
    summary: 'Generate and understand images and video responsibly; the official range is 10–15%.',
    decisions: [
      { if: 'creating a new visual asset', use: 'a supported image or video generation model with a clear prompt and permitted reference media', notThis: 'a text-only analysis pipeline' },
      { if: 'changing a specific image region', use: 'supported mask-based editing or inpainting', notThis: 'regenerating the whole image without preserving context' },
      { if: 'answering questions about an image', use: 'a multimodal model grounded in the visual input', notThis: 'assuming a text-only model has seen the image' },
      { if: 'untrusted text appears in an image', use: 'treat it as data and apply injection and content safety controls', notThis: 'obeying it as a higher-priority instruction' },
    ],
    concepts: [
      { title: '3.1 Image and video generation and editing', body: 'Choose a supported model and controls for generating images or video from text and reference media. Specify subject, style and constraints; check the result against intended use. For image edits, use masks, inpainting or prompt-driven modifications when supported; for video, plan edits and inspect segments and continuity. Feature availability and controls vary by model and deployment.', cue: 'A mask identifies the region to edit; a reference supplies visual context.', example: 'Replace a background with an inpainted region while preserving the product, then review the result for brand accuracy.' },
      { title: '3.2 Multimodal understanding', body: 'Supply one or multiple images to an appropriate multimodal model for concise captions, detailed descriptions or visual question answering. Generate accessible alt text based on purpose, without inventing details. Content Understanding can extract visual characteristics and identify objects, components or regions; select single-task or pro-mode pipelines as appropriate. Analyze video segments and retain timestamps or other evidence to support downstream interpretation.', cue: 'A caption describes; an evidence-grounded answer addresses a specific question.', example: 'Describe a chart for an accessible report, then ask a separate question about a visible trend and verify it against the image.' },
      { title: '3.3 Visual safety and policy', body: 'Use appropriate filters to classify unsafe or prohibited visual content and assess both input and generated output. Treat embedded text and other retrieved visual content as untrusted to mitigate indirect prompt injection. Apply organizational policies such as watermarking, detecting prohibited symbols, brand checks and flagging inappropriate content; route uncertain cases for review.', cue: 'Visual content can contain instructions as well as sensitive imagery.', example: 'An image contains a message asking the assistant to reveal secrets; the assistant treats it as image content, not an instruction.' },
    ],
  },
  {
    domain: 'D4', markers: [], v11: [],
    summary: 'Analyze and translate text and implement speech workflows; the official range is 10–15%.',
    decisions: [
      { if: 'extracting entities and structured fields', use: 'a suitable language capability or prompted model with validated schema', notThis: 'assuming arbitrary generated JSON is always valid' },
      { if: 'translating text', use: 'Azure Translator or an evaluated LLM translation flow', notThis: 'speech synthesis alone' },
      { if: 'making spoken input available to an agent', use: 'speech recognition or an appropriate audio-capable model', notThis: 'text-to-speech, which produces audio from text' },
    ],
    concepts: [
      { title: '4.1 Text analysis and translation', body: 'Extract entities, topics, summaries and structured JSON with generative prompting or Foundry Tools. Detect sentiment, tone, safety concerns and sensitive information, checking results for domain-specific errors. Customize prompts and output validation for domain tasks such as compliance summaries or field extraction. Use Translator or an evaluated language model flow for translation and review terminology and meaning.', cue: 'A fluent summary can omit an important qualification; evaluate against source text.', example: 'Extract a contract renewal date into a schema and route ambiguous dates to a reviewer rather than silently guessing.' },
      { title: '4.2 Speech and audio', body: 'Speech-to-text turns audio into text; text-to-speech synthesizes spoken output. Combine these with an agent when conversational audio is needed, and consider custom speech models for domain vocabulary. Audio-capable multimodal models can reason over audio where supported; speech translation can combine recognition, translation and synthesis or use suitable Foundry Tools. Evaluate language, accents, latency, privacy and transcription errors.', cue: 'Recognize, translate and synthesize are distinct stages.', example: 'Transcribe a customer request, translate it for an agent and synthesize the approved response in the customer language.' },
    ],
  },
  {
    domain: 'D5', markers: [], v11: [],
    summary: 'Build retrieval, enrichment and document extraction pipelines; the official range is 10–15%.',
    decisions: [
      { if: 'retrieving exact identifiers and semantically similar passages', use: 'hybrid search with appropriate ranking and evaluation', notThis: 'relying only on keyword matching or vector similarity without testing' },
      { if: 'a scanned document contains fields and tables', use: 'OCR plus layout and field extraction through an appropriate analyzer', notThis: 'treating the scan as already structured text' },
      { if: 'feeding retrieved content to an agent', use: 'preserve provenance and enforce document permissions', notThis: 'giving all users access to every indexed chunk' },
    ],
    concepts: [
      { title: '5.1 Ingestion, search and grounding', body: 'Ingest documents, images, audio or video; extract and enrich content using built-in or custom skills, OCR and layout where necessary. Chunk and index text with source metadata and appropriate embeddings. Keyword search matches terms; vector search compares embeddings; hybrid combines both, and semantic ranking can improve ordering. Measure retrieval relevance, access filtering, ingestion quality and index freshness. Connect retrieval to RAG workflows or agent tools while preserving citations and security boundaries.', cue: 'Poor extraction or stale indexing can defeat an otherwise capable model.', example: 'A scanned manual is OCR-processed and chunked with page references, then hybrid retrieval supplies the relevant page to a repair assistant.' },
      { title: '5.2 Document and multimodal extraction', body: 'Use Content Understanding analyzers and schemas to combine OCR, layout and field extraction into structured results or Markdown for downstream reasoning. Process documents and other supported modalities, retaining source evidence and checking field accuracy. Compare extracted fields to source pages and handle missing, ambiguous or low-confidence results through validation and review; clean grounded representations improve RAG and agent workflows.', cue: 'Extraction converts source material into usable data; retrieval selects relevant material for a question.', example: 'Analyze an invoice into supplier, date and total fields, verify the total against the original page and index the approved representation.' },
    ],
  },
]
