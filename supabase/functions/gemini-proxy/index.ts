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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_API_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
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

function sanitizeErrorMessage(status: number): string {
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

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

function extractText(json: GeminiResponse): string {
  if (json.promptFeedback?.blockReason) {
    throw new Error(`Request blocked: ${json.promptFeedback.blockReason}`);
  }

  const candidate = json.candidates?.[0];
  if (!candidate) {
    throw new Error("No candidates in response.");
  }

  if (candidate.finishReason && candidate.finishReason !== "STOP") {
    if (candidate.finishReason === "MAX_TOKENS") {
      throw new Error("Response exceeded maximum token limit.");
    }
    if (candidate.finishReason === "SAFETY") {
      throw new Error("Response was blocked by safety filters.");
    }
  }

  const text = candidate.content?.parts?.[0]?.text;
  if (!text || text.trim().length === 0) {
    throw new Error("The AI provider returned an empty response.");
  }
  return text;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<unknown> {
  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out.");
    }
    throw new Error("Network error contacting AI provider.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errBody = await response.json();
      errorDetail = errBody?.error?.message ?? "";
    } catch {
      // ignore parse failure
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(`Auth failed: ${response.status}`);
    }
    if (response.status === 429) {
      throw new Error("Rate limited: 429");
    }
    if (response.status >= 500) {
      throw new Error(`Server error: ${response.status} ${errorDetail}`);
    }
    throw new Error(`API error: ${response.status} ${errorDetail}`);
  }

  let json: GeminiResponse;
  try {
    json = (await response.json()) as GeminiResponse;
  } catch {
    throw new Error("Malformed response from AI provider.");
  }

  const text = extractText(json);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("AI provider returned non-JSON content.");
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

      const msg = lastError.message.toLowerCase();
      const isTransient =
        msg.includes("timeout") ||
        msg.includes("timed out") ||
        msg.includes("network") ||
        msg.includes("503") ||
        msg.includes("502") ||
        msg.includes("429") ||
        msg.includes("rate limited");

      if (!isTransient || attempt === MAX_RETRIES) break;

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

    const status = msg.includes("auth failed")
      ? 401
      : msg.includes("rate limited") || msg.includes("429")
      ? 429
      : msg.includes("timeout") || msg.includes("timed out")
      ? 504
      : 502;

    return errorResponse(status, sanitizeErrorMessage(status));
  }
});
