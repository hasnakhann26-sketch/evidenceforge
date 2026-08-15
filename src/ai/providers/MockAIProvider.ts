// MockAIProvider — implements the full AIProvider pipeline using
// synthetic demo data. This is the default provider and requires
// no API credentials.
//
// All data returned is DEMO DATA — synthetic placeholders that do
// not represent real research findings or citations.

import type { AIProvider } from "@/ai/AIProvider";
import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";
import {
  demoQuestionAnalysis,
  demoClaimDecomposition,
  demoEvidenceAssessment,
  demoUncertaintyAssessment,
  demoBrief,
} from "@/ai/providers/mockData";

const STAGE_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const MockAIProvider: AIProvider = {
  id: "mock",
  name: "Demo Provider (Synthetic Data)",
  isDemo: true,

  async analyzeQuestion(question: string): Promise<ResearchQuestionAnalysis> {
    await delay(STAGE_DELAY_MS);
    return demoQuestionAnalysis(question);
  },

  async decomposeClaims(
    _analysis: ResearchQuestionAnalysis
  ): Promise<ClaimDecomposition> {
    await delay(STAGE_DELAY_MS);
    return demoClaimDecomposition();
  },

  async assessEvidence(
    _analysis: ResearchQuestionAnalysis,
    _decomposition: ClaimDecomposition
  ): Promise<EvidenceAssessmentResult> {
    await delay(STAGE_DELAY_MS);
    return demoEvidenceAssessment();
  },

  async assessUncertainty(
    _analysis: ResearchQuestionAnalysis,
    _decomposition: ClaimDecomposition,
    _evidence: EvidenceAssessmentResult
  ): Promise<UncertaintyAssessment> {
    await delay(STAGE_DELAY_MS);
    return demoUncertaintyAssessment();
  },

  async synthesizeBrief(
    _analysis: ResearchQuestionAnalysis,
    _decomposition: ClaimDecomposition,
    _evidence: EvidenceAssessmentResult,
    _uncertainty: UncertaintyAssessment
  ): Promise<BriefResearchBrief> {
    await delay(STAGE_DELAY_MS);
    return demoBrief();
  },
};
