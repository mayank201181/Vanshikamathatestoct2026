"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { qaMarks, setsForTopic } from "@/lib/content";
import { SECTIONS, TOPICS, TOPIC_IDS } from "@/lib/sections";
import type { QA, TopicId } from "@/lib/types";

export default function BankPage() {
  const { p, ready } = useStore();
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const topics = topic === "all" ? TOPIC_IDS : [topic];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">📝 Question bank</h1>
        <p className="mt-1 text-slate-600">
          For every topic: <strong>4 multiple-choice sets</strong> (10 questions) and <strong>4 written sets</strong> (6 show-your-method questions), from Foundations up to
          Stretch &amp; challenge. Everything is marked instantly and saved as you go — leave any time and carry on later.
        </p>
      </div>
      <div className="nav-scroll flex gap-1.5 overflow-x-auto pb-1">
        {(["all", ...TOPIC_IDS] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold ${topic === t ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
          >
            {t === "all" ? "All topics" : `${TOPICS[t].emoji} ${TOPICS[t].short}`}
          </button>
        ))}
      </div>

      {topics.map((t) => (
        <section key={t} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              {TOPICS[t].emoji} {TOPICS[t].title} <span className="text-sm font-semibold text-slate-400">Unit {TOPICS[t].unit}</span>
            </h2>
            <Link href={`/guide/${t}`} className="text-sm font-semibold text-indigo-600 hover:underline">
              📖 Revise the guide
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {setsForTopic(t).map(({ kind, set }) => {
              const best = p.best[set.id];
              const att = p.attempts[set.id];
              const answered = att ? Object.keys(att.answers).length : 0;
              const inProgress = ready && att && !att.completed && answered > 0;
              const counts = { warmup: 0, core: 0, challenge: 0 };
              set.questions.forEach((q) => counts[q.difficulty]++);
              const marks = kind === "qa" ? set.questions.reduce((s, q) => s + qaMarks(q as QA), 0) : set.questions.length;
              return (
                <Link
                  key={set.id}
                  href={`/set/${set.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                  <span className={`self-start rounded-full px-2.5 py-1 text-xs font-bold ${kind === "mcq" ? "bg-indigo-50 text-indigo-700" : "bg-fuchsia-50 text-fuchsia-700"}`}>
                    {kind === "mcq" ? `Multiple choice · ${set.questions.length} Qs` : `Written · ${set.questions.length} Qs · ${marks} marks`}
                  </span>
                  <h3 className="mt-2 font-extrabold text-slate-900 group-hover:text-indigo-700">{set.title}</h3>
                  <p className="flex-1 text-sm text-slate-600">{set.subtitle}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {counts.warmup} warm-up · {counts.core} core · {counts.challenge} challenge
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    {ready && best ? (
                      <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${best.pct >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>Best: {best.pct}%</span>
                    ) : inProgress ? (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-sm font-bold text-indigo-700">
                        In progress · {answered}/{set.questions.length}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">Not started</span>
                    )}
                    <span className="font-bold text-indigo-600">{inProgress ? "Resume →" : best ? "Open →" : "Start →"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Practise one skill:</span>
            {SECTIONS.filter((s) => s.topic === t).map((s) => (
              <Link key={s.id} href={`/practice/${s.id}`} className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                {s.emoji} {s.label}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-bold text-slate-800">How marking works</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Multiple choice:</strong> pick an answer and press <strong>Check</strong>. If it’s wrong you’ll see the exact slip behind your choice, the right answer and the
            method.
          </li>
          <li>
            <strong>Written:</strong> type each part’s answer — fractions like <code>1 7/15</code>, ratios like <code>4:6:3</code>, algebra like <code>3x(2x+3)</code> or{" "}
            <code>3n^2+2</code>. Right value but not simplified / not fully factorised = you lose the last mark (just like the real test). Then read the worked solution.
          </li>
          <li>Hints cost a star, so try first! ⭐ Up to 3 stars for a right answer with no hints.</li>
        </ul>
      </div>
    </div>
  );
}
