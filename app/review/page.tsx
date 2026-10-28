"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { emptyAttempt, useStore } from "@/lib/store";
import { lookup } from "@/lib/content";
import { openMistakes } from "@/lib/share";
import { Runner, type RunItem } from "@/components/Runner";
import { RichInline } from "@/components/Rich";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import type { TopicId } from "@/lib/types";

const RUN = "review";

export default function ReviewPage() {
  const { p, ready, saveAttempt, resetAttempt } = useStore();
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [filter, setFilter] = useState<"all" | TopicId>("all");

  const open = useMemo(() => (ready ? openMistakes(p) : []), [p, ready]);
  const fixed = useMemo(() => Object.values(p.mistakes).filter((v) => v === false).length, [p.mistakes]);
  const filtered = open.filter((id) => filter === "all" || lookup(id)?.q.topic === filter);

  // A Mistakes round is saved like a set, so she can leave (e.g. to the guide) and carry on later.
  const saved = p.attempts[RUN];
  const savedIds = (saved?.ids ?? []).filter((id) => lookup(id));
  const savedDone = saved ? savedIds.filter((id) => saved.answers[id] !== undefined).length : 0;
  const canResume = !!saved && savedIds.length > 0 && !saved.completed && savedDone < savedIds.length;

  const startNew = (ids: string[]) => {
    resetAttempt(RUN);
    saveAttempt(RUN, emptyAttempt(ids));
    setRunKey((k) => k + 1);
    setRunning(true);
  };

  if (running && saved?.ids?.length) {
    const items: RunItem[] = savedIds
      .map((id) => lookup(id)!)
      .map((x) => (x.kind === "mcq" ? { kind: "mcq" as const, q: x.q as never } : { kind: "qa" as const, q: x.q as never }));
    return (
      <div className="space-y-3">
        <button onClick={() => setRunning(false)} className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Back to Mistakes list
        </button>
        <Runner
          key={runKey}
          mode="review"
          runId={RUN}
          here="/review"
          title="🔁 Fix my mistakes"
          subtitle="Get it right this time and it comes off your list. Saved as you go — you can leave and come back."
          items={items}
          backHref="/"
          backLabel="🏠 Home"
          onRestart={() => startNew(openMistakes(p))}
        />
      </div>
    );
  }

  if (!ready) return <div className="h-64 animate-pulse rounded-2xl bg-white" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🔁 Mistakes list</h1>
        <p className="mt-1 text-slate-600">
          Every question you got wrong (or lost a mark on) lands here. Get it fully right and it comes off the list (+ stars). This is the fastest way to gain marks before the test.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <div className="text-2xl font-extrabold text-rose-600">{open.length}</div>
          <div className="text-xs font-semibold text-rose-700">still to fix</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="text-2xl font-extrabold text-emerald-600">{fixed}</div>
          <div className="text-xs font-semibold text-emerald-700">fixed</div>
        </div>
        <div className="nav-scroll ml-auto flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-sm font-semibold">
          {(["all", ...TOPIC_IDS] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-lg px-3 py-1.5 ${filter === f ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
              {f === "all" ? "All" : `${TOPICS[f].emoji} ${TOPICS[f].short}`}
            </button>
          ))}
        </div>
      </div>

      {canResume && (
        <button
          onClick={() => setRunning(true)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50 px-5 py-4 text-left hover:bg-indigo-100"
        >
          <span>
            <span className="block text-lg font-extrabold text-indigo-900">Continue your mistakes round →</span>
            <span className="text-sm text-indigo-800">
              {savedDone} of {savedIds.length} done — your answers are saved.
            </span>
          </span>
          <span className="text-3xl">▶️</span>
        </button>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-5xl">{Object.keys(p.stats).length ? "🎉" : "📝"}</div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">{Object.keys(p.stats).length ? "Nothing to fix here!" : "No mistakes yet"}</h2>
          <p className="mt-1 text-slate-600">
            {Object.keys(p.stats).length ? "Brilliant. Try another set to find any weak spots." : "Do a question set first — anything you get wrong will show up here."}
          </p>
          <Link href="/bank" className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">
            📝 Question bank
          </Link>
        </div>
      ) : (
        <>
          <button
            onClick={() => startNew(filtered)}
            className={`w-full rounded-2xl px-5 py-4 text-lg font-extrabold shadow sm:w-auto ${canResume ? "border border-rose-300 bg-white text-rose-700 hover:bg-rose-50" : "bg-rose-600 text-white hover:bg-rose-700"}`}
          >
            {canResume ? `Start a fresh round with all ${filtered.length} →` : `Fix ${filtered.length} mistake${filtered.length === 1 ? "" : "s"} now →`}
          </button>
          <ul className="space-y-2">
            {filtered.map((id) => {
              const x = lookup(id)!;
              return (
                <li key={id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs font-semibold text-slate-500">
                    {TOPICS[x.q.topic].emoji} {TOPICS[x.q.topic].title} · {x.setTitle} · Q{x.number}
                  </div>
                  <div className="line-clamp-2 text-sm text-slate-800">
                    <RichInline text={x.q.question.split("\n")[0]} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
