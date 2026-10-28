"use client";

import Link from "next/link";
import { getSet, setsForTopic } from "@/lib/content";
import { TOPICS } from "@/lib/sections";
import { Runner, type RunItem } from "@/components/Runner";

export function SetClient({ id }: { id: string }) {
  const s = getSet(id)!;
  const t = TOPICS[s.set.topic];
  const items: RunItem[] =
    s.kind === "mcq" ? s.set.questions.map((q) => ({ kind: "mcq" as const, q })) : s.set.questions.map((q) => ({ kind: "qa" as const, q }));
  const siblings = setsForTopic(s.set.topic);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <Link href="/bank" className="font-semibold text-indigo-600 hover:underline">
          📝 Question bank
        </Link>
        <span className="text-slate-400">/</span>
        <Link href={`/guide/${s.set.topic}`} className="font-semibold text-slate-600 hover:underline">
          {t.emoji} {t.title}
        </Link>
        <span className="ml-auto flex flex-wrap gap-1">
          {siblings.map((x) => (
            <Link
              key={x.set.id}
              href={`/set/${x.set.id}`}
              className={`rounded-md px-2 py-0.5 text-xs font-bold ${x.set.id === id ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              {x.kind === "mcq" ? "MC" : "W"}
              {x.set.id.slice(-1)}
            </Link>
          ))}
        </span>
      </div>
      <Runner
        key={id}
        mode="set"
        runId={s.set.id}
        here={`/set/${s.set.id}`}
        title={`${t.title} — ${s.kind === "mcq" ? "Multiple choice" : "Written"} ${s.set.id.slice(-1)}: ${s.set.title.split(" · ").slice(1).join(" · ") || s.set.title}`}
        subtitle={s.set.subtitle}
        items={items}
        backHref="/bank"
        backLabel="📝 All sets"
      />
    </div>
  );
}
