import type { CertificationPracticeModule, Domain } from '../../core/types'
import { diagnosticQuestionIds, questions } from './questions'

export const domains: Domain[] = [
  { id: 'D1', title: 'Cloud Concepts', weight: 24, objectives: ['1.1 Define the benefits of the AWS Cloud', '1.2 Identify design principles of the AWS Cloud', '1.3 Understand benefits and strategies for migration to the AWS Cloud', '1.4 Understand concepts of cloud economics'] },
  { id: 'D2', title: 'Security and Compliance', weight: 30, objectives: ['2.1 Understand the AWS shared responsibility model', '2.2 Understand AWS Cloud security, governance, and compliance concepts', '2.3 Identify AWS access management capabilities', '2.4 Identify components and resources for security'] },
  { id: 'D3', title: 'Cloud Technology and Services', weight: 34, objectives: ['3.1 Define methods of deploying and operating in the AWS Cloud', '3.2 Define the AWS global infrastructure', '3.3 Identify AWS compute services', '3.4 Identify AWS database services', '3.5 Identify AWS network services', '3.6 Identify AWS storage services', '3.7 Identify AWS AI/ML and analytics services', '3.8 Identify services from other in-scope AWS service categories'] },
  { id: 'D4', title: 'Billing, Pricing, and Support', weight: 12, objectives: ['4.1 Compare AWS pricing models', '4.2 Understand resources for billing, budget, and cost management', '4.3 Identify AWS technical resources and AWS Support options'] },
]

export const examFacts = { questions: 65, scored: 50, unscored: 15, minutes: 90, scoreMinimum: 100, scoreMaximum: 1000, passingScore: 700, formats: ['single', 'multiple'] as const }
export const examAllocation = { D1: 16, D2: 19, D3: 22, D4: 8 }
export const practiceScoreDisclaimer = 'Scores are raw practice percentages. They are not AWS scaled scores and do not predict a pass.'
export const clfPracticeModule: CertificationPracticeModule = {
  code: 'CLF-C02', domains,
  exam: { questionCount: examFacts.questions, minutes: examFacts.minutes, allocation: examAllocation },
  questions, diagnosticQuestionIds, practiceScoreDisclaimer,
}

export const examGuideUrl = 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html'
export const inScopeServicesUrl = 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html'
export const certificationUrl = 'https://aws.amazon.com/certification/certified-cloud-practitioner/'

