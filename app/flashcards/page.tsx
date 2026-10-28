"use client";

import { useMemo, useState } from "react";
import { GUIDES } from "@/lib/content";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import { useStore } from "@/lib/store";
import { Rich } from "@/components/Rich";
import type { TopicId } from "@/lib/types";

type Filter = "all" | TopicId | "learning";

const ALL_CARDS = TOPIC_IDS.flatMap((t) => GUIDES[t].flashcards.map((c) => ({ ...c, topic: t, key: `${t}:${c.front}` })));

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsPage() {
  const { p, setCard, ready } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    const base = ALL_CARDS.filter((c) => (filter === "all" ? true : filter === "learning" ? p.cards[c.key] !== "known" : c.topic === filter));
    return seed ? shuffle(base) : base;
    // a new deck only when the filter or shuffle changes, not on every tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, seed, ready]);

  const card = deck[i];
  const known = ALL_CARDS.filter((c) => p.cards[c.key] === "known").length;

  const next = (state?: "known" | "learning") => {
    if (card && state) setCard(card.key, state);
    setFlipped(false);
    setI((x) => (x + 1 < deck.length ? x + 1 : deck.length));
  };

  const pick = (f: Filter) => {
    setFilter(f);
    setI(0);
    setFlipped(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🃏 Flashcards</h1>
        <p className="mt-1 text-slate-600">
          Key facts, methods and vocabulary for all six topics. You know{" "}
          <strong>
            {known}/{ALL_CARDS.length}
          </strong>
          .
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="nav-scroll flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-sm font-semibold">
          {(["all", ...TOPIC_IDS, "learning"] as Filter[]).map((f) => (
            <button key={f} onClick={() => pick(f)} className={`shrink-0 rounded-lg px-3 py-1.5 ${filter === f ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
              {f === "all" ? "All" : f === "learning" ? "Still learning" : `${TOPICS[f].emoji} ${TOPICS[f].short}`}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setSeed((s) => s + 1);
            setI(0);
            setFlipped(false);
          }}
          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
        >
          🔀 Shuffle
        </button>
      </div>

      {card ? (
        <>
          <p className="text-center text-sm text-slate-500">
            Card {i + 1} of {deck.length}
            {p.cards[card.key] === "known" ? " · ✅ known" : p.cards[card.key] === "learning" ? " · 🔁 still learning" : ""}
          </p>
          <button
            onClick={() => setFlipped((f) => !f)}
            className={`flex min-h-64 w-full flex-col items-center justify-center rounded-3xl border-2 p-6 text-center shadow-sm transition ${
              flipped ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-200"
            }`}
          >
            <span className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {TOPICS[card.topic].title} · {flipped ? "answer" : "question"}
            </span>
            {!flipped ? (
              <Rich text={card.front} className="text-2xl font-extrabold text-slate-900" />
            ) : (
              <Rich text={card.back} className="text-lg leading-relaxed text-slate-800" />
            )}
            {!flipped && <span className="mt-4 text-sm font-semibold text-indigo-600">Answer it in your head, then tap to flip</span>}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => next("learning")} className="rounded-xl border-2 border-amber-300 bg-amber-50 py-3 font-bold text-amber-800">
              🔁 Still learning
            </button>
            <button onClick={() => next("known")} className="rounded-xl border-2 border-emerald-400 bg-emerald-50 py-3 font-bold text-emerald-800">
              ✅ Got it
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-5xl">{deck.length ? "🎉" : "🌟"}</div>
          <p className="mt-2 text-lg font-bold text-slate-900">{deck.length ? "Deck finished!" : "No cards here — you know them all!"}</p>
          <button onClick={() => pick("learning")} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">
            Go through the ‘still learning’ pile
          </button>
        </div>
      )}
    </div>
  );
}
