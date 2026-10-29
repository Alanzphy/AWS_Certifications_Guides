import type { GuideSection } from '../../core/types'

export const guide: GuideSection[] = [
  {
    domain: 'D1', markers: [], v11: [],
    summary: 'Build a vocabulary for cloud responsibility, layered security, trust, cryptography, governance, and identity.',
    decisions: [
      { if: 'deciding who protects a cloud resource', use: 'shared responsibility for the specific service model', notThis: 'assuming the provider owns all customer security' },
      { if: 'checking a user’s identity versus their allowed actions', use: 'authentication versus authorization', notThis: 'treating sign-in as permission to everything' },
      { if: 'protecting confidentiality versus checking integrity', use: 'encryption versus hashing', notThis: 'assuming a hash is reversible encryption' },
    ],
    concepts: [
      { title: 'Responsibility and layered controls', body: 'Microsoft protects the underlying cloud infrastructure; customers remain responsible for their data, identities, and access. The precise split varies between IaaS, PaaS, and SaaS: for example, customers normally patch a guest OS in an IaaS VM. Defense in depth combines physical, identity, network, compute, application, and data controls so one failure need not expose everything.', cue: 'Always identify the service model before assigning responsibility.', example: 'Microsoft secures the data center while the VM customer manages its guest operating system and permissions.' },
      { title: 'Zero Trust and cryptography', body: 'Zero Trust means verify explicitly, use least-privilege access, and assume breach. Encryption transforms readable information using keys and can be reversed with appropriate keys; hashing produces a digest useful for integrity checks and is not reversible encryption. Encrypt data at rest and in transit according to requirements.', cue: 'A changed digest can reveal changed data; TLS protects data in transit.', example: 'A policy requires MFA for a sensitive app and gives each analyst only the access needed.' },
      { title: 'Governance, risk, compliance, and identity', body: 'Governance sets direction and accountability, risk management assesses and treats uncertainty, and compliance addresses obligations and controls. Identity is a primary security perimeter when users and workloads access resources from many locations. Authentication verifies identity; authorization decides permissions. An identity provider authenticates identities; directory services organize identity information. Active Directory is a traditional on-premises directory, while federation establishes trust between identity systems.', cue: 'Authentication answers who; authorization answers what is allowed.', example: 'A partner signs in through its own trusted identity provider and receives only authorized access to a shared application.' },
    ],
  },
  {
    domain: 'D2', markers: [], v11: [],
    summary: 'Distinguish Entra identity, authentication, access controls, risk detection, and governance.',
    decisions: [
      { if: 'require MFA based on app and sign-in context', use: 'Conditional Access', notThis: 'a role assignment alone' },
      { if: 'grant a privileged role only when needed', use: 'Privileged Identity Management', notThis: 'permanent administrator access for everyone' },
      { if: 'periodically confirm access is still needed', use: 'access reviews', notThis: 'a password reset' },
      { if: 'respond to risky sign-ins or users', use: 'Entra ID Protection', notThis: 'a retention policy' },
    ],
    concepts: [
      { title: 'Identity types and hybrid identity', body: 'Microsoft Entra ID is a cloud identity and access management service and identity provider. Its directory can contain users, guests, groups, devices, and workload identities such as service principals and managed identities. Hybrid identity connects on-premises Active Directory identities with Entra ID, supporting access across environments; it is not the same directory protocol as domain-joined AD.', cue: 'A managed identity gives a workload an identity without a developer managing its credentials.', example: 'An Azure application uses a managed identity to access a resource; a guest collaborator uses an external identity.' },
      { title: 'Authentication and access', body: 'Entra supports methods such as passwords, Microsoft Authenticator, FIDO2 security keys, and other passwordless options. MFA combines different factor categories. Password protection blocks weak passwords, and self-service password reset enables eligible users to reset credentials. Conditional Access evaluates signals such as user, app, device, and risk to apply controls. Entra roles govern directory administration; Azure RBAC manages access to Azure resources at a scope.', cue: 'Conditional Access controls the conditions of access; roles specify permissions.', example: 'A policy asks for MFA when staff access an application from a risky context, while a scoped Azure role limits resource actions.' },
      { title: 'Governance and protection', body: 'Entra ID Governance helps manage access lifecycle and entitlement. Access reviews let reviewers verify ongoing need. Privileged Identity Management (PIM) supports just-in-time, time-limited role activation and approval where configured. Entra ID Protection identifies risky users and sign-ins and can support automated remediation. Licensing and configuration affect availability.', cue: 'Review recurring access, activate privileged roles just in time, and investigate identity risk.', example: 'A reviewer removes a guest’s outdated access and an administrator activates an eligible role only for a maintenance window.' },
    ],
  },
  {
    domain: 'D3', markers: [], v11: [],
    summary: 'Select infrastructure controls, cloud posture and workload protection, SIEM/SOAR, and the right Defender capability.',
    decisions: [
      { if: 'mitigate distributed network floods', use: 'Azure DDoS Protection', notThis: 'WAF web exploit rules alone' },
      { if: 'block malicious HTTP requests', use: 'Azure Web Application Firewall', notThis: 'NSG packet filtering alone' },
      { if: 'assess cloud configurations and protect workloads', use: 'Defender for Cloud', notThis: 'Service Trust Portal reports' },
      { if: 'correlate diverse security events and automate response', use: 'Microsoft Sentinel SIEM and SOAR', notThis: 'a network security group' },
      { if: 'investigate correlated incidents from Microsoft security products', use: 'Microsoft Defender XDR and Defender portal', notThis: 'a compliance score' },
    ],
    concepts: [
      { title: 'Azure network and secret protection', body: 'Virtual networks and subnets segment resources; NSGs apply allow/deny traffic rules at subnet or network interface scope. Azure Firewall is a managed network firewall; WAF protects web applications from common HTTP attacks. Azure DDoS Protection mitigates distributed traffic attacks. Azure Bastion enables RDP/SSH to VMs without exposing their public IPs. Key Vault safeguards keys, secrets, and certificates.', cue: 'WAF examines web requests; an NSG filters network traffic.', example: 'A team uses separate subnets and NSGs, a WAF for its web front end, and Bastion for VM administration.' },
      { title: 'Cloud security posture and workload protection', body: 'Microsoft Defender for Cloud offers cloud security posture management (CSPM) and workload protection. Policies and standards define expected configurations, assessments identify gaps, and recommendations guide remediation. Enhanced workload protection adds threat detection and protection for supported workloads; its coverage depends on enabled plans and resources.', cue: 'A posture recommendation identifies configuration risk; workload protection detects threats to workloads.', example: 'A team follows a recommendation to restrict exposed management ports and enables suitable protection for its servers.' },
      { title: 'Sentinel and Defender XDR', body: 'Microsoft Sentinel is a SIEM that collects and analyzes security data from multiple sources; SOAR capabilities orchestrate and automate response using playbooks. Microsoft Defender XDR correlates signals across supported Microsoft security products and provides incidents in the Microsoft Defender portal. Defender for Office 365 protects email and collaboration; Defender for Endpoint protects devices; Defender for Identity uses on-premises identity signals; Defender for Cloud Apps addresses cloud apps. Defender Vulnerability Management identifies and prioritizes exposures, while Microsoft Threat Intelligence provides adversary context.', cue: 'Sentinel combines broader security data and automation; Defender XDR correlates Microsoft security signals.', example: 'An analyst examines a correlated phishing and endpoint incident in Defender, and Sentinel runs a configured response playbook.' },
    ],
  },
  {
    domain: 'D4', markers: [], v11: [],
    summary: 'Understand Microsoft assurance and privacy, then classify, protect, retain, investigate, and audit information with Purview.',
    decisions: [
      { if: 'obtain Microsoft assurance reports', use: 'Service Trust Portal', notThis: 'the organization’s compliance score' },
      { if: 'protect a sensitive document versus retain it for years', use: 'sensitivity label versus retention label', notThis: 'assuming both labels do the same job' },
      { if: 'prevent risky sharing of sensitive content', use: 'DLP', notThis: 'eDiscovery alone' },
      { if: 'search content for a legal matter versus user activity', use: 'eDiscovery versus Audit', notThis: 'interchanging content discovery and event history' },
    ],
    concepts: [
      { title: 'Trust, privacy, and compliance', body: 'The Service Trust Portal provides Microsoft assurance resources including audit reports and compliance documentation, subject to access requirements. Microsoft privacy principles include customer control, transparency, security, and lawful handling. The Purview portal brings together compliance and data security capabilities. Compliance Manager helps assess requirements, track improvement actions, and calculate a compliance score. The score reflects progress on assessed actions, not proof of compliance or a guarantee against incidents.', cue: 'Microsoft reports describe its controls; customers still assess their own responsibilities.', example: 'An audit team obtains a Microsoft report and tracks customer improvement actions in Compliance Manager.' },
      { title: 'Classification, protection, and lifecycle', body: 'Purview classifies content using sensitive information types, trainable classifiers, and other supported methods. Content explorer shows classified content; Activity explorer shows related activity. Sensitivity labels and policies classify and can protect supported content; DLP policies detect sensitive information and can warn or restrict sharing. Retention policies apply lifecycle settings to locations; retention labels can apply item-level retention and be published through label policies. Records management adds controls to records and their disposition.', cue: 'Classification identifies data, sensitivity labels protect it, DLP controls risky actions, and retention governs its lifecycle.', example: 'A DLP policy warns before sharing customer identifiers; a retention label keeps a contract for its required period.' },
      { title: 'Insider risk, eDiscovery, and audit', body: 'Insider Risk Management correlates configured signals to identify potentially risky internal activity and supports privacy-conscious investigation. eDiscovery supports searching, preserving, reviewing, and exporting content for investigations or legal cases. Audit records and searches supported user and administrator activities. Availability and retention of audit data depend on configuration and licensing.', cue: 'Insider risk investigates patterns, eDiscovery handles case content, Audit retrieves activity events.', example: 'An investigator preserves relevant email for a legal case and searches audit events to understand who accessed a file.' },
    ],
  },
]
