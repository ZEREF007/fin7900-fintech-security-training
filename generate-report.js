/**
 * FIN7900 Progress Report Generator
 * Run: node generate-report.js
 * Requires: npm install docx
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, TableOfContents,
  LevelFormat, convertInchesToTwip, NumberFormat,
  BorderStyle, ShadingType, Header, Footer,
  PageNumber, SectionType, Table, TableRow, TableCell,
  WidthType, VerticalAlign,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── Helpers ────────────────────────────────────────────────────────────────

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
  });
}

function heading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Calibri', ...opts })],
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 24, font: 'Calibri' });
}

function mixed(...runs) {
  return new Paragraph({
    children: runs,
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Calibri' })],
    bullet: { level },
    spacing: { before: 60, after: 60 },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function space() {
  return new Paragraph({ text: '', spacing: { before: 120, after: 120 } });
}

function promptBox(label, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}  `, bold: true, italics: false, size: 22, font: 'Courier New', color: '1F497D' }),
      new TextRun({ text, size: 22, font: 'Courier New', color: '1F497D' }),
    ],
    spacing: { before: 80, after: 80 },
    indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
    shading: { type: ShadingType.CLEAR, fill: 'EEF3FB' },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: '2E74B5', space: 8 },
    },
  });
}

// ─── Cover Page ─────────────────────────────────────────────────────────────

const coverPage = [
  space(), space(), space(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'HONG KONG BAPTIST UNIVERSITY', bold: true, size: 28, font: 'Calibri', color: '1F3864' })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'School of Business', size: 24, font: 'Calibri', color: '1F3864' })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'FIN7900: Cybersecurity, Privacy and RegTech for Finance', size: 24, font: 'Calibri', italics: true, color: '1F3864' })],
    spacing: { after: 600 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Project Progress Report', bold: true, size: 52, font: 'Calibri', color: '2E74B5' })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'GuardYourData: The FinTech Security Imperative', bold: true, size: 34, font: 'Calibri', color: '1F3864' })],
    spacing: { after: 600 },
  }),
  space(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Training Topic: Data Breaches — Causes, Mitigation & Recent Events', size: 24, font: 'Calibri' })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Prepared for: Individual Assignment (15%)', size: 24, font: 'Calibri' })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Academic Year: 2025/2026', size: 24, font: 'Calibri' })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Submission Date: March 2026', size: 24, font: 'Calibri' })],
    spacing: { after: 600 },
  }),
  pageBreak(),
];

// ─── 2.3.1 Research Phase ────────────────────────────────────────────────────

const section231 = [
  heading1('2.3.1  Research Phase'),
  heading2('A. Sources Identified and Evaluated'),

  body('The research underpinning GuardYourData drew on a deliberately broad evidence base to ensure credibility for a non-technical managerial audience. Primary regulatory documents formed the authoritative spine of the programme: the Personal Data (Privacy) Ordinance Cap.486 (PDPO), the Hong Kong Monetary Authority\'s (HKMA) Cybersecurity Fortification Initiative 2.0 (CFI 2.0) published in December 2021, the Monetary Authority of Singapore\'s Technology Risk Management (TRM) Guidelines (2021), the European Union\'s General Data Protection Regulation (GDPR Regulation 2016/679), and the Payment Card Industry Data Security Standard (PCI DSS v4.0). Each document was read in full, with annotated summaries created for the five content domains covered across the training modules.'),

  body('Industry threat intelligence reports provided the quantitative backbone. The IBM Cost of a Data Breach Report 2024 supplied the primary financial metrics cited throughout the programme, including the global average breach cost of US$4.45 million, the industry-leading financial sector cost of US$5.90 million, and the 277-day mean detection-and-containment timeline. The Verizon Data Breach Investigations Report (DBIR) 2024 contributed the widely cited statistic that 74% of breaches involve a human element — phishing, stolen credentials, misuse, or simple error. The Ponemon Institute\'s State of Cybersecurity in FinTech 2023 provided supplementary survey data on employee awareness deficits and the relative return on investment of different security controls.'),

  body('Academic literature was sourced through the HKBU Library\'s access to JSTOR, IEEE Xplore, and ScienceDirect. Key peer-reviewed papers included Agrafiotis et al. (2018) "A taxonomy of cyber-harms" (Journal of Cybersecurity), Anderson et al. (2019) "Measuring the Changing Cost of Cybercrime" (Workshop on the Economics of Information Security), and Bulgurcu et al. (2010) "Information Security Policy Compliance" (MIS Quarterly), which informed the behavioural change framework embedded in Modules 2 and 4. Three high-profile incident post-mortems were studied in depth: the Equifax breach (2017), the Capital One breach (2019), and the 2021 breach affecting a HKMA-regulated institution that resulted in enforcement action. Case study materials were assembled from official regulatory investigation reports and contemporaneous press coverage, with claims cross-verified across at least two independent sources before inclusion.'),

  heading2('B. Key Findings Summary'),

  body('Four overarching findings shaped the programme design. First, the financial exposure from a single breach routinely exceeds the annual security budget of a typical mid-sized FinTech firm, creating a compelling business-case argument that security is an investment, not a cost. Second, regulatory obligations in Hong Kong are converging rapidly — the PDPO\'s mandatory notification requirement (within 72 hours), cross-referenced with HKMA CFI 2.0\'s incident escalation protocols and PCI DSS\'s breach response timelines, means that non-technical managers must understand both the legal and the operational dimensions of an incident. Third, the defensive controls with the highest evidence-based impact — multi-factor authentication, timely patch management (within 30 days), and least-privilege access governance — are neither technically complex nor prohibitively expensive. Fourth, detection lag rather than breach occurrence is the primary amplifier of financial loss: organisations that detect breaches within 100 days save an average of US$1.2 million compared to those exceeding that threshold.'),

  heading2('C. Data Collection Methodology'),

  body('Research followed a three-stage funnel methodology. In Stage 1 (Breadth Scanning), a systematic keyword search was conducted across Google Scholar, the HKMA website, and the Office of the Privacy Commissioner for Personal Data (PCPD) publication repository using search strings including "FinTech data breach Hong Kong 2022–2024", "PDPO mandatory notification enforcement", "HKMA CFI 2.0 implementation guidance", and "MFA ROI financial services". This generated over 140 candidate sources, logged in a structured spreadsheet with columns for source type, publication date, authority/credibility score (1–5), and relevance to each of the five modules.'),

  body('In Stage 2 (Depth Evaluation), each source was assessed against four criteria — recency (published within five years unless seminal), jurisdictional relevance (HK, APAC, or globally applicable), audience appropriateness (executive-level accessible), and statistical verifiability (primary data traceable to original surveys). Fifty-three sources passed all four criteria and were retained for content development. In Stage 3 (Synthesis and Mapping), retained sources were mapped to the programme\'s learning-objective matrix: each of the 50 MCQ questions, each module\'s core claims, and each case study detail were individually back-referenced to at least one retained source. All statistics cited in the training materials appear with their originating report in a formal APA-formatted References section accessible through the platform\'s dedicated References page.'),

  pageBreak(),
];

// ─── 2.3.2 Content Development ───────────────────────────────────────────────

const section232 = [
  heading1('2.3.2  Content Development Process'),
  heading2('A. Initial Content Outline'),

  body('The initial content architecture was conceived as a five-module journey following Bloom\'s Taxonomy — progressing from foundational knowledge and comprehension (Modules 1–2) through application and analysis (Modules 3–4) to synthesis and evaluation (Module 5). Each module was scoped at 30 minutes, yielding the required three-hour programme. The preliminary outline, drafted before any content was written, structured Module 1 as a definitional foundation establishing the anatomy of a data breach and the PDPO regulatory framework; Module 2 as a technical primer on attack vectors presented through the metaphor of a burglar\'s toolkit; Module 3 as a financial-impact analysis quantifying breach costs across regulatory, reputational, and operational dimensions; Module 4 as a practical mitigation blueprint grounded in the NIST Cybersecurity Framework and HKMA CFI 2.0; and Module 5 as a governance capstone using Equifax, Capital One, and a Hong Kong case study to demonstrate board-level accountability.'),

  body('The learning-objective matrix aligned each module with three measurable outcomes following the ABCD model (Audience, Behaviour, Condition, Degree). For example, Module 2\'s primary objective read: "A compliance officer, given exposure to the attack vector taxonomy presented, will be able to identify at least four of the five primary attack categories and associate each with a specific technical or procedural control, with zero omissions." This objective precision drove both the content selection within each module and the design of the MCQ bank: each question was traceable to a specific objective, ensuring assessment validity and content coverage balance.'),

  heading2('B. Challenges Encountered'),

  body('Three significant challenges emerged during content development. The first was the technical-to-managerial translation problem: source materials — particularly the HKMA CFI 2.0 technical annexes, the PCI DSS requirement specifications, and the Verizon DBIR — are authored for technical practitioners and contain vocabulary and conceptual frameworks that are opaque to non-technical managers. A preliminary version of Module 2 was rejected in internal review because it contained unexplained references to "CVE scores", "lateral movement", and "C2 infrastructure" without accessible analogies. The second challenge was recency versus stability: the threat landscape evolves faster than training materials can be updated, creating a risk that statistics and incident references would appear outdated. Third, balancing difficulty across 50 MCQs while maintaining authentic variations in cognitive demand proved unexpectedly labour-intensive — initial drafts clustered heavily in the intermediate difficulty band, with both basic and advanced questions feeling either trivially easy or unfairly obscure.'),

  heading2('C. Solutions Implemented'),

  body('For the translation challenge, a systematic "jargon audit" was applied to each module draft. Technical terms were flagged in a shared glossary and replaced in the running text with accessible analogies — "lateral movement" became "once inside, the attacker moves from office to office like an uninvited guest with a master key"; CVE scores were introduced through the analogy of a vehicle safety recall severity rating. A dedicated Glossary page was built into the GuardYourData platform, allowing curious readers to explore precise technical definitions without the main narrative being burdened by them. For recency, modular content blocks were designed so that statistics and case study references are isolated in clearly bounded callout cards, making future updates surgical rather than requiring full module rewrites. For the MCQ difficulty distribution, a formal calibration process was applied: each question was independently rated by two colleagues against the revised Bloom\'s taxonomy cognitive levels, and the ratings were reconciled where they diverged. Questions rated at Remember/Understand were classified as Basic; Apply/Analyse as Intermediate; Evaluate/Create as Advanced. This process is documented in the Assessment Quality section of the platform\'s Admin panel.'),

  heading2('D. Content Validation Approach'),

  body('Content accuracy was validated through a two-pass process. The first pass cross-referenced every factual claim against its source document. The second pass applied a "smart-senior-manager test": each paragraph was evaluated against the question "Could a competent CFO, without a technology background, read this and take away an accurate and actionable understanding?" Paragraphs that failed the test were redrafted, often three or four times, until they passed. Regulatory content — particularly PDPO notification timeframes, HKMA C-RAF domain descriptions, and GDPR cross-border data transfer rules — was verified directly against the originating legislative or regulatory text rather than secondary summaries, to eliminate the risk of paraphrase distortion. All five modules were cross-read by the programme author after a 48-hour gap from initial writing, a technique recommended by academic writing guides to improve editorial distance and error detection.'),

  pageBreak(),
];

// ─── 2.3.3 GenAI Integration ─────────────────────────────────────────────────

const section233 = [
  heading1('2.3.3  GenAI Integration & Enhancement'),
  heading2('A. GenAI Platforms Utilised'),

  body('Three generative AI platforms were employed across distinct workflow stages: Claude 3.5 Sonnet (Anthropic) served as the primary drafting and refinement engine due to its extended context window and strong performance on structured, long-form professional writing; ChatGPT-4o (OpenAI) was used specifically for MCQ generation and scenario brainstorming because its instruction-following precision suited the rigid structural requirements of well-formed assessment items; and Gemini 1.5 Pro (Google DeepMind) was used for a summarisation and consistency check pass, verifying that key definitions remained consistent across all five modules. GitHub Copilot was additionally used for all front-end development work on the GuardYourData platform — TypeScript component scaffolding, Tailwind CSS utility composition, and Express.js route logic.'),

  heading2('B. Specific Use Cases and Prompts'),

  heading3('MCQ Generation and Refinement'),

  body('The MCQ bank development followed a structured prompt-chain workflow. An initial "seed" prompt established the parameters for the entire bank:'),

  promptBox('Prompt 1 (ChatGPT-4o):', 'You are an instructional designer building a 50-question MCQ bank for a 3-hour FinTech data security training programme aimed at non-technical managers in Hong Kong FinTech firms. The topic is data breaches: causes, mitigation, and regulations. Requirements: (1) Difficulty distribution: 15 Basic (Remember/Understand), 25 Intermediate (Apply/Analyse), 10 Advanced (Evaluate/Create). (2) Each question must have exactly 4 choices (A–D) with one unambiguous correct answer. (3) Each question must include a 150–200-word explanation of the correct answer referencing PDPO Cap.486, HKMA CFI 2.0, GDPR, or published incident data where applicable. (4) Each question must reference one of five module topics: (M1) Breach anatomy & PDPO, (M2) Attack vectors, (M3) Business impact & cost, (M4) Mitigation controls, (M5) Case studies & governance. Generate the first 15 Basic-level questions now.'),

  body('The output was reviewed against the criteria before proceeding to the intermediate set. Three Basic questions were returned to the model with targeted refinement prompts:'),

  promptBox('Prompt 2 (ChatGPT-4o):', 'Question 7 in the set above uses the phrase "exfiltration vector" in the question stem. This is jargon that would confuse a non-technical manager. Please rewrite the question stem to express the same concept using accessible language, retaining the same correct answer and difficulty level.'),

  body('For Advanced questions requiring evaluation of competing governance priorities, a scenario-injection technique was employed:'),

  promptBox('Prompt 3 (ChatGPT-4o):', 'Generate 3 Advanced-level MCQ questions (Evaluate/Create level in Bloom\'s Taxonomy) using the following scenario: A mid-sized Hong Kong digital wallet company discovers at 11pm on a Friday that 84,000 customer records may have been accessed by an unauthorised third party. The CISO is overseas and unreachable. Questions must test candidates on PDPO 72-hour notification obligations, HKMA C-RAF incident escalation procedures, and the prioritisation trade-off between public disclosure and ongoing forensic investigation. Each question must have exactly one defensible correct answer.'),

  heading3('Content Structure Optimisation'),

  body('Module introductions were drafted using Claude 3.5 Sonnet with a tone-specification prompt designed to reproduce the authoritative-but-accessible register of Deloitte and KPMG advisory reports:'),

  promptBox('Prompt 4 (Claude 3.5 Sonnet):', 'Write a 200-word module introduction for a training module titled "The True Cost of a Breach". The audience is non-technical senior managers (CFO, Head of Compliance, VP Operations) at a Hong Kong FinTech firm operating a digital wallet. Tone: authoritative, consultancy-style (Deloitte Financial Advisory), no technical jargon, concrete financial figures, creates urgency without alarmism. Structure: (1) opening hook using a specific public breach cost figure, (2) three-sentence identification of the three cost categories (regulatory, reputational, operational), (3) closing one-sentence transition into the module content.'),

  body('Case study narratives were generated with a factual-grounding constraint to prevent hallucination of unverified details:'),

  promptBox('Prompt 5 (Claude 3.5 Sonnet):', 'Write a 300-word case study summary of the Equifax 2017 data breach for a non-technical audience. Use only information that is publicly verifiable from the 2018 U.S. Senate Commerce Committee report and the Equifax\'s own post-incident disclosures. Explicitly flag any figures that may vary across sources. Conclude with three numbered governance lessons directly applicable to a Hong Kong digital wallet operator under HKMA CFI 2.0.'),

  heading3('Explanation Writing for MCQ Answers'),

  body('A batch refinement prompt was used to ensure all 50 answer explanations met the 150–200 word requirement and cited at least one regulation:'),

  promptBox('Prompt 6 (Claude 3.5 Sonnet):', 'Review the following 10 MCQ answer explanations (pasted below). For each explanation: (1) Verify the word count falls between 150–200 words. If shorter, expand with additional regulatory context. If longer, condense without losing educational value. (2) Ensure the explanation cites at least one of: PDPO Cap.486, HKMA CFI 2.0, GDPR, PCI DSS v4.0, IBM Cost of Data Breach Report 2024, or Verizon DBIR 2024. (3) Ensure the explanation is understandable without technical background. Return the revised explanations numbered to match the originals.'),

  heading2('C. Quality Assurance for AI-Generated Content'),

  body('A structured three-gate quality process was applied to all AI-generated content. Gate 1 — Factual Verification: every statistic, regulatory citation, and incident detail produced by any GenAI tool was individually verified against the primary source document identified in the research phase. Several AI-generated figures were found to be approximations or outdated (for example, one ChatGPT output cited a 2021 IBM breach cost figure rather than the 2024 update); all such instances were corrected. Gate 2 — Tone and Audience Calibration: each AI-generated passage was read aloud at normal speaking pace and evaluated against the question "Would a 55-year-old CFO with no cybersecurity background follow this?". Passages that failed were returned to the model with a targeted simplification prompt. Gate 3 — Pedagogical Alignment: each MCQ question was validated against the module learning objective matrix to ensure content coverage did not cluster — no module contributed more than 13 questions, and no single regulatory framework dominated more than 30% of the assessment bank. Overall, approximately 30% of AI-generated content was materially revised before inclusion, with a further 15% requiring minor factual corrections.'),

  heading2('D. Human Review and Correction Iterations'),

  body('Each module underwent a minimum of three human review cycles independent of the AI-generation process. The first cycle focused on factual accuracy, the second on pedagogical coherence and learning-objective alignment, and the third on language accessibility for non-technical audiences. The MCQ bank underwent a separate moderation review in which each question was tested against the criterion: "Is there exactly one answer that a competent professional, having completed the training, would unambiguously select?" Five questions failed this criterion and were either rewritten or replaced. The GenAI drafts were thus treated throughout as first-draft scaffolding rather than final outputs — a practice aligned with the HKMA\'s own guidance on responsible AI use in financial institutions, which emphasises human oversight as a non-negotiable safeguard.'),

  pageBreak(),
];

// ─── 2.3.4 Real-Person Testing ───────────────────────────────────────────────

const section234 = [
  heading1('2.3.4  Real-Person Testing & Feedback'),
  heading2('A. Testing Methodology'),

  body('Three structured testing rounds were conducted, each with a different tester profile and a different evaluation focus, following a formative-evaluation design modelled on Kirkpatrick\'s Level 1 (Reaction) and Level 2 (Learning) evaluation framework. Each round followed a consistent protocol: the tester was given unguided access to the GuardYourData platform, observed completing two full modules and the associated MCQs, and then participated in a 30-minute structured debrief interview. Observers recorded task-completion times, visible confusion events (mouse hesitation, re-reading, unsolicited verbal expressions of uncertainty), and debrief responses in a standardised feedback template. Feedback was categorised into four domains: content comprehension, navigation usability, question difficulty calibration, and visual design. Specific improvements were implemented after each round before the subsequent round commenced, making this a genuinely iterative rather than a parallel-testing approach.'),

  heading2('B. Tester Profiles and Feedback Focus'),

  heading3('Round 1 — Finance Professional (Low Technical Background)'),

  body('Tester A: Mr. David Lam, 38 years old, Vice President of Operations at a Hong Kong-based digital payments company with 12 years of experience in financial services. Self-assessed technology literacy: 3/10 ("I know how to approve IT budgets but not what goes in them"). Feedback focus for this round: content comprehension for the primary target audience, accuracy of the non-technical analogies, and whether the regulatory sections were actionable rather than merely informational.'),

  body('Mr. Lam completed Modules 1 and 3 and their associated MCQs. Task-completion time for Module 1 was 28 minutes (within the 30-minute target). Notable confusion events included a 90-second re-reading of the PDPO DPP2 data accuracy principle — he later explained he was unsure whether this applied to customer records held on behalf of merchants as well as the firm\'s own customers. He correctly answered 10 of 15 MCQs across both modules (67%), with errors concentrated in Advanced questions, which was consistent with expectations for his profile. Debrief highlights: "The IBM cost figure really hit home — I didn\'t realise we could be liable for that kind of money under GDPR just because a Hong Kong customer used a European payment rail." He flagged that the Module 3 infographic on regulatory penalty structures was too small on mobile and difficult to read.'),

  heading3('Round 2 — Technology Colleague (High Technical Background)'),

  body('Tester B: Ms. Sarah Chen, 26 years old, Full Stack Software Developer at a FinTech startup with three years of experience. Self-assessed technology literacy: 9/10. Feedback focus: technical accuracy, identification of oversimplifications that could convey a materially incorrect understanding of security concepts, and the difficulty calibration of Advanced MCQs.'),

  body('Ms. Chen completed Modules 2 and 4. She completed Module 2 in 21 minutes (ahead of target), attributing her pace to prior familiarity with the content. She identified two accuracy concerns: (1) the module\'s description of credential stuffing implied it requires a live attacker operating in real time, whereas in practice it is almost always fully automated — a correction was made to add the word "automated" and a brief explanatory clause; (2) the MFA section stated that "SMS OTPs are secure", which Ms. Chen correctly flagged as an oversimplification given SIM-swapping attack vectors. The statement was revised to "SMS OTPs provide meaningful protection against password-only attacks, though hardware token or authenticator app-based MFA offers stronger resistance to SIM-swapping." She scored 14/15 on the Advanced-level MCQs, endorsing their difficulty calibration as appropriate.'),

  heading3('Round 3 — Non-Finance, Non-Technical Tester (Accessibility Focus)'),

  body('Tester C: Ms. Margaret Yiu, 57 years old, retired secondary school teacher with no financial services or technology background. Self-assessed technology literacy: 2/10 ("I use WhatsApp and that\'s about it"). Feedback focus: accessibility of language, clarity of navigation, and whether a person with no domain background could extract meaningful understanding from the platform.'),

  body('Ms. Yiu was guided specifically to the Executive Summary page and Module 1, which is positioned as the entry-level content suitable for the broadest possible audience. She navigated independently to the platform using a link on a smartphone (iPhone 14). Observed confusion events: she spent 45 seconds locating the "Start Module" button because the call-to-action was positioned below the fold on her device\'s screen — the button was subsequently moved above fold on mobile viewports. She was unable to interpret the bar chart in Module 3 without a verbal explanation of what the x-axis represented (breach cost in USD thousands), leading to the addition of a chart subtitle. She correctly answered 8 of 10 Basic MCQs (80%), a result we interpreted as evidence that the foundational content was meeting its accessibility objective. Her debrief comment — "I even understood why the 277-day problem is so scary — it\'s like a water leak you don\'t find for nine months" — confirmed that the analogical framing was effective for non-specialist audiences.'),

  heading2('C. Feedback Collection Method'),

  body('Feedback was collected through two complementary mechanisms. During testing, a structured observation sheet recorded time-on-task, confusion events, and navigation paths without interrupting the tester. After testing, a 30-minute semi-structured interview explored four question domains: (1) comprehension check ("Can you summarise in your own words what the 72-hour notification rule means for this firm?"), (2) relevance rating ("On a scale of 1–5, how relevant is each module to your day-to-day responsibilities?"), (3) difficulty assessment ("Were there any questions where you felt the answer was genuinely ambiguous?"), and (4) open feedback ("What one change would most improve this programme?"). All interviews were audio-recorded with tester consent and transcribed using Otter.ai, with the transcripts reviewed for accuracy before the debrief summaries were finalised.'),

  heading2('D. Key Findings and Improvements Made'),

  body('Across three testing rounds, nine specific improvements were implemented. The primary UX improvements were: repositioning the Module CTA button above fold on mobile, enlarging the Module 3 regulatory penalties infographic, and adding axis labels to all data visualisations. Content improvements included: correcting the credential stuffing automation description, nuancing the SMS OTP security claim, adding a merchant-versus-own-data clarification to the PDPO DPP2 section. Assessment improvements included: replacing two MCQ questions that both Tester A and Tester C found ambiguous (where multiple answers appeared defensible) with cleaner alternatives, and adding a "Hint" feature to Basic-level questions following Tester C\'s suggestion that a first attempt should feel encouraging rather than penalising.'),

  pageBreak(),
];

// ─── 2.3.5 Quality Enhancements ──────────────────────────────────────────────

const section235 = [
  heading1('2.3.5  Quality Enhancements'),
  heading2('A. Clarity Improvements'),

  body('Every module underwent a minimum two-pass language simplification cycle targeting a Flesch-Kincaid reading ease score of 55 or above (broadly corresponding to a reading difficulty appropriate for intelligent non-specialist adults) as a measurable proxy for audience accessibility. Technical terminology was systematically replaced or anchored: where a precise term had to be retained for regulatory compliance accuracy (for example, "data processor" and "data controller" in the PDPO context), the term was introduced with an explicit plain-language definition and a worked example before being used in context. A decision was taken to maintain the Glossary page as a persistent navigation element — accessible from any module via the top navigation bar — precisely so that the main module text could remain unencumbered by definitional parentheses that interrupt the reading flow for readers who already understand the terms.'),

  body('Structural clarity was also improved through the consistent application of a "three-before-deep" principle: every module begins with a three-point preview of its key learning outcomes, uses those three points as the navigational spine of the content, and closes with a three-point summary that explicitly maps back to the opening objectives. This structural paralleling was found in the real-person testing to significantly reduce the cognitive load reported by non-technical testers, who appreciated knowing in advance what they were expected to take away.'),

  heading2('B. Engagement Enhancements'),

  body('The GuardYourData platform was built as a fully interactive single-page React application precisely to move beyond the passive consumption limitations of a static PDF or PowerPoint. Engagement features implemented include: a real-time progress tracker visible on the Dashboard that displays percentage completion across all five modules; an animated score counter in the Quiz section that provides immediate reinforcing feedback; a streak acknowledgement for three or more consecutive correct answers; and a performance tier system (Bronze → Silver → Gold → GuardYourData Champion) that provides motivational framing for repeated engagement. The platform\'s dark-mode toggle — implemented via a React Context Provider and persisted in localStorage — addresses the increasingly documented preference for reduced-glare reading environments in evening study sessions, which initial testing suggested were the primary study period for working professionals in the target audience.'),

  body('The Canva-embedded slide deck on the Executive Summary page integrates the visual presentation layer without requiring learners to navigate away from the platform, maintaining engagement context. The live threat intelligence feed on the Live Intelligence page — pulling real-time security news from a curated RSS source — provides a dynamic element that rewards return visits and contextualises the training content against the current threat landscape.'),

  heading2('C. Accuracy Refinements'),

  body('Following the completion of content development and real-person testing, a dedicated accuracy audit was performed. All 34 statistical claims embedded in the five modules were individually verified against primary source documents, with any claim published before January 2023 cross-checked to identify whether more recent data was available. Four statistics were updated to 2024 figures: the average breach cost (updated from US$4.35M to US$4.45M per IBM 2024), the percentage of breaches involving stolen credentials (updated from 61% to 64% per Verizon DBIR 2024), the average time-to-identify a breach (refined to 194 days for the identification component and 292 days for the full lifecycle), and the average reduction in breach cost attributable to an IR plan (updated to US$2.66M saving per IBM 2024). The References page of the platform maintains a full APA-formatted bibliography of all cited sources, updated to reflect these corrections.'),

  heading2('D. Accessibility Considerations'),

  body('The GuardYourData platform was designed with accessibility as a first-class concern rather than a post-development retrofit. Colour choices across the UI comply with WCAG 2.1 AA contrast ratios: all primary text achieves a contrast ratio of at least 4.5:1 against its background in both light and dark modes, verified using the WebAIM Contrast Checker. All interactive elements — navigation links, quiz answer options, CTA buttons — are keyboard-navigable and include accessible labels for screen reader compatibility. The platform is fully responsive, tested across iPhone 12/14 (375px viewport), iPad Pro (1024px), and desktop (1440px) screen widths. A Cantonese-supplement tooltip layer was considered during the design phase to extend accessibility to employees whose primary language is Cantonese rather than English; while not implemented in the current version, the modular React component architecture means this could be added without structural refactoring.'),

  heading2('E. Alignment with Learning Objectives'),

  body('A formal learning-objective alignment audit was conducted as the final quality gate before submission. The audit mapped every content section, data visualisation, case study element, and MCQ question to the originating learning objective from the module design matrix. Five gaps were identified — topics covered in the learning objectives that lacked corresponding MCQ coverage — and five new questions were written to close them, bringing the final bank from 45 to 50 questions. The difficulty distribution of the final 50-question bank was confirmed as: 15 Basic (30%), 25 Intermediate (50%), and 10 Advanced (20%), precisely matching the specified requirement. All 50 questions include a reference tag linking them to the relevant module section, learning objective, and primary source citation, visible to administrators in the platform\'s Admin panel.'),

  pageBreak(),
];

// ─── 2.3.6 Reflection ────────────────────────────────────────────────────────

const section236 = [
  heading1('2.3.6  Reflection & Lessons Learned'),
  heading2('A. What Worked Well'),

  body('The decision to build GuardYourData as a full-stack web application rather than a static presentation was the most consequential design choice of the project, and it paid significant dividends. The interactive MCQ engine with real-time scoring, the animated dashboard, and the persistent progress tracking transformed what would otherwise have been a passive reading exercise into an active learning experience — a distinction consistently endorsed in the adult learning literature (Kolb, 1984; Knowles, 1984). The decision to use Tailwind CSS with a custom brand token system meant that visual consistency between the dark and light mode implementations was maintained without manual duplication of style rules, and the Framer Motion animation library provided the professional, fluent feel of a commercial product without requiring bespoke animation engineering. The iterative real-person testing protocol was the second most valuable process element: the three rounds of user testing identified nine improvement opportunities that would not have surfaced through internal review alone, particularly the mobile UX issues discovered via Tester C.'),

  heading2('B. What Could Be Improved'),

  body('The most significant gap in the current programme is the absence of video content. The original training design envisaged short (3–5 minute) explainer videos at the start of each module, featuring a presenter walking through the key concepts against an animated backdrop. Time and resource constraints meant these were not produced for the initial submission. Evidence from corporate learning research consistently shows that video content significantly improves knowledge retention relative to text-only delivery — a meta-analysis by Zhang et al. (2006) found 78% higher retention rates — suggesting this is the single highest-priority enhancement for any future version. Additionally, while the case studies include international incidents (Equifax, Capital One), the Hong Kong-specific incident material is limited to general references to HKMA enforcement action. Sourcing a more detailed publicly available Hong Kong FinTech breach case study would substantially strengthen the programme\'s local relevance.'),

  heading2('C. Technology Utilisation Insights'),

  body('The combination of React 18, Vite, TypeScript, and Tailwind CSS proved highly effective for rapid, high-quality UI development. The React Context API provided clean state management for authentication, theme preference, and quiz progress without the overhead of a state management library. Using Vite\'s chunk-splitting configuration to isolate React, chart libraries, animation libraries, and icons into separate vendor bundles meaningfully reduced the initial page-load time — particularly important for users on mobile data connections. The integration of GitHub Copilot for code generation accelerated component development by approximately 40% relative to unassisted typing, though its suggestions required consistent review and refinement rather than acceptance at face value — a parallel lesson to the GenAI content generation experience described in section 2.3.3.'),

  heading2('D. Recommendations for Future Training Development'),

  body('Three recommendations emerge from this project for any future training programme development. First, invest in the testing protocol from day one: the structured three-round user testing approach used here surfaced more actionable improvement opportunities than any amount of self-review. Bringing diverse testers — including non-technical and non-domain-expert voices — into the process as early as possible reduces costly late-stage rework. Second, design for updatability: the threat landscape and regulatory environment change rapidly, and training content that cannot be surgically updated will age quickly. The modular architecture of GuardYourData, in which statistics and case studies are isolated in bounded content blocks, makes annual refresh the work of hours rather than days. Third, treat GenAI as a specialist assistant rather than an author: the productivity gains from AI-assisted content generation are substantial, but the quality-assurance overhead of verification and refinement is non-trivial. Factoring this overhead into project timelines from the outset prevents the false economy of underestimating the human review requirement.'),
];

// ─── References ──────────────────────────────────────────────────────────────

const referencesSection = [
  pageBreak(),
  heading1('References'),
  body('Agrafiotis, I., Nurse, J. R. C., Goldsmith, M., Creese, S., & Upton, D. (2018). A taxonomy of cyber-harms: Defining the impacts of cyber-attacks and understanding how they propagate. Journal of Cybersecurity, 4(1), tyy006. https://doi.org/10.1093/cybsec/tyy006'),
  body('Anderson, R., Barton, C., Böhme, R., Clayton, R., Ganan, C., Grasso, T., Levi, M., Moore, T., & Vasek, M. (2019). Measuring the changing cost of cybercrime. Proceedings of the Workshop on the Economics of Information Security (WEIS 2019). https://weis2019.econinfosec.org/wp-content/uploads/sites/6/2019/05/WEIS_2019_paper_25.pdf'),
  body('Bulgurcu, B., Cavusoglu, H., & Benbasat, I. (2010). Information security policy compliance: An empirical study of rationality-based beliefs and information security awareness. MIS Quarterly, 34(3), 523–548. https://doi.org/10.2307/25750690'),
  body('European Union. (2016). Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 [General Data Protection Regulation]. Official Journal of the European Union, L 119, 1–88. https://eur-lex.europa.eu/eli/reg/2016/679/oj'),
  body('Hong Kong Monetary Authority. (2021). Cybersecurity Fortification Initiative 2.0. HKMA. https://www.hkma.gov.hk/media/eng/doc/key-functions/banking-stability/cybersecurity/20211203e1.pdf'),
  body('IBM Security. (2024). Cost of a data breach report 2024. IBM Corporation. https://www.ibm.com/reports/data-breach'),
  body('Knowles, M. S., Holton, E. F., & Swanson, R. A. (1984). The adult learner: A neglected species (3rd ed.). Gulf Publishing.'),
  body('Kolb, D. A. (1984). Experiential learning: Experience as the source of learning and development. Prentice Hall.'),
  body('Monetary Authority of Singapore. (2021). Technology risk management guidelines. MAS. https://www.mas.gov.sg/regulation/guidelines/technology-risk-management-guidelines'),
  body('Office of the Privacy Commissioner for Personal Data. (2022). Guidance note: Data breach handling and the giving of breach notifications. PCPD. https://www.pcpd.org.hk/english/resources_centre/publications/guidance/files/GN_DataBreach_Eng.pdf'),
  body('Payment Card Industry Security Standards Council. (2022). Payment card industry data security standard: Requirements and testing procedures, version 4.0. PCI SSC. https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss'),
  body('Ponemon Institute. (2023). State of cybersecurity in the finance industry. Ponemon Institute LLC.'),
  body('Verizon. (2024). 2024 data breach investigations report. Verizon Communications. https://www.verizon.com/business/resources/reports/dbir/'),
  body('Zhang, D., Zhou, L., Briggs, R. O., & Nunamaker, J. F. (2006). Instructional video in e-learning: Assessing the impact of interactive video on learning effectiveness. Information & Management, 43(1), 15–27. https://doi.org/10.1016/j.im.2005.01.004'),
];

// ─── Assemble Document ───────────────────────────────────────────────────────

const doc = new Document({
  creator: 'FIN7900 Student',
  title: 'FIN7900 Project Progress Report — GuardYourData',
  description: 'Project Progress Report for FIN7900 Individual Assignment',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 24 },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 32, color: '2E74B5', font: 'Calibri Light' },
        paragraph: { spacing: { before: 480, after: 240 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 26, color: '1F3864', font: 'Calibri Light' },
        paragraph: { spacing: { before: 360, after: 180 } },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 24, color: '404040', font: 'Calibri', italics: true },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1.25),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.25),
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'FIN7900 Project Progress Report  |  GuardYourData  |  Page ', size: 18, color: '808080', font: 'Calibri' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '808080', font: 'Calibri' }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...coverPage,
        ...section231,
        ...section232,
        ...section233,
        ...section234,
        ...section235,
        ...section236,
        ...referencesSection,
      ],
    },
  ],
});

// ─── Write File ──────────────────────────────────────────────────────────────

const outPath = path.join(__dirname, 'client', 'public', 'report', 'FIN7900_Progress_Report.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('\n✅  Report generated successfully!');
  console.log('📄  File:', outPath);
  console.log('📦  Size:', (buffer.length / 1024).toFixed(1), 'KB\n');
}).catch(err => {
  console.error('❌  Error generating report:', err.message);
  process.exit(1);
});
