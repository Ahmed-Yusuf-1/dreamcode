/**
 * Server-only AI helper for the Dream Guide (the Socratic hint mentor).
 *
 * Provider-agnostic by design: the actual model call is selected at runtime
 * from env vars, so you can plug in Gemini, OpenAI (or any OpenAI-compatible
 * endpoint), or Anthropic without touching code. Until the env vars are set,
 * `isGuideConfigured()` is false and the guide stays switched off. There is no
 * SDK dependency here - everything goes through the built-in `fetch`.
 *
 * Required env (server-only, NEVER NEXT_PUBLIC_):
 *   AI_PROVIDER  one of: gemini | openai | anthropic   (openai also covers any
 *                OpenAI-compatible endpoint via AI_BASE_URL)
 *   AI_API_KEY   the provider API key
 *   AI_MODEL     the model id (e.g. a Gemini, GPT, or Claude model name)
 *   AI_BASE_URL  optional override of the provider base URL
 */

export type GuideRole = "user" | "assistant";

export interface GuideMessage {
  role: GuideRole;
  content: string;
}

export interface GuideProblem {
  title: string;
  instructions?: string;
  functionName?: string;
  language?: string;
  kind?: string;
}

/** Thrown on any provider/transport failure, carrying the HTTP status to return. */
export class GuideError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GuideError";
    this.status = status;
  }
}

const MAX_OUTPUT_TOKENS = 600;
const REQUEST_TIMEOUT_MS = 30_000;

function config() {
  return {
    provider: (process.env.AI_PROVIDER || "").toLowerCase().trim(),
    apiKey: (process.env.AI_API_KEY || "").trim(),
    model: (process.env.AI_MODEL || "").trim(),
    baseUrl: (process.env.AI_BASE_URL || "").trim(),
  };
}

/** True only when a provider, key, and model are all present. */
export function isGuideConfigured(): boolean {
  const c = config();
  return c.provider.length > 0 && c.apiKey.length > 0 && c.model.length > 0;
}

/** Builds the strict Socratic system prompt plus the learner's problem context. */
export function buildSystemPrompt(problem: GuideProblem, code?: string): string {
  const rules = [
    "You are the Dream Guide, a Socratic programming mentor inside a learn-to-code app called dreamcode.",
    "",
    "Your single rule: you ask questions and give graduated hints. You NEVER write the working solution, never hand over a full corrected function, and never paste more than a tiny illustrative snippet (one or two lines, only to show a concept, never the learner's actual answer).",
    "",
    "Escalate gently as the conversation goes on:",
    "1. First, ask a question that gets the learner to explain their thinking or read their own code out loud.",
    "2. If they are still stuck, nudge toward the specific line or idea that matters, still as a question.",
    "3. Only if they remain stuck after several turns, offer a worked analogy on a DIFFERENT example, never their exact problem.",
    "",
    "If the learner asks you to just give the answer or write the code for them, kindly decline and ask a guiding question instead. The whole point is that they solve it themselves.",
    "",
    "Keep replies short, usually two to four sentences. Be warm and encouraging. Write in plain prose: no em dashes, no en dashes, no decorative emoji. Use plain hyphens, periods, and commas.",
  ];

  const ctx: string[] = ["", "Here is what the learner is working on:", `- Task: ${problem.title}`];
  if (problem.kind) ctx.push(`- Type: ${problem.kind}`);
  if (problem.language) ctx.push(`- Language: ${problem.language}`);
  if (problem.functionName) ctx.push(`- Function they are writing: ${problem.functionName}`);
  if (problem.instructions) ctx.push(`- Instructions they were given: ${problem.instructions}`);

  if (code && code.trim()) {
    ctx.push(
      "",
      "The learner's current code (read it and reason about it, but do not rewrite it for them):",
      "```",
      code.slice(0, 4000),
      "```",
    );
  }

  return [...rules, ...ctx].join("\n");
}

/** Calls the configured provider and returns the guide's reply text. */
export async function generateHint(opts: { system: string; messages: GuideMessage[] }): Promise<string> {
  const c = config();
  if (!isGuideConfigured()) {
    throw new GuideError("the Dream Guide is not configured", 503);
  }
  switch (c.provider) {
    case "gemini":
      return geminiHint(c, opts);
    case "openai":
    case "openai-compatible":
      return openaiHint(c, opts);
    case "anthropic":
      return anthropicHint(c, opts);
    default:
      throw new GuideError(`unknown AI_PROVIDER "${c.provider}"`, 500);
  }
}

type Cfg = ReturnType<typeof config>;

async function postJson(
  url: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    const reason = e instanceof Error && e.name === "AbortError" ? "timed out" : "could not be reached";
    throw new GuideError(`the AI provider ${reason}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GuideError(`the AI provider returned ${res.status}: ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

// Gemini (Google Generative Language API)
async function geminiHint(c: Cfg, { system, messages }: { system: string; messages: GuideMessage[] }) {
  const base = (c.baseUrl || "https://generativelanguage.googleapis.com").replace(/\/$/, "");
  const url = `${base}/v1beta/models/${encodeURIComponent(c.model)}:generateContent?key=${encodeURIComponent(c.apiKey)}`;
  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.7 },
  };
  const data = await postJson(url, {}, body);
  const candidates = data.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
  const text = (candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new GuideError("the AI provider returned an empty reply");
  return text;
}

// OpenAI and OpenAI-compatible Chat Completions
async function openaiHint(c: Cfg, { system, messages }: { system: string; messages: GuideMessage[] }) {
  const base = (c.baseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  const body = {
    model: c.model,
    max_tokens: MAX_OUTPUT_TOKENS,
    messages: [{ role: "system", content: system }, ...messages],
  };
  const data = await postJson(url, { Authorization: `Bearer ${c.apiKey}` }, body);
  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  const text = (choices?.[0]?.message?.content ?? "").trim();
  if (!text) throw new GuideError("the AI provider returned an empty reply");
  return text;
}

// Anthropic Messages API
async function anthropicHint(c: Cfg, { system, messages }: { system: string; messages: GuideMessage[] }) {
  const base = (c.baseUrl || "https://api.anthropic.com").replace(/\/$/, "");
  const url = `${base}/v1/messages`;
  const body = {
    model: c.model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system,
    messages,
  };
  const data = await postJson(url, { "x-api-key": c.apiKey, "anthropic-version": "2023-06-01" }, body);
  const content = data.content as Array<{ type?: string; text?: string }> | undefined;
  const text = (content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("")
    .trim();
  if (!text) throw new GuideError("the AI provider returned an empty reply");
  return text;
}
