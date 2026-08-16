// AI configuration layer.
//
// Reads provider selection and model configuration from environment
// variables. API keys are NEVER read here or exposed to client-side
// code — real providers that need credentials must be proxied through
// a server-side edge function or backend.
//
// Environment variables (all optional, defaults to "mock"):
//   VITE_AI_PROVIDER        — "mock" | "openai-compatible" | "gemini" (default: "mock")
//   VITE_AI_MODEL           — model identifier string (default: "")
//   VITE_AI_API_BASE        — base URL for an OpenAI-compatible endpoint (default: "")
//   VITE_GEMINI_PROXY_URL   — Supabase project URL for the Gemini proxy Edge Function (default: "")
//
// Secrets (server-side only, never prefixed with VITE_):
//   GEMINI_API_KEY          — read only by the gemini-proxy Edge Function, never
//   AI_API_KEY / OPENAI_API_KEY — read only by edge functions, never
//   imported into client code.

export type ProviderType = "mock" | "openai-compatible" | "gemini";

export interface AIConfig {
  provider: ProviderType;
  model: string;
  apiBase: string;
}

function resolveProvider(raw: string | undefined): ProviderType {
  if (raw === "openai-compatible") return "openai-compatible";
  if (raw === "gemini") return "gemini";
  return "mock";
}

export function getAIConfig(): AIConfig {
  const provider = resolveProvider(import.meta.env.VITE_AI_PROVIDER);
  const model = import.meta.env.VITE_AI_MODEL ?? "";
  const apiBase =
    provider === "gemini"
      ? import.meta.env.VITE_GEMINI_PROXY_URL ?? ""
      : import.meta.env.VITE_AI_API_BASE ?? "";

  return { provider, model, apiBase };
}

export function isDemoMode(): boolean {
  return getAIConfig().provider === "mock";
}
