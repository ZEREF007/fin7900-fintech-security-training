import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle, BadgeCheck } from 'lucide-react'
import { MODULES } from '../data/modules'
import SlideViewer from '../components/SlideViewer'
import ModuleMCQ from '../components/ModuleMCQ'
import CountUp from '../components/CountUp'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'
import { useAuth } from '../context/AuthContext'

/* ─── Per-module deep-dive written explanations ─── */
const MODULE_DEEP_DIVE: Record<number, { heading: string; body: string }[]> = {
  1: [
    {
      heading: 'What Exactly Constitutes a Data Breach?',
      body: `A data breach is any security incident in which sensitive, protected, or confidential data is accessed, disclosed, stolen, or destroyed by an unauthorised party — whether through malicious intent, negligence, or system misconfiguration. The definition under Hong Kong's Personal Data (Privacy) Ordinance (PDPO Cap.486) is deliberately broad: it encompasses not only targeted hacking but accidental exposure, such as a misconfigured cloud storage bucket visible to the public internet, or a misdirected email containing customer account information.\n\nFor a digital wallet operator, the scope of a potential breach is uniquely wide. A single customer record may contain a government-issued identity document, biometric data used for facial recognition login, a linked bank account and card number, a full transaction history, a device token enabling session hijacking, and a geolocation history from app usage. Unlike a retail loyalty card database, a digital wallet breach creates a complete profile an attacker can use to commit identity fraud, drain accounts, obtain credit, or sell as a "fullz" package on dark web markets for approximately US$310 per record (Privacy Affairs, 2024).\n\nThis combination of data density and financial immediacy explains why the financial technology sector consistently reports some of the highest per-record breach costs in IBM's annual research — US$183 per record in 2024, compared to the cross-industry average of US$165. It also explains why digital wallet operators face an elevated duty of care under both PDPO DPP4 and the HKMA Cybersecurity Fortification Initiative 2.0.`,
    },
    {
      heading: 'The Four Types of Breach and Why All Four Apply to Digital Wallets',
      body: `Breaches are commonly discussed as though they are uniformly external hacking events. In practice, the IBM Cost of a Data Breach Report 2024 and the Verizon DBIR 2024 together identify four distinct causal categories, each requiring a different preventive response.\n\n<strong>External attacks</strong> account for approximately 55% of documented incidents. This category encompasses phishing campaigns that steal employee credentials, exploitation of unpatched software vulnerabilities, SQL injection and API manipulation attacks, and ransomware. Digital wallet platforms are particularly exposed because they present multiple external-facing surfaces: a mobile application, a web portal, partner API integrations, and administrative management consoles — each a potential entry point.\n\n<strong>Insider threats</strong> account for approximately 20% of incidents. This includes both malicious insiders who deliberately exfiltrate or sell customer data, and negligent insiders who click phishing links, misconfigure systems, or bypass security controls for convenience. The Ponemon Institute (2023) found that negligent insider incidents cost an average of US$4.58 million per event in financial services — more than external attacks — because they are significantly harder to detect.\n\n<strong>Accidental disclosure</strong> accounts for approximately 15% of incidents and is especially relevant to small and scaling FinTech teams. A developer who exposes a test database to the public internet, an administrator who misconfigures an AWS storage bucket, or staff who send a customer list to the wrong email — all trigger the same PDPO notification obligations as a deliberate attack.\n\n<strong>Physical theft</strong> accounts for approximately 10% of incidents. Laptops containing unencrypted customer databases, USB drives with backup data, and physical access to server rooms are all viable attack vectors. PDPO DPP4 requires "all practicable steps" to prevent unauthorised access — a standard that explicitly includes physical security measures, not merely digital ones.`,
    },
    {
      heading: 'Understanding PDPO Data Protection Principles in Practice',
      body: `The Personal Data (Privacy) Ordinance Cap.486, as substantially amended in 2021, imposes six Data Protection Principles (DPPs) on any organisation that collects or processes Hong Kong residents' personal data. For a digital wallet operator, all six apply simultaneously and continuously.\n\n<strong>DPP1 — Purpose and Means of Collection:</strong> Personal data must be collected only for a lawful purpose directly related to the data controller's function, and only to the extent necessary. Every data point collected must have a defined, documented purpose at the time of collection. Privacy impact assessments must precede feature launches.\n\n<strong>DPP2 — Accuracy and Retention:</strong> Data must be accurate and must not be retained longer than necessary. This creates a legal obligation to implement a data retention and deletion schedule. Transaction data retained indefinitely without a documented purpose may violate this principle.\n\n<strong>DPP3 — Use of Personal Data:</strong> Data must only be used for the purpose for which it was collected. Using customer transaction data to profile customers for third-party advertising without explicit opt-in consent is a potential DPP3 violation.\n\n<strong>DPP4 — Security of Personal Data:</strong> This is the most operationally demanding principle. All practicable steps must be taken to ensure personal data is protected against unauthorised or accidental access, processing, erasure, loss, or use. "All practicable steps" covers technical controls (encryption, access controls, vulnerability patching), organisational controls (staff training, documented security policies), and physical controls (secure premises, locked server rooms). A breach does not automatically constitute a DPP4 violation — but a breach resulting from failure to implement industry-standard controls clearly does.\n\n<strong>DPP5 — Openness:</strong> Data subjects must be able to ascertain what types of personal data the organisation holds and the main purposes for which it is held. A well-maintained, clearly written privacy policy published prominently in the app satisfies this requirement.\n\n<strong>DPP6 — Access and Correction:</strong> Individuals have the right to request access to their own personal data and to request corrections if data is inaccurate. A digital wallet operator must have a documented, functional process for responding to these requests within 40 days.`,
    },
    {
      heading: 'The Breach Lifecycle and Why 277 Days is a Crisis',
      body: `IBM's 2024 research documents a mean time of 204 days to identify a breach and a further 73 days to contain it — a total dwell time of 277 days from initial compromise to containment. Every one of those 277 days represents ongoing theft of customer data, ongoing violation of PDPO Section 33A's notification requirement, ongoing escalation of fines, and ongoing reputational damage compounding daily.\n\nThe lifecycle typically follows a recognisable sequence. <strong>Initial access</strong> is achieved through one of the four causal categories above. The attacker then conducts <strong>lateral movement</strong> — exploring the network, escalating privileges, identifying where the most valuable data lives. This reconnaissance phase can last weeks without triggering any alerts in an organisation without a SIEM. Then comes <strong>data exfiltration</strong>: data is copied to attacker-controlled infrastructure, often through encrypted channels that bypass network monitoring. <strong>Discovery</strong> may come from an automated detection system, a customer complaint, a law enforcement tip, or the attacker themselves — through a ransom demand or publication of stolen data.\n\nThe cost of detection lag is quantified by IBM: organisations that identify and contain a breach in under 200 days spend an average of US$3.93 million; those that take over 200 days spend US$4.95 million — a US$1.02 million premium for delayed detection. For a Hong Kong SVF operator, PDPO Section 33A also requires notification to the PCPD within three days of becoming aware of a breach creating real risk of harm. Delayed detection directly delays this notification, compounding regulatory exposure with every passing day.`,
    },
  ],
  2: [
    {
      heading: 'Phishing and Business Email Compromise: The Most Common Entry Point',
      body: `Phishing remains the single most common initial attack vector in financial services breaches, accounting for 36% of incidents in the Verizon DBIR 2024. Despite extensive awareness campaigns, phishing effectiveness has not declined — because the technique has evolved from crude mass-spam to highly targeted spear-phishing crafted with personal and organisational detail sourced from LinkedIn, company websites, and previously stolen data.\n\nA modern spear-phishing attack targeting a digital wallet operator might impersonate a trusted payment network partner (Visa, Mastercard, or Alipay), the HKMA Cybersecurity team issuing a "supervisory notice," or the CEO of the organisation in what is known as a Business Email Compromise (BEC). The email arrives with apparently correct sender domain, references real upcoming regulatory deadlines, and requests urgent action — clicking a link to a credential-harvesting page visually identical to the genuine site, or opening an attachment containing malicious code.\n\nBEC is a specific, financially devastating variant where an attacker impersonates a senior executive or trusted financial counterpart to redirect payment to attacker-controlled accounts. The FBI IC3 Report 2023 recorded US$2.9 billion in BEC-related losses in the United States alone. For a digital wallet operator managing large-value settlement flows, a single successful BEC attack can result in multi-million-dollar fraudulent transfers.\n\nThe technical defence includes email authentication standards (SPF, DKIM, and DMARC), which prevent exact-domain spoofing — but not domain-lookalike attacks. Multi-Factor Authentication (MFA) is the most powerful mitigating control: even if credentials are captured by a phishing page, MFA prevents the attacker from using them. HKMA TM-E-1 explicitly requires MFA for all privileged and remote access.`,
    },
    {
      heading: 'Ransomware: When Attackers Lock the Business',
      body: `Ransomware attacks have become the dominant form of financially motivated cybercrime in financial services. Malware encrypts an organisation's files and systems, rendering them inaccessible, and the attacker demands a cryptocurrency ransom in exchange for the decryption key. Modern ransomware gangs operate a "double extortion" model: they also exfiltrate data before encrypting it, threatening to publish customer data publicly if the ransom is not paid.\n\nFor a digital wallet operator, a ransomware attack creates compounding crises simultaneously. The immediate operational impact is service unavailability — if payment processing systems are encrypted, customers cannot transact. The data exfiltration component creates a second crisis: a personal data breach requiring PDPO Section 33A notification within three days and HKMA TM-E-1 incident notification within one hour of detection. The ransom payment decision creates a third: payments to ransomware gangs may violate sanctions regulations if the gang has been designated by OFAC or other authorities.\n\nThe 2022 Medibank breach illustrates exactly this scenario: stolen VPN credentials (no MFA) granted attacker access, 9.7 million patient records were exfiltrated, data was published on dark web forums after Medibank's board refused to pay the ransom, and total remediation cost exceeded AUD$250 million. The most cost-effective prevention: MFA on all remote access points, plus offline backups that ransomware encryption routines cannot reach.`,
    },
    {
      heading: 'API and BOLA Attacks: The Vulnerability Unique to FinTech',
      body: `Broken Object Level Authorisation (BOLA) — ranked the number one API security risk by OWASP since 2019 — is particularly dangerous for digital wallet platforms because they are inherently API-intensive. A digital wallet exposes APIs to the mobile application, web browsers, merchant partners, payment network settlement systems, and regulatory reporting endpoints. Each is a potential BOLA target.\n\nA BOLA vulnerability exists when an API endpoint uses a user-controlled identifier (such as an account number or transaction ID) to retrieve data but fails to verify that the requesting user is actually authorised to access that specific object. In practice: if GET /api/transactions/TXN-10042 returns transaction data and the application does not verify that the authenticated session user owns that transaction, then any authenticated user can enumerate transaction IDs and access any customer's transaction history. No technical hacking skill is required — simply changing a number in a URL.\n\nThe 2019 Capital One breach involved a related vulnerability (SSRF — Server-Side Request Forgery) combined with an overly permissive IAM role, illustrating how seemingly minor misconfigurations concatenate into catastrophic outcomes. For a digital wallet operator, the practical mitigation is mandatory object-level authorisation checks at every API endpoint — every request for a specific resource must verify that the authenticated identity has been explicitly granted access to that particular object.`,
    },
    {
      heading: 'Insider Threats: The Risk That Does Not Come from Outside',
      body: `The Ponemon Institute (2023) defines insider threats as incidents caused by current or former employees, contractors, business partners, or other individuals who have — or had — authorised access to an organisation's systems and data, whether acting maliciously, negligently, or unknowingly.\n\nFor a digital wallet operator, the insider threat surface is broad: customer service agents with access to account information, developers with production database access, compliance officers with the full KYC document store, payment operations staff able to authorise large transfers, and third-party contractors maintaining infrastructure. A malicious insider can exfiltrate customer data gradually over months in quantities that fall below automated alerting thresholds.\n\nThe most effective technical controls are: least-privilege access (every individual should have access only to the minimum data and systems required by their specific role); privileged access management (a separate, monitored layer for high-privilege accounts such as database administrators); and comprehensive audit logging (all access to sensitive data should be logged with user identity, timestamp, and action, stored in an immutable system that even administrators cannot delete). The HKMA CFI 2.0 framework specifically includes insider threat under its Intelligence-Led Cyber Attack Simulation (iCAST) assessment scope.`,
    },
    {
      heading: 'Supply Chain Attacks: The Threat from Trusted Third Parties',
      body: `A supply chain attack occurs when an attacker compromises a trusted third-party supplier — software vendor, cloud service provider, API integration partner, or managed service provider — and uses that trusted relationship to pivot into the target organisation's systems. The 2020 SolarWinds attack, in which a compromised software update was distributed to 18,000 government and enterprise customers, is the most cited example; but supply chain attacks are growing in frequency across the financial sector.\n\nFor a digital wallet operator, the supply chain attack surface is substantial: the core banking integration partner, the KYC identity verification service, the fraud detection platform, the card payment processing network, the cloud infrastructure provider, the mobile app framework libraries, and open-source packages incorporated into the codebase. Each represents a trusted pathway into the organisation's data environment.\n\nHKMA Supervisory Policy Manual TM-G-1 requires due diligence on third-party IT service providers and security requirements in all third-party contracts. PCI DSS v4.0 Requirement 12.8 mandates a documented list of all third-party service providers, a formal risk assessment process for each, and annual confirmation that each provider maintains their own PCI DSS compliance. Operationally, supply chain risk is managed through third-party security assessments (SOC 2 reports, penetration test results, security questionnaires), contractual security standards, and continuous monitoring of third-party access.`,
    },
  ],
  3: [
    {
      heading: 'The True Cost of a Data Breach: Beyond the Fine',
      body: `The IBM Cost of a Data Breach Report 2024 identifies the mean total cost of a data breach in financial services at US$5.90 million — but this figure substantially underrepresents the full financial impact because it captures only costs measurable within a defined post-breach window. The full economic impact continues to compound for years.\n\nIBM decomposes breach cost into four categories. Detection and escalation costs — identifying, investigating, and escalating a breach — average US$1.58 million. Notification costs — legal review, regulatory notification, customer notification, credit monitoring services — average US$0.37 million. Post-breach response costs — remediation, technology upgrades, additional staff, forensic investigation — average US$1.35 million. And lost business costs — customer attrition, reduced revenues, new customer acquisition costs, and reputational damage — average US$1.30 million. This fourth category is most frequently underestimated by senior management because it does not appear as a discrete invoice but manifests gradually as declining retention rates and reduced spending.\n\nThe Ponemon Institute (2023) found that 87% of consumers would cease using a FinTech service following a breach that mishandled their personal data — and among those who would continue, 64% would reduce the value of assets held through the service. For a digital wallet operator this translates directly into reduced transaction volumes, reduced interchange revenue, and potentially reduced SVF licence renewal prospects if the HKMA determines that the operator's security posture is inadequate.`,
    },
    {
      heading: 'The Regulatory Exposure Matrix: Multiple Simultaneous Obligations',
      body: `A Hong Kong digital wallet operator does not face a single regulatory breach notification obligation — it faces multiple, simultaneous, and potentially conflicting obligations across several jurisdictions and frameworks.\n\n<strong>PDPO Section 33A (Hong Kong):</strong> Mandatory notification to the PCPD within three days of becoming aware of a data breach that creates real risk of significant harm. Customer notification must follow promptly. The penalty for failure to notify is a fine of up to HKD 50,000 and six months' imprisonment — a personal criminal liability for the data controller, not merely a corporate fine.\n\n<strong>HKMA TM-E-1 (Hong Kong):</strong> Significant cybersecurity incidents must be reported to the HKMA within one hour of detection. "Significant" includes any incident affecting the availability of e-banking services, confirmed unauthorised access to customer payment data, and any ransomware infection affecting production systems. This one-hour window is entirely separate from the three-day PDPO notification obligation.\n\n<strong>GDPR Article 33 (European Union — extraterritorial):</strong> If the operator holds data on any EU residents, GDPR applies regardless of location. Notification to the relevant EU data protection authority must be made within 72 hours. Fines for GDPR notification failures can reach €10 million or 2% of global annual turnover; fines for underlying data protection failures can reach €20 million or 4% of global annual turnover.\n\n<strong>PCI DSS v4.0 (Global standard for card data):</strong> If the breach involves cardholder data — card numbers, CVVs, PINs — the acquiring bank and card schemes must be notified immediately. A forensic investigation (PCI Forensic Investigator) must be commissioned within 72 hours. The card scheme may impose significant fines and potentially revoke the operator's ability to process card payments — a potentially existential consequence.`,
    },
    {
      heading: 'The Board ROI Model: Making the Business Case for Security Investment',
      body: `One of the most persistent challenges for cybersecurity professionals in FinTech is translating security investment into board-level financial language. IBM's 2024 research provides exactly the data needed to construct a return-on-investment model that resonates with a CFO or CEO rather than a CISO.\n\nIBM documents cost savings from specific deployed controls compared to organisations without them. Organisations with a fully automated AI-powered detection and response platform saved an average of US$2.22 million per breach. Organisations with an incident response plan tested through tabletop exercises saved US$2.66 million. SIEM deployment saved US$1.68 million. MFA enforcement across all accounts saved US$500,000. Zero Trust Architecture deployment saved US$1.51 million.\n\nThese figures create a compelling board-level calculation. A SIEM deployment costing US$200,000 annually that saves US$1.68 million per breach has a breakeven period of less than two months of avoided breach exposure. MFA deployment on a 1,000-person organisation costing US$30,000 annually saves US$500,000 per avoided breach. The business case for security investment is return on capital deployed, expressed in exactly the terms a board of directors understands.\n\nThe PwC Global Economic Crime Survey (2024) additionally found that organisations that invest proactively in security controls before an incident spend 40% less on post-breach remediation than those that invest reactively. The cost of preparation is consistently and substantially lower than the cost of response.`,
    },
    {
      heading: 'Customer Trust: The Cost That Does Not Appear on the Invoice',
      body: `The financial cost tallies produced by IBM and Ponemon capture measurable, invoiced expenditure. The customer trust cost of a data breach is harder to quantify but, for most FinTech operators, ultimately larger. Trust is the single most important commercial asset of a digital wallet: customers entrust the service with their identity documents, payment credentials, and transaction history. When that trust is breached, customer relationships rarely survive.\n\nPonemon Institute (2023) research is specific: 87% of consumers would stop using a FinTech service following a breach in which their data was mishandled. "Mishandled" was defined by respondents to include delayed notification, minimisation of severity in communications, absence of a credible remedy such as credit monitoring, and failure to explain clearly what data was compromised. Conversely, organisations that notified promptly, communicated transparently, and offered substantive remedies retained significantly higher proportions of their customer base.\n\nFor a listed digital wallet operator, the reputational impact of a major breach has direct share price consequences. Academic analysis of the stock price impact of disclosed data breaches in financial services shows an average abnormal return of -3.5% in the five trading days following a breach disclosure, with larger falls for breaches involving payment credential data. The long-term recovery to pre-breach valuation takes on average 46 trading days — and does not occur at all for operators perceived to have been negligent in their security posture prior to the breach.`,
    },
  ],
  4: [
    {
      heading: 'Zero Trust Architecture: Trust Nothing, Verify Everything',
      body: `Zero Trust is a security architecture philosophy premised on the principle that no user, device, or system — whether inside or outside the corporate network perimeter — should be trusted by default. Every access request must be continuously verified against explicit policy, regardless of network location. The traditional "castle and moat" perimeter model — where anything inside the firewall is trusted — is fundamentally incompatible with modern cloud-based, mobile-first, API-connected digital wallet operations.\n\nNIST Special Publication 800-207 (2020) defines the five core principles of Zero Trust: all data sources and computing services are treated as resources; all communication is secured regardless of network location; access to individual resources is granted on a per-session basis; resource access is determined by dynamic policy incorporating observable state; and the enterprise monitors and measures the integrity and security posture of all owned and associated assets.\n\nFor a digital wallet operator, Zero Trust implementation typically involves three initial and highest-impact measures: network microsegmentation (dividing the production network into isolated zones so that a compromised component cannot reach other systems); strong identity verification for every access request (MFA plus device health certificates for privileged access); and least-privilege access enforcement (access tokens scoped to only the specific resources needed for the authenticated session). IBM (2024) documents a US$1.51 million average breach cost saving for organisations with Zero Trust deployed.`,
    },
    {
      heading: 'Identity and Access Management: Least Privilege in Practice',
      body: `Identity and Access Management (IAM) is the set of policies, technologies, and processes that ensure the right individuals have access to the right resources at the right times and for the right reasons. The Principle of Least Privilege states that every user, service account, and application should have access to only the minimum permissions necessary to perform their authorised function.\n\nIn practice, IAM failures are among the most common and most costly breach contributors. The Capital One breach (2019) was directly enabled by a WAF service account that had been granted an excessive IAM role — the combination of SSRF vulnerability and overly permissive role together granted access to 106 million customer records across 700+ Amazon S3 buckets. Had the WAF service account been scoped to minimum necessary permissions, the SSRF vulnerability would have been exploited but the data exposure would have been near zero.\n\nFor a digital wallet operator, IAM implementation requires four elements: a comprehensive inventory of all users and service accounts and their current permissions; a role-based access control (RBAC) model mapping each role to a defined permission set reflecting least privilege; a periodic access review process (at minimum quarterly, monthly for privileged accounts) that removes excess permissions; and Privileged Access Management (PAM) tooling that enforces just-in-time access to production systems, records all privileged sessions, and requires secondary approval for high-risk operations. The HKMA CFI 2.0 includes PAM under its Technology Resilience domain assessment criteria.`,
    },
    {
      heading: 'Encryption: Protecting Data At Rest and In Transit',
      body: `Encryption is the process of converting plaintext data into ciphertext using a cryptographic algorithm, rendering it unintelligible to any party without the correct decryption key. For a digital wallet operator, encryption determines whether a breach results in the attacker obtaining usable customer data or worthless ciphertext.\n\nFor <strong>data at rest</strong> (stored in databases, file systems, backups), AES-256 is the current industry standard mandated by PCI DSS v4.0 Requirement 3.5 for all stored primary account numbers. For <strong>data in transit</strong> (transmitted between the mobile app and server, between microservices, and between the operator and payment network partners), TLS 1.2 or higher is required for all transmissions containing cardholder data (PCI DSS v4.0 Requirement 4.2.1).\n\nTokenisation is an alternative to encryption for stored payment card data: the system replaces the actual card number with a randomly generated token that has no mathematical relationship to the original. The token is usable within the platform for transaction processing but has no value to an attacker who steals it. Payment processors like Stripe and Adyen offer tokenisation services that keep actual PANs off the wallet operator's systems entirely, dramatically reducing PCI DSS scope and breach exposure.\n\nKey management is as important as the encryption algorithm itself. An AES-256 encrypted database is only as secure as the key used to encrypt it. If the encryption key is stored alongside the encrypted data, a single access event compromises both. Hardware Security Modules (HSMs) are purpose-built cryptographic devices that store encryption keys in tamper-resistant hardware, ensuring that even a fully compromised server cannot expose the underlying keys.`,
    },
    {
      heading: 'SIEM and Incident Detection: Seeing the Attack Before It Completes',
      body: `Security Information and Event Management (SIEM) is a technology platform that aggregates, correlates, and analyses log data from across an organisation's entire IT environment — network devices, servers, applications, databases, identity systems, and endpoints — to detect patterns of behaviour indicative of a security incident in progress. In the context of the 277-day average breach dwell time documented by IBM (2024), SIEM is the technology that closes the gap between compromise and detection.\n\nA SIEM system ingests log events from every connected source, normalises them into a common format, and applies detection rules and machine learning models to identify anomalous patterns. Relevant detection use cases for a digital wallet operator include: a single user account querying a database volume statistically implausible for their role; authentication failures from multiple accounts originating from the same IP (indicating a credential stuffing attack); a service account accessing an AWS S3 bucket it has never previously accessed; and data exfiltration indicators such as large outbound transfers to external IPs at unusual hours.\n\nIBM (2024) documents a US$1.68 million average breach cost reduction for organisations with SIEM deployed — from earlier detection (reducing dwell time), faster containment (real-time alerts), and a more complete audit trail for regulatory investigation. The HKMA CFI 2.0 framework explicitly includes SIEM as a required control under the Security Operations domain, with the iCAST assessment programme specifically testing SIEM detection capability against simulated attack scenarios.`,
    },
    {
      heading: 'Incident Response: The Plan You Must Test Before You Need It',
      body: `An incident response plan (IRP) is a documented, pre-approved set of procedures governing how an organisation identifies, contains, eradicates, and recovers from a cybersecurity incident. IBM (2024) documents the most impactful single control in the entire breach cost dataset: organisations with an IRP tested through tabletop exercises in the 12 months prior to an incident saved an average of US$2.66 million per breach — more than a fully automated AI detection platform.\n\nThe NIST Cybersecurity Framework (CSF) 2.0 defines incident response across four phases. <strong>Preparation</strong> encompasses building the IR team, documenting communication trees (including the HKMA one-hour notification requirement), establishing relationships with external forensic investigators, and defining escalation criteria. <strong>Detection and Analysis</strong> covers identifying the incident, determining scope and severity, and preserving forensic evidence. <strong>Containment, Eradication, and Recovery</strong> involves isolating affected systems, eliminating the attacker's foothold, and restoring systems from known-good backups. <strong>Post-Incident Activity</strong> includes formal root-cause analysis, lessons-learned review, regulatory notification, customer remediation, and IRP update.\n\nFor a Hong Kong digital wallet operator, the IRP must specifically address: one hour to HKMA (TM-E-1), three days to PCPD (PDPO Section 33A), 72 hours to EU DPA if GDPR applies, 72 hours PFI commission if cardholder data involved, and immediate notification to card schemes and acquiring bank if PAN data is compromised. Discovering these notification obligations for the first time during a crisis guarantees regulatory non-compliance and maximises breach cost.`,
    },
  ],
  5: [
    {
      heading: 'Case Study 1 — Equifax (2017): The Unpatched Long-Tail Catastrophe',
      body: `The Equifax data breach of May–July 2017 remains one of the most studied cybersecurity incidents in financial services history, precisely because its root cause was not sophisticated attack tradecraft but an entirely preventable operational failure: a critical Apache Struts vulnerability (CVE-2017-5638) publicly disclosed on 7 March 2017 that remained unpatched in Equifax production systems for 78 days.\n\nThe attack method was OGNL injection through the Apache Struts framework — requiring no insider knowledge or custom tooling, merely knowledge of the publicly disclosed CVE and access to a freely available proof-of-concept exploit. The attackers gained initial access on 13 May 2017 and then spent 76 days in undetected lateral movement: navigating 48 different database queries across three US states' worth of IT infrastructure, accessing 265 servers, and exfiltrating 147.9 million US residents' personal data including Social Security Numbers, driver's licence numbers, birth dates, and credit card numbers. The data was transmitted through an encrypted channel that bypassed network monitoring — itself blinded by an SSL certificate on the monitoring tool that had expired and not been renewed for 19 months.\n\nThe financial consequences exceeded US$700 million in FTC settlement, US$575 million in consumer restitution, additional state attorney general settlements, and approximately US$1.4 billion in total breach-related expenditure.\n\n<strong>Key lessons for digital wallet operators:</strong> (1) Patch critical CVEs within 72 hours of public disclosure — the 78-day window was the result of a patch management programme that scheduled but did not verify patch application. (2) Expired certificates are an operational risk, not a cosmetic issue — the 19-month-expired monitoring certificate was a governance failure that blinded detection. (3) Network segmentation dramatically limits blast radius — 48 database queries across 265 servers indicates almost no internal segmentation; isolation of the dispute portal from core credit data databases would have limited the breach scope dramatically.`,
    },
    {
      heading: 'Case Study 2 — Capital One (2019): The Permission Misconfiguration That Cost US$80 Million',
      body: `The Capital One breach of March–July 2019, publicly disclosed in July 2019, exposed the personal and financial data of approximately 106 million credit card applicants in the US and Canada. The technical root cause was a combination of two elements that together created a catastrophic vulnerability: an SSRF vulnerability in the Web Application Firewall (WAF) service deployed on AWS EC2, and an IAM role attached to that WAF instance with significantly more permissions than required.\n\nServer-Side Request Forgery (SSRF) allowed the attacker to induce the WAF server to request the AWS EC2 instance metadata service endpoint (169.254.169.254), which returned the temporary IAM credentials for the EC2 instance. Using those credentials, the attacker authenticated to AWS as the WAF's IAM role identity — an identity that had been granted ListBuckets and GetObject permissions across Capital One's entire AWS S3 environment. Over four months, the attacker extracted 700+ S3 bucket contents containing applicant personal data.\n\nThe OCC imposed a US$80 million civil money penalty specifically for the IAM role over-permissioning — not for the SSRF vulnerability itself, but for the cloud governance failure that allowed a WAF service account to access customer data it had no reason to touch. This enforcement decision establishes that regulators hold organisations liable not just for vulnerabilities they cannot reasonably prevent, but for security architecture decisions they make consciously.\n\n<strong>Key lessons:</strong> (1) Cloud IAM roles must be scoped to minimum necessary permissions — the Capital One WAF role needed no access to S3 customer data; that access should never have been granted. (2) SSRF attacks are enabled when metadata endpoints are reachable from application-layer components — AWS IMDSv2 mitigates this class; ensure all compute instances use it. (3) Security tools must themselves be subject to security architecture review — the WAF was the entry point.`,
    },
    {
      heading: 'Case Study 3 — Medibank (2022): No MFA Means No Defence',
      body: `The Medibank data breach of October 2022 is the largest personal data breach in Australian history. The breach exposed the personal and medical records of 9.7 million current and former customers, including names, dates of birth, Medicare numbers, phone numbers, email addresses, and medical claims data — procedures claimed, diagnoses, and prescription history.\n\nThe attack entry point was straightforwardly simple: stolen VPN credentials for a Medibank employee's account that lacked Multi-Factor Authentication. The ransomware group used these credentials to authenticate to Medibank's VPN without any secondary verification challenge, then conducted lateral movement to the customer database over approximately three weeks before exfiltrating 480,000+ patient claims records.\n\nMedibank's board made the decision — following government security advice — not to pay the ransom. The attackers responded by publishing batches of stolen customer data on dark web forums, specifically targeting customers with sensitive medical conditions to maximise harm. The data publication continued for months. Total remediation costs exceeded AUD$250 million in the first year. APRA's subsequent investigation identified multiple control failings beyond the MFA gap: inadequate supplier access controls, insufficient logging and monitoring to detect lateral movement, and board-level governance that had not treated cybersecurity as a material risk.\n\nThe Australian government subsequently introduced mandatory cybersecurity standards for critical infrastructure that include specific MFA requirements — a direct legislative consequence of the Medibank incident.\n\n<strong>Key lessons:</strong> (1) MFA on every remote access point is non-negotiable — the entire Medibank breach causal chain begins and ends with absent MFA on one employee VPN account. HKMA TM-E-1 requires MFA for all remote and privileged access. (2) SIEM with behavioural baselines would have flagged abnormal access patterns within hours, not weeks. (3) Ransomware extortion strategy must be defined in the IRP before an incident — the decision criteria, authority, and legal review process for ransom demands should be documented before the crisis, not during it.`,
    },
    {
      heading: 'Synthesising the Case Studies: Common Threads and the Universal Lesson',
      body: `Across three incidents spanning three countries, three sectors, and three distinct attack techniques, three common causal threads emerge with striking consistency.\n\n<strong>Thread 1 — A single exploitable gap in a known control area.</strong> Equifax failed to patch a publicly disclosed CVE for 78 days. Capital One granted an IAM role excessive permissions. Medibank had no MFA on VPN. In each case, a single, identifiable, fixable gap at a known risk point — patch management, access governance, authentication — served as the entire foundation of the breach. None required novel attack techniques. All three could have been prevented by executing known security fundamentals reliably.\n\n<strong>Thread 2 — Detection failure extended the damage exponentially.</strong> In all three cases, the gaps between compromise and detection were measured in months: 76 days at Equifax, four months at Capital One, three weeks at Medibank. Extended dwell time directly expanded the volume of data stolen and the regulatory and remediation cost. Early detection through SIEM and behavioural analytics would have dramatically reduced the impact of all three breaches.\n\n<strong>Thread 3 — Governance failures enabled technical failures.</strong> Post-incident investigations found not just technical vulnerabilities but governance processes that failed to identify and mitigate known risk: Equifax's patch management programme that scheduled but did not verify application; Capital One's cloud governance that had no IAM scope reviews; Medibank's board risk processes that had not classified MFA on remote access as a critical control. For Hong Kong digital wallet operators under HKMA supervision, this governance dimension is precisely what the CFI 2.0 framework and iCAST assessment programme are designed to evaluate.\n\nThe universal lesson: cybersecurity risk in financial services is primarily a management problem, not a technology problem. The technology to prevent all three breaches existed, was well understood, and was commercially available. The failures were failures of governance, process, and accountability — exactly what a well-designed training programme, a tested incident response plan, and board-level security culture address.`,
    },
  ],
}

