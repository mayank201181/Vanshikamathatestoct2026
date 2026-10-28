"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, rankFor, type Progress } from "@/lib/store";
import { ALL_QUESTIONS, GUIDES, setsForTopic } from "@/lib/content";
import { TOPICS, UNITS } from "@/lib/sections";
import { openMistakes, topicProgress } from "@/lib/share";
import { ShareButton } from "@/components/ShareButton";
import type { TopicId } from "@/lib/types";

type Task = { key: string; label: string; href: string; done?: (p: Progress) => boolean };

const guideDone = (t: TopicId) => (p: Progress) => GUIDES[t].sections.length > 0 && GUIDES[t].sections.every((s) => p.guidesRead[s.id]);
const setDone = (id: string) => (p: Progress) => !!p.best[id];
const guide = (t: TopicId): Task => ({ key: `guide-${t}`, label: `Read the ${TOPICS[t].title} guide (≈15 min)`, href: `/guide/${t}`, done: guideDone(t) });
const mcq = (t: TopicId, n: number): Task => ({ key: `${t}-mcq-${n}`, label: `${TOPICS[t].title} · Multiple choice ${n}`, href: `/set/${t}-mcq-${n}`, done: setDone(`${t}-mcq-${n}`) });
const written = (t: TopicId, n: number): Task => ({ key: `${t}-written-${n}`, label: `${TOPICS[t].title} · Written ${n}`, href: `/set/${t}-written-${n}`, done: setDone(`${t}-written-${n}`) });

const PLAN: { title: string; tasks: Task[] }[] = [
  { title: "Day 1 — Fractions", tasks: [guide("fr"), mcq("fr", 1), written("fr", 1)] },
  { title: "Day 2 — Percentages", tasks: [guide("pc"), mcq("pc", 1), written("pc", 1)] },
  { title: "Day 3 — Ratio", tasks: [guide("ra"), mcq("ra", 1), written("ra", 1)] },
  { title: "Day 4 — Expressions", tasks: [guide("ex"), mcq("ex", 1), written("ex", 1)] },
  { title: "Day 5 — Substitution & Sequences", tasks: [guide("su"), mcq("su", 1), guide("sq"), mcq("sq", 1), written("sq", 1)] },
  {
    title: "Day 6 — Exam practice",
    tasks: [
      { key: "set2", label: "Set 2 (MC + written) of your two weakest topics", href: "/bank" },
      { key: "set3", label: "Set 3 · Exam practice of any topic below 80%", href: "/bank" },
      { key: "mock1", label: "Take a mock class test (40 min)", href: "/mock", done: (p) => p.history.some((h) => h.setId === "mock") },
      { key: "fix", label: "Fix every mistake on your Mistakes list", href: "/review", done: (p) => Object.keys(p.best).length > 2 && openMistakes(p).length === 0 },
    ],
  },
  {
    title: "Night before & test morning",
    tasks: [
      { key: "cram", label: "Read the cram sheet (10 min)", href: "/cram" },
      { key: "cards", label: "Flashcards — just the ‘still learning’ pile", href: "/flashcards" },
      { key: "stretch", label: "Optional: one Set 4 · Stretch & challenge", href: "/bank" },
    ],
  },
];

function daysUntil(dateIso: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const test = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((test.getTime() - today.getTime()) / 86400000);
}

