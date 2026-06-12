"use client";

import { useRef, useState } from "react";

interface GuideChatProps {
  citySlug: string;
  tourSlug: string;
  suggestions?: string[];
}

interface Message {
  role: "user" | "guide";
  text: string;
}

const defaultSuggestions = [
  "Wo gibt es hier guten Kaffee?",
  "Was ist der beste Fotospot in der Nähe?",
  "Kann ich die Tour auf 90 Minuten kürzen?",
  "Wo kann ich danach etwas trinken gehen?",
];

/**
 * «Frag deinen Guide» – Chat an /api/guide (OpenAI mit Tour-Kontext).
 * Ohne OPENAI_API_KEY antwortet der Guide mit einem freundlichen Hinweis.
 */
export default function GuideChat({
  citySlug,
  tourSlug,
  suggestions = defaultSuggestions,
}: GuideChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: citySlug, tour: tourSlug, question: q }),
      });
      const data = await res.json().catch(() => null);
      const answer =
        res.ok && data?.answer
          ? data.answer
          : res.status === 503
            ? "Der KI-Guide ist noch nicht aktiviert. Trag deinen OPENAI_API_KEY in .env.local ein – dann beantworte ich dir unterwegs alles, von Kaffee-Tipps bis Routen-Abkürzungen."
            : "Hoppla, das hat gerade nicht geklappt. Versuch es gleich nochmal.";
      setMessages((m) => [...m, { role: "guide", text: answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "guide", text: "Keine Verbindung – bist du offline?" },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-cream/10 bg-ink-800 px-6 py-4">
        <h3 className="font-bold text-cream">💬 Frag deinen Guide</h3>
        <p className="mt-1 text-xs text-cream-dim">
          Kaffee, Fotospots, Abkürzungen, Bars – frag, was du unterwegs wissen
          willst.
        </p>
      </div>

      <div
        ref={listRef}
        className="max-h-72 space-y-3 overflow-y-auto px-6 py-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-cream/20 bg-ink-900 px-3 py-1.5 text-xs font-medium text-cream-dim transition hover:border-cream/40 hover:text-cream"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-ink-800 text-cream"
                : "bg-ink-800 text-cream-dim"
            }`}
          >
            {m.text}
          </div>
        ))}
        {busy && (
          <div className="max-w-[85%] animate-pulse rounded-2xl bg-ink-800 px-4 py-2.5 text-sm text-cream-faint">
            Dein Guide denkt nach…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex gap-2 border-t border-cream/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Deine Frage…"
          maxLength={300}
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-cream-faint focus:border-glacier-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-signal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal-600 disabled:opacity-40"
        >
          Senden
        </button>
      </form>
    </div>
  );
}