const MODULE_TIPS: Record<number, string[]> = {
  1: [
    'Google your company name plus the words "data breach" to find out if you have been hit before',
    'Check your own email at haveibeenpwned.com to see if your data is already circulating online',
    'Ask your IT team today: "Do we have a written plan for what to do in the first hour of a breach?" If the answer is no, that is your next action',
    'Look at the PCPD website (pcpd.org.hk) to understand the 3-day mandatory breach reporting rule that now applies to your organisation',
  ],
  2: [
    'Never click a link in an unexpected email. Type the official address directly into your browser',
    'Turn on MFA (multi-factor authentication) for all work accounts today. It blocks over 99% of automated password attacks',
    'Ask your team: does everyone have a different password for every account? If not, a password manager like 1Password or Bitwarden fixes this for free',
    'Check that your organisation patches software within 30 days of a security update. Unpatched systems are the easiest entry point for attackers',
  ],
  3: [
    'Find out if your company holds data from EU citizens. If yes, GDPR applies to you even if you are based in Hong Kong',
    'Check whether your organisation has a valid PCI DSS certificate. If you process card payments without one, you face serious financial penalties',
    'Ask your compliance team when you last submitted a report under the HKMA Cyber Resilience Assessment Framework',
    'Read the PCPD guidance on mandatory breach notification so you know the exact steps before an incident happens',
  ],
  4: [
    'Enable MFA on every account your team uses today. This single step stops the majority of credential-based attacks',
    'Make sure your organisation encrypts sensitive data both in storage and during transfer. Ask your IT team to confirm this in writing',
    'Test your incident response plan with a tabletop exercise. Sit in a room, describe a breach scenario, and see what each person does. You will find the gaps',
    'Review who in your organisation has access to sensitive systems. Remove access for anyone who no longer needs it',
  ],
  5: [
    'Read the summary of the Equifax breach (2017) and ask yourself which of those mistakes your organisation could make today',
    'Check whether your organisation has done a penetration test in the last 12 months. If not, schedule one',
    'Look up the HKMA C-RAF framework and identify which of its 8 domains your organisation is weakest in',
    'Create a one-page incident response contact sheet and put it somewhere physical, not just digital, so it is accessible when systems are down',
  ],
}

