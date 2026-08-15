import type {
  Investigation,
  Claim,
  EvidenceItem,
  ResearchBrief,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// DEMO DATA — clearly labeled. Not real research findings.
// These are synthetic placeholders for UI development only.
// ─────────────────────────────────────────────────────────────

const demoClaims: Claim[] = [
  {
    id: "claim-1",
    text: "Remote work maintains or improves individual productivity for knowledge workers.",
    evidenceCount: 4,
    supportingCount: 2,
    contradictingCount: 1,
    mixedCount: 1,
    confidence: "moderate",
  },
  {
    id: "claim-2",
    text: "Remote work negatively impacts team collaboration and innovation.",
    evidenceCount: 3,
    supportingCount: 1,
    contradictingCount: 1,
    mixedCount: 1,
    confidence: "low",
  },
  {
    id: "claim-3",
    text: "Hybrid models offer a balance that outperforms fully-remote or fully-in-office arrangements.",
    evidenceCount: 2,
    supportingCount: 1,
    contradictingCount: 0,
    mixedCount: 1,
    confidence: "moderate",
  },
];

const demoEvidence: EvidenceItem[] = [
  {
    id: "ev-1",
    claimId: "claim-1",
    title: "Productivity effects of remote work before and during COVID-19",
    source: {
      id: "src-1",
      title: "Productivity effects of remote work before and during COVID-19",
      authors: ["Choudhury, A.", "Foroughi, C.", "Larson, B."],
      publication: "Journal of Applied Economics",
      date: "2024-03-15",
      url: "#demo-source-1",
      type: "peer-reviewed",
    },
    excerpt:
      "We find that remote workers were, on average, 13% more productive than their in-office counterparts during the study period, though variance increased significantly.",
    summary:
      "Controlled study of 5,000 knowledge workers showing a 13% average productivity increase for remote workers, with notable variance across roles and seniority levels.",
    stance: "supporting",
    confidence: "high",
    relevanceScore: 0.92,
    publicationDate: "2024-03-15",
  },
  {
    id: "ev-2",
    claimId: "claim-1",
    title: "Measuring productivity in remote software engineering teams",
    source: {
      id: "src-2",
      title: "Measuring productivity in remote software engineering teams",
      authors: ["Bao, L.", "Xing, Z.", "Xia, Y."],
      publication: "ICSE Proceedings",
      date: "2023-06-01",
      url: "#demo-source-2",
      type: "peer-reviewed",
    },
    excerpt:
      "Analysis of commit data from 12,000 developers showed no statistically significant difference in output between remote and on-site developers.",
    summary:
      "Large-scale analysis of developer commit data finding no significant output difference between remote and on-site developers.",
    stance: "supporting",
    confidence: "moderate",
    relevanceScore: 0.78,
    publicationDate: "2023-06-01",
  },
  {
    id: "ev-3",
    claimId: "claim-1",
    title: "The productivity pitfalls of remote work: Evidence from a natural experiment",
    source: {
      id: "src-3",
      title: "The productivity pitfalls of remote work: Evidence from a natural experiment",
      authors: ["Gibbs, M.", "Lei, M.", "Mengel, F."],
      publication: "NBER Working Paper Series",
      date: "2023-01-20",
      url: "#demo-source-3",
      type: "working-paper",
    },
    excerpt:
      "Our results indicate a 6–10% productivity decrease for remote workers, primarily driven by increased communication costs and slower coordination.",
    summary:
      "Natural experiment finding a 6–10% productivity decrease for remote workers, attributed to communication and coordination overhead.",
    stance: "contradicting",
    confidence: "moderate",
    relevanceScore: 0.85,
    publicationDate: "2023-01-20",
  },
  {
    id: "ev-4",
    claimId: "claim-1",
    title: "Remote work and employee productivity: A meta-analytic review",
    source: {
      id: "src-4",
      title: "Remote work and employee productivity: A meta-analytic review",
      authors: ["Zhang, Y.", "Hartog, D.", "Bakker, A."],
      publication: "Journal of Organizational Psychology",
      date: "2024-08-10",
      url: "#demo-source-4",
      type: "meta-analysis",
    },
    excerpt:
      "Across 47 studies, the overall effect size was positive but small (d = 0.15), with substantial heterogeneity moderated by task interdependence and organizational support.",
    summary:
      "Meta-analysis of 47 studies showing a small positive effect (d = 0.15) with high heterogeneity, moderated by task interdependence and organizational support.",
    stance: "mixed",
    confidence: "high",
    relevanceScore: 0.88,
    publicationDate: "2024-08-10",
  },
  {
    id: "ev-5",
    claimId: "claim-2",
    title: "Effects of remote work on collaboration among information workers",
    source: {
      id: "src-5",
      title: "Effects of remote work on collaboration among information workers",
      authors: ["Yang, L.", "Holtz, D.", "Jaffe, S.", "Suri, S."],
      publication: "Nature Human Behaviour",
      date: "2022-09-12",
      url: "#demo-source-5",
      type: "peer-reviewed",
    },
    excerpt:
      "We find that the shift to remote work caused a decrease in cross-group collaboration, as measured by network ties, and an increase in siloed communication.",
    summary:
      "Analysis of 61,000 Microsoft employees showing decreased cross-group collaboration and increased siloed communication after the shift to remote work.",
    stance: "supporting",
    confidence: "high",
    relevanceScore: 0.90,
    publicationDate: "2022-09-12",
  },
  {
    id: "ev-6",
    claimId: "claim-2",
    title: "Innovation in distributed teams: The role of synchronous interaction",
    source: {
      id: "src-6",
      title: "Innovation in distributed teams: The role of synchronous interaction",
      authors: ["Martinez, S.", "Chen, R."],
      publication: "Organization Science",
      date: "2023-11-05",
      url: "#demo-source-6",
      type: "peer-reviewed",
    },
    excerpt:
      "Teams with structured synchronous interaction protocols showed no significant innovation deficit compared to co-located teams.",
    summary:
      "Study of 120 distributed teams finding that structured synchronous interaction protocols can mitigate innovation deficits.",
    stance: "contradicting",
    confidence: "moderate",
    relevanceScore: 0.72,
    publicationDate: "2023-11-05",
  },
  {
    id: "ev-7",
    claimId: "claim-2",
    title: "Collaboration networks and team creativity in hybrid work environments",
    source: {
      id: "src-7",
      title: "Collaboration networks and team creativity in hybrid work environments",
      authors: ["Kumar, P.", "Otero, M."],
      publication: "Academy of Management Proceedings",
      date: "2024-01-30",
      url: "#demo-source-7",
      type: "preprint",
    },
    excerpt:
      "Results were mixed: hybrid teams with 2–3 in-office days maintained creative output, while fully remote teams showed declines in divergent thinking tasks.",
    summary:
      "Study of 85 teams showing mixed results — hybrid arrangements maintained creative output while fully remote teams declined in divergent thinking.",
    stance: "mixed",
    confidence: "low",
    relevanceScore: 0.68,
    publicationDate: "2024-01-30",
  },
  {
    id: "ev-8",
    claimId: "claim-3",
    title: "Hybrid work arrangements and employee outcomes: Evidence from a randomized trial",
    source: {
      id: "src-8",
      title: "Hybrid work arrangements and employee outcomes: Evidence from a randomized trial",
      authors: ["Bloom, N.", "Han, R.", "Liang, J."],
      publication: "Nature",
      date: "2024-06-26",
      url: "#demo-source-8",
      type: "peer-reviewed",
    },
    excerpt:
      "Employees assigned to hybrid work (2 days remote) reported equivalent or higher satisfaction and showed no productivity loss compared to full-time office workers.",
    summary:
      "Randomized controlled trial of 1,612 employees finding hybrid work (2 remote days) produced equivalent productivity and higher satisfaction.",
    stance: "supporting",
    confidence: "high",
    relevanceScore: 0.95,
    publicationDate: "2024-06-26",
  },
  {
    id: "ev-9",
    claimId: "claim-3",
    title: "Comparing engagement and output across work models in knowledge industries",
    source: {
      id: "src-9",
      title: "Comparing engagement and output across work models in knowledge industries",
      authors: ["Thompson, E.", "Reyes, A."],
      publication: "Work and Occupations",
      date: "2023-12-15",
      url: "#demo-source-9",
      type: "report",
    },
    excerpt:
      "Hybrid models showed higher engagement scores but inconsistent output measures across the three organizations studied, limiting generalizability.",
    summary:
      "Three-organization comparison showing higher engagement for hybrid models but inconsistent output measures, limiting generalizability.",
    stance: "mixed",
    confidence: "low",
    relevanceScore: 0.65,
    publicationDate: "2023-12-15",
  },
];

const demoBrief: ResearchBrief = {
  executiveFinding:
    "The evidence suggests that remote work can maintain or modestly improve individual productivity for knowledge workers, but it may reduce cross-group collaboration and innovation. Hybrid models (2–3 in-office days) appear to offer the best balance, supported by the strongest evidence. However, substantial heterogeneity across studies and contexts limits confidence in these findings.",
  strongestSupportingEvidenceId: "ev-8",
  strongestContradictingEvidenceId: "ev-3",
  uncertainties: [
    "Most studies focus on knowledge workers in technology and finance; findings may not generalize to other industries.",
    "The definition and measurement of 'productivity' varies significantly across studies, making direct comparison difficult.",
    "Long-term effects (>3 years) of remote and hybrid work remain understudied.",
    "Organizational support and culture may moderate effects but are inconsistently controlled for.",
  ],
  limitations: [
    "This brief is based on a non-exhaustive selection of evidence and should not be treated as a systematic review.",
    "Publication bias toward positive findings may inflate the apparent productivity benefits.",
    "Several included studies rely on self-reported productivity measures.",
  ],
  openQuestions: [
    "How do remote and hybrid work arrangements affect workers in non-knowledge industries?",
    "What are the long-term (>5 years) career trajectory effects of remote work?",
    "Which specific organizational practices best mitigate collaboration deficits in remote teams?",
    "How do effects differ across demographic groups (age, caregiving status, seniority)?",
  ],
  sourceIds: ["src-1", "src-2", "src-3", "src-4", "src-5", "src-6", "src-7", "src-8", "src-9"],
};

const demoUnknowns = [
  "Most studies focus on knowledge workers in technology and finance; findings may not generalize to other industries.",
  "The definition and measurement of 'productivity' varies significantly across studies, making direct comparison difficult.",
  "Long-term effects (>3 years) of remote and hybrid work remain understudied.",
  "Organizational support and culture may moderate effects but are inconsistently controlled for.",
];

export function createDemoInvestigation(): Investigation {
  return {
    id: "demo-investigation",
    question: "Does remote work improve or reduce employee productivity?",
    status: "complete",
    claims: demoClaims,
    evidence: demoEvidence,
    brief: demoBrief,
    confidence: "moderate",
    unknowns: demoUnknowns,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
}
