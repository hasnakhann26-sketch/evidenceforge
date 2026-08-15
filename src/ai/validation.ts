// Runtime validation for pipeline stage outputs.
//
// These validators check that data returned by an AI provider has
// the expected shape before it flows into the next pipeline stage
// or the UI. They throw a PipelineValidationError on failure, which
// the InvestigationService catches and surfaces as an error state.

import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";
import type { ConfidenceLevel, EvidenceStance } from "@/types";

export class PipelineValidationError extends Error {
  constructor(
    message: string,
    public readonly stage: string
  ) {
    super(message);
    this.name = "PipelineValidationError";
  }
}

function assert(condition: boolean, stage: string, message: string): void {
  if (!condition) {
    throw new PipelineValidationError(message, stage);
  }
}

const VALID_CONFIDENCE: ConfidenceLevel[] = [
  "high",
  "moderate",
  "low",
  "very-low",
];
const VALID_STANCE: EvidenceStance[] = ["supporting", "contradicting", "mixed"];

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === "string");
}

export function validateQuestionAnalysis(
  data: unknown,
  stage = "question-analysis"
): asserts data is ResearchQuestionAnalysis {
  const d = data as Record<string, unknown>;
  assert(d != null && typeof d === "object", stage, "Expected an object");
  assert(isString(d.question), stage, "Missing 'question' string");
  assert(isString(d.normalizedQuestion), stage, "Missing 'normalizedQuestion'");
  assert(
    isStringArray(d.keyConcepts),
    stage,
    "Missing 'keyConcepts' string array"
  );
  assert(isString(d.domain), stage, "Missing 'domain' string");
  assert(
    d.scope == null || typeof d.scope === "object",
    stage,
    "'scope' must be an object or null"
  );
  assert(
    isStringArray(d.subQuestions),
    stage,
    "Missing 'subQuestions' string array"
  );
}

export function validateClaimDecomposition(
  data: unknown,
  stage = "claim-decomposition"
): asserts data is ClaimDecomposition {
  const d = data as Record<string, unknown>;
  assert(d != null && typeof d === "object", stage, "Expected an object");
  assert(Array.isArray(d.claims), stage, "Missing 'claims' array");
  assert((d.claims as unknown[]).length > 0, stage, "'claims' must not be empty");

  for (const claim of d.claims as Record<string, unknown>[]) {
    assert(isString(claim.id), stage, "Claim missing 'id'");
    assert(isString(claim.text), stage, `Claim ${claim.id} missing 'text'`);
    assert(
      isString(claim.rationale),
      stage,
      `Claim ${claim.id} missing 'rationale'`
    );
    assert(
      isString(claim.evidenceType),
      stage,
      `Claim ${claim.id} missing 'evidenceType'`
    );
  }

  assert(Array.isArray(d.relationships), stage, "Missing 'relationships' array");
  for (const rel of d.relationships as Record<string, unknown>[]) {
    assert(isString(rel.claimIdA), stage, "Relationship missing 'claimIdA'");
    assert(isString(rel.claimIdB), stage, "Relationship missing 'claimIdB'");
    assert(
      typeof rel.type === "string",
      stage,
      "Relationship missing 'type'"
    );
  }
}

export function validateEvidenceAssessment(
  data: unknown,
  stage = "evidence-assessment"
): asserts data is EvidenceAssessmentResult {
  const d = data as Record<string, unknown>;
  assert(d != null && typeof d === "object", stage, "Expected an object");
  assert(Array.isArray(d.perClaim), stage, "Missing 'perClaim' array");
  assert((d.perClaim as unknown[]).length > 0, stage, "'perClaim' must not be empty");

  for (const item of d.perClaim as Record<string, unknown>[]) {
    assert(isString(item.claimId), stage, "Per-claim missing 'claimId'");
    assert(Array.isArray(item.evidence), stage, "Per-claim missing 'evidence'");
    assert(
      Array.isArray(item.assessments),
      stage,
      "Per-claim missing 'assessments'"
    );

    for (const ev of item.evidence as Record<string, unknown>[]) {
      assert(isString(ev.id), stage, "Evidence missing 'id'");
      assert(isString(ev.claimId), stage, "Evidence missing 'claimId'");
      assert(isString(ev.title), stage, `Evidence ${ev.id} missing 'title'`);
      assert(
        ev.source != null && typeof ev.source === "object",
        stage,
        `Evidence ${ev.id} missing 'source'`
      );
      assert(isString(ev.excerpt), stage, `Evidence ${ev.id} missing 'excerpt'`);
      assert(isString(ev.summary), stage, `Evidence ${ev.id} missing 'summary'`);
    }

    for (const a of item.assessments as Record<string, unknown>[]) {
      assert(isString(a.evidenceId), stage, "Assessment missing 'evidenceId'");
      assert(isString(a.claimId), stage, "Assessment missing 'claimId'");
      assert(
        typeof a.stance === "string" && VALID_STANCE.includes(a.stance as EvidenceStance),
        stage,
        `Assessment ${a.evidenceId} has invalid stance`
      );
      assert(
        typeof a.confidence === "string" &&
          VALID_CONFIDENCE.includes(a.confidence as ConfidenceLevel),
        stage,
        `Assessment ${a.evidenceId} has invalid confidence`
      );
      assert(
        typeof a.relevanceScore === "number" &&
          a.relevanceScore >= 0 &&
          a.relevanceScore <= 1,
        stage,
        `Assessment ${a.evidenceId} has invalid relevanceScore`
      );
    }
  }
}

export function validateUncertaintyAssessment(
  data: unknown,
  stage = "uncertainty-analysis"
): asserts data is UncertaintyAssessment {
  const d = data as Record<string, unknown>;
  assert(d != null && typeof d === "object", stage, "Expected an object");
  assert(
    isStringArray(d.evidenceGaps),
    stage,
    "Missing 'evidenceGaps' string array"
  );
  assert(
    isStringArray(d.methodologicalLimitations),
    stage,
    "Missing 'methodologicalLimitations' string array"
  );
  assert(
    isStringArray(d.confounders),
    stage,
    "Missing 'confounders' string array"
  );
  assert(
    isStringArray(d.openQuestions),
    stage,
    "Missing 'openQuestions' string array"
  );
  assert(
    typeof d.overallConfidence === "string" &&
      VALID_CONFIDENCE.includes(d.overallConfidence as ConfidenceLevel),
    stage,
    "Invalid 'overallConfidence'"
  );
}

export function validateBrief(
  data: unknown,
  stage = "brief-synthesis"
): asserts data is BriefResearchBrief {
  const d = data as Record<string, unknown>;
  assert(d != null && typeof d === "object", stage, "Expected an object");
  assert(
    isString(d.executiveFinding),
    stage,
    "Missing 'executiveFinding' string"
  );
  assert(
    isString(d.strongestSupportingEvidenceId),
    stage,
    "Missing 'strongestSupportingEvidenceId'"
  );
  assert(
    isString(d.strongestContradictingEvidenceId),
    stage,
    "Missing 'strongestContradictingEvidenceId'"
  );
  assert(
    isStringArray(d.uncertainties),
    stage,
    "Missing 'uncertainties' string array"
  );
  assert(
    isStringArray(d.limitations),
    stage,
    "Missing 'limitations' string array"
  );
  assert(
    isStringArray(d.openQuestions),
    stage,
    "Missing 'openQuestions' string array"
  );
  assert(isStringArray(d.sourceIds), stage, "Missing 'sourceIds' string array");
}
