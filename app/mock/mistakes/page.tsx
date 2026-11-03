"use client";

import Link from "next/link";
import { useState } from "react";
import { emptyAttempt, useStore } from "@/lib/store";
import { lookup, qaMarks } from "@/lib/content";
import { buildMistakesMock, MISTAKES_MOCK_RUN, openMistakeIds } from "@/lib/mock";
import { Runner, type RunItem } from "@/components/Runner";
import type { QA } from "@/lib/types";

const RUN = MISTAKES_MOCK_RUN;
const LIMIT = 20;

export default function MistakesMockPage() {
  const { p, ready, saveAttempt, resetAttempt, markShown } = useStore();
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const saved = p.attempts[RUN];
  const savedIds = (saved?.ids ?? []).filter((id) => lookup(id));
  const savedDone = saved ? savedIds.filter((id) => saved.answers[id] !== undefined).length : 0;
  const canResume = !!saved && savedIds.length > 0 && !saved.completed;
  const open = ready ? openMistakeIds(p) : [];

  const start = () => {
    const built = buildMistakesMock(p, LIMIT);
    if (!built.ids.length) return;
    resetAttempt(RUN);
    saveAttempt(RUN, emptyAttempt(built.ids));
    markShown(built.shown);
    setRunKey((k) => k + 1);
    setRunning(true);
  };

  if (running && savedIds.length) {
    const items: RunItem[] = savedIds
      .map((id) => lookup(id)!)
      .map((x) => (x.kind === "mcq" ? { kind: "mcq" as const, q: x.q as never } : { kind: "qa" as const, q: x.q as never }));
    const marks = items.reduce((s, it) => s + (it.kind === "qa" ? qaMarks(it.q as QA) : 1), 0);
    return (
      <div className="space-y-3">
        <button onClick={() => setRunning(false)} className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Back
        </button>
        <Runner
          key={runKey}
          mode="mock"
          runId={RUN}
          here="/mock/mistakes"
          title="🔁 Mock test from my mistakes"
          subtitle={`${items.length} questions · ${marks} marks · the same skills you slipped on, with new numbers. Saved as you go.`}
          items={items}
          backHref="/review"
          backLabel="🔁 Mistakes list"
          onRestart={start}
        />
      </div>
    );
  }

  if (!ready) return <div className="h-64 animate-pulse rounded-2xl bg-white" />;

  const history = p.history.filter((h) => h.setId === RUN);
  const n = Math.min(open.length, LIMIT);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🔁 Mock test from my mistakes</h1>
        <p className="mt-1 text-slate-600">
          For every question on your Mistakes list you get a <strong>new version of the same skill with different numbers</strong> — so you can&apos;t just remember the
          answer, you have to do the method. Get it right and the original mistake comes off your list; get it wrong and it stays there for next time.
        </p>
      </div>

      {canResume && (
        <button
          onClick={() => setRunning(true)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50 px-5 py-4 text-left hover:bg-indigo-100"
        >
          <span>
            <span className="block text-lg font-extrabold text-indigo-900">Continue your mistakes mock →</span>
            <span className="text-sm text-indigo-800">
              {savedDone} of {savedIds.length} done — your answers are saved.
            </span>
          </span>
          <span className="text-3xl">▶️</span>
        </button>
      )}

      {open.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-5xl">🎉</div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">No open mistakes</h2>
          <p className="mt-1 text-slate-600">Do a mock test or a question set — anything you slip on will appear here.</p>
          <Link href="/mock" className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">
            🎓 Mock test
          </Link>
        </div>
      ) : (
        <button
          onClick={start}
          className={`w-full rounded-2xl px-5 py-4 text-lg font-extrabold shadow sm:w-auto ${canResume ? "border border-rose-300 bg-white text-rose-700 hover:bg-rose-50" : "bg-rose-600 text-white hover:bg-rose-700"}`}
        >
          {canResume ? `Start a fresh one instead (${n} questions)` : `Start: ${n} question${n === 1 ? "" : "s"} from my mistakes →`}
        </button>
      )}
      {open.length > LIMIT && <p className="text-sm text-slate-500">You have {open.length} open mistakes — this mock takes the {LIMIT} most recent. Do another one after to cover the rest.</p>}
      {history.length > 0 && (
        <p className="text-sm text-slate-600">
          Mistakes mocks so far: {history.slice(-5).map((h) => `${h.pct}%`).join(", ")}
        </p>
      )}
    </div>
  );
}
