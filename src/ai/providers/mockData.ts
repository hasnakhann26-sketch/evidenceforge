// Pipeline demo data for the MockAIProvider.
//
// This data is synthetic and clearly labeled as DEMO DATA.
// It does not represent real research findings or real citations.
// It exists so the pipeline produces meaningful output for UI
// development and demonstration without requiring a live AI provider.
//
// The structure matches the pipeline stage types in types/pipeline.ts,
// NOT the UI-facing types in types/index.ts. The InvestigationService
// maps from these pipeline structures to the UI types.

import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
  EvidenceRecord,
  EvidenceAssessment,
  ClaimEvidenceAssessment,
} from "@/types/pipeline";
import type { Source } from "@/types";

// ── Sources (synthetic) ──────────────────────────────────────────

const demoSources: Record<string, Source> = {
  "src-1": {
    id: "src-1",
    title: "Productivity effects of remote work before and during COVID-19",
    authors: ["Choudhury, A.", "Foroughi, C.", "Larson, B."],
    publication: "Journal of Applied Economics",
    date: "2024-03-15",
    url: "#demo-source-1",
    type: "peer-reviewed",
  },
  "src-2": {
    id: "src-2",
    title: "Measuring productivity in remote software engineering teams",
    authors: ["Bao, L.", "Xing, Z.", "Xia, Y."],
    publication: "ICSE Proceedings",
    date: "2023-06-01",
    url: "#demo-source-2",
    type: "peer-reviewed",
  },
  "src-3": {
    id: "src-3",
    title:
      "The productivity pitfalls of remote work: Evidence from a natural experiment",
    authors: ["Gibbs, M.", "Lei, M.", "Mengel, F."],
    publication: "NBER Working Paper Series",
    date: "2023-01-20",
    url: "#demo-source-3",
    type: "working-paper",
  },
  "src-4": {
    id: "src-4",
    title: "Remote work and employee productivity: A meta-analytic review",
    authors: ["Zhang, Y.", "Hartog, D.", "Bakker, A."],
    publication: "Journal of Organizational Psychology",
    date: "2024-08-10",
    url: "#demo-source-4",
    type: "meta-analysis",
  },
  "src-5": {
    id: "src-5",
    title: "Effects of remote work on collaboration among information workers",
    authors: ["Yang, L.", "Holtz, D.", "Jaffe, S.", "Suri, S."],
    publication: "Nature Human Behaviour",
    date: "2022-09-12",
    url: "#demo-source-5",
    type: "peer-reviewed",
  },
  "src-6": {
    id: "src-6",
    title: "Innovation in distributed teams: The role of synchronous interaction",
    authors: ["Martinez, S.", "Chen, R."],
    publication: "Organization Science",
    date: "2023-11-05",
    url: "#demo-source-6",
    type: "peer-reviewed",
  },
  "src-7": {
    id: "src-7",
    title: "Collaboration networks and team creativity in hybrid work environments",
    authors: ["Kumar, P.", "Otero, M."],
    publication: "Academy of Management Proceedings",
    date: "2024-01-30",
    url: "#demo-source-7",
    type: "preprint",
  },
  "src-8": {
    id: "src-8",
    title:
      "Hybrid work arrangements and employee outcomes: Evidence from a randomized trial",
    authors: ["Bloom, N.", "Han, R.", "Liang, J."],
    publication: "Nature",
    date: "2024-06-26",
    url: "#demo-source-8",
    type: "peer-reviewed",
  },
  "src-9": {
    id: "src-9",
    title: "Comparing engagement and output across work models in knowledge industries",
    authors: ["Thompson, E.", "Reyes, A."],
    publication: "Work and Occupations",
    date: "2023-12-15",
    url: "#demo-source-9",
    type: "report",
  },
};

// ── Stage 1: Question Analysis ───────────────────────────────────

export function demoQuestionAnalysis(question: string): ResearchQuestionAnalysis {
  return {
    question,
    normalizedQuestion: question,
    keyConcepts: [
      "remote work",
      "employee productivity",
      "hybrid work",
      "knowledge workers",
    ],
    domain: "labor economics / organizational behavior",
    scope: {
      temporal: "2019–present",
      population: "knowledge workers",
    },
    subQuestions: [
      "Does remote work affect individual productivity differently than team productivity?",
      "How do hybrid models compare to fully-remote or fully-in-office arrangements?",
      "What factors moderate the productivity effects of remote work?",
    ],
  };
}

// ── Stage 2: Claim Decomposition ─────────────────────────────────

