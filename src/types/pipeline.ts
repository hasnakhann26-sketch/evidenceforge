// Pipeline stage types for EvidenceForge's investigation pipeline.
//
// These types represent the data structures that flow between pipeline
// stages. They are distinct from the UI-facing types in types/index.ts
// (which are the final, denormalized shape the components consume).
// The InvestigationService maps pipeline outputs to UI types.
//
// Pipeline flow:
//   ResearchQuestion
//     → QuestionAnalysis
//     → ClaimDecomposition
//     → EvidenceAssessment
//     → UncertaintyAssessment
//     → ResearchBrief
//
// All structures are provider-agnostic: any AI provider (mock or real)
// must produce objects conforming to these interfaces.

import type { ConfidenceLevel, EvidenceStance, Source } from "@/types";

// ── Stage 1: Question Analysis ──────────────────────────────────

export interface ResearchQuestionAnalysis {
  /** The original question as submitted by the user. */
  question: string;
  /** Normalized / rephrased version for downstream processing. */
  normalizedQuestion: string;
  /** Key concepts and terms identified in the question. */
  keyConcepts: string[];
  /** The research domain (e.g. "labor economics", "public health"). */
  domain: string;
  /** Scope hints — temporal, geographic, population. */
  scope: {
    temporal?: string;
    geographic?: string;
    population?: string;
  };
  /** Sub-questions that the main question implies. */
  subQuestions: string[];
}

// ── Stage 2: Claim Decomposition ─────────────────────────────────

export interface DecomposedClaim {
  id: string;
  text: string;
  /** Why this claim was extracted from the question. */
  rationale: string;
  /** What kind of evidence would support or contradict this claim. */
  evidenceType: string;
}

export interface ClaimDecomposition {
  claims: DecomposedClaim[];
  /** How the claims relate to each other. */
  relationships: ClaimRelationship[];
}

export interface ClaimRelationship {
  claimIdA: string;
  claimIdB: string;
  type: "supports" | "contradicts" | "independent" | "nuances";
  description: string;
}

// ── Stage 3: Evidence Assessment ─────────────────────────────────

export interface EvidenceRecord {
  id: string;
  claimId: string;
  title: string;
  source: Source;
  /** Direct excerpt from the source (quoted). */
  excerpt: string;
  /** Neutral summary of what the evidence says. */
  summary: string;
}

export interface EvidenceAssessment {
  evidenceId: string;
  claimId: string;
  stance: EvidenceStance;
  confidence: ConfidenceLevel;
  /** 0–1, how relevant this evidence is to the claim. */
  relevanceScore: number;
  /** Why the stance and confidence were assigned. */
  reasoning: string;
}

export interface ClaimEvidenceAssessment {
  claimId: string;
  evidence: EvidenceRecord[];
  assessments: EvidenceAssessment[];
}

export interface EvidenceAssessmentResult {
  perClaim: ClaimEvidenceAssessment[];
}

// ── Stage 4: Uncertainty Analysis ───────────────────────────────

export interface UncertaintyAssessment {
  /** Gaps in the evidence base. */
  evidenceGaps: string[];
  /** Methodological limitations of available evidence. */
  methodologicalLimitations: string[];
  /** Factors that could change the conclusion if investigated. */
  confounders: string[];
  /** Questions the evidence does not answer. */
  openQuestions: string[];
  /** Overall confidence across all claims. */
  overallConfidence: ConfidenceLevel;
}

// ── Stage 5: Research Brief ──────────────────────────────────────

export interface BriefResearchBrief {
  executiveFinding: string;
  strongestSupportingEvidenceId: string;
  strongestContradictingEvidenceId: string;
  uncertainties: string[];
  limitations: string[];
  openQuestions: string[];
  sourceIds: string[];
}

// ── Pipeline result (all stages combined) ───────────────────────

export interface PipelineResult {
  questionAnalysis: ResearchQuestionAnalysis;
  claimDecomposition: ClaimDecomposition;
  evidenceAssessment: EvidenceAssessmentResult;
  uncertaintyAssessment: UncertaintyAssessment;
  brief: BriefResearchBrief;
}

// ── Stage identifiers ────────────────────────────────────────────

export type PipelineStage =
  | "question-analysis"
  | "claim-decomposition"
  | "evidence-assessment"
  | "uncertainty-analysis"
  | "brief-synthesis";

export interface PipelineStageInfo {
  stage: PipelineStage;
  label: string;
  description: string;
}

export const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    stage: "question-analysis",
    label: "Analyzing question",
    description: "Identifying key concepts, domain, and scope",
  },
  {
    stage: "claim-decomposition",
    label: "Decomposing into claims",
    description: "Breaking the question into testable propositions",
  },
  {
    stage: "evidence-assessment",
    label: "Assessing evidence",
    description: "Gathering and evaluating evidence for each claim",
  },
  {
    stage: "uncertainty-analysis",
    label: "Analyzing uncertainty",
    description: "Identifying gaps, limitations, and open questions",
  },
  {
    stage: "brief-synthesis",
    label: "Synthesizing brief",
    description: "Producing the evidence-based research brief",
  },
];
