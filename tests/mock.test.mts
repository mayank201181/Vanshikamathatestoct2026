import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_PROGRESS, noteMistake, type Progress } from "../lib/progressMerge.ts";
import { buildMistakesMock, buildMock, openMistakeIds, shownKey } from "../lib/mock.ts";
import { lookup, ALL_QUESTIONS } from "../lib/content/index.ts";
import { GENERATORS, isGenerated, parseGenId } from "../lib/gen/index.ts";
import { TOPIC_IDS } from "../lib/sections.ts";

const clone = (p: Progress): Progress => JSON.parse(JSON.stringify(p));

/** Simulate doing a mock: remember it as shown and answer every question (alternately right/wrong). */
function sit(p: Progress, ids: string[], shown: string[], t0: number): Progress {
  const q = clone(p);
  shown.forEach((k) => (q.shown[k] = t0));
  ids.forEach((id, i) => {
    const good = i % 3 !== 0;
    q.stats[id] = { attempts: 1, correct: good ? 1 : 0, lastCorrect: good, lastScore: good ? 1 : 0, lastAt: t0 + i };
    q.mistakes = noteMistake(q.mistakes, id, good);
  });
  return q;
}

test("a mock has 2 multiple-choice + 1 written per topic, multiple choice first, all resolvable", () => {
  const { ids, repeats } = buildMock(clone(EMPTY_PROGRESS));
  assert.equal(repeats, 0);
  assert.equal(ids.length, TOPIC_IDS.length * 3);
  const kinds = ids.map((id) => lookup(id)!.kind);
  assert.ok(kinds.every(Boolean));
  const firstWritten = kinds.indexOf("qa");
  assert.ok(kinds.slice(firstWritten).every((k) => k === "qa"), "all multiple choice comes before the written questions");
  for (const t of TOPIC_IDS) {
    const mine = ids.map(lookup).filter((x) => x!.q.topic === t);
    assert.equal(mine.filter((x) => x!.kind === "mcq").length, 2, `${t}: 2 multiple choice`);
    assert.equal(mine.filter((x) => x!.kind === "qa").length, 1, `${t}: 1 written`);
  }
});

test("twenty mocks in a row never repeat an exact question (topics with fresh-number templates)", () => {
  // a topic is fully covered once it has templates for both multiple choice and written
  const covered = new Set(TOPIC_IDS.filter((t) => ["mcq", "qa"].every((k) => GENERATORS.some((g) => g.topic === t && g.kinds.includes(k as "mcq" | "qa")))));
  let p = clone(EMPTY_PROGRESS);
  const seen = new Set<string>();
  for (let k = 0; k < 20; k++) {
    const built = buildMock(p);
    built.ids.forEach((id, i) => {
      const key = built.shown[i];
      const topic = lookup(id)!.q.topic;
      if (covered.has(topic)) assert.ok(!seen.has(key), `mock ${k + 1} repeated ${key} (${topic} has templates)`);
      seen.add(key);
    });
    p = sit(p, built.ids, built.shown, 1000 * (k + 1));
  }
  if (covered.size === TOPIC_IDS.length) {
    // with every topic covered, nothing at all repeats
    assert.equal(buildMock(p).repeats, 0);
  }
});

test("topics with generators get fresh numbers rather than bank repeats", () => {
  const withGen = new Set(GENERATORS.map((g) => g.topic));
  const { ids } = buildMock(clone(EMPTY_PROGRESS));
  const generated = ids.filter(isGenerated).map((id) => lookup(id)!.q.topic);
  for (const t of withGen) assert.ok(generated.includes(t), `${t} has generators but none were used`);
});

test("the mistakes mock makes a new-numbers twin of each mistake, and a right twin fixes the original", () => {
  // three bank mistakes in sections that have generators, if any exist
  const genSections = new Set(GENERATORS.map((g) => g.section));
  const picks = ALL_QUESTIONS.filter((x) => genSections.has(x.q.section)).slice(0, 3);
  let p = clone(EMPTY_PROGRESS);
  picks.forEach((x, i) => {
    p.stats[x.q.id] = { attempts: 1, correct: 0, lastCorrect: false, lastScore: 0, lastAt: 100 + i };
    p.mistakes[x.q.id] = true;
  });
  assert.deepEqual(new Set(openMistakeIds(p)), new Set(picks.map((x) => x.q.id)));
  const built = buildMistakesMock(p);
  assert.equal(built.ids.length, picks.length);
  for (const id of built.ids) {
    if (!isGenerated(id)) continue; // no template for that skill → asked again
    const ref = parseGenId(id)!;
    assert.ok(picks.some((x) => x.q.id === ref.origin), `${id} must point back at its mistake`);
    assert.equal(lookup(id)!.q.section, lookup(ref.origin!)!.q.section, "twin is the same skill");
  }
  // answer every twin correctly → all originals fixed, and no twin lands on the list
  for (const id of built.ids) p.mistakes = noteMistake(p.mistakes, id, true);
  assert.equal(openMistakeIds(p).length, 0);
  assert.ok(Object.keys(p.mistakes).every((id) => !id.startsWith("g~")));
  // a wrong twin keeps the original open
  const twin = built.ids.find(isGenerated);
  if (twin) {
    p.mistakes = noteMistake(p.mistakes, twin, false);
    assert.deepEqual(openMistakeIds(p), [parseGenId(twin)!.origin]);
  }
});

test("shownKey distinguishes bank questions from fresh-number ones", () => {
  assert.equal(shownKey("fr-m1-q01"), "b:fr-m1-q01");
  const g = GENERATORS[0];
  const { ids } = buildMock(clone(EMPTY_PROGRESS));
  const gen = ids.find(isGenerated);
  if (g && gen) assert.match(shownKey(gen)!, /^g:[a-z0-9-]+\|/);
});
