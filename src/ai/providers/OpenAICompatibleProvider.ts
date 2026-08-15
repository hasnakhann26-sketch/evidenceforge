// OpenAICompatibleProvider — adapter skeleton for any OpenAI-compatible
// chat completions API (OpenAI, Azure OpenAI, local LLMs with an
// OpenAI-compatible endpoint, etc.).
//
// SECURITY MODEL:
//   This provider does NOT embed API keys in client-side code.
//   It sends requests to a server-side proxy (Supabase Edge Function
//   or similar backend) that holds the API key as a secret and forwards
//   the request to the real AI endpoint.
//
//   The client only needs:
//     - VITE_AI_API_BASE: the proxy URL (e.g. a Supabase Edge Function URL)
//     - VITE_AI_MODEL: the model to request
//
//   The proxy reads the real API key from a server-side secret
//   (AI_API_KEY or OPENAI_API_KEY) and injects it into the upstream
//   request. The key never reaches the browser.
//
// STATUS: Skeleton only. Method bodies are not implemented because no
//   usable API credentials are currently available. When credentials
//   are provided, implement each method to call the proxy endpoint
//   and parse the structured JSON response into the pipeline types.

import type { AIProvider } from "@/ai/AIProvider";
import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";
import type { AIConfig } from "@/ai/config";

export function createOpenAICompatibleProvider(
  config: AIConfig
): AIProvider {
  return {
    id: "openai-compatible",
    name: `OpenAI-compatible (${config.model || "default model"})`,
    isDemo: false,

    async analyzeQuestion(question: string): Promise<ResearchQuestionAnalysis> {
      // TODO: Implement when API credentials are available.
      // 1. Build a system prompt instructing the model to return
      //    structured JSON matching ResearchQuestionAnalysis.
      // 2. POST to `${config.apiBase}/chat/completions` with
      //    { model: config.model, messages, response_format: { type: "json_object" } }
      // 3. Parse the JSON response and validate with validateQuestionAnalysis().
      throw new Error(
        `OpenAI-compatible provider not yet implemented. ` +
          `Cannot analyze question: "${question}". ` +
          `Configure VITE_AI_API_BASE and server-side AI_API_KEY to enable.`
      );
    },

    async decomposeClaims(
      _analysis: ResearchQuestionAnalysis
    ): Promise<ClaimDecomposition> {
      throw new Error(
        "OpenAI-compatible provider not yet implemented. " +
          "Configure VITE_AI_API_BASE and server-side AI_API_KEY to enable."
      );
    },

    async assessEvidence(
      _analysis: ResearchQuestionAnalysis,
      _decomposition: ClaimDecomposition
    ): Promise<EvidenceAssessmentResult> {
      throw new Error(
        "OpenAI-compatible provider not yet implemented. " +
          "Configure VITE_AI_API_BASE and server-side AI_API_KEY to enable."
      );
    },

    async assessUncertainty(
      _analysis: ResearchQuestionAnalysis,
      _decomposition: ClaimDecomposition,
      _evidence: EvidenceAssessmentResult
    ): Promise<UncertaintyAssessment> {
      throw new Error(
        "OpenAI-compatible provider not yet implemented. " +
          "Configure VITE_AI_API_BASE and server-side AI_API_KEY to enable."
      );
    },

    async synthesizeBrief(
      _analysis: ResearchQuestionAnalysis,
      _decomposition: ClaimDecomposition,
      _evidence: EvidenceAssessmentResult,
      _uncertainty: UncertaintyAssessment
    ): Promise<BriefResearchBrief> {
      throw new Error(
        "OpenAI-compatible provider not yet implemented. " +
          "Configure VITE_AI_API_BASE and server-side AI_API_KEY to enable."
      );
    },
  };
}
