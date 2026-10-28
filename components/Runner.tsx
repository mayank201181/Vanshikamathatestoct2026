"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DataTable, MCQ, QA, QAPart } from "@/lib/types";
import { emptyAttempt, useStore, type SetAttempt } from "@/lib/store";
import { optionOrder } from "@/lib/optionOrder";
import { checkAnswer, checkWithTraps, displayAnswer, type CheckResult } from "@/lib/answerCheck";
import { gradeQA } from "@/lib/grade";
import { qaMarks } from "@/lib/content";
import { DIFFICULTY_META, sectionHref, sectionMeta } from "@/lib/sections";
import { Rich, RichInline } from "./Rich";
import { AnswerInput } from "./AnswerInput";
import { ShareButton } from "./ShareButton";

export type RunItem = { kind: "mcq"; q: MCQ } | { kind: "qa"; q: QA };

type Mode = "set" | "practice" | "review" | "mock";
type Persist = (fn: (prev: SetAttempt) => SetAttempt) => void;

type Props = {
  /** Every mode is saved on this device and resumes where she left off.
   *  "set" also records best scores; "practice" is a guide section; "review" is the Mistakes run. */
  mode: Mode;
  /** Storage key for this run. */
  runId: string;
  /** This page's address, for "Continue where you left off". */
  here: string;
  /** Replaces the default "start again" (used by the Mistakes run to pick up new mistakes). */
  onRestart?: () => void;
  title: string;
  subtitle?: string;
  items: RunItem[];
  backHref: string;
  backLabel: string;
};

type Status = "todo" | "right" | "part" | "wrong";

/** Timestamp for saves; only ever called from event handlers. */
const stamp = () => Date.now();

function statusOf(item: RunItem, a: SetAttempt): Status {
  const ans = a.answers[item.q.id];
  if (ans === undefined) return "todo";
  if (item.kind === "mcq") return ans === item.q.answerIndex ? "right" : "wrong";
  const [got, max] = marksFor(item, a);
  if (got >= max) return "right";
  if (got > 0) return "part";
  return "wrong";
}

/** Score as (marks earned, marks available): MCQ = 1 mark each, written = sum of part marks. */
function marksFor(item: RunItem, a: SetAttempt): [number, number] {
  if (item.kind === "mcq") return [a.answers[item.q.id] === item.q.answerIndex ? 1 : 0, 1];
  const pm = a.partMarks?.[item.q.id] ?? [];
  return [pm.reduce((s, x) => s + x, 0), qaMarks(item.q)];
}

