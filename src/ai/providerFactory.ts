// Provider factory — selects and instantiates the AI provider based
// on environment configuration.
//
// This is the single entry point for obtaining an AIProvider instance.
// The InvestigationService and other consumers call getProvider()
// rather than importing a specific provider directly.

import type { AIProvider } from "@/ai/AIProvider";
import { getAIConfig, type AIConfig } from "@/ai/config";
import { MockAIProvider } from "@/ai/providers/MockAIProvider";
import { createOpenAICompatibleProvider } from "@/ai/providers/OpenAICompatibleProvider";
import { createGeminiProvider } from "@/ai/providers/GeminiProvider";

let cachedProvider: AIProvider | null = null;
let cachedConfigKey: string | null = null;

export function createProvider(config: AIConfig): AIProvider {
  switch (config.provider) {
    case "openai-compatible":
      return createOpenAICompatibleProvider(config);
    case "gemini":
      return createGeminiProvider(config);
    case "mock":
    default:
      return MockAIProvider;
  }
}

export function getProvider(): AIProvider {
  const config = getAIConfig();
  const configKey = `${config.provider}:${config.model}:${config.apiBase}`;

  if (cachedProvider && cachedConfigKey === configKey) {
    return cachedProvider;
  }

  cachedProvider = createProvider(config);
  cachedConfigKey = configKey;
  return cachedProvider;
}
