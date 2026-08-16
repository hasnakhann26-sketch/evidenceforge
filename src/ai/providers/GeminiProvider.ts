// GeminiProvider — client-side provider that calls the Gemini proxy
// Edge Function. Implements the AIProvider interface unchanged.
//
// SECURITY MODEL:
//   This provider does NOT hold any API key. It sends pipeline stage
//   requests to the Supabase Edge Function proxy (VITE_GEMINI_PROXY_URL).
//   The proxy holds GEMINI_API_KEY as a server-side secret and forwards
//   the request to the Gemini API. The key never reaches the browser.
//
//   The proxy URL is a public value — it is the Edge Function endpoint,
//   not a secret. It is safe to include in client-side code and .env.

import type { AIProvider } from "@/ai/AIProvider";
import type {
  ResearchQuestionAnalysis,
  ClaimDecomposition,
  EvidenceAssessmentResult,
  UncertaintyAssessment,
  BriefResearchBrief,
} from "@/types/pipeline";
import type { AIConfig } from "@/ai/config";
import {
  questionAnalysisSystemPrompt,
  questionAnalysisUserPrompt,
  claimDecompositionSystemPrompt,
  claimDecompositionUserPrompt,
  evidenceAssessmentSystemPrompt,
  evidenceAssessmentUserPrompt,
  uncertaintyAnalysisSystemPrompt,
  uncertaintyAnalysisUserPrompt,
  briefSynthesisSystemPrompt,
  briefSynthesisUserPrompt,
} from "@/ai/providers/geminiPrompts";

interface ProxyResponse {
  data: unknown;
  error?: string;
}

async function callProxy(
  proxyUrl: string,
  stage: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  const url = `${proxyUrl}/functions/v1/gemini-proxy`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach the Supabase anon key if available (for auth-controlled access).
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey) {
    headers["Authorization"] = `Bearer ${anonKey}`;
    headers["apikey"] = anonKey;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ stage, systemPrompt, userPrompt }),
    });
  } catch {
    throw new Error(
      "Could not reach the AI service. Please check your connection and try again."
    );
  }

  if (!response.ok) {
    let message: string;
    try {
      const body = (await response.json()) as ProxyResponse;
      message = body.error ?? `The AI service returned an error (${response.status}).`;
    } catch {
      message = `The AI service returned an error (${response.status}).`;
    }
    throw new Error(message);
  }

  let body: ProxyResponse;
  try {
    body = (await response.json()) as ProxyResponse;
  } catch {
    throw new Error("The AI service returned a malformed response.");
  }

  if (body.error) {
    throw new Error(body.error);
  }

  if (body.data == null) {
    throw new Error("The AI service returned an empty response.");
  }

  return body.data;
}

export function createGeminiProvider(config: AIConfig): AIProvider {
  const proxyUrl = config.apiBase;

  if (!proxyUrl) {
    throw new Error(
      "Gemini provider is not configured. Set VITE_GEMINI_PROXY_URL to the Supabase project URL."
    );
  }

  return {
    id: "gemini",
    name: `Gemini (${config.model || "gemini-2.0-flash"})`,
    isDemo: false,

    async analyzeQuestion(question: string): Promise<ResearchQuestionAnalysis> {
      const data = await callProxy(
        proxyUrl,
        "question-analysis",
        questionAnalysisSystemPrompt(),
        questionAnalysisUserPrompt(question)
      );
      return data as ResearchQuestionAnalysis;
    },

    async decomposeClaims(
      analysis: ResearchQuestionAnalysis
    ): Promise<ClaimDecomposition> {
      const data = await callProxy(
        proxyUrl,
        "claim-decomposition",
        claimDecompositionSystemPrompt(),
        claimDecompositionUserPrompt(analysis)
      );
      return data as ClaimDecomposition;
    },

    async assessEvidence(
      analysis: ResearchQuestionAnalysis,
      decomposition: ClaimDecomposition
    ): Promise<EvidenceAssessmentResult> {
      const data = await callProxy(
        proxyUrl,
        "evidence-assessment",
        evidenceAssessmentSystemPrompt(),
        evidenceAssessmentUserPrompt(analysis, decomposition)
      );
      return data as EvidenceAssessmentResult;
    },

    async assessUncertainty(
      analysis: ResearchQuestionAnalysis,
      decomposition: ClaimDecomposition,
      evidence: EvidenceAssessmentResult
    ): Promise<UncertaintyAssessment> {
      const data = await callProxy(
        proxyUrl,
        "uncertainty-analysis",
        uncertaintyAnalysisSystemPrompt(),
        uncertaintyAnalysisUserPrompt(analysis, decomposition, evidence)
      );
      return data as UncertaintyAssessment;
    },

    async synthesizeBrief(
      analysis: ResearchQuestionAnalysis,
      decomposition: ClaimDecomposition,
      evidence: EvidenceAssessmentResult,
      uncertainty: UncertaintyAssessment
    ): Promise<BriefResearchBrief> {
      const data = await callProxy(
        proxyUrl,
        "brief-synthesis",
        briefSynthesisSystemPrompt(),
        briefSynthesisUserPrompt(analysis, decomposition, evidence, uncertainty)
      );
      return data as BriefResearchBrief;
    },
  };
}
