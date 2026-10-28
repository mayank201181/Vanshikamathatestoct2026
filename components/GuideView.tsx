"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GuideSection, QuickCheck, TopicId } from "@/lib/types";
import { GUIDES, questionsForSection, setsForTopic } from "@/lib/content";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import { useStore } from "@/lib/store";
import { checkAnswer, displayAnswer } from "@/lib/answerCheck";
import { Rich, RichInline } from "./Rich";
import { AnswerInput } from "./AnswerInput";
import { ListenButton } from "./ListenButton";

/** Text for read-aloud: drop markdown and say simple maths in words. */
function plain(md: string) {
  return md
    .replace(/\{\{([\s\S]+?)\}\}/g, (_m, x: string) =>
      x
        .replace(/(\d+) (\d+)\/(\d+)/g, "$1 and $2 over $3")
        .replace(/\//g, " over ")
        .replace(/\^2/g, " squared")
        .replace(/\^3/g, " cubed")
        .replace(/\^/g, " to the power ")
        .replace(/\*/g, " times ")
        .replace(/sqrt/g, "root "),
    )
    .replace(/\*\*|\*|`/g, "")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/^- /gm, "")
    .replace(/−/g, " minus ");
}

export function GuideView({ topic }: { topic: TopicId }) {
  const g = GUIDES[topic];
  const sections = g.sections;
  const t = TOPICS[topic];
  const store = useStore();
  const { p, ready, setGuidePos, setLast } = store;
  const readCount = sections.filter((s) => p.guidesRead[s.id]).length;
  const [resumed, setResumed] = useState<string | null>(null);
  const restored = useRef(false);

  // Pick up where she left off: scroll to the last section read (unless the link names one).
  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const hash = window.location.hash.slice(1);
    const target = hash || p.guidePos[topic];
    if (target && document.getElementById(target)) {
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: "start" }));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off notice after restoring the scroll position
      if (!hash) setResumed(sections.find((s) => s.id === target)?.heading ?? null);
    }
  }, [ready, p.guidePos, topic, sections]);

  // Remember which section is on screen.
  useEffect(() => {
    if (!ready || !sections.length) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const id = visible.target.id;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const s = sections.find((x) => x.id === id);
          if (!s) return;
          setGuidePos(topic, id);
          setLast({ href: `/guide/${topic}#${id}`, label: `${t.title} guide — ${s.heading}` });
        }, 700);
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ready, sections, topic, t.title, setGuidePos, setLast]);

  const idx = TOPIC_IDS.indexOf(topic);
  const next = TOPIC_IDS[(idx + 1) % TOPIC_IDS.length];

  return (
    <div className="space-y-6">
      <div className="nav-scroll flex gap-1.5 overflow-x-auto pb-1">
        {TOPIC_IDS.map((x) => (
          <Link
            key={x}
            href={`/guide/${x}`}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold ${x === topic ? "bg-indigo-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
          >
            {TOPICS[x].emoji} {TOPICS[x].short}
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: t.color }}>
          Unit {t.unit} · Revision guide
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {t.emoji} {t.title}
        </h1>
        <p className="mt-1 text-slate-600">
          One section per lesson in your OneNote. Try each <strong>puzzle</strong> before reading, work through the examples, do the quick check, then tick the section.
          {ready && sections.length > 0 && (
            <span className="ml-1 font-semibold text-slate-800">
              {readCount}/{sections.length} sections done.
            </span>
          )}
        </p>
        {resumed && (
          <p className="mt-3 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800">
            ▶️ Picked up where you left off: “{resumed}”.{" "}
            <button className="underline underline-offset-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to the top
            </button>
          </p>
        )}
        {sections.length === 0 ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-amber-900">This guide is being written — check back shortly.</p>
        ) : (
          <nav className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${p.guidesRead[s.id] ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {p.guidesRead[s.id] ? "✓" : i + 1}
                </span>
                <span className="text-slate-700">{s.heading}</span>
                <span className="ml-auto hidden shrink-0 text-xs text-slate-400 sm:inline">{s.lesson}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {sections.map((s, i) => (
        <SectionCard key={s.id} s={s} n={i + 1} />
      ))}

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-extrabold text-slate-900">📝 Test yourself on {t.title}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {setsForTopic(topic).map(({ kind, set }) => (
            <Link key={set.id} href={`/set/${set.id}`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40">
              {kind === "mcq" ? "Multiple choice" : "Written"} {set.id.slice(-1)}
              <span className="block text-xs font-normal text-slate-500">{set.title.split(" · ").slice(1).join(" · ")}</span>
              {p.best[set.id] && <span className="text-xs font-bold text-emerald-700">Best {p.best[set.id].pct}%</span>}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <Link href={`/guide/${next}`} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700">
          {TOPICS[next].emoji} {TOPICS[next].title} guide →
        </Link>
        <Link href="/bank" className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white">
          📝 Question bank
        </Link>
      </div>
    </div>
  );
}

function SectionCard({ s, n }: { s: GuideSection; n: number }) {
  const { p, markGuideRead } = useStore();
  const [reveal, setReveal] = useState(false);
  const read = !!p.guidesRead[s.id];
  const count = questionsForSection(s.id).length;
  return (
    <section id={s.id} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Section {n} · {s.lesson}
          </p>
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{s.heading}</h2>
        </div>
        <ListenButton getText={() => `${s.heading}. ${plain(s.body)} Key points. ${s.keyPoints.map(plain).join(". ")}`} />
      </div>

      {/* discovery puzzle */}
      <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-sm font-extrabold text-violet-800">🧩 Puzzle first</p>
        <Rich text={s.discovery.problem} className="mt-1 text-violet-950" />
        {reveal ? (
          <div className="mt-2 rounded-xl bg-white/70 p-3 text-violet-950">
            <span className="font-bold">💡 </span>
            <RichInline text={s.discovery.idea} />
          </div>
        ) : (
          <button onClick={() => setReveal(true)} className="mt-2 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white">
            I&apos;ve had a think — show me
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="min-w-0 text-slate-700">
          <Rich text={s.body} />
        </div>
        {s.diagram && (
          <figure className="diagram min-w-0 self-start">
            <div className="diagram-svg" dangerouslySetInnerHTML={{ __html: s.diagram }} />
            {s.diagramCaption && (
              <figcaption>
                <RichInline text={s.diagramCaption} />
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {/* worked examples */}
      <div className="mt-5 space-y-3">
        <p className="text-sm font-extrabold uppercase tracking-wide text-slate-500">✏️ Worked examples</p>
        {s.workedExamples.map((w, i) => (
          <WorkedExampleCard key={i} w={w} n={i + 1} />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-extrabold text-emerald-800">✅ Key points</p>
        <ul className="mt-1.5 space-y-1">
          {s.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-2 text-emerald-950">
              <span>•</span>
              <span>
                <RichInline text={k} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Callout tone="sky" title="🤔 Why does this work?" text={s.whyItWorks} />
        {s.memoryTrick && <Callout tone="fuchsia" title="🧠 Memory trick" text={s.memoryTrick} />}
        <Callout tone="amber" title="⚠️ Exam tip" text={s.examTip} />
        <Callout tone="slate" title="🚀 Think deeper" text={s.thinkDeeper} />
      </div>

      {/* quick checks */}
      {s.quickChecks.length > 0 && (
        <div className="mt-4 space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
          <p className="text-sm font-extrabold text-indigo-800">🎯 Your turn — quick check</p>
          {s.quickChecks.map((c, i) => (
            <QuickCheckCard key={i} c={c} id={`${s.id}:${i}`} />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => markGuideRead(s.id, !read)}
          className={`rounded-xl px-4 py-2 font-semibold ${read ? "bg-emerald-600 text-white" : "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"}`}
        >
          {read ? "✓ Got it" : "Tick when you've got it"}
        </button>
        {count > 0 && (
          <Link href={`/practice/${s.id}`} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
            Practise this skill ({count} questions) →
          </Link>
        )}
      </div>
    </section>
  );
}

function WorkedExampleCard({ w, n }: { w: GuideSection["workedExamples"][number]; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-sm font-bold text-slate-500">
        Example {n}
        {w.title ? ` · ${w.title}` : ""}
      </p>
      <Rich text={w.problem} className="mt-1 font-semibold text-slate-900" />
      {open ? (
        <div className="mt-2 space-y-1.5">
          <ol className="space-y-1.5">
            {w.steps.map((st, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">{i + 1}</span>
                <div className="flex-1 text-slate-800">
                  <Rich text={st} />
                </div>
              </li>
            ))}
          </ol>
          <p className="rounded-lg bg-white px-3 py-2 font-bold text-emerald-800">
            Answer: <RichInline text={w.answer} />
          </p>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Have a go, then show the working ↓
        </button>
      )}
    </div>
  );
}

function QuickCheckCard({ c, id }: { c: QuickCheck; id: string }) {
  const { p, setQuick } = useStore();
  const saved = p.quick[id];
  const [value, setValue] = useState(saved?.answer ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const done = saved?.status === "correct";
  function check() {
    const r = checkAnswer(c.answer, value);
    if (r.status === "invalid") {
      setMsg(r.feedback ?? "I couldn't read that.");
      return;
    }
    setMsg(r.feedback ?? null);
    setQuick(id, { answer: value, status: r.status });
  }
  return (
    <div className="rounded-xl bg-white p-3">
      <Rich text={c.question} className="font-semibold text-slate-900" />
      <div className="mt-2">
        <AnswerInput value={value} onChange={(v) => { setValue(v); setMsg(null); }} onSubmit={check} type={c.answer.type} disabled={done} />
      </div>
      {!done && (
        <button onClick={check} disabled={!value.trim()} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-40">
          Check
        </button>
      )}
      {saved && (
        <div className={`mt-2 rounded-lg p-2 text-sm ${saved.status === "correct" ? "bg-emerald-50 text-emerald-900" : saved.status === "close" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-900"}`}>
          <p className="font-bold">
            {saved.status === "correct" ? "✅ Correct!" : saved.status === "close" ? "🟡 Almost —" : "❌ Not yet."} {msg && <span className="font-normal">{msg}</span>}
          </p>
          {saved.status !== "correct" && (
            <p>
              Answer: <RichInline text={displayAnswer(c.answer)} />
            </p>
          )}
          <Rich text={c.solution} className="mt-1" />
        </div>
      )}
      {!saved && msg && <p className="mt-2 text-sm font-semibold text-amber-800">{msg}</p>}
    </div>
  );
}

function Callout({ tone, title, text }: { tone: "sky" | "fuchsia" | "amber" | "slate"; title: string; text: string }) {
  const cls = {
    sky: "border-sky-200 bg-sky-50 text-sky-950",
    fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <p className="text-sm font-extrabold">{title}</p>
      <Rich text={text} className="mt-1 text-[0.95rem] rich-inherit" />
    </div>
  );
}