export const serviceMap = [
  ['Virtual servers with control of the operating system', 'Amazon EC2', 'Resizable cloud compute instances; choose when a workload needs server-level control.'],
  ['Run code in response to events without managing servers', 'AWS Lambda', 'Event-driven serverless compute; EC2 instead gives control over instances.'],
  ['Object storage for files, backups, and data lakes', 'Amazon S3', 'Durable object storage; not a mounted block disk or shared file system.'],
  ['Persistent block storage for an EC2 instance', 'Amazon EBS', 'Block volumes attached to compute; EFS is shared file storage.'],
  ['Shared elastic file storage for Linux workloads', 'Amazon EFS', 'Managed network file system; unlike EBS, it is designed for shared file access.'],
  ['Managed relational database', 'Amazon RDS', 'Managed relational engines; DynamoDB is a NoSQL key-value/document database.'],
  ['Managed NoSQL key-value and document database', 'Amazon DynamoDB', 'Serverless NoSQL database; RDS/Aurora provide relational models.'],
  ['Register domains and route DNS queries', 'Amazon Route 53', 'DNS and domain services; CloudFront caches content at edge locations.'],
  ['Deliver content with low latency from edge locations', 'Amazon CloudFront', 'Content delivery network; Route 53 answers DNS queries.'],
  ['Record account API activity for audit', 'AWS CloudTrail', 'Who did what through AWS APIs; CloudWatch monitors metrics, logs, and alarms.'],
  ['Operational metrics, logs, and alarms', 'Amazon CloudWatch', 'Operational observability; CloudTrail is the API audit history.'],
  ['Compliance reports and agreements', 'AWS Artifact', 'On-demand compliance documents; AWS Config evaluates resource configuration.'],
  ['Assess resource configuration against rules', 'AWS Config', 'Configuration history and compliance evaluation; Artifact supplies audit documents.'],
  ['Users and permissions for AWS resources', 'AWS IAM', 'Identity and access management for AWS; IAM Identity Center helps manage workforce access across accounts.'],
  ['Central workforce access across multiple AWS accounts', 'AWS IAM Identity Center', 'Single sign-on and workforce access; IAM remains for AWS resource permissions.'],
  ['Explore historical spending and trends', 'AWS Cost Explorer', 'Analyze cost and usage over time; Budgets tracks thresholds and alerts.'],
  ['Set cost or usage thresholds and alerts', 'AWS Budgets', 'Monitor against configured thresholds; Cost Explorer visualizes historical spend.'],
  ['Managed distributed relational database', 'Amazon Aurora', 'MySQL- and PostgreSQL-compatible relational database in the RDS family.'],
  ['Analyze data with SQL directly in S3', 'Amazon Athena', 'Interactive serverless queries over data in S3.'],
  ['Cloud data warehouse', 'Amazon Redshift', 'Analytics warehouse for large-scale SQL analytics; not an operational relational database.'],
  ['Managed extract, transform, and load', 'AWS Glue', 'Data integration and cataloging for analytics pipelines.'],
  ['Protect web applications from common web exploits', 'AWS WAF', 'Web application filtering; Shield focuses on DDoS protection.'],
  ['Managed DDoS protection', 'AWS Shield', 'DDoS defense; WAF filters web requests using rules.'],
  ['Discover sensitive data in S3', 'Amazon Macie', 'Finds and classifies sensitive data; it does not grant access or encrypt objects.'],
  ['Threat detection using AWS activity and findings', 'Amazon GuardDuty', 'Managed threat detection; Security Hub consolidates security findings.'],
  ['Encryption keys', 'AWS KMS', 'Create and control cryptographic keys; Secrets Manager stores and rotates secrets.'],
  ['Store and rotate credentials and secrets', 'AWS Secrets Manager', 'Secret lifecycle management; KMS manages encryption keys.'],
  ['Privately connect to supported AWS services', 'AWS PrivateLink', 'Private connectivity without public internet exposure.'],
  ['Move relational databases to AWS', 'AWS Database Migration Service', 'Database migration; AWS Application Migration Service is for server workloads.'],
  ['Migrate virtualized servers to AWS', 'AWS Application Migration Service', 'Server lift-and-shift migration; DMS focuses on databases.'],
  ['Queue messages for decoupled consumers', 'Amazon SQS', 'Message queue; SNS is publish/subscribe notification fanout.'],
  ['Publish notifications to multiple subscribers', 'Amazon SNS', 'Pub/sub messaging; SQS provides durable queues for consumers.'],
  ['Manage containers without managing servers', 'AWS Fargate', 'Serverless compute for containers; ECS and EKS orchestrate containers.'],
  ['Create and manage AWS resources from templates', 'AWS CloudFormation', 'Infrastructure as code using declarative templates.'],
  ['Review personal recommendations and checks', 'AWS Trusted Advisor', 'Guidance across cost, security, fault tolerance, performance, and service limits.'],
]

export const glossary = [
  ['Availability Zone', 'An isolated location within an AWS Region, designed to reduce correlated failures.'],
  ['AWS Region', 'A geographic area containing multiple Availability Zones.'],
  ['Elasticity', 'Automatically or quickly adjusting resources to match changing demand.'],
  ['Scalability', 'Increasing or decreasing capacity to handle workload changes.'],
  ['Fault tolerance', 'Ability to continue operating when a component fails.'],
  ['High availability', 'Designing for a high level of operational uptime, commonly across failure domains.'],
  ['CapEx', 'Upfront capital expenditure for owned infrastructure.'],
  ['OpEx', 'Ongoing operating expenditure; cloud usage commonly shifts spending toward consumption-based costs.'],
  ['Economies of scale', 'Lower unit costs that can result when infrastructure is purchased and operated at large scale.'],
  ['Shared responsibility model', 'AWS secures the cloud infrastructure; customers secure their data, identities, configurations, and use of services.'],
  ['Least privilege', 'Grant only the permissions needed to perform a task.'],
  ['MFA', 'Multi-factor authentication adds an additional verification factor beyond a password.'],
  ['Encryption at rest', 'Protecting stored data using encryption.'],
  ['Encryption in transit', 'Protecting data as it travels between systems, commonly with TLS.'],
  ['DDoS', 'A distributed denial-of-service attack overwhelms a target with traffic from many sources.'],
  ['RPO', 'Recovery point objective: the maximum acceptable amount of data loss measured in time.'],
  ['RTO', 'Recovery time objective: the target maximum time to restore a service.'],
  ['SLA', 'A service-level agreement describes AWS service availability commitments and related terms.'],
  ['TCO', 'Total cost of ownership compares the complete cost of operating a solution, including direct and indirect costs.'],
  ['Reserved pricing', 'Commitment-based pricing that can reduce cost for eligible predictable usage.'],
  ['Spot Instances', 'Use spare EC2 capacity at discounted prices with interruption risk.'],
  ['Savings Plans', 'A commitment to a consistent amount of eligible compute usage in exchange for lower prices.'],
  ['Serverless', 'A service model where AWS manages underlying servers and capacity provisioning for the customer.'],
  ['Edge location', 'A point of presence used to deliver content closer to end users.'],
  ['Tag', 'A key-value label that helps organize resources and allocate cost.'],
]
