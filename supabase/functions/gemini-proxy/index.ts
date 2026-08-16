// Gemini proxy Edge Function for EvidenceForge.
//
// SECURITY MODEL:
//   This function holds the GEMINI_API_KEY as a server-side secret.
//   The browser never sees the key. The frontend sends a pipeline stage
//   name and its input; this function calls the Gemini API and returns
//   the structured JSON response.
//
//   The key is read ONLY from Deno.env.get("GEMINI_API_KEY") — never
//   from the request body, never from the URL, never from client code.
//
// ROUTES:
//   POST /gemini-proxy  — body: { stage: string, systemPrompt: string, userPrompt: string }
//   Returns: { data: <parsed JSON from Gemini> } on success
//   Returns: { error: string } on failure (never includes the API key)

import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODEL = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 2;

interface ProxyRequest {
  stage: string;
  systemPrompt: string;
  userPrompt: string;
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeErrorMessage(status: number, _rawMessage: string): string {
  // Never expose the API key or upstream headers in error messages.
  if (status === 401 || status === 403) {
    return "Authentication with the AI provider failed. Check that the API key is valid.";
  }
  if (status === 429) {
    return "The AI provider rate limit was reached. Please try again in a moment.";
  }
  if (status >= 500) {
    return "The AI provider is temporarily unavailable. Please try again.";
  }
  return "The AI provider returned an error. Please try again.";
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const result = await model.generateContent(userPrompt, {
      abortSignal: controller.signal,
    });
    const text = result.response.text();
    if (!text || text.trim().length === 0) {
      throw new Error("The AI provider returned an empty response.");
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callGeminiWithRetry(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGemini(apiKey, systemPrompt, userPrompt);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Retry only on transient failures (timeout / network / 5xx / rate limit).
      const msg = lastError.message.toLowerCase();
      const isTransient =
        msg.includes("timeout") ||
        msg.includes("aborted") ||
        msg.includes("network") ||
        msg.includes("fetch") ||
        msg.includes("503") ||
        msg.includes("502") ||
        msg.includes("429");

      if (!isTransient || attempt === MAX_RETRIES) break;

      // Exponential backoff: 1s, 2s
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error("Unknown error calling AI provider.");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed. Use POST.");
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return errorResponse(
      500,
      "The AI service is not configured. The server-side API key is missing."
    );
  }

  let body: ProxyRequest;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, "Invalid JSON in request body.");
  }

  if (!body.stage || !body.systemPrompt || !body.userPrompt) {
    return errorResponse(
      400,
      "Missing required fields: stage, systemPrompt, userPrompt."
    );
  }

  try {
    const data = await callGeminiWithRetry(
      apiKey,
      body.systemPrompt,
      body.userPrompt
    );
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    // Determine HTTP-like status from error for sanitized message
    const status = msg.includes("401") || msg.includes("403")
      ? 401
      : msg.includes("429")
      ? 429
      : msg.includes("timeout") || msg.includes("aborted")
      ? 504
      : 502;

    return errorResponse(status, sanitizeErrorMessage(status, msg));
  }
});