function niceDate(dateIso: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function Home() {
  const { p, ready, setName, togglePlan, setTestDate } = useStore();
  const [nameDraft, setNameDraft] = useState("");
  const [editDate, setEditDate] = useState(false);

  const answered = ALL_QUESTIONS.filter((x) => p.stats[x.q.id]).length;
  const scored = ALL_QUESTIONS.map((x) => p.stats[x.q.id]).filter(Boolean);
  const accuracy = scored.length ? Math.round((scored.reduce((s, x) => s + (x?.lastScore ?? 0), 0) / scored.length) * 100) : null;
  const mistakes = openMistakes(p).length;
  const rank = rankFor(p.stars);
  const progress = topicProgress(p);
  const d = p.testDate ? daysUntil(p.testDate) : null;
  const countdown =
    d === null ? null : d > 1 ? `${d} days to go` : d === 1 ? "Test is TOMORROW" : d === 0 ? "Test day — good luck! 🍀" : "Test done — well done!";

  return (
    <div className="space-y-6">
      {/* hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Year 8 Maths · Class test prep</p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{ready && p.name ? `Hi ${p.name}! 👋` : "Ready for the maths test? 👋"}</h1>
            <p className="mt-2 text-white/90">
              <strong>Unit 1</strong> Fractions · Percentages · Ratio and <strong>Unit 2</strong> Expressions · Substitution · Sequences — a guide for every lesson, 4 multiple-choice
              and 4 written sets per topic, marked instantly with full working.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur">
            {ready && p.testDate && !editDate ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/80">{niceDate(p.testDate)}</div>
                <div className="text-xl font-extrabold">{countdown}</div>
                <button onClick={() => setEditDate(true)} className="mt-1 text-xs font-semibold text-white/80 underline underline-offset-2">
                  change date
                </button>
              </>
            ) : (
              <label className="block text-left">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/80">When is the test?</span>
                <input
                  type="date"
                  defaultValue={p.testDate ?? ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setTestDate(e.target.value);
                      setEditDate(false);
                    }
                  }}
                  className="mt-1 block rounded-lg border-0 bg-white px-2 py-1 text-sm text-slate-900"
                />
              </label>
            )}
          </div>
        </div>
        {ready && !p.name && (
          <form
            className="mt-5 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (nameDraft.trim()) setName(nameDraft.trim());
            }}
          >
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="What's your first name?"
              className="min-w-0 flex-1 rounded-xl border-0 bg-white px-3 py-2 text-slate-900 outline-none ring-2 ring-white/40 placeholder:text-slate-400 focus:ring-white"
            />
            <button className="rounded-xl bg-white px-4 py-2 font-bold text-indigo-700">Save</button>
          </form>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/bank" className="rounded-xl bg-white px-4 py-2.5 font-bold text-indigo-700 shadow hover:bg-indigo-50">
            📝 Start practising
          </Link>
          <Link href="/guide" className="rounded-xl bg-white/15 px-4 py-2.5 font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">
            📖 Revise first
          </Link>
          <Link href="/mock" className="rounded-xl bg-white/15 px-4 py-2.5 font-semibold text-white ring-1 ring-white/40 hover:bg-white/25">
            🎓 Mock test
          </Link>
        </div>
      </section>

      {/* continue */}
      {ready && p.last && (
        <Link
          href={p.last.href}
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-indigo-300 bg-indigo-50 px-5 py-4 shadow-sm transition hover:bg-indigo-100"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-indigo-600">Continue where you left off</span>
            <span className="block text-lg font-extrabold text-indigo-950">{p.last.label}</span>
            <span className="text-xs text-indigo-700">Your answers and half-typed working are saved on this device.</span>
          </span>
          <span className="text-3xl">▶️</span>
        </Link>
      )}

      {/* stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Questions done" value={`${answered}/${ALL_QUESTIONS.length}`} />
        <Stat label="Average score" value={accuracy === null ? "—" : `${accuracy}%`} />
        <Link href="/review" className="block">
          <Stat label="Mistakes to fix" value={String(mistakes)} tone={mistakes ? "rose" : "emerald"} />
        </Link>
        <Stat label={rank.next ? `${rank.next.min - p.stars} ⭐ to ${rank.next.title}` : "Top rank!"} value={`${rank.emoji} ${p.stars}⭐`} />
      </section>

      {/* topics */}
      {UNITS.map((u) => (
        <section key={u.unit} className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">{u.title}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {u.topics.map((t) => {
              const topic = TOPICS[t];
              const tp = progress.find((x) => x.topic === t)!;
              const sets = setsForTopic(t);
              const read = GUIDES[t].sections.filter((s) => p.guidesRead[s.id]).length;
              return (
                <div key={t} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl text-2xl" style={{ background: `${topic.color}18` }}>
                      {topic.emoji}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-500">
                        {tp.answered}/{tp.total} done{!Number.isNaN(tp.score) && ` · ${Math.round(tp.score * 100)}% average`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${tp.total ? (tp.answered / tp.total) * 100 : 0}%`, background: topic.color }} />
                  </div>
                  <Link href={`/guide/${t}`} className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-center text-sm font-semibold text-white hover:bg-slate-700">
                    📖 Guide {GUIDES[t].sections.length > 0 && `(${read}/${GUIDES[t].sections.length} read)`}
                  </Link>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {sets.map(({ kind, set }) => {
                      const best = p.best[set.id];
                      const att = p.attempts[set.id];
                      const started = att && Object.keys(att.answers).length > 0 && !att.completed;
                      const cls = best
                        ? best.pct >= 80
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-amber-300 bg-amber-50 text-amber-900"
                        : started
                          ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                          : "border-slate-200 bg-white text-slate-600";
                      return (
                        <Link key={set.id} href={`/set/${set.id}`} title={set.title} className={`rounded-lg border px-1 py-1 text-center text-xs font-bold hover:border-indigo-400 ${cls}`}>
                          {kind === "mcq" ? "MC" : "W"}
                          {set.id.slice(-1)}
                          <span className="block text-[10px] font-semibold opacity-80">{best ? `${best.pct}%` : started ? "…" : "—"}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* plan */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">🗓️ Study plan</h2>
          <span className="text-xs text-slate-500">About 45 minutes a day. Ticks itself as you finish things — or tap to tick.</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN.map((day) => (
            <div key={day.title} className="rounded-xl border border-slate-200 p-3">
              <p className="mb-2 text-sm font-extrabold text-slate-800">{day.title}</p>
              <ul className="space-y-1.5">
                {day.tasks.map((t) => {
                  const auto = ready && t.done ? t.done(p) : false;
                  const done = auto || !!p.plan[t.key];
                  return (
                    <li key={t.key} className="flex items-start gap-2">
                      <button
                        onClick={() => togglePlan(t.key)}
                        disabled={auto}
                        aria-label={done ? "Mark not done" : "Mark done"}
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"}`}
                      >
                        {done ? "✓" : ""}
                      </button>
                      <Link href={t.href} className={`text-sm hover:text-indigo-700 hover:underline ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {t.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div>
          <h2 className="font-extrabold text-emerald-900">Show a grown-up how you&apos;re doing</h2>
          <p className="text-sm text-emerald-800">Sends your best score for every set, your weakest skills and how many mistakes are left.</p>
        </div>
        <ShareButton progress={p} />
      </section>
    </div>
  );
}

function Stat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" | "emerald" }) {
  const color = tone === "rose" ? "text-rose-600" : tone === "emerald" ? "text-emerald-600" : "text-slate-900";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}
