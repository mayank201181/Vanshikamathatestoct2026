import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../lib/answerCheck.ts";
import { generates, optionValue, verifyAnswer, verifyMcq } from "../lib/verify.ts";

const st = (spec: Parameters<typeof checkAnswer>[0], a: string) => checkAnswer(spec, a).status;

test("1 : n ratios must be written in that form", () => {
  assert.equal(st({ type: "ratio", parts: [1, 2.5], unitForm: "1:n" }, "1 : 2.5"), "correct");
  assert.equal(st({ type: "ratio", parts: [1, 2.5], unitForm: "1:n" }, "2:5"), "close");
});

test("nth-term answers accept Un = …, u(n) = …, nth term = …", () => {
  for (const a of ["3n+2", "Un = 3n + 2", "u(n) = 2 + 3n", "nth term = 3n+2", "Tn=3n+2"]) {
    assert.equal(st({ type: "expression", expr: "3n+2" }, a), "correct", a);
  }
  assert.equal(st({ type: "expression", expr: "3n+2" }, "3n+5"), "incorrect");
});

test("option values read fractions, mixed numbers, money, percentages and units", () => {
  assert.ok(Math.abs(optionValue("{{1 7/15}}")! - 22 / 15) < 1e-12);
  assert.equal(optionValue("£16 000"), 16000);
  assert.equal(optionValue("22%"), 22);
  assert.equal(optionValue("40 minutes"), 40);
  assert.equal(optionValue("Down by 10%"), null);
});

test("MCQ verify catches a wrong key and a duplicate correct option", () => {
  assert.deepEqual(verifyMcq(["{{6/8}}", "{{1 7/15}}", "{{6/15}}", "{{1 2/15}}"], 1, "4/5+2/3"), []);
  assert.ok(verifyMcq(["{{6/8}}", "{{1 7/15}}", "{{6/15}}", "{{1 2/15}}"], 3, "4/5+2/3").some((m) => m.startsWith("KEY MISMATCH")));
  assert.ok(verifyMcq(["{{6/8}}", "0.75", "{{3/4}}", "1"], 1, "3/4").some((m) => m.includes("same value")));
  assert.deepEqual(verifyMcq(["28x − 9", "28x + 9", "{{28x-24}}", "13x − 1"], 0, "5(2x+3)+6(3x-4)"), []);
  assert.equal(verifyMcq(["3n + 2", "3n + 5", "n + 3", "2n + 3"], 1, "terms:5,8,11,14").length, 2);
});

test("written verify checks numbers, rounding, lists, ratios, algebra and sequences", () => {
  assert.ok(verifyAnswer({ type: "number", value: 8640 }, "8000*0.9*1.2").ok);
  assert.ok(!verifyAnswer({ type: "number", value: 8800 }, "8000*0.9*1.2").ok);
  assert.ok(verifyAnswer({ type: "number", value: 9.3 }, "7*4/3").ok); // 2 s.f. rounding
  assert.ok(verifyAnswer({ type: "list", values: [80, 40, 60], ordered: true }, "180/9*4, 180/9*2, 180/9*3").ok);
  assert.ok(verifyAnswer({ type: "ratio", parts: [4, 6, 3] }, "8:12:6").ok);
  assert.ok(verifyAnswer({ type: "expression", expr: "2x^2-5x+12" }, "x(2x+1)-3(2x-4)").ok);
  assert.ok(verifyAnswer({ type: "expression", expr: "3n^2-3n+1" }, "terms:1,7,19,37,61").ok);
  assert.equal(generates("n^2+2", [3, 6, 11, 18, 27]), true);
});

test("numbers may carry a short unit phrase; reversed lists get order feedback", () => {
  assert.equal(st({ type: "number", value: 72 }, "72 home fans"), "correct");
  assert.equal(st({ type: "number", value: 9.3 }, "£9.3 million"), "correct");
  const r = checkAnswer({ type: "list", values: [80, 40], ordered: true }, "40, 80");
  assert.equal(r.status, "incorrect");
  assert.match(r.feedback ?? "", /order the question asks/);
});
