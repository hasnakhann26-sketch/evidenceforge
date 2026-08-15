// AIProvider — the provider-independent abstraction for EvidenceForge's
// investigation pipeline.
//
// Every AI provider (mock, OpenAI-compatible, or future custom backends)
// implements this interface. The InvestigationService calls these methods
// in sequence to run the full pipeline. No provider-specific types leak
// into the service or UI layers.

import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";

export interface AIProvider {
  /** Unique identifier for this provider (e.g. "mock", "openai"). */
  readonly id: string;

  /** Human-readable name for display/logging. */
  readonly name: string;

  /** Whether this provider produces real AI output or synthetic demo data. */
  readonly isDemo: boolean;

  /**
   * Stage 1: Analyze the research question.
   * Identifies key concepts, domain, scope, and sub-questions.
   */
  analyzeQuestion(question: string): Promise<ResearchQuestionAnalysis>;

  /**
   * Stage 2: Decompose the question into testable claims.
   * Given the question analysis, produces a set of claims and their
   * relationships.
   */
  decomposeClaims(
    analysis: ResearchQuestionAnalysis
  ): Promise<ClaimDecomposition>;

  /**
   * Stage 3: Assess evidence for each claim.
   * In Stage 2 this returns demo data. A real provider would retrieve
   * evidence and assess its stance, confidence, and relevance.
   */
  assessEvidence(
    analysis: ResearchQuestionAnalysis,
    decomposition: ClaimDecomposition
  ): Promise<EvidenceAssessmentResult>;

  /**
   * Stage 4: Analyze uncertainty across all claims and evidence.
   * Identifies gaps, limitations, confounders, and open questions.
   */
  assessUncertainty(
    analysis: ResearchQuestionAnalysis,
    decomposition: ClaimDecomposition,
    evidence: EvidenceAssessmentResult
  ): Promise<UncertaintyAssessment>;

  /**
   * Stage 5: Synthesize the research brief.
   * Combines all prior stage outputs into a structured brief.
   */
  synthesizeBrief(
    analysis: ResearchQuestionAnalysis,
    decomposition: ClaimDecomposition,
    evidence: EvidenceAssessmentResult,
    uncertainty: UncertaintyAssessment
  ): Promise<BriefResearchBrief>;
}
