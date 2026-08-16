// Stage-specific prompts for the Gemini provider.
//
// Each function returns a system prompt that instructs Gemini to produce
// strict JSON matching the corresponding pipeline stage type. The user
// prompt provides the actual input data for that stage.

import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";

// ── Stage 1: Question Analysis ──────────────────────────────────

export function questionAnalysisSystemPrompt(): string {
  return `You are a research question analyst. Analyze the given research question and return a JSON object with EXACTLY this structure:
{
  "question": "<the original question>",
  "normalizedQuestion": "<rephrased version for processing>",
  "keyConcepts": ["concept1", "concept2", ...],
  "domain": "<the research domain>",
  "scope": {
    "temporal": "<time period or null>",
    "geographic": "<region or null>",
    "population": "<population group or null>"
  },
  "subQuestions": ["sub-question 1", "sub-question 2", ...]
}
Rules:
- keyConcepts must have at least 3 items.
- subQuestions must have at least 2 items.
- All string values must be non-empty.
- Return ONLY the JSON object, no markdown, no explanation.`;
}

export function questionAnalysisUserPrompt(question: string): string {
  return `Research question to analyze:\n\n${question}`;
}

// ── Stage 2: Claim Decomposition ─────────────────────────────────

export function claimDecompositionSystemPrompt(): string {
  return `You are a research claim analyst. Given a question analysis, decompose it into 3-5 testable claims. Return a JSON object with EXACTLY this structure:
{
  "claims": [
    {
      "id": "claim-1",
      "text": "<the claim statement>",
      "rationale": "<why this claim was extracted>",
      "evidenceType": "<what kind of evidence would support or contradict>"
    },
    ...
  ],
  "relationships": [
    {
      "claimIdA": "claim-1",
      "claimIdB": "claim-2",
      "type": "supports" | "contradicts" | "independent" | "nuances",
      "description": "<how they relate>"
    },
    ...
  ]
}
Rules:
- claims must have 3-5 items, each with unique ids "claim-1", "claim-2", etc.
- relationships must have at least 2 items.
- All string values must be non-empty.
- Return ONLY the JSON object, no markdown, no explanation.`;
}

export function claimDecompositionUserPrompt(
  analysis: ResearchQuestionAnalysis
): string {
  return `Question analysis:\n${JSON.stringify(analysis, null, 2)}`;
}

// ── Stage 3: Evidence Assessment ─────────────────────────────────

export function evidenceAssessmentSystemPrompt(): string {
  return `You are a research evidence analyst. Given a question analysis and claim decomposition, generate plausible evidence for each claim. Return a JSON object with EXACTLY this structure:
{
  "perClaim": [
    {
      "claimId": "<claim id>",
      "evidence": [
        {
          "id": "ev-1",
          "claimId": "<claim id>",
          "title": "<evidence title>",
          "source": {
            "id": "src-1",
            "title": "<source title>",
            "authors": ["Author Last, Initial."],
            "publication": "<journal or venue>",
            "date": "YYYY-MM-DD",
            "url": "<source url>",
            "type": "peer-reviewed" | "preprint" | "report" | "meta-analysis" | "systematic-review" | "working-paper"
          },
          "excerpt": "<direct quoted excerpt>",
          "summary": "<neutral summary>"
        },
        ...
      ],
      "assessments": [
        {
          "evidenceId": "ev-1",
          "claimId": "<claim id>",
          "stance": "supporting" | "contradicting" | "mixed",
          "confidence": "high" | "moderate" | "low" | "very-low",
          "relevanceScore": <number 0-1>,
          "reasoning": "<why this stance and confidence>"
        },
        ...
      ]
    },
    ...
  ]
}
Rules:
- Each claim must have 2-4 evidence items.
- Each evidence item must have a matching assessment.
- relevanceScore must be a number between 0 and 1.
- Evidence IDs should be unique across all claims (ev-1, ev-2, ...).
- Source IDs should be unique (src-1, src-2, ...).
- Return ONLY the JSON object, no markdown, no explanation.`;
}

export function evidenceAssessmentUserPrompt(
  analysis: ResearchQuestionAnalysis,
  decomposition: ClaimDecomposition
): string {
  return `Question analysis:\n${JSON.stringify(analysis, null, 2)}\n\nClaim decomposition:\n${JSON.stringify(decomposition, null, 2)}`;
}

// ── Stage 4: Uncertainty Analysis ───────────────────────────────

export function uncertaintyAnalysisSystemPrompt(): string {
  return `You are a research uncertainty analyst. Given the analysis, decomposition, and evidence, identify uncertainties. Return a JSON object with EXACTLY this structure:
{
  "evidenceGaps": ["gap 1", "gap 2", ...],
  "methodologicalLimitations": ["limitation 1", ...],
  "confounders": ["confounder 1", ...],
  "openQuestions": ["question 1", ...],
  "overallConfidence": "high" | "moderate" | "low" | "very-low"
}
Rules:
- Each array must have at least 2 items.
- All string values must be non-empty.
- overallConfidence must be one of: "high", "moderate", "low", "very-low".
- Return ONLY the JSON object, no markdown, no explanation.`;
}

export function uncertaintyAnalysisUserPrompt(
  analysis: ResearchQuestionAnalysis,
  decomposition: ClaimDecomposition,
  evidence: EvidenceAssessmentResult
): string {
  return `Question analysis:\n${JSON.stringify(analysis, null, 2)}\n\nClaim decomposition:\n${JSON.stringify(decomposition, null, 2)}\n\nEvidence assessment:\n${JSON.stringify(evidence, null, 2)}`;
}

// ── Stage 5: Brief Synthesis ─────────────────────────────────────

export function briefSynthesisSystemPrompt(): string {
  return `You are a research brief synthesizer. Given all prior pipeline outputs, produce a concise research brief. Return a JSON object with EXACTLY this structure:
{
  "executiveFinding": "<1-paragraph executive summary>",
  "strongestSupportingEvidenceId": "<evidence id>",
  "strongestContradictingEvidenceId": "<evidence id>",
  "uncertainties": ["uncertainty 1", ...],
  "limitations": ["limitation 1", ...],
  "openQuestions": ["question 1", ...],
  "sourceIds": ["src-1", "src-2", ...]
}
Rules:
- executiveFinding must be a non-empty paragraph.
- strongestSupportingEvidenceId and strongestContradictingEvidenceId must reference actual evidence IDs from the input.
- Each array must have at least 2 items.
- sourceIds must reference actual source IDs from the evidence.
- Return ONLY the JSON object, no markdown, no explanation.`;
}

export function briefSynthesisUserPrompt(
  analysis: ResearchQuestionAnalysis,
  decomposition: ClaimDecomposition,
  evidence: EvidenceAssessmentResult,
  uncertainty: UncertaintyAssessment
): string {
  return `Question analysis:\n${JSON.stringify(analysis, null, 2)}\n\nClaim decomposition:\n${JSON.stringify(decomposition, null, 2)}\n\nEvidence assessment:\n${JSON.stringify(evidence, null, 2)}\n\nUncertainty assessment:\n${JSON.stringify(uncertainty, null, 2)}`;
}

// Type marker to satisfy unused-import linter — these types are used
// in the function signatures above.
export type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
};