export function demoClaimDecomposition(): ClaimDecomposition {
  return {
    claims: [
      {
        id: "claim-1",
        text: "Remote work maintains or improves individual productivity for knowledge workers.",
        rationale:
          "The question asks whether productivity improves or reduces; individual-level productivity is the primary measurable outcome.",
        evidenceType:
          "Controlled studies, natural experiments, and meta-analyses measuring individual output.",
      },
      {
        id: "claim-2",
        text: "Remote work negatively impacts team collaboration and innovation.",
        rationale:
          "Productivity is not only individual; collaboration and innovation are downstream effects that may be affected differently.",
        evidenceType:
          "Network analysis studies, team-level innovation metrics, and collaboration surveys.",
      },
      {
        id: "claim-3",
        text: "Hybrid models offer a balance that outperforms fully-remote or fully-in-office arrangements.",
        rationale:
          "The question implies a binary, but the evidence base includes hybrid models as a third option worth examining.",
        evidenceType:
          "Randomized trials and multi-organization comparisons of hybrid vs. fully-remote vs. in-office.",
      },
    ],
    relationships: [
      {
        claimIdA: "claim-1",
        claimIdB: "claim-2",
        type: "nuances",
        description:
          "Individual productivity and team collaboration may move in opposite directions under remote work.",
      },
      {
        claimIdA: "claim-1",
        claimIdB: "claim-3",
        type: "nuances",
        description:
          "Hybrid models may resolve the tension between individual productivity and team collaboration.",
      },
      {
        claimIdA: "claim-2",
        claimIdB: "claim-3",
        type: "nuances",
        description:
          "Hybrid models may mitigate the collaboration deficits identified in fully-remote work.",
      },
    ],
  };
}

// ── Stage 3: Evidence Assessment ─────────────────────────────────

const evidenceByClaim: Record<
  string,
  { records: EvidenceRecord[]; assessments: EvidenceAssessment[] }
> = {
  "claim-1": {
    records: [
      {
        id: "ev-1",
        claimId: "claim-1",
        title: "Productivity effects of remote work before and during COVID-19",
        source: demoSources["src-1"],
        excerpt:
          "We find that remote workers were, on average, 13% more productive than their in-office counterparts during the study period, though variance increased significantly.",
        summary:
          "Controlled study of 5,000 knowledge workers showing a 13% average productivity increase for remote workers, with notable variance across roles and seniority levels.",
      },
      {
        id: "ev-2",
        claimId: "claim-1",
        title: "Measuring productivity in remote software engineering teams",
        source: demoSources["src-2"],
        excerpt:
          "Analysis of commit data from 12,000 developers showed no statistically significant difference in output between remote and on-site developers.",
        summary:
          "Large-scale analysis of developer commit data finding no significant output difference between remote and on-site developers.",
      },
      {
        id: "ev-3",
        claimId: "claim-1",
        title:
          "The productivity pitfalls of remote work: Evidence from a natural experiment",
        source: demoSources["src-3"],
        excerpt:
          "Our results indicate a 6–10% productivity decrease for remote workers, primarily driven by increased communication costs and slower coordination.",
        summary:
          "Natural experiment finding a 6–10% productivity decrease for remote workers, attributed to communication and coordination overhead.",
      },
      {
        id: "ev-4",
        claimId: "claim-1",
        title: "Remote work and employee productivity: A meta-analytic review",
        source: demoSources["src-4"],
        excerpt:
          "Across 47 studies, the overall effect size was positive but small (d = 0.15), with substantial heterogeneity moderated by task interdependence and organizational support.",
        summary:
          "Meta-analysis of 47 studies showing a small positive effect (d = 0.15) with high heterogeneity, moderated by task interdependence and organizational support.",
      },
    ],
    assessments: [
      {
        evidenceId: "ev-1",
        claimId: "claim-1",
        stance: "supporting",
        confidence: "high",
        relevanceScore: 0.92,
        reasoning:
          "Large controlled study directly measuring individual productivity with a clear positive finding.",
      },
      {
        evidenceId: "ev-2",
        claimId: "claim-1",
        stance: "supporting",
        confidence: "moderate",
        relevanceScore: 0.78,
        reasoning:
          "Large sample but limited to software engineering; output measured via commits which may not capture all productivity dimensions.",
      },
      {
        evidenceId: "ev-3",
        claimId: "claim-1",
        stance: "contradicting",
        confidence: "moderate",
        relevanceScore: 0.85,
        reasoning:
          "Natural experiment design provides causal evidence, but the finding of decreased productivity contradicts the claim.",
      },
      {
        evidenceId: "ev-4",
        claimId: "claim-1",
        stance: "mixed",
        confidence: "high",
        relevanceScore: 0.88,
        reasoning:
          "Meta-analysis provides the strongest evidence quality, but the small effect size and high heterogeneity mean the claim is only weakly supported overall.",
      },
    ],
  },
  "claim-2": {
    records: [
      {
        id: "ev-5",
        claimId: "claim-2",
        title: "Effects of remote work on collaboration among information workers",
        source: demoSources["src-5"],
        excerpt:
          "We find that the shift to remote work caused a decrease in cross-group collaboration, as measured by network ties, and an increase in siloed communication.",
        summary:
          "Analysis of 61,000 Microsoft employees showing decreased cross-group collaboration and increased siloed communication after the shift to remote work.",
      },
      {
        id: "ev-6",
        claimId: "claim-2",
        title: "Innovation in distributed teams: The role of synchronous interaction",
        source: demoSources["src-6"],
        excerpt:
          "Teams with structured synchronous interaction protocols showed no significant innovation deficit compared to co-located teams.",
        summary:
          "Study of 120 distributed teams finding that structured synchronous interaction protocols can mitigate innovation deficits.",
      },
      {
        id: "ev-7",
        claimId: "claim-2",
        title: "Collaboration networks and team creativity in hybrid work environments",
        source: demoSources["src-7"],
        excerpt:
          "Results were mixed: hybrid teams with 2–3 in-office days maintained creative output, while fully remote teams showed declines in divergent thinking tasks.",
        summary:
          "Study of 85 teams showing mixed results — hybrid arrangements maintained creative output while fully remote teams declined in divergent thinking.",
      },
    ],
    assessments: [
      {
        evidenceId: "ev-5",
        claimId: "claim-2",
        stance: "supporting",
        confidence: "high",
        relevanceScore: 0.9,
        reasoning:
          "Very large sample with network-level collaboration metrics directly supporting the claim.",
      },
      {
        evidenceId: "ev-6",
        claimId: "claim-2",
        stance: "contradicting",
        confidence: "moderate",
        relevanceScore: 0.72,
        reasoning:
          "Shows that with structured protocols, innovation deficits can be mitigated, contradicting the universal negative claim.",
      },
      {
        evidenceId: "ev-7",
        claimId: "claim-2",
        stance: "mixed",
        confidence: "low",
        relevanceScore: 0.68,
        reasoning:
          "Small sample and preprint status limit confidence; results are mixed between hybrid and fully-remote.",
      },
    ],
  },
  "claim-3": {
    records: [
      {
        id: "ev-8",
        claimId: "claim-3",
        title:
          "Hybrid work arrangements and employee outcomes: Evidence from a randomized trial",
        source: demoSources["src-8"],
        excerpt:
          "Employees assigned to hybrid work (2 days remote) reported equivalent or higher satisfaction and showed no productivity loss compared to full-time office workers.",
        summary:
          "Randomized controlled trial of 1,612 employees finding hybrid work (2 remote days) produced equivalent productivity and higher satisfaction.",
      },
      {
        id: "ev-9",
        claimId: "claim-3",
        title: "Comparing engagement and output across work models in knowledge industries",
        source: demoSources["src-9"],
        excerpt:
          "Hybrid models showed higher engagement scores but inconsistent output measures across the three organizations studied, limiting generalizability.",
        summary:
          "Three-organization comparison showing higher engagement for hybrid models but inconsistent output measures, limiting generalizability.",
      },
    ],
    assessments: [
      {
        evidenceId: "ev-8",
        claimId: "claim-3",
        stance: "supporting",
        confidence: "high",
        relevanceScore: 0.95,
        reasoning:
          "Randomized controlled trial — the strongest study design — directly comparing hybrid to full-time office work.",
      },
      {
        evidenceId: "ev-9",
        claimId: "claim-3",
        stance: "mixed",
        confidence: "low",
        relevanceScore: 0.65,
        reasoning:
          "Only three organizations and inconsistent output measures limit the strength of this evidence.",
      },
    ],
  },
};

