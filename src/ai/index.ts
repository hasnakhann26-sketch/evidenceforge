// Barrel export for the AI service layer.
// Consumers import from "@/ai" rather than individual files.

export type { AIProvider } from "@/ai/AIProvider";
export { getAIConfig, isDemoMode, type AIConfig, type ProviderType } from "@/ai/config";
export { getProvider, createProvider } from "@/ai/providerFactory";
export { MockAIProvider } from "@/ai/providers/MockAIProvider";
export { createOpenAICompatibleProvider } from "@/ai/providers/OpenAICompatibleProvider";
