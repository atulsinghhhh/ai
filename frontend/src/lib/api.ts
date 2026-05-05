import { BACKEND_URL } from "@/lib/config";

export interface Conversation {
  id: string;
  title: string | null;
  slug: string;
}

export interface Source {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface StreamResult {
  answer: string;
  sources: Source[];
  followUpQuestions: string[];
}

/** Fetch all conversations for the authenticated user */
export async function fetchConversations(token: string): Promise<Conversation[]> {
  const res = await fetch(`${BACKEND_URL}/conversations`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch conversations");
  return data.data;
}

/** Create a new conversation */
export async function createConversation(
  token: string,
  title: string
): Promise<Conversation> {
  const res = await fetch(`${BACKEND_URL}/conversations`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to create conversation");
  return data.data;
}

/** Parse the streamed response from the backend, separating answer text from sources */
function parseStreamedResponse(fullText: string): { answer: string; sources: Source[] } {
  const sourcesStartMarker = "======SOURCES_START======";
  const sourcesEndMarker = "======SOURCES_END======";

  const startIdx = fullText.indexOf(sourcesStartMarker);
  if (startIdx === -1) {
    return { answer: fullText, sources: [] };
  }

  const answer = fullText.substring(0, startIdx).trim();
  const endIdx = fullText.indexOf(sourcesEndMarker);
  const sourcesBlock = fullText.substring(
    startIdx + sourcesStartMarker.length,
    endIdx === -1 ? undefined : endIdx
  );

  const sources: Source[] = [];
  for (const line of sourcesBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      sources.push({
        title: parsed.title || new URL(parsed.url).hostname,
        url: parsed.url,
        content: parsed.content || "",
        score: parsed.score,
      });
    } catch {
      // skip malformed lines
    }
  }

  return { answer, sources };
}

/** Parse follow-up questions from the <FOLLOW_UP_QUESTIONS> tags in the answer */
function parseFollowUpQuestions(answer: string): { cleanAnswer: string; questions: string[] } {
  const followUpStart = answer.indexOf("<FOLLOW_UP_QUESTIONS>");
  if (followUpStart === -1) {
    return { cleanAnswer: answer, questions: [] };
  }

  const cleanAnswer = answer.substring(0, followUpStart).trim();
  const followUpEnd = answer.lastIndexOf("<FOLLOW_UP_QUESTIONS>");
  const followUpBlock = answer.substring(followUpStart, followUpEnd === followUpStart ? undefined : followUpEnd + "<FOLLOW_UP_QUESTIONS>".length);

  const questionsMatch = followUpBlock.match(/<questions>([\s\S]*?)<\/questions>/);
  if (!questionsMatch) {
    return { cleanAnswer, questions: [] };
  }

  const questions = (questionsMatch[1] ?? "")
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  return { cleanAnswer, questions };
}

/** Clean answer tags from the response */
function cleanAnswerTags(text: string): string {
  return text
    .replace(/<\/?ANSWER>/g, "")
    .replace(/<\/?FOLLOW_UP_QUESTIONS>/g, "")
    .replace(/<\/?questions>/g, "")
    .trim();
}

/** Send a query to an existing conversation and stream the response */
export async function sendQuery(
  token: string,
  conversationId: string,
  query: string,
  onChunk: (text: string) => void,
  onComplete: (result: StreamResult) => void,
  onError: (error: Error) => void
) {
  try {
    const res = await fetch(`${BACKEND_URL}/conversations/${conversationId}`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      // Only stream content before the sources marker
      const sourcesIdx = fullText.indexOf("======SOURCES_START======");
      if (sourcesIdx === -1) {
        onChunk(fullText);
      } else {
        onChunk(fullText.substring(0, sourcesIdx));
      }
    }

    const { answer, sources } = parseStreamedResponse(fullText);
    const { cleanAnswer, questions } = parseFollowUpQuestions(answer);
    const finalAnswer = cleanAnswerTags(cleanAnswer);

    onComplete({
      answer: finalAnswer,
      sources,
      followUpQuestions: questions,
    });
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function perplexityAsk(
  query: string,
  onChunk: (text: string) => void,
  onComplete: (result: StreamResult) => void,
  onError: (error: Error) => void
) {
  try {
    const res = await fetch(`${BACKEND_URL}/perplexity-ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      const sourcesIdx = fullText.indexOf("======SOURCES_START======");
      if (sourcesIdx === -1) {
        onChunk(fullText);
      } else {
        onChunk(fullText.substring(0, sourcesIdx));
      }
    }

    const { answer, sources } = parseStreamedResponse(fullText);
    const { cleanAnswer, questions } = parseFollowUpQuestions(answer);
    const finalAnswer = cleanAnswerTags(cleanAnswer);

    onComplete({
      answer: finalAnswer,
      sources,
      followUpQuestions: questions,
    });
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}

/** Fetch follow-up questions for a conversation */
export async function fetchFollowUpQuestions(
  token: string,
  conversationId: string
): Promise<string[]> {
  const res = await fetch(`${BACKEND_URL}/follow-up-questions`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId }),
  });

  if (!res.ok) throw new Error("Failed to fetch follow-up questions");

  // The backend streams the response, so we need to read the full body
  const reader = res.body?.getReader();
  if (!reader) return [];

  const decoder = new TextDecoder();
  let fullText = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fullText += decoder.decode(value, { stream: true });
  }

  try {
    // The backend returns a JSON array of strings, but it might be wrapped in tags or just a string
    // If it's a raw JSON array:
    return JSON.parse(fullText.trim());
  } catch {
    // Fallback parsing if it's not pure JSON
    return fullText
      .split("\n")
      .map(q => q.replace(/^-\s*/, "").trim())
      .filter(Boolean);
  }
}