export function demoEvidenceAssessment(): EvidenceAssessmentResult {
  const perClaim: ClaimEvidenceAssessment[] = Object.entries(
    evidenceByClaim
  ).map(([claimId, data]) => ({
    claimId,
    evidence: data.records,
    assessments: data.assessments,
  }));

  return { perClaim };
}

// ── Stage 4: Uncertainty Analysis ───────────────────────────────

export function demoUncertaintyAssessment(): UncertaintyAssessment {
  return {
    evidenceGaps: [
      "Most studies focus on knowledge workers in technology and finance; findings may not generalize to other industries.",
      "The definition and measurement of 'productivity' varies significantly across studies, making direct comparison difficult.",
      "Long-term effects (>3 years) of remote and hybrid work remain understudied.",
      "Organizational support and culture may moderate effects but are inconsistently controlled for.",
    ],
    methodologicalLimitations: [
      "This brief is based on a non-exhaustive selection of evidence and should not be treated as a systematic review.",
      "Publication bias toward positive findings may inflate the apparent productivity benefits.",
      "Several included studies rely on self-reported productivity measures.",
    ],
    confounders: [
      "Industry type and task interdependence levels vary across studies.",
      "Organizational culture and remote-work maturity may independently affect outcomes.",
      "The COVID-19 pandemic introduced exogenous stressors that confound pre/post comparisons.",
    ],
    openQuestions: [
      "How do remote and hybrid work arrangements affect workers in non-knowledge industries?",
      "What are the long-term (>5 years) career trajectory effects of remote work?",
      "Which specific organizational practices best mitigate collaboration deficits in remote teams?",
      "How do effects differ across demographic groups (age, caregiving status, seniority)?",
    ],
    overallConfidence: "moderate",
  };
}

// ── Stage 5: Research Brief ──────────────────────────────────────

export function demoBrief(): BriefResearchBrief {
  return {
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
    sourceIds: [
      "src-1",
      "src-2",
      "src-3",
      "src-4",
      "src-5",
      "src-6",
      "src-7",
      "src-8",
      "src-9",
    ],
  };
}
