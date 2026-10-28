import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeQA, keywordMatches, tokens, normalise } from "../lib/grade.ts";

const hit = (answer: string, kw: string) => keywordMatches(tokens(answer), kw);

test("keeps maths symbols as words: ratios, equals, percent, powers", () => {
  assert.equal(normalise("3:4"), "3 to 4");
  assert.equal(normalise("x = 2"), "x equals 2");
  assert.equal(normalise("25%"), "25 percent");
  assert.equal(normalise("x² > x"), "x squared greater than x");
});

test("matches numbers exactly and forgives small word slips", () => {
  assert.ok(hit("the increase is 40 and 40 out of 160 is a quarter", "40+160"));
  assert.ok(hit("it is a quadradic sequence", "quadratic"));
  assert.ok(hit("the denomenators must match", "denominator"));
  assert.ok(!hit("the answer is 140", "40"));
});

test("does not over-match short words", () => {
  assert.ok(!hit("reduce", "red"));
  assert.ok(!hit("bat", "fat"));
});

test("refuses negated matches", () => {
  assert.ok(!hit("it is not quadratic", "quadratic"));
  assert.ok(hit("it is not quadratic", "not quadratic"));
});

test("'+' needs every part", () => {
  assert.ok(hit("second differences are 1, 2, 4 which are not constant", "second difference+not constant"));
  assert.ok(!hit("second differences are 1, 2, 4", "second difference+not constant"));
});

test("grades a written explanation point by point", () => {
  const r = gradeQA(
    {
      markScheme: [
        { point: "Gives a counter-example", keywords: ["a equals 2", "2+1/2"], feedback: "Try a = 2 and b = 1." },
        { point: "Says the statement is false", keywords: ["false", "not true", "not always"], feedback: "Say it's false." },
      ],
    },
    "It is not always true. If a = 2 and b = 1 then 1/2 is smaller than 1.",
  );
  assert.deepEqual(r.credited, [true, true]);
});

test("numbers glued to units or letters still match", () => {
  assert.ok(hit("the energy is 20J", "20 j"));
  assert.ok(hit("the energy is 20 J", "20j"));
  assert.ok(hit("nth term is 3n+2", "3n"));
  assert.ok(!hit("4(x + 1)", "4x"));
});
