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

test("a restated expression before the answer is ignored", () => {
  assert.equal(st({ type: "number", value: -27 }, "e³ = −27"), "correct");
  assert.equal(st({ type: "number", value: 75 }, "8e^2 + 3 = 75"), "correct");
  assert.equal(st({ type: "number", value: 75 }, "8e^2 + 3 = 72"), "incorrect");
  assert.equal(st({ type: "fraction", n: 15, d: 4 }, "(2c − e)/4 = 15/4"), "correct");
});

test("an 'expand' answer must also collect like terms", () => {
  const spec = { type: "expression", expr: "x^2+7x+12", form: "expanded" } as const;
  assert.equal(st(spec, "x² + 7x + 12"), "correct");
  assert.equal(st(spec, "12 + 7x + x^2"), "correct");
  assert.equal(st(spec, "x^2+3x+4x+12"), "close");
  assert.equal(st(spec, "(x+3)(x+4)"), "close");
});

test("a short label before the number is ignored", () => {
  assert.equal(st({ type: "number", value: 33 }, "Pattern 33"), "correct");
  assert.equal(st({ type: "number", value: 24 }, "term 24"), "correct");
  assert.equal(st({ type: "number", value: -5 }, "minus 5"), "invalid");
});

test("labels before list values are ignored", () => {
  assert.equal(st({ type: "list", values: [1, 7, 19], ordered: true }, "U1=1, U2=7, U3=19"), "correct");
  assert.equal(st({ type: "list", values: [80, 40, 60], ordered: true }, "Lucy = £80, Mary = £40, Nancy = £60"), "correct");
  assert.equal(st({ type: "list", values: [2, -3] }, "x = 2 or x = -3"), "correct");
  assert.equal(st({ type: "list", values: [28, 35] }, "28, 35"), "correct");
});

test("a multiplier may be typed with a times sign", () => {
  assert.equal(st({ type: "number", value: 1.05, allowFraction: false }, "×1.05"), "correct");
  assert.equal(st({ type: "number", value: 0.9, allowFraction: false }, "x 0.9"), "correct");
});

test("MCQ algebra options are read the way {{ }} displays them", () => {
  assert.deepEqual(verifyMcq(["{{3xyz/4}}", "{{3/4}}", "{{6xyz/8}}x", "{{42xyz}}"], 0, "42xyz/56"), []);
  assert.deepEqual(verifyMcq(["{{3y/z}}", "{{3yz}}", "{{3/z}}", "{{y/z}}"], 0, "3xy/xz"), []);
  assert.deepEqual(verifyMcq(["{{f/2c}}", "{{f/(2c)}}x", "{{2f/c}}", "{{fc/2}}"], 0, "17cf/(34c^2)"), []);
});

test("yes/no answers may carry a reason", () => {
  const no = { type: "text", accept: ["no"] } as const;
  for (const a of ["No", "no, he's wrong", "No he’s not", "Nope", "no it isn't", "NO."]) assert.equal(st(no, a), "correct", a);
  for (const a of ["yes", "Yes he is", "not sure"]) assert.notEqual(st(no, a), "correct", a);
  assert.equal(st({ type: "text", accept: ["sometimes"] }, "Sometimes - e.g. x = 0.5"), "correct");
});