export function Runner({ mode, runId, here, title, subtitle, items, backHref, backLabel, onRestart }: Props) {
  const store = useStore();
  const { ready } = store;
  const [a, setA] = useState<SetAttempt>(() => emptyAttempt());
  const aRef = useRef<SetAttempt>(a);
  const [loaded, setLoaded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // resume the saved run (every mode is saved on this device)
  useEffect(() => {
    if (!ready || loaded) return;
    const saved = store.getAttempt(runId);
    // Restore the saved run once the store has loaded from localStorage (not available during server render).
    /* eslint-disable react-hooks/set-state-in-effect */
    if (saved) {
      const restored = { ...emptyAttempt(), ...saved, index: Math.min(saved.index, Math.max(0, items.length - 1)) };
      aRef.current = restored;
      setA(restored);
      if (saved.completed) setShowSummary(true);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ready, loaded, runId, store, items.length]);

  // remember this place for "Continue where you left off"
  const { setLast } = store;
  useEffect(() => {
    if (!loaded || !items.length) return;
    setLast({ href: here, label: showSummary ? `${title} — results` : `${title} — question ${a.index + 1} of ${items.length}` });
  }, [loaded, here, title, a.index, items.length, showSummary, setLast]);

  /** Apply a change to the latest attempt and save it immediately. */
  const persist: Persist = (fn) => {
    const next = { ...fn(aRef.current), updatedAt: stamp() };
    aRef.current = next;
    setA(next);
    store.saveAttempt(runId, next);
  };

  const item = items[a.index];
  const answeredCount = items.filter((it) => a.answers[it.q.id] !== undefined).length;
  const allDone = answeredCount === items.length && items.length > 0;

  const go = (i: number) => {
    if (i < 0 || i >= items.length) return;
    persist((prev) => ({ ...prev, index: i }));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const finish = () => {
    const [got, total] = items.reduce(
      ([g, t], it) => {
        const [x, y] = marksFor(it, aRef.current);
        return [g + x, t + y];
      },
      [0, 0],
    );
    const pct = total ? Math.round((got / total) * 100) : 0;
    if ((mode === "set" || mode === "mock") && !aRef.current.completed) {
      store.finishSet({ setId: runId, correct: got, total, pct, at: stamp() });
      store.award(`${runId}:finished`, 5);
    }
    persist((prev) => ({ ...prev, completed: true }));
    setShowSummary(true);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const restart = () => {
    if (onRestart) return onRestart();
    store.resetAttempt(runId);
    const fresh = emptyAttempt();
    aRef.current = fresh;
    setA(fresh);
    setShowSummary(false);
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Nothing here yet. <Link className="font-semibold text-indigo-600" href={backHref}>{backLabel}</Link>
      </div>
    );
  }

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white" />;
  }

  if (showSummary) {
    return (
      <div ref={topRef}>
        <Summary
          mode={mode}
          title={title}
          items={items}
          attempt={a}
          onReview={(i) => {
            setShowSummary(false);
            go(i);
          }}
          onRestart={restart}
          backHref={backHref}
          backLabel={backLabel}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{answeredCount}</span> / {items.length} answered
        </div>
      </div>

      {/* progress bar + navigator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2.5">
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(answeredCount / items.length) * 100}%` }} />
        </div>
        <div className="nav-scroll flex gap-1.5 overflow-x-auto pb-1">
          {items.map((it, i) => {
            const s = statusOf(it, a);
            const cls =
              s === "right" ? "bg-emerald-500 text-white" : s === "part" ? "bg-amber-400 text-white" : s === "wrong" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200";
            return (
              <button
                key={it.q.id}
                onClick={() => go(i)}
                aria-label={`Question ${i + 1}`}
                className={`h-8 w-8 shrink-0 rounded-lg text-sm font-bold transition ${cls} ${i === a.index ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {item.kind === "mcq" ? (
        <McqCard key={item.q.id} mcq={item.q} number={a.index + 1} total={items.length} mode={mode} runId={runId} attempt={a} persist={persist} />
      ) : (
        <QaCard key={item.q.id} qa={item.q} number={a.index + 1} total={items.length} mode={mode} runId={runId} attempt={a} persist={persist} />
      )}

      {/* footer navigation */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => go(a.index - 1)} disabled={a.index === 0} className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-600 disabled:opacity-40">
          ← Back
        </button>
        {allDone ? (
          <button onClick={finish} className="whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white shadow hover:bg-emerald-700">
            See my results 🎉
          </button>
        ) : (
          <span className="text-center text-xs text-slate-400">{items.length - answeredCount} to go · ✓ saved on this device</span>
        )}
        <button
          onClick={() => {
            if (a.index < items.length - 1) go(a.index + 1);
            else {
              const firstTodo = items.findIndex((it) => a.answers[it.q.id] === undefined);
              if (firstTodo >= 0) go(firstTodo);
              else finish();
            }
          }}
          className="whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          {a.index < items.length - 1 ? "Next →" : allDone ? "Finish" : "Unanswered →"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Badges({ q, number, total, marks }: { q: MCQ | QA; number: number; total: number; marks?: number }) {
  const d = DIFFICULTY_META[q.difficulty];
  const s = sectionMeta(q.section);
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold">
      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
        Q{number} of {total}
      </span>
      <span className={`rounded-full px-2.5 py-1 ${d.className}`}>{d.label}</span>
      {s && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
          {s.emoji} {s.label}
        </span>
      )}
      {q.source && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">📓 {q.source}</span>}
      {marks !== undefined && <span className="ml-auto rounded-full bg-slate-800 px-2.5 py-1 text-white">{marks} mark{marks === 1 ? "" : "s"}</span>}
    </div>
  );
}

function TableView({ table }: { table: DataTable }) {
  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {table.caption && (
          <caption className="mb-1 text-left text-xs font-semibold text-slate-500">
            <RichInline text={table.caption} />
          </caption>
        )}
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="border border-slate-300 bg-slate-100 px-2 py-1.5 text-left font-semibold text-slate-800">
                <RichInline text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} className="border border-slate-300 bg-white px-2 py-1.5 text-slate-800">
                  <RichInline text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuestionBody({ q }: { q: MCQ | QA }) {
  return (
    <>
      <Rich text={q.question} className="text-lg font-semibold leading-snug text-slate-900" />
      {q.diagram && (
        <div className="diagram my-3">
          <div className="diagram-svg" dangerouslySetInnerHTML={{ __html: q.diagram }} />
        </div>
      )}
      {q.table && <TableView table={q.table} />}
    </>
  );
}

function Hints({ hints, used, onUse, locked }: { hints: string[]; used: number; onUse: () => void; locked: boolean }) {
  if (!hints.length) return null;
  return (
    <div className="mt-4 space-y-2">
      {hints.slice(0, used).map((h, i) => (
        <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="font-bold">Hint {i + 1}: </span>
          <RichInline text={h} />
        </div>
      ))}
      {!locked && used < hints.length && (
        <button onClick={onUse} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100">
          💡 {used === 0 ? "Need a hint?" : "Another hint"} ({used + 1}/{hints.length})
          <span className="font-normal text-amber-700/80">· costs a star</span>
        </button>
      )}
    </div>
  );
}

function ReviseLink({ section }: { section: string }) {
  const s = sectionMeta(section);
  if (!s) return null;
  return (
    <Link href={sectionHref(section)} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
      📖 Revise “{s.label}” in the guide
    </Link>
  );
}

type CardProps = { number: number; total: number; mode: Mode; runId: string; attempt: SetAttempt; persist: Persist };

const without = <T,>(rec: Record<string, T> | undefined, key: string): Record<string, T> => {
  const out = { ...(rec ?? {}) };
  delete out[key];
  return out;
};

function McqCard({ mcq, number, total, runId, attempt, persist }: CardProps & { mcq: MCQ }) {
  const store = useStore();
  const committed = attempt.answers[mcq.id];
  const checked = typeof committed === "number";
  const [selected, setSelected] = useState<number | null>(checked ? (committed as number) : attempt.picks?.[mcq.id] ?? null);
  const used = attempt.hintsUsed[mcq.id] ?? 0;
  const order = useMemo(() => optionOrder(mcq), [mcq]);
  const labelAt = (pos: number) => String.fromCharCode(65 + pos);
  const letterOf = (authored: number) => labelAt(order.indexOf(authored));
  const [earned, setEarned] = useState<number | null>(null);

  function check() {
    if (selected === null || checked) return;
    const good = selected === mcq.answerIndex;
    store.recordAnswer(mcq.id, good ? 1 : 0, good);
    const stars = good ? Math.max(1, 3 - used) : 0;
    store.award(`${runId}:${mcq.id}`, stars);
    setEarned(stars);
    persist((prev) => ({ ...prev, answers: { ...prev.answers, [mcq.id]: selected }, picks: without(prev.picks, mcq.id) }));
  }

  const right = checked && committed === mcq.answerIndex;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <Badges q={mcq} number={number} total={total} />
      <QuestionBody q={mcq} />

      <div className="mt-4 space-y-2">
        {order.map((i, pos) => {
          const isSel = selected === i;
          const isAns = i === mcq.answerIndex;
          let cls = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40";
          if (checked) {
            if (isAns) cls = "border-emerald-500 bg-emerald-50";
            else if (isSel) cls = "border-rose-500 bg-rose-50";
            else cls = "border-slate-200 bg-white opacity-60";
          } else if (isSel) cls = "border-indigo-500 bg-indigo-50";
          return (
            <button
              key={i}
              onClick={() => {
                if (checked) return;
                setSelected(i);
                persist((prev) => ({ ...prev, picks: { ...(prev.picks ?? {}), [mcq.id]: i } }));
              }}
              disabled={checked}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition ${cls}`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${isSel && !checked ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 bg-white text-slate-600"}`}>
                {labelAt(pos)}
              </span>
              <span className="text-[1.05rem] text-slate-800">
                <RichInline text={mcq.options[i]} />
              </span>
              {checked && isAns && <span className="ml-auto">✅</span>}
              {checked && isSel && !isAns && <span className="ml-auto">❌</span>}
            </button>
          );
        })}
      </div>

      <Hints
        hints={mcq.hints}
        used={used}
        locked={checked}
        onUse={() => persist((prev) => ({ ...prev, hintsUsed: { ...prev.hintsUsed, [mcq.id]: (prev.hintsUsed[mcq.id] ?? 0) + 1 } }))}
      />

      {!checked && (
        <button
          onClick={check}
          disabled={selected === null}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Check my answer
        </button>
      )}

      {checked && (
        <div className="mt-5 space-y-3 animate-pop">
          {right ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
              <p className="font-extrabold text-emerald-800">✅ Correct!{earned ? ` +${earned} ⭐` : ""}</p>
              <Rich text={mcq.optionFeedback[mcq.answerIndex]} className="mt-1 text-emerald-900 rich-inherit" />
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
                <p className="font-extrabold text-rose-800">
                  ❌ Not quite — you chose {letterOf(committed as number)}: <RichInline text={mcq.options[committed as number]} />
                </p>
                <div className="mt-1 text-rose-900">
                  <span className="font-semibold">Why that’s not right: </span>
                  <RichInline text={mcq.optionFeedback[committed as number]} />
                </div>
              </div>
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4">
                <p className="font-extrabold text-emerald-800">
                  ✅ The right answer is {letterOf(mcq.answerIndex)}: <RichInline text={mcq.options[mcq.answerIndex]} />
                </p>
                <Rich text={mcq.optionFeedback[mcq.answerIndex]} className="mt-1 text-emerald-900 rich-inherit" />
              </div>
            </>
          )}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="mb-1 text-sm font-extrabold uppercase tracking-wide text-indigo-700">📘 How to do it</p>
            <Rich text={mcq.explanation} className="text-indigo-950/90 rich-inherit" />
            {mcq.strategy && <p className="mt-2 text-xs font-semibold text-indigo-700">🧠 Strategy: {mcq.strategy}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ReviseLink section={mcq.section} />
            {!right && <span className="text-xs text-slate-500">🔁 Added to your Mistakes list for another go.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Written questions: one input per part, marked part by part.

const partName = (p: QAPart, i: number, n: number) => (n > 1 ? `(${p.label ?? String.fromCharCode(97 + i)})` : "");

/** Marks for an auto-marked part from the checker's verdict. */
function autoMarks(p: QAPart, r: CheckResult): number {
  if (r.status === "correct") return p.marks;
  if (r.status === "close") return Math.max(0, p.marks - 1);
  return 0;
}

function QaCard({ qa, number, total, runId, attempt, persist }: CardProps & { qa: QA }) {
  const store = useStore();
  const committed = attempt.answers[qa.id];
  const checked = Array.isArray(committed);
  const blank = qa.parts.map(() => "");
  const [drafts, setDrafts] = useState<string[]>(() => (checked ? (committed as string[]) : attempt.drafts?.[qa.id] ?? blank));
  const [problem, setProblem] = useState<string | null>(null);

  // save half-typed answers as she types, so leaving the page never loses them
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraft = useRef<string[] | null>(null);
  const persistRef = useRef(persist);
  useEffect(() => {
    persistRef.current = persist;
  });
  const flushDraft = () => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = null;
    const v = pendingDraft.current;
    pendingDraft.current = null;
    if (v !== null) persistRef.current((prev) => (prev.answers[qa.id] !== undefined ? prev : { ...prev, drafts: { ...(prev.drafts ?? {}), [qa.id]: v } }));
  };
  useEffect(() => () => flushDraft(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const onDraft = (i: number, v: string) => {
    const next = drafts.map((d, j) => (j === i ? v : d));
    setDrafts(next);
    setProblem(null);
    pendingDraft.current = next;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(flushDraft, 400);
  };

  const used = attempt.hintsUsed[qa.id] ?? 0;
  const max = qaMarks(qa);
  const partMarks = attempt.partMarks?.[qa.id] ?? qa.parts.map(() => 0);
  const ticks = attempt.ticks?.[qa.id] ?? qa.parts.map(() => [] as boolean[]);
  const overrides = attempt.overrides?.[qa.id] ?? qa.parts.map(() => false);
  const got = partMarks.reduce((s, x) => s + x, 0);
  const results = useMemo(
    () => (checked ? qa.parts.map((p, i) => (p.answer ? checkWithTraps(p.answer, (committed as string[])[i] ?? "", p.traps) : null)) : []),
    [checked, committed, qa.parts],
  );

  function mark() {
    if (checked) return;
    if (drafts.every((d) => !d.trim())) {
      setProblem("Type an answer first — even a guess teaches you something.");
      return;
    }
    for (let i = 0; i < qa.parts.length; i++) {
      const p = qa.parts[i];
      const text = drafts[i] ?? "";
      if (p.answer && text.trim()) {
        const r = checkAnswer(p.answer, text);
        if (r.status === "invalid") {
          setProblem(`Part ${partName(p, i, qa.parts.length) || "answer"}: ${r.feedback ?? "I couldn't read that."}`);
          return;
        }
      }
    }
    const newTicks: boolean[][] = [];
    const marks = qa.parts.map((p, i) => {
      const text = drafts[i] ?? "";
      if (p.answer) {
        newTicks.push([]);
        return text.trim() ? autoMarks(p, checkWithTraps(p.answer, text, p.traps)) : 0;
      }
      const g = gradeQA({ markScheme: p.markScheme ?? [] }, text);
      newTicks.push(text.trim().length >= 3 ? g.credited : (p.markScheme ?? []).map(() => false));
      return newTicks[i].filter(Boolean).length;
    });
    const total = marks.reduce((s, x) => s + x, 0);
    store.recordAnswer(qa.id, total / max, total >= max);
    store.award(`${runId}:${qa.id}`, Math.max(0, total - Math.min(used, total)));
    if (draftTimer.current) clearTimeout(draftTimer.current);
    pendingDraft.current = null;
    persist((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qa.id]: drafts },
      partMarks: { ...prev.partMarks, [qa.id]: marks },
      ticks: { ...prev.ticks, [qa.id]: newTicks },
      overrides: { ...prev.overrides, [qa.id]: qa.parts.map(() => false) },
      drafts: without(prev.drafts, qa.id),
    }));
  }

  function save(nextMarks: number[], nextTicks: boolean[][], nextOverrides: boolean[]) {
    const total = nextMarks.reduce((s, x) => s + x, 0);
    store.adjustAnswer(qa.id, total / max, total >= max);
    persist((prev) => ({
      ...prev,
      partMarks: { ...prev.partMarks, [qa.id]: nextMarks },
      ticks: { ...prev.ticks, [qa.id]: nextTicks },
      overrides: { ...prev.overrides, [qa.id]: nextOverrides },
    }));
  }

  function toggleTick(pi: number, k: number) {
    const nextTicks = ticks.map((t, i) => (i === pi ? t.map((v, j) => (j === k ? !v : v)) : t));
    const nextMarks = partMarks.map((m, i) => (i === pi ? nextTicks[i].filter(Boolean).length : m));
    save(nextMarks, nextTicks, overrides);
  }

  function toggleOverride(pi: number) {
    const p = qa.parts[pi];
    const r = results[pi];
    const on = !overrides[pi];
    const nextOverrides = overrides.map((v, i) => (i === pi ? on : v));
    const nextMarks = partMarks.map((m, i) => (i === pi ? (on ? p.marks : r ? autoMarks(p, r) : 0) : m));
    save(nextMarks, ticks, nextOverrides);
  }

  const verdict = got >= max ? "full" : got > 0 ? "part" : "none";
  const verdictCls =
    verdict === "full" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : verdict === "part" ? "border-amber-300 bg-amber-50 text-amber-900" : "border-rose-300 bg-rose-50 text-rose-800";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <Badges q={qa} number={number} total={total} marks={max} />
      <QuestionBody q={qa} />

      <div className="mt-4 space-y-5">
        {qa.parts.map((p, i) => {
          const name = partName(p, i, qa.parts.length);
          const r = results[i];
          return (
            <div key={i} className={qa.parts.length > 1 ? "rounded-xl border border-slate-100 bg-slate-50/60 p-3" : ""}>
              {(name || p.prompt) && (
                <div className="mb-2 flex items-start gap-2">
                  {name && <span className="font-extrabold text-indigo-700">{name}</span>}
                  <div className="flex-1 text-slate-800">{p.prompt && <Rich text={p.prompt} />}</div>
                  {qa.parts.length > 1 && <span className="shrink-0 text-xs font-bold text-slate-500">[{p.marks}]</span>}
                </div>
              )}
              {p.answer ? (
                <AnswerInput
                  value={drafts[i] ?? ""}
                  onChange={(v) => onDraft(i, v)}
                  type={p.answer.type}
                  disabled={checked}
                  label={qa.parts.length > 1 ? `Your answer to ${name}` : "Your answer"}
                />
              ) : (
                <textarea
                  value={drafts[i] ?? ""}
                  onChange={(e) => onDraft(i, e.target.value)}
                  disabled={checked}
                  rows={4}
                  aria-label={`Your explanation ${name}`}
                  placeholder={`Explain your reasoning… (worth ${p.marks} mark${p.marks === 1 ? "" : "s"} — make ${p.marks} clear point${p.marks === 1 ? "" : "s"})`}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-base text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                />
              )}

              {checked && p.answer && r && (
                <PartResult
                  marks={partMarks[i] ?? 0}
                  max={p.marks}
                  result={r}
                  typed={(committed as string[])[i] ?? ""}
                  answerText={displayAnswer(p.answer)}
                  overridden={!!overrides[i]}
                  onOverride={() => toggleOverride(i)}
                />
              )}
              {checked && p.markScheme && (
                <ExplainResult part={p} ticks={ticks[i] ?? []} onToggle={(k) => toggleTick(i, k)} />
              )}
            </div>
          );
        })}
      </div>

      <Hints
        hints={qa.hints}
        used={used}
        locked={checked}
        onUse={() => persist((prev) => ({ ...prev, hintsUsed: { ...prev.hintsUsed, [qa.id]: (prev.hintsUsed[qa.id] ?? 0) + 1 } }))}
      />

      {problem && <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 animate-shake">{problem}</p>}

      {!checked && (
        <button
          onClick={mark}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
        >
          Mark my answer{qa.parts.length > 1 ? "s" : ""}
        </button>
      )}

      {checked && (
        <div className="mt-5 space-y-3 animate-pop">
          <div className={`rounded-xl border p-4 ${verdictCls}`}>
            <p className="text-lg font-extrabold">
              {verdict === "full" ? "🏆" : verdict === "part" ? "🟡" : "🔴"} {got} / {max} marks
              {verdict === "full" ? " — full marks!" : verdict === "part" ? " — nearly there" : " — learn the method below"}
            </p>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-indigo-700">📝 Worked solution</p>
            <ol className="space-y-1.5">
              {qa.solution.map((step, k) => (
                <li key={k} className="flex gap-2 text-indigo-950/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-800">{k + 1}</span>
                  <div className="flex-1">
                    <Rich text={step} className="rich-inherit" />
                  </div>
                </li>
              ))}
            </ol>
            {qa.altMethod && (
              <div className="mt-3 rounded-lg bg-white/70 p-3">
                <p className="text-sm font-extrabold text-indigo-800">🔀 Another way: {qa.altMethod.label}</p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-indigo-950/90">
                  {qa.altMethod.steps.map((s, k) => (
                    <li key={k}>
                      <RichInline text={s} />
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {qa.strategy && <p className="mt-2 text-xs font-semibold text-indigo-700">🧠 Strategy: {qa.strategy}</p>}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <span className="font-extrabold">⚠️ Common mistake: </span>
            <RichInline text={qa.commonError} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ReviseLink section={qa.section} />
            {got < max && <span className="text-xs text-slate-500">🔁 Added to your Mistakes list for another go.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function PartResult({
  marks,
  max,
  result,
  typed,
  answerText,
  overridden,
  onOverride,
}: {
  marks: number;
  max: number;
  result: CheckResult;
  typed: string;
  answerText: string;
  overridden: boolean;
  onOverride: () => void;
}) {
  const good = overridden || result.status === "correct";
  const close = !overridden && result.status === "close";
  const blank = !typed.trim();
  const cls = good ? "border-emerald-200 bg-emerald-50 text-emerald-900" : close ? "border-amber-200 bg-amber-50 text-amber-900" : "border-rose-200 bg-rose-50 text-rose-900";
  return (
    <div className={`mt-2 rounded-lg border p-3 text-sm ${cls}`}>
      <p className="font-bold">
        {good ? "✅ Correct" : close ? "🟡 Almost" : blank ? "⬜ Not answered" : "❌ Not quite"} · {marks}/{max}
        {overridden && <span className="font-normal"> (you marked this right)</span>}
      </p>
      {!good && result.feedback && (
        <p className="mt-0.5">
          <RichInline text={result.feedback} />
        </p>
      )}
      {!good && (
        <p className="mt-0.5">
          <span className="font-semibold">Answer: </span>
          <RichInline text={answerText} />
        </p>
      )}
      {!blank && (result.status !== "correct" || overridden) && (
        <button onClick={onOverride} className="mt-1 block text-left text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-700">
          {overridden ? "Undo — use the checker's mark" : "I'm sure my answer means the same — mark it right"}
        </button>
      )}
    </div>
  );
}

function ExplainResult({ part, ticks, onToggle }: { part: QAPart; ticks: boolean[]; onToggle: (k: number) => void }) {
  return (
    <div className="mt-2 space-y-2">
      <ul className="space-y-2">
        {(part.markScheme ?? []).map((mp, k) => {
          const got = !!ticks[k];
          return (
            <li key={k} className={`rounded-lg border p-3 text-sm ${got ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">{got ? "✅" : "❌"}</span>
                <div className="flex-1">
                  <p className={`font-semibold ${got ? "text-emerald-900" : "text-rose-900"}`}>
                    <RichInline text={mp.point} />
                  </p>
                  {!got && (
                    <p className="mt-1 text-rose-900/90">
                      <span className="font-semibold">What you needed: </span>
                      <RichInline text={mp.feedback} />
                    </p>
                  )}
                  <button onClick={() => onToggle(k)} className="mt-1 block text-left text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-700">
                    {got ? "I didn’t really say this — remove the mark" : "I did say this — give me the mark"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {part.model && (
        <div className="rounded-lg border border-indigo-200 bg-white p-3 text-sm">
          <p className="font-extrabold text-indigo-700">✍️ Full-marks answer</p>
          <Rich text={part.model} className="text-slate-800" />
        </div>
      )}
      <p className="text-xs text-slate-500">Explanations are ticked by spotting key ideas — check each tick honestly against the full-marks answer.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Summary({
  mode,
  title,
  items,
  attempt,
  onReview,
  onRestart,
  backHref,
  backLabel,
}: {
  mode: Mode;
  title: string;
  items: RunItem[];
  attempt: SetAttempt;
  onReview: (i: number) => void;
  onRestart: () => void;
  backHref: string;
  backLabel: string;
}) {
  const { p } = useStore();
  let got = 0;
  let total = 0;
  const bySection = new Map<string, [number, number]>();
  items.forEach((it) => {
    const [x, y] = marksFor(it, attempt);
    got += x;
    total += y;
    const cur = bySection.get(it.q.section) ?? [0, 0];
    bySection.set(it.q.section, [cur[0] + x, cur[1] + y]);
  });
  const pct = total ? Math.round((got / total) * 100) : 0;
  const wrong = items.map((it, i) => ({ it, i, s: statusOf(it, attempt) })).filter((x) => x.s !== "right");
  const emoji = pct >= 90 ? "🏆" : pct >= 75 ? "🌟" : pct >= 50 ? "👍" : "💪";
  const message =
    pct >= 90
      ? "Outstanding — you're test-ready on this!"
      : pct >= 75
        ? "Strong work. Fix the few slips below and you're there."
        : pct >= 50
          ? "Good effort. The questions below are your fastest route to marks."
          : "Every question here is a mark you can win back in the test. Work through them one by one.";
  const sections = [...bySection.entries()].sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="text-5xl">{emoji}</div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          {title}: {pct}%
        </h1>
        <p className="text-slate-500">
          {got} / {total} {items.some((it) => it.kind === "qa") ? "marks" : "correct"}
        </p>
        <p className="mx-auto mt-2 max-w-md text-slate-700">{message}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={onRestart} className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
            {mode === "set" ? "🔄 Try this set again" : mode === "practice" ? "🔄 Practise again" : mode === "mock" ? "🎓 New mock test" : "🔁 Start a new mistakes round"}
          </button>
          {wrong.length > 0 && (
            <Link href="/review" className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">
              🔁 Fix my mistakes
            </Link>
          )}
          <Link href={backHref} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
            {backLabel}
          </Link>
          <ShareButton progress={p} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-extrabold text-slate-900">How you did, skill by skill</h2>
        <ul className="space-y-2">
          {sections.map(([sid, [x, y]]) => {
            const s = sectionMeta(sid);
            const f = y ? x / y : 0;
            return (
              <li key={sid} className="flex items-center gap-3">
                <span className="w-44 shrink-0 truncate text-sm text-slate-700 sm:w-60">
                  {s?.emoji} {s?.label ?? sid}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${f >= 0.8 ? "bg-emerald-500" : f >= 0.5 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${Math.max(4, f * 100)}%` }} />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-slate-600">
                  {x}/{y}
                </span>
                {f < 0.8 && (
                  <Link href={sectionHref(sid)} className="text-xs font-semibold text-indigo-600 hover:underline">
                    revise
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {wrong.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-extrabold text-slate-900">Look again at these ({wrong.length})</h2>
          <ul className="space-y-2">
            {wrong.map(({ it, i, s }) => (
              <li key={it.q.id}>
                <button onClick={() => onReview(i)} className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${s === "part" ? "bg-amber-400" : "bg-rose-500"}`}>{i + 1}</span>
                  <span className="line-clamp-2 text-sm text-slate-700">
                    <RichInline text={it.q.question.split("\n")[0]} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
