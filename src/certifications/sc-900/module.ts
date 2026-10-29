import type { CertificationPracticeModule, Domain } from '../../core/types'
import { diagnosticQuestionIds, questions } from './questions'

export const domains: Domain[] = [
  { id: 'D1', title: 'Security, compliance, and identity concepts', weight: 13, weightLabel: '10–15%', objectives: ['1.1 Security and compliance concepts', '1.2 Identity concepts'] },
  { id: 'D2', title: 'Microsoft Entra capabilities', weight: 27, weightLabel: '25–30%', objectives: ['2.1 Entra ID and identity types', '2.2 Authentication', '2.3 Access management', '2.4 Identity protection and governance'] },
  { id: 'D3', title: 'Microsoft security solutions', weight: 37, weightLabel: '35–40%', objectives: ['3.1 Azure infrastructure security', '3.2 Azure security management', '3.3 Microsoft Sentinel', '3.4 Microsoft Defender XDR'] },
  { id: 'D4', title: 'Microsoft compliance solutions', weight: 23, weightLabel: '20–25%', objectives: ['4.1 Service Trust Portal and privacy', '4.2 Compliance management', '4.3 Information protection and data lifecycle', '4.4 Insider risk, eDiscovery, and audit'] },
]

export const examFacts = { minutes: 45, passingScore: 700 }
export const examAllocation = { D1: 5, D2: 11, D3: 15, D4: 9 }
export const practiceScoreDisclaimer = 'App scores are raw practice percentages, not Microsoft scaled scores or a pass prediction. The app uses 40 questions in 45 minutes; the actual exam question count and formats are not guaranteed to match.'
export const scPracticeModule: CertificationPracticeModule = {
  code: 'SC-900', domains,
  exam: { questionCount: 40, minutes: examFacts.minutes, allocation: examAllocation },
  questions, diagnosticQuestionIds, practiceScoreDisclaimer,
}

export const serviceMap = [
  ['Cloud identity and sign-in', 'Microsoft Entra ID', 'Cloud identity provider and directory; hybrid identity connects on-premises identity with cloud services.'],
  ['Context-based access rules', 'Conditional Access', 'Evaluates signals and applies controls such as MFA; RBAC grants permissions.'],
  ['Temporary privileged access', 'Entra Privileged Identity Management', 'Manages eligible, time-limited privileged role activation.'],
  ['Review continuing access', 'Entra ID Governance access reviews', 'Reviewers periodically decide whether users still need access.'],
  ['Risky users and sign-ins', 'Entra ID Protection', 'Detects identity risks and supports risk-based remediation.'],
  ['Distributed traffic floods', 'Azure DDoS Protection', 'Helps mitigate network DDoS attacks; WAF addresses web application exploits.'],
  ['Network traffic filtering', 'Azure Firewall', 'Managed network security firewall; NSGs filter traffic using rules at subnet or network interface level.'],
  ['Web exploit filtering', 'Azure Web Application Firewall', 'Filters web requests against attacks such as SQL injection.'],
  ['Private VM administration', 'Azure Bastion', 'Provides RDP/SSH access through the Azure portal without exposing a VM public IP.'],
  ['Keys and secrets', 'Azure Key Vault', 'Stores and controls access to secrets, keys, and certificates.'],
  ['Cloud posture and workloads', 'Microsoft Defender for Cloud', 'Assesses security posture and offers workload protection capabilities.'],
  ['Cross-source security analytics and automation', 'Microsoft Sentinel', 'Cloud-native SIEM and SOAR for collecting, detecting, investigating, and responding.'],
  ['Correlated Microsoft threat response', 'Microsoft Defender XDR', 'Correlates signals across supported Microsoft security products into incidents.'],
  ['Protect endpoints', 'Defender for Endpoint', 'Endpoint threat prevention, detection, investigation, and response.'],
  ['Protect email and collaboration', 'Defender for Office 365', 'Protects against threats such as phishing in supported collaboration services.'],
  ['Discover and control cloud apps', 'Defender for Cloud Apps', 'Cloud app discovery and cloud access security controls.'],
  ['Detect identity attacks on premises', 'Defender for Identity', 'Uses on-premises identity signals to identify suspicious activity.'],
  ['Prioritize endpoint weaknesses', 'Defender Vulnerability Management', 'Discovers and prioritizes vulnerabilities and exposures.'],
  ['Attacker context', 'Microsoft Threat Intelligence', 'Threat intelligence enriches investigations and understanding of adversaries.'],
  ['Microsoft assurance documentation', 'Service Trust Portal', 'Provides Microsoft compliance and audit documentation, subject to access requirements.'],
  ['Assess compliance improvements', 'Microsoft Purview Compliance Manager', 'Manages assessments and improvement actions; score is not a compliance certification.'],
  ['Protect sensitive content', 'Purview sensitivity labels and DLP', 'Labels classify and can protect content; DLP detects and restricts risky sharing.'],
  ['Preserve or delete content over time', 'Purview retention and records management', 'Retention policies and labels manage lifecycle; records controls support regulated records.'],
  ['Investigate content and actions', 'Purview eDiscovery and Audit', 'eDiscovery supports legal investigations; Audit searches recorded activities.'],
  ['Detect risky internal activity', 'Purview Insider Risk Management', 'Correlates configured signals to identify potential insider risks with privacy controls.'],
]

export const glossary = [
  ['Shared responsibility', 'Microsoft and customers each retain security duties; the division changes with the service model.'],
  ['Defense in depth', 'Multiple complementary layers limit the effect of a control failure.'],
  ['Zero Trust', 'Verify explicitly, use least privilege, and assume breach.'],
  ['Authentication', 'Proving an identity; authorization determines what that identity may do.'],
  ['Federation', 'Trust between identity systems enables access using an external identity provider.'],
  ['Workload identity', 'An identity used by software, services, or applications rather than a person.'],
  ['MFA', 'Authentication using two or more different categories of verification factor.'],
  ['RBAC', 'Role-based access control assigns permissions through roles at a defined scope.'],
  ['CSPM', 'Cloud security posture management identifies and helps remediate cloud configuration risks.'],
  ['SIEM', 'Security information and event management collects and analyzes security events.'],
  ['SOAR', 'Security orchestration, automation, and response coordinates and automates response workflows.'],
  ['DLP', 'Data loss prevention detects and controls inappropriate handling of sensitive information.'],
  ['Sensitivity label', 'Classification that can apply protection to supported content.'],
  ['Retention label', 'A label that manages how long an item is retained or when it is deleted.'],
  ['Compliance score', 'A progress indicator for assessed improvement actions, not proof of regulatory compliance.'],
]
