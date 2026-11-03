"use client";

import Link from "next/link";
import { useState } from "react";
import { emptyAttempt, useStore } from "@/lib/store";
import { lookup, qaMarks } from "@/lib/content";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import { buildMock, MOCK_RUN, openMistakeIds } from "@/lib/mock";
import { Runner, type RunItem } from "@/components/Runner";
import type { QA } from "@/lib/types";

const RUN = MOCK_RUN;

export default function MockPage() {
  const { p, ready, saveAttempt, resetAttempt, markShown } = useStore();
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const saved = p.attempts[RUN];
  const savedIds = (saved?.ids ?? []).filter((id) => lookup(id));
  const savedDone = saved ? savedIds.filter((id) => saved.answers[id] !== undefined).length : 0;
  const canResume = !!saved && savedIds.length > 0 && !saved.completed;
  const mistakes = ready ? openMistakeIds(p).length : 0;

  const start = () => {
    const built = buildMock(p);
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
          ← Back to mock tests
        </button>
        <Runner
          key={runKey}
          mode="mock"
          runId={RUN}
          here="/mock"
          title="🎓 Mock class test"
          subtitle={`${items.length} questions · ${marks} marks · aim for about 40 minutes, no calculator, working on paper. Saved as you go.`}
          items={items}
          backHref="/mock"
          backLabel="🎓 Mock tests"
          onRestart={start}
        />
      </div>
    );
  }

  if (!ready) return <div className="h-64 animate-pulse rounded-2xl bg-white" />;

  const history = p.history.filter((h) => h.setId === RUN);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🎓 Mock class test</h1>
        <p className="mt-1 text-slate-600">
          A mixed paper across all six topics — 2 multiple-choice questions and 1 written question from each of Fractions, Percentages, Ratio, Expressions, Substitution and
          Sequences. <strong>Every mock has brand-new numbers</strong>: the same kinds of question come up (that&apos;s what the test will ask), but you&apos;ll never see
          exactly the same question twice. Your weakest skills come up most.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {TOPIC_IDS.map((t) => (
          <span key={t} className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">
            {TOPICS[t].emoji} {TOPICS[t].short}
          </span>
        ))}
      </div>
      {canResume && (
        <button
          onClick={() => setRunning(true)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50 px-5 py-4 text-left hover:bg-indigo-100"
        >
          <span>
            <span className="block text-lg font-extrabold text-indigo-900">Continue your mock test →</span>
            <span className="text-sm text-indigo-800">
              {savedDone} of {savedIds.length} done — your answers are saved.
            </span>
          </span>
          <span className="text-3xl">▶️</span>
        </button>
      )}
      <button
        onClick={start}
        className={`w-full rounded-2xl px-5 py-4 text-lg font-extrabold shadow sm:w-auto ${canResume ? "border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
      >
        {canResume ? "Start a brand-new mock instead" : "Start a mock test →"}
      </button>
      {saved?.completed && (
        <p className="text-sm text-slate-600">
          Last mock finished.{" "}
          <button onClick={() => setRunning(true)} className="font-semibold text-indigo-600 underline underline-offset-2">
            See its results
          </button>
          {history.length > 0 && ` · ${history.length} mock${history.length === 1 ? "" : "s"} so far: ${history.slice(-5).map((h) => `${h.pct}%`).join(", ")}`}
        </p>
      )}

      <Link
        href="/mock/mistakes"
        className="flex items-center justify-between gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 px-5 py-4 hover:bg-rose-100"
      >
        <span>
          <span className="block text-lg font-extrabold text-rose-900">🔁 Mock test from my mistakes →</span>
          <span className="text-sm text-rose-800">
            {mistakes
              ? `A new-numbers version of each of your ${mistakes} open mistake${mistakes === 1 ? "" : "s"}. Get one right and it comes off your list.`
              : "No open mistakes right now — do a mock or a set first, then come back."}
          </span>
        </span>
        <span className="text-3xl">🎯</span>
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-bold text-slate-800">Make it feel like the real thing</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Set a 40-minute timer, put your phone away and write your working on paper.</li>
          <li>Don’t use hints — save them for practice.</li>
          <li>
            Afterwards, every question you dropped marks on goes to your{" "}
            <Link href="/review" className="font-semibold text-indigo-600 underline">
              Mistakes list
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
