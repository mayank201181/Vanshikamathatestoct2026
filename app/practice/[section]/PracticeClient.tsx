"use client";

import Link from "next/link";
import { questionsForSection } from "@/lib/content";
import { sectionHref, sectionMeta } from "@/lib/sections";
import { Runner, type RunItem } from "@/components/Runner";

export function PracticeClient({ section }: { section: string }) {
  const s = sectionMeta(section)!;
  const order = { warmup: 0, core: 1, challenge: 2 } as const;
  const items: RunItem[] = questionsForSection(section)
    .sort((a, b) => order[a.q.difficulty] - order[b.q.difficulty])
    .map((x) => (x.kind === "mcq" ? { kind: "mcq" as const, q: x.q as never } : { kind: "qa" as const, q: x.q as never }));
  return (
    <div className="space-y-3">
      <Link href={sectionHref(section)} className="text-sm font-semibold text-indigo-600 hover:underline">
        ← Read “{s.label}” in the guide
      </Link>
      <Runner
        mode="practice"
        runId={`practice-${section}`}
        here={`/practice/${section}`}
        title={`${s.emoji} Practise: ${s.label}`}
        subtitle={`Every question on this skill from all 8 sets (${items.length}), easiest first. Note: answers here also count in those sets' Mistakes list, but not their scores.`}
        items={items}
        backHref="/"
        backLabel="🏠 Home"
      />
    </div>
  );
}
