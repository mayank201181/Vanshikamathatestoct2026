"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PAPERS, qaMarks } from "@/lib/content";

/** The four class-test practice papers, with where she's up to on each. */
export function PaperCards() {
  const { p, ready } = useStore();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PAPERS.map((paper) => {
        const marks = paper.questions.reduce((s, q) => s + qaMarks(q), 0);
        const att = p.attempts[paper.id];
        const done = att ? paper.questions.filter((q) => att.answers[q.id] !== undefined).length : 0;
        const best = p.best[paper.id];
        const inProgress = !!att && done > 0 && !att.completed;
        const status = !ready
          ? " "
          : inProgress
            ? `${done} of ${paper.questions.length} answered — saved, carry on where you stopped`
            : best
              ? `Best: ${best.correct} / ${best.total} marks (${best.pct}%)`
              : "Not started yet";
        return (
          <div key={paper.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">📄 {paper.title}</h3>
              <span className="text-xs font-semibold text-slate-500">
                {paper.questions.length} questions · {marks} marks · {paper.minutes} min
              </span>
            </div>
            <p className={`mt-1 text-sm ${inProgress ? "font-semibold text-indigo-700" : best ? "font-semibold text-emerald-700" : "text-slate-500"}`}>{status}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link href={`/paper/${paper.id}`} className="rounded-xl bg-indigo-600 px-3.5 py-2 font-bold text-white hover:bg-indigo-700">
                {inProgress ? "Continue →" : best ? "See results →" : "Start on screen →"}
              </Link>
              <Link href={`/paper/${paper.id}/print`} className="rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
                🖨️ Print
              </Link>
              <Link href={`/paper/${paper.id}/answers`} className="rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
                ✅ Answers
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
