/**
 * Gemini (Vertex AI Express) für strukturierte Antworten – nur serverseitig.
 * Liefert geparstes JSON; bei Fehler oder Überlast wird das nächste Modell versucht.
 */
const MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

export async function geminiJson<T>(prompt: string, opts: { temperature?: number; timeoutMs?: number; system?: string } = {}): Promise<{ data: T; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("KI nicht eingerichtet.");
  let last: Error | undefined;
  for (const model of MODELS) {
    try {
      const res = await fetch(`https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
        method: "POST",
        signal: AbortSignal.timeout(opts.timeoutMs ?? 45_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(opts.system ? { systemInstruction: { parts: [{ text: opts.system }] } } : {}),
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: opts.temperature ?? 0.6 },
        }),
      });
      if (!res.ok) throw new Error(`Gemini ${model} ${res.status}`);
      const j = await res.json();
      const text = (j?.candidates?.[0]?.content?.parts as { text?: string }[] | undefined)?.map((p) => p.text ?? "").join("") ?? "";
      const clean = text.replace(/^```(?:json)?\s*|\s*```$/g, "");
      return { data: JSON.parse(clean) as T, model };
    } catch (e) {
      last = e as Error;
    }
  }
  throw last ?? new Error("KI nicht erreichbar.");
}
