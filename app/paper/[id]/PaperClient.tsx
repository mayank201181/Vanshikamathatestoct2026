"use client";

import Link from "next/link";
import { PAPERS, getPaper, qaMarks } from "@/lib/content";
import { Runner, type RunItem } from "@/components/Runner";

export function PaperClient({ id }: { id: string }) {
  const paper = getPaper(id)!;
  const items: RunItem[] = paper.questions.map((q) => ({ kind: "qa" as const, q }));
  const marks = paper.questions.reduce((s, q) => s + qaMarks(q), 0);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <Link href="/mock" className="font-semibold text-indigo-600 hover:underline">
          🎓 Mock tests
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-600">{paper.title}</span>
        <span className="ml-auto flex flex-wrap gap-1">
          {PAPERS.map((x, i) => (
            <Link
              key={x.id}
              href={`/paper/${x.id}`}
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${x.id === id ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              P{i + 1}
            </Link>
          ))}
          <Link href={`/paper/${id}/print`} className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
            🖨️ Print
          </Link>
        </span>
      </div>
      <Runner
        key={id}
        mode="set"
        runId={paper.id}
        here={`/paper/${paper.id}`}
        title={`📄 ${paper.title}`}
        subtitle={`Like your class mock test: ${items.length} questions, ${marks} marks, about ${paper.minutes} minutes. Work on paper, type each answer in its box. Saved as you go.`}
        items={items}
        backHref="/mock"
        backLabel="🎓 Mock tests"
      />
    </div>
  );
}
