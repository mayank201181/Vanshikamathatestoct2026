import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_PROGRESS, emptyAttempt, mergeAttempt, mergeProgress, normaliseProgress } from "../lib/progressMerge.ts";
import type { Progress, SetAttempt } from "../lib/progressMerge.ts";

const att = (answers: Record<string, number | string[]>, updatedAt: number, extra: Partial<SetAttempt> = {}): SetAttempt => ({
  ...emptyAttempt(),
  answers,
  startedAt: 1,
  updatedAt,
  ...extra,
});
const prog = (over: Partial<Progress>): Progress => ({ ...EMPTY_PROGRESS, ...over });

test("answers from two copies of the same set are combined, never lost", () => {
  const a = prog({ attempts: { "mcq-1": att({ "s1-q01": 2, "s1-q02": 1 }, 100) } });
  const b = prog({ attempts: { "mcq-1": att({ "s1-q03": 0 }, 200) } });
  const m = mergeProgress(a, b);
  assert.deepEqual(Object.keys(m.attempts["mcq-1"].answers).sort(), ["s1-q01", "s1-q02", "s1-q03"]);
});

test("a restarted set does not come back from an older copy", () => {
  const old = prog({ attempts: { "mcq-1": att({ "s1-q01": 2 }, 100) } });
  const fresh = prog({ resets: { "mcq-1": 150 }, attempts: { "mcq-1": att({ "s1-q05": 1 }, 160) } });
  const m = mergeProgress(old, fresh);
  assert.deepEqual(Object.keys(m.attempts["mcq-1"].answers), ["s1-q05"]);
  const m2 = mergeProgress(fresh, old);
  assert.deepEqual(Object.keys(m2.attempts["mcq-1"].answers), ["s1-q05"]);
});

test("drafts and picks are kept until the question is answered", () => {
  const x = att({}, 100, { drafts: { "w1-q01": ["1 7/15", ""] }, picks: { "s1-q02": 3 } });
  const y = att({ "w1-q01": ["1 7/15", "24"] }, 200, { partMarks: { "w1-q01": [2, 1] } });
  const m = mergeAttempt(x, y)!;
  assert.equal(m.drafts?.["w1-q01"], undefined);
  assert.equal(m.picks?.["s1-q02"], 3);
  assert.deepEqual(m.partMarks["w1-q01"], [2, 1]);
});

test("the newest 'continue where you left off' place wins; guide positions merge", () => {
  const a = prog({ last: { href: "/set/fr-mcq-1", label: "Fractions Set 1", at: 300 }, guidePos: { fr: "fr-addsub" } });
  const b = prog({ last: { href: "/guide/pc", label: "Percentages guide", at: 200 }, guidePos: { pc: "pc-change" } });
  const m = mergeProgress(a, b);
  assert.equal(m.last?.href, "/set/fr-mcq-1");
  assert.deepEqual(m.guidePos, { fr: "fr-addsub", pc: "pc-change" });
});

test("latest result per question wins, with its mistake status", () => {
  const a = prog({ stats: { q: { attempts: 1, correct: 0, lastCorrect: false, lastScore: 0, lastAt: 100 } }, mistakes: { q: true } });
  const b = prog({ stats: { q: { attempts: 2, correct: 1, lastCorrect: true, lastScore: 1, lastAt: 200 } }, mistakes: { q: false } });
  assert.equal(mergeProgress(a, b).mistakes.q, false);
  assert.equal(mergeProgress(b, a).mistakes.q, false);
});

test("best scores keep the higher one; history has no duplicates", () => {
  const f1 = { setId: "mcq-1", correct: 20, total: 25, pct: 80, at: 10 };
  const f2 = { setId: "mcq-1", correct: 23, total: 25, pct: 92, at: 20 };
  const m = mergeProgress(prog({ best: { "mcq-1": f2 }, history: [f1, f2] }), prog({ best: { "mcq-1": f1 }, history: [f1] }));
  assert.equal(m.best["mcq-1"].pct, 92);
  assert.equal(m.history.length, 2);
});

test("older saves without new fields still load", () => {
  const p = normaliseProgress({ name: "", stars: 5 } as Partial<Progress>);
  assert.equal(p.name, "Vanshika");
  assert.deepEqual(p.resets, {});
  assert.deepEqual(p.guidePos, {});
  assert.deepEqual(p.quick, {});
  assert.equal(p.stars, 5);
});
