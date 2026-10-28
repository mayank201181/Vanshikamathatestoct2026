"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { GUIDES } from "@/lib/content";
import { TOPICS, UNITS } from "@/lib/sections";

export default function GuideIndex() {
  const { p, ready } = useStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">📖 Revision guides</h1>
        <p className="mt-1 text-slate-600">
          Six guides — one per topic, one section per lesson in your OneNote. Each section starts with a puzzle, explains the method and <em>why</em> it works, walks through
          examples from your class notes, and ends with a quick check. The guide remembers the section you were reading.
        </p>
      </div>
      {UNITS.map((u) => (
        <section key={u.unit} className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">{u.title}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {u.topics.map((t) => {
              const g = GUIDES[t];
              const read = g.sections.filter((s) => p.guidesRead[s.id]).length;
              const pos = ready ? g.sections.find((s) => s.id === p.guidePos[t]) : undefined;
              return (
                <Link key={t} href={`/guide/${t}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300">
                  <div className="text-3xl">{TOPICS[t].emoji}</div>
                  <h3 className="mt-1 text-lg font-extrabold text-slate-900">{TOPICS[t].title}</h3>
                  <p className="text-sm text-slate-600">{TOPICS[t].blurb}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {g.sections.length} sections · {ready ? `${read} done` : ""}
                  </p>
                  {pos && <p className="mt-1 text-xs font-semibold text-indigo-700">▶ Continue: {pos.heading}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
