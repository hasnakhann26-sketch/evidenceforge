// InvestigationService — the provider-independent pipeline orchestrator.
//
// This service runs the full investigation pipeline by calling the
// AIProvider's methods in sequence:
//
//   1. analyzeQuestion
//   2. decomposeClaims
//   3. assessEvidence
//   4. assessUncertainty
//   5. synthesizeBrief
//
// Each stage's output is validated before passing to the next stage.
// The final PipelineResult is mapped to the UI-facing Investigation type.
//
// The service is provider-agnostic: it works with MockAIProvider today
// and will work with OpenAICompatibleProvider (or any future provider)
// without changes. The hook layer subscribes to stage progress callbacks.

import type { AIProvider } from "@/ai/AIProvider";
import type {
  PipelineResult,
  PipelineStage,
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";
import type { Investigation, Claim, EvidenceItem, ResearchBrief } from "@/types";
import {
  validateQuestionAnalysis,
  validateClaimDecomposition,
  validateEvidenceAssessment,
  validateUncertaintyAssessment,
  validateBrief,
  PipelineValidationError,
} from "@/ai/validation";

export type ProgressCallback = (stage: PipelineStage, label: string) => void;

export interface InvestigationServiceResult {
  investigation: Investigation;
  pipelineResult: PipelineResult;
}

export class InvestigationService {
  constructor(private provider: AIProvider) {}

  async run(
    question: string,
    onProgress?: ProgressCallback
  ): Promise<InvestigationServiceResult> {
    // Stage 1: Question Analysis
    onProgress?.("question-analysis", "Analyzing question");
    const analysis = await this.provider.analyzeQuestion(question);
    validateQuestionAnalysis(analysis, "question-analysis");

    // Stage 2: Claim Decomposition
    onProgress?.("claim-decomposition", "Decomposing into claims");
    const decomposition = await this.provider.decomposeClaims(analysis);
    validateClaimDecomposition(decomposition, "claim-decomposition");

    // Stage 3: Evidence Assessment
    onProgress?.("evidence-assessment", "Assessing evidence");
    const evidence = await this.provider.assessEvidence(analysis, decomposition);
    validateEvidenceAssessment(evidence, "evidence-assessment");

    // Stage 4: Uncertainty Analysis
    onProgress?.("uncertainty-analysis", "Analyzing uncertainty");
    const uncertainty = await this.provider.assessUncertainty(
      analysis,
      decomposition,
      evidence
    );
    validateUncertaintyAssessment(uncertainty, "uncertainty-analysis");

    // Stage 5: Brief Synthesis
    onProgress?.("brief-synthesis", "Synthesizing brief");
    const brief = await this.provider.synthesizeBrief(
      analysis,
      decomposition,
      evidence,
      uncertainty
    );
    validateBrief(brief, "brief-synthesis");

    const pipelineResult: PipelineResult = {
      questionAnalysis: analysis,
      claimDecomposition: decomposition,
      evidenceAssessment: evidence,
      uncertaintyAssessment: uncertainty,
      brief,
    };

    const investigation = this.mapToInvestigation(
      question,
      pipelineResult,
      this.provider.isDemo
    );

    return { investigation, pipelineResult };
  }

  private mapToInvestigation(
    question: string,
    result: PipelineResult,
    isDemo: boolean
  ): Investigation {
    const claims: Claim[] = result.claimDecomposition.claims.map((dc) => {
      const claimEvidence = result.evidenceAssessment.perClaim.find(
        (ce) => ce.claimId === dc.id
      );

      const assessments = claimEvidence?.assessments ?? [];
      const supportingCount = assessments.filter(
        (a) => a.stance === "supporting"
      ).length;
      const contradictingCount = assessments.filter(
        (a) => a.stance === "contradicting"
      ).length;
      const mixedCount = assessments.filter(
        (a) => a.stance === "mixed"
      ).length;

      // Derive claim-level confidence from assessment confidences.
      const confidence = deriveClaimConfidence(assessments.map((a) => a.confidence));

      return {
        id: dc.id,
        text: dc.text,
        evidenceCount: assessments.length,
        supportingCount,
        contradictingCount,
        mixedCount,
        confidence,
      };
    });

    const evidence: EvidenceItem[] = [];
    for (const ce of result.evidenceAssessment.perClaim) {
      for (const record of ce.evidence) {
        const assessment = ce.assessments.find(
          (a) => a.evidenceId === record.id
        );
        if (!assessment) continue;

        evidence.push({
          id: record.id,
          claimId: record.claimId,
          title: record.title,
          source: record.source,
          excerpt: record.excerpt,
          summary: record.summary,
          stance: assessment.stance,
          confidence: assessment.confidence,
          relevanceScore: assessment.relevanceScore,
          publicationDate: record.source.date,
        });
      }
    }

    const brief: ResearchBrief = {
      executiveFinding: result.brief.executiveFinding,
      strongestSupportingEvidenceId: result.brief.strongestSupportingEvidenceId,
      strongestContradictingEvidenceId:
        result.brief.strongestContradictingEvidenceId,
      uncertainties: result.brief.uncertainties,
      limitations: result.brief.limitations,
      openQuestions: result.brief.openQuestions,
      sourceIds: result.brief.sourceIds,
    };

    return {
      id: `investigation-${Date.now()}`,
      question,
      status: "complete",
      claims,
      evidence,
      brief,
      confidence: result.uncertaintyAssessment.overallConfidence,
      unknowns: result.uncertaintyAssessment.evidenceGaps,
      createdAt: new Date().toISOString(),
      isDemo,
    };
  }
}

// Derive a claim-level confidence from the confidences of its evidence
// assessments. Uses a simple priority: if any assessment is "high" and
// the majority are "high" or "moderate", the claim is "moderate" or
// "high". If most are "low" or "very-low", the claim is "low".
function deriveClaimConfidence(
  confidences: Array<"high" | "moderate" | "low" | "very-low">
): "high" | "moderate" | "low" | "very-low" {
  if (confidences.length === 0) return "low";

  const rank: Record<string, number> = {
    "very-low": 0,
    low: 1,
    moderate: 2,
    high: 3,
  };
  const avg =
    confidences.reduce((sum, c) => sum + rank[c], 0) / confidences.length;

  if (avg >= 2.5) return "high";
  if (avg >= 1.5) return "moderate";
  if (avg >= 0.5) return "low";
  return "very-low";
}

export { PipelineValidationError };
export type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
};