export default function ModulePage() {
  const { id } = useParams()
  const num = parseInt(id ?? '1', 10)
  const mod = MODULES.find(m => m.number === num)
  const { token } = useAuth()
  const [slidesViewed, setSlidesViewed] = useState(false)
  const [mcqScore, setMcqScore] = useState<{ score: number; total: number } | null>(null)
  const [manuallyCompleted, setManuallyCompleted] = useState(false)
  const completedRef = useRef(false)
  const [videoUrl, setVideoUrl] = useState<string>('')

  useEffect(() => {
    if (!mod) return
    fetch(`/api/videos/module${mod.number}`)
      .then(r => r.json())
      .then(d => { if (d.url) setVideoUrl(d.url) })
      .catch(() => {})
  }, [mod])

  const markComplete = (slideDone: boolean, mcq: { score: number; total: number } | null) => {
    if (!mod || !token || completedRef.current) return
    if (!slideDone || !mcq) return
    completedRef.current = true
    setManuallyCompleted(true)
    fetch('/api/progress/module-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ module_id: mod.id, mcq_score: mcq.score, mcq_total: mcq.total }),
    }).catch(() => { /* silent */ })
  }

  const markCompleteManual = () => {
    if (!mod || !token) return
    completedRef.current = true
    setManuallyCompleted(true)
    fetch('/api/progress/module-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ module_id: mod.id, mcq_score: mcqScore?.score ?? null, mcq_total: mcqScore?.total ?? null }),
    }).catch(() => { /* silent */ })
  }

  if (!mod) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-white font-bold text-lg">Module not found</p>
          <Link to="/" className="btn-primary mt-4 inline-flex">Go Home</Link>
        </div>
      </div>
    )
  }

  const tips    = MODULE_TIPS[num] ?? MODULE_TIPS[1]
  const prevMod = MODULES.find(m => m.number === num - 1)
  const nextMod = MODULES.find(m => m.number === num + 1)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-black/30"
      >
        <img
          src={mod.heroImage}
          alt={mod.title}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
        <div className="hero-overlay absolute inset-0 p-8 flex flex-col justify-end">
          <div className="badge badge-blue mb-3 w-fit">
            {mod.icon} Module {mod.number} · {mod.duration}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{mod.title}</h1>
          <p className="text-slate-300 text-base max-w-xl">
            {mod.subtitle}
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            {mod.heroStats.map((s, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                <div className="text-xl font-black text-white leading-none">
                  <CountUp value={s.value} duration={1600} />
                </div>
                <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Learning objectives */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="section-title">Learning Objectives</h2>
        <p className="section-sub">What you will understand and be able to apply after this module</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {mod.objectives.map((obj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              className="flex items-start gap-2.5 p-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/30 cursor-default"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{obj}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Video section — above slide deck */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        className="mb-10"
      >
        <h2 className="section-title">Video Overview</h2>
        <p className="section-sub">Watch a curated video summary of this module</p>
        <div>
          <div
            className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center"
            style={{ aspectRatio: '16/9' }}
            id={`${mod.id}VideoWrap`}
          >
            {videoUrl ? (
              videoUrl.startsWith('/videos/') ? (
                <video
                  key={videoUrl}
                  controls
                  className="w-full h-full object-contain bg-black"
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  src={videoUrl.includes('youtube.com/watch') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl.includes('youtu.be/') ? videoUrl.replace('youtu.be/', 'www.youtube.com/embed/') : videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Module ${mod.number} video`}
                />
              )
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-500">
                <div className="text-3xl mb-2">🎬</div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-400">Module {mod.number} — {mod.title}</p>
                <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-500">Video coming soon</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Slide deck */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <h2 className="section-title">Slide Deck</h2>
        <p className="section-sub">Step through the key concepts at your own pace</p>
        <SlideViewer
          slides={mod.slides}
          color={mod.color}
          onAllSlidesViewed={() => {
            setSlidesViewed(true)
            markComplete(true, mcqScore)
          }}
        />
      </motion.section>

      {/* Deep Dive — detailed written explanations for every slide topic */}
      {(MODULE_DEEP_DIVE[num] ?? []).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="section-title">In-Depth Explanations</h2>
          <p className="section-sub">Detailed written coverage of every topic covered in the slide deck — read at your own pace</p>
          <div className="space-y-5 mt-4">
            {(MODULE_DEEP_DIVE[num] ?? []).map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-700/40 overflow-hidden shadow-sm"
              >
                <div className={`px-6 py-3 bg-gradient-to-r ${mod.color} flex items-center gap-3`}>
                  <span className="text-white/70 text-xs font-mono font-bold">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="text-white font-bold text-sm leading-snug">{item.heading}</h3>
                </div>
                <div className="px-6 py-5 bg-white dark:bg-slate-900/50 space-y-4">
                  {item.body.split('\n\n').map((para, pi) => (
                    <p
                      key={pi}
                      className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Key takeaways */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/60 dark:to-accent-900/30 border border-brand-200 dark:border-brand-700/30 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Key Takeaways</h2>
          <ul className="space-y-3">
            {mod.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-600 dark:bg-brand-700/50 text-white dark:text-brand-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Mini MCQ Quiz */}
      <ModuleMCQ
        questions={mod.mcqs}
        moduleTitle={mod.title}
        onComplete={(score, total) => {
          const result = { score, total }
          setMcqScore(result)
          markComplete(slidesViewed, result)
        }}
      />

      {/* Manual Mark as Completed */}
      {token && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 mb-2"
        >
          {manuallyCompleted ? (
            <div className="flex items-center gap-3 px-5 py-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
              <BadgeCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-emerald-300 font-semibold text-sm">Module marked as completed!</p>
                <p className="text-slate-500 text-xs mt-0.5">Your progress has been saved to your dashboard.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl">
              <div>
                <p className="text-white font-semibold text-sm">Finished with this module?</p>
                <p className="text-slate-400 text-xs mt-0.5">Mark it as completed to track your progress on the dashboard.</p>
              </div>
              <button
                onClick={markCompleteManual}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                <BadgeCheck className="w-4 h-4" /> Mark as Completed
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Tips */}
      <QuickTips tips={tips} />

      {/* Module navigation */}
      <div className="mt-12 flex items-center justify-between gap-4">
        {prevMod ? (
          <Link
            to={`/module/${prevMod.number}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left hidden sm:block">
              <div className="text-slate-500 dark:text-slate-400 text-xs">Previous</div>
              <div>Module {prevMod.number}: {prevMod.title}</div>
            </div>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all text-sm">
            <ChevronLeft className="w-4 h-4" /> Overview
          </Link>
        )}

        {nextMod ? (
          <Link
            to={`/module/${nextMod.number}`}
            className={clsx('flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all text-sm font-medium bg-gradient-to-r', nextMod.color)}
          >
            <div className="text-right hidden sm:block">
              <div className="text-white/70 text-xs">Next</div>
              <div>Module {nextMod.number}: {nextMod.title}</div>
            </div>
            <span className="sm:hidden">Next Module</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/quiz" className="btn-primary text-sm">
            🧠 Take Final Quiz <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
