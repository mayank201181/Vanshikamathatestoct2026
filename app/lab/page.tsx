"use client";

import { useState } from "react";
import { LABS } from "@/components/Labs";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { TopicId } from "@/lib/types";

export default function LabPage() {
  const [topic, setTopic] = useState<TopicId>("fr");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🔬 Maths labs</h1>
        <p className="mt-1 text-slate-600">Change the numbers and watch what happens — the quickest way to see <em>why</em> a method works.</p>
      </div>
      <div className="nav-scroll flex gap-1.5 overflow-x-auto pb-1">
        {TOPIC_IDS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold ${topic === t ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
          >
            {TOPICS[t].emoji} {TOPICS[t].short}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        {LABS[topic].map((w) => (
          <div key={w.id}>
            <p className="mb-2 text-sm text-slate-600">{w.blurb}</p>
            <ErrorBoundary>
              <w.Component />
            </ErrorBoundary>
          </div>
        ))}
      </div>
    </div>
  );
}
