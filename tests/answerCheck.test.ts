import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer, checkWithTraps, specSelfCheck } from "../lib/answerCheck.ts";
import type { AnswerSpec } from "../lib/types.ts";

const st = (spec: AnswerSpec, input: string) => checkAnswer(spec, input).status;

test("numbers: formats", () => {
  const s: AnswerSpec = { type: "number", value: -11 };
  for (const i of ["-11", "−11", " -11 ", "x = -11", "x=−11", "-11.0"]) assert.equal(st(s, i), "correct", i);
  assert.equal(st(s, "11"), "incorrect");
  assert.equal(checkAnswer(s, "11").feedback, "Check the sign (+ or −).");
  assert.equal(st(s, ""), "invalid");
  assert.equal(st(s, "eleven"), "invalid");
});

test("numbers: money, units, thousands", () => {
  assert.equal(st({ type: "number", value: 46 }, "£46"), "correct");
  assert.equal(st({ type: "number", value: 46 }, "S$46"), "correct");
  assert.equal(st({ type: "number", value: 46 }, "$46.00"), "correct");
  assert.equal(st({ type: "number", value: 1200 }, "1,200"), "correct");
  assert.equal(st({ type: "number", value: 12 }, "12 cm"), "correct");
  assert.equal(st({ type: "number", value: 12 }, "12cm²"), "correct");
  assert.equal(st({ type: "number", value: 12 }, "12 cm^2"), "correct");
  assert.equal(st({ type: "number", value: 60 }, "60 km/h"), "correct");
  assert.equal(st({ type: "number", value: 120 }, "120°"), "correct");
  assert.equal(st({ type: "number", value: 35 }, "35%"), "correct");
  assert.equal(st({ type: "number", value: 12 }, "12 5"), "invalid");
});

test("numbers: fractions allowed / disallowed", () => {
  assert.equal(st({ type: "number", value: 0.75 }, "3/4"), "correct");
  assert.equal(st({ type: "number", value: 0.75 }, "¾"), "correct");
  assert.equal(st({ type: "number", value: 0.75, allowFraction: false }, "3/4"), "close");
  assert.equal(st({ type: "number", value: 0.75, allowFraction: false }, "0.75"), "correct");
  assert.equal(st({ type: "number", value: 1.75 }, "1 3/4"), "correct");
  assert.equal(st({ type: "number", value: 0.5 }, ".5"), "correct");
});

test("numbers: rounding near miss & tolerance", () => {
  assert.equal(st({ type: "number", value: 12.57 }, "12.6"), "close");
  assert.equal(st({ type: "number", value: 12.57 }, "12.57"), "correct");
  assert.equal(st({ type: "number", value: 12.57, tolerance: 0.01 }, "12.566"), "correct");
  assert.equal(st({ type: "number", value: 100 }, "99"), "incorrect");
  assert.equal(st({ type: "number", value: 3.14 }, "3"), "incorrect");
});

test("numbers: standard form", () => {
  const s: AnswerSpec = { type: "number", value: 32000, standardForm: true };
  assert.equal(st(s, "3.2 x 10^4"), "correct");
  assert.equal(st(s, "3.2×10⁴"), "correct");
  assert.equal(st(s, "32000"), "close");
  assert.equal(st(s, "32 x 10^3"), "close");
  assert.equal(st({ type: "number", value: 0.0045, standardForm: true }, "4.5 × 10^-3"), "correct");
  assert.equal(st({ type: "number", value: 0.0045, standardForm: true }, "4.5 × 10^(−3)"), "correct");
});

test("fractions", () => {
  const s: AnswerSpec = { type: "fraction", n: 7, d: 12, simplest: true };
  assert.equal(st(s, "7/12"), "correct");
  assert.equal(st(s, "14/24"), "close");
  assert.equal(st(s, "12/7"), "incorrect");
  assert.equal(checkAnswer(s, "12/7").feedback, "That's the reciprocal — is it upside down?");
  assert.equal(st(s, "0.5833"), "incorrect");
  assert.equal(st({ type: "fraction", n: 3, d: 4, allowDecimal: true }, "0.75"), "correct");
  assert.equal(st({ type: "fraction", n: 3, d: 4 }, "0.75"), "close");
  const mixed: AnswerSpec = { type: "fraction", n: 19, d: 12, form: "mixed" };
  assert.equal(st(mixed, "1 7/12"), "correct");
  assert.equal(st(mixed, "19/12"), "close");
  assert.equal(st({ type: "fraction", n: -3, d: 4 }, "−3/4"), "correct");
  assert.equal(st({ type: "fraction", n: -3, d: 4 }, "3/4"), "incorrect");
  assert.equal(st({ type: "fraction", n: 6, d: 3 }, "2"), "correct");
  assert.equal(st({ type: "fraction", n: 9, d: 10 }, "⁹⁄₁₀"), "correct");
});

test("lists and coordinates", () => {
  const share: AnswerSpec = { type: "list", values: [28, 35] };
  for (const i of ["28, 35", "35, 28", "£28 and £35", "28 35", "28;35"]) assert.equal(st(share, i), "correct", i);
  assert.equal(st(share, "28"), "close");
  const pt: AnswerSpec = { type: "list", values: [3, -2], ordered: true };
  assert.equal(st(pt, "(3, -2)"), "correct");
  assert.equal(st(pt, "(3,−2)"), "correct");
  assert.equal(st(pt, "(-2, 3)"), "incorrect");
  const roots: AnswerSpec = { type: "list", values: [2, -3] };
  assert.equal(st(roots, "x = 2 or x = -3"), "correct");
  assert.equal(st(roots, "x=-3, x=2"), "correct");
  const hcfLcm: AnswerSpec = { type: "list", values: [36, 7560], ordered: true };
  assert.equal(st(hcfLcm, "HCF = 36, LCM = 7560"), "correct");
  const pm: AnswerSpec = { type: "list", values: [12, -12] };
  for (const i of ["±12", "x = ±12", "+-12", "12, -12"]) assert.equal(st(pm, i), "correct", i);
  assert.notEqual(st(pm, "12"), "correct");
  const primes: AnswerSpec = { type: "list", values: [2, 2, 2, 3, 5] };
  for (const i of ["2, 2, 2, 3, 5", "2 × 2 × 2 × 3 × 5", "2^3 × 3 × 5", "2³×3×5", "120 = 2^3 * 3 * 5", "5 x 3 x 2^3"]) assert.equal(st(primes, i), "correct", i);
  for (const i of ["2^2 × 3 × 5", "2 × 3 × 5", "120"]) assert.notEqual(st(primes, i), "correct", i);
  // Non-prime lists are not read as products.
  assert.equal(st(share, "28 × 35"), "invalid");
});

test("ratios", () => {
  const s: AnswerSpec = { type: "ratio", parts: [3, 4], simplest: true };
  assert.equal(st(s, "3:4"), "correct");
  assert.equal(st(s, "3 : 4"), "correct");
  assert.equal(st(s, "12:16"), "close");
  assert.equal(st(s, "4:3"), "incorrect");
  assert.equal(st({ type: "ratio", parts: [2, 3, 5] }, "2:3:5"), "correct");
  assert.equal(st({ type: "ratio", parts: [1, 2.5] }, "1 : 2.5"), "correct");
  assert.equal(st(s, "3 to 4"), "correct");
});

test("expressions: equivalence", () => {
  const s: AnswerSpec = { type: "expression", expr: "2x+6" };
  for (const i of ["2x+6", "6+2x", "2(x+3)", "2*x + 6", "x+x+6", "y = 2x + 6", "2x + 6 = y"]) assert.equal(st(s, i), "correct", i);
  assert.equal(st(s, "2x+5"), "incorrect");
  assert.equal(st(s, "2y+6"), "incorrect");
  assert.equal(st({ type: "expression", expr: "x^2+5x+6" }, "(x+2)(x+3)"), "correct");
  assert.equal(st({ type: "expression", expr: "x^2+5x+6" }, "x²+5x+6"), "correct");
  assert.equal(st({ type: "expression", expr: "a^5" }, "a^2 × a^3"), "correct");
  assert.equal(st({ type: "expression", expr: "12pi" }, "12π"), "correct");
  assert.equal(st({ type: "expression", expr: "6ab" }, "6ba"), "correct");
  assert.equal(st({ type: "expression", expr: "(x+1)/2" }, "x/2 + 1/2"), "correct");
  assert.equal(st({ type: "expression", expr: "3n+2" }, "3n + 2"), "correct");
  assert.equal(st({ type: "expression", expr: "-x^2" }, "-x^2"), "correct");
  assert.equal(st({ type: "expression", expr: "x^-1" }, "1/x"), "correct");
  assert.equal(st({ type: "expression", expr: "2x+6" }, "2x+"), "invalid");
  // A unit typed after the answer is ignored — unless its letters are variables of the answer.
  const area: AnswerSpec = { type: "expression", expr: "60+9pi" };
  for (const i of ["60 + 9π m²", "60+9pi m^2", "9π + 60 m", "60 + 9pi cm2"]) assert.equal(st(area, i), "correct", i);
  assert.equal(st(area, "60 + 8π m²"), "incorrect");
  assert.equal(st({ type: "expression", expr: "5m" }, "5 m^2"), "incorrect");
});

test("expressions: forms", () => {
  const f: AnswerSpec = { type: "expression", expr: "3(x+2)", form: "factorised" };
  assert.equal(st(f, "3(x+2)"), "correct");
  assert.equal(st(f, "3(2+x)"), "correct");
  assert.equal(st(f, "3x+6"), "close");
  assert.equal(st({ type: "expression", expr: "x(x+5)", form: "factorised" }, "x(x+5)"), "correct");
  assert.equal(st({ type: "expression", expr: "(x+3)^2", form: "factorised" }, "(x+3)^2"), "correct");
  assert.equal(st({ type: "expression", expr: "(x+3)^2", form: "factorised" }, "(x+3)(x+3)"), "correct");
  const e: AnswerSpec = { type: "expression", expr: "x^2+5x+6", form: "expanded" };
  assert.equal(st(e, "x^2+5x+6"), "correct");
  assert.equal(st(e, "(x+2)(x+3)"), "close");
  const s: AnswerSpec = { type: "expression", expr: "4x+3y", form: "simplified" };
  assert.equal(st(s, "4x+3y"), "correct");
  assert.equal(st(s, "3y+4x"), "correct");
  assert.equal(st(s, "3x+x+3y"), "close");
  // "Factorise fully": a common factor left inside a bracket is close, not correct.
  const full: AnswerSpec = { type: "expression", expr: "3x(2x+5)", form: "factorised" };
  assert.equal(st(full, "3x(2x+5)"), "correct");
  assert.equal(st(full, "x(6x+15)"), "close");
  assert.equal(st(full, "3(2x^2+5x)"), "close");
  assert.equal(st(full, "-3x(-2x-5)"), "correct");
  assert.equal(st({ type: "expression", expr: "(x+2)(x+3)", form: "factorised" }, "(x+3)(x+2)"), "correct");
  assert.equal(st({ type: "expression", expr: "2(x+2)(x+1)", form: "factorised" }, "(2x+4)(x+1)"), "close");
  assert.equal(st({ type: "expression", expr: "4(a+2b)", form: "factorised" }, "2(2a+4b)"), "close");
});

test("text", () => {
  const s: AnswerSpec = { type: "text", accept: ["x > 3", "3 < x"] };
  assert.equal(st(s, "x>3"), "correct");
  assert.equal(st(s, "X > 3"), "correct");
  assert.equal(st(s, "3<x"), "correct");
  assert.equal(st(s, "x≥3"), "incorrect");
  assert.equal(st({ type: "text", accept: ["isosceles"] }, "Isosceles."), "correct");
  assert.equal(st({ type: "text", accept: ["x <= 4"] }, "x ≤ 4"), "correct");
});

test("self-check of display answers", () => {
  const specs: AnswerSpec[] = [
    { type: "number", value: -2.5 },
    { type: "number", value: 32000, standardForm: true },
    { type: "number", value: 0.00045, standardForm: true },
    { type: "fraction", n: 19, d: 12, form: "mixed", simplest: true },
    { type: "fraction", n: -3, d: 4, simplest: true },
    { type: "fraction", n: 6, d: 8 },
    { type: "list", values: [3, -2], ordered: true },
    { type: "ratio", parts: [2, 3], simplest: true },
    { type: "expression", expr: "3(x+2)", form: "factorised" },
    { type: "expression", expr: "4x+3y", form: "simplified" },
    { type: "text", accept: ["obtuse"] },
  ];
  for (const s of specs) assert.equal(specSelfCheck(s).status, "correct", JSON.stringify(s));
});

test("numbers: a unit can't hide a second number", () => {
  const nine: AnswerSpec = { type: "number", value: 9 };
  for (const i of ["x = 9 or 2", "9 or 3", "9 x 2", "9x2", "9 x2", "9 or2", "9 times 2"]) assert.equal(st(nine, i), "invalid", i);
  for (const i of ["9 cm2", "9 cm 2", "9 m^3", "9 cm²", "9 units^2", "9 m/s", "9 litres", "9°"]) assert.equal(st(nine, i), "correct", i);
  assert.equal(st({ type: "number", value: -2 }, "-2 x 3"), "invalid");
  assert.equal(st({ type: "fraction", n: 1, d: 3, simplest: true }, "1/3 or 3"), "invalid");
  // A squared or cubed unit under the line.
  assert.equal(st({ type: "number", value: 7.9 }, "7.9 g/cm³"), "correct");
  assert.equal(st({ type: "number", value: 2000 }, "2000 N/m²"), "correct");
  assert.equal(st({ type: "number", value: 2700 }, "2700 kg/m^3"), "correct");
});

test("numbers: spaced thousands", () => {
  assert.equal(st({ type: "number", value: 7050000 }, "7 050 000"), "correct");
  assert.equal(st({ type: "number", value: 7050000 }, "-7 050 000"), "incorrect");
  assert.equal(st({ type: "number", value: -7050 }, "−7 050"), "correct");
  assert.equal(st({ type: "number", value: 2591.8 }, "2 591.8 m"), "correct");
  assert.equal(st({ type: "number", value: 0.00025 }, "0.000 25"), "correct");
  assert.equal(st({ type: "number", value: 21600 }, "21 600 cm²"), "correct");
  assert.equal(st({ type: "ratio", parts: [1, 50000] }, "1 : 50 000"), "correct");
  assert.equal(st({ type: "number", value: 67700000, standardForm: true }, "67 700 000"), "close");
  // Groups must be exactly three digits, and a mixed number is still a mixed number.
  assert.equal(st({ type: "number", value: 12 }, "12 5"), "invalid");
  assert.equal(st({ type: "number", value: 125 }, "12 5"), "invalid");
  assert.equal(st({ type: "number", value: 1.5 }, "1 1/2"), "correct");
});

test("numbers typed with π", () => {
  const s: AnswerSpec = { type: "number", value: 37.7 };
  for (const i of ["12π", "12pi", "12 pi", "x = 12π cm"]) {
    assert.equal(st(s, i), "close", i);
    assert.match(checkAnswer(s, i).feedback ?? "", /decimal/);
  }
  assert.equal(st(s, "37.7"), "correct");
  assert.equal(st(s, "13π"), "incorrect");
  assert.equal(st({ type: "number", value: 38 }, "12π"), "close");
  // π is not a unit: "12π" is not 12.
  assert.equal(st({ type: "number", value: 12 }, "12π"), "incorrect");
  // "Using π = 3.14" and "Use π = 22/7" questions: the exact answer is still close, not wrong.
  assert.equal(st({ type: "number", value: 50.24 }, "16π"), "close");
  assert.equal(st({ type: "number", value: 154 }, "49π"), "close");
  assert.equal(st({ type: "number", value: 50.24 }, "17π"), "incorrect");
  // Words that merely contain "pi" are still units.
  assert.equal(st({ type: "number", value: 6 }, "6 pieces"), "correct");
});

test("lists: thousands separators, mixed numbers, units and times", () => {
  const recipe: AnswerSpec = { type: "list", values: [525, 1400], ordered: true };
  for (const i of ["525, 1,400", "525 g of red lentils and 1,400 ml of water", "525, 1400", "525, 1 400"]) assert.equal(st(recipe, i), "correct", i);
  assert.equal(st({ type: "list", values: [36, 7560], ordered: true }, "HCF = 36, LCM = 7,560"), "correct");
  assert.equal(st({ type: "list", values: [36, 7560], ordered: true }, "7,560, 36"), "incorrect");
  assert.equal(st({ type: "list", values: [1200, 800] }, "£1,200 and £800"), "correct");
  // Commas between values with no spaces still separate them when that gives the right count.
  assert.equal(st({ type: "list", values: [18, 160, 2880] }, "18,160,2880"), "correct");
  assert.equal(st({ type: "list", values: [2, 100] }, "2,100"), "correct");
  // A mixed number is one value.
  const grad: AnswerSpec = { type: "list", values: [1.5, 3], ordered: true };
  for (const i of ["1 1/2, 3", "1½, 3", "3/2, 3", "1.5, 3"]) assert.equal(st(grad, i), "correct", i);
  const mid: AnswerSpec = { type: "list", values: [0, 6.5], ordered: true };
  for (const i of ["(0, 6½)", "(0, 6 1/2)"]) assert.equal(st(mid, i), "correct", i);
  assert.equal(st({ type: "list", values: [-2.5, 3], ordered: true }, "(-2½, 3)"), "correct");
  for (const i of ["(-½, 3)", "(−½, 3)", "3, -½"]) assert.equal(st({ type: "list", values: [-0.5, 3] }, i), "correct", i);
  assert.equal(st({ type: "list", values: [3, -4], ordered: true }, "3 - 4"), "invalid");
  assert.notEqual(st({ type: "list", values: [1, 0.5, 3], ordered: true }, "1 1/2, 3"), "correct");
  // Squared and cubed units, as the answers are displayed.
  const areas: AnswerSpec = { type: "list", values: [7, 5], ordered: true };
  for (const i of ["7 cm², 5 cm²", "7 cm^2, 5 cm^2", "7 cm2, 5 cm2", "7cm², 5cm²"]) assert.equal(st(areas, i), "correct", i);
  assert.equal(st({ type: "list", values: [18, 21.2], ordered: true }, "18 cm², 21.2 cm"), "correct");
  assert.equal(st({ type: "list", values: [15, 10], ordered: true }, "15 km/h, 10 km/h"), "correct");
  // Hours and minutes typed together.
  const flight: AnswerSpec = { type: "list", values: [8, 15], ordered: true };
  for (const i of ["8h15min", "8 h15 min", "8 h 15 min", "8hours15minutes", "8, 15"]) assert.equal(st(flight, i), "correct", i);
  assert.equal(st(flight, "8h16min"), "incorrect");
});

test("lists: too few values is only 'close' when the given ones are right", () => {
  const share: AnswerSpec = { type: "list", values: [28, 35] };
  assert.equal(st(share, "28"), "close");
  assert.equal(st(share, "35"), "close");
  for (const i of ["99", "0", "-1000"]) {
    assert.equal(st(share, i), "incorrect", i);
    assert.equal(checkAnswer(share, i).feedback, "I was expecting 2 values.");
  }
  const primes: AnswerSpec = { type: "list", values: [2, 2, 2, 3, 5] };
  assert.equal(st(primes, "2, 2"), "close");
  assert.equal(st(primes, "7"), "incorrect");
  assert.equal(st(primes, "2, 7"), "incorrect");
  assert.equal(st({ type: "list", values: [3, -2], ordered: true }, "3"), "close");
});

test("expressions: in terms of π", () => {
  const circ: AnswerSpec = { type: "expression", expr: "10pi" };
  for (const i of ["31.41592654", "31.4159265", "31.415927"]) {
    assert.equal(st(circ, i), "close", i);
    assert.match(checkAnswer(circ, i).feedback ?? "", /π/);
  }
  for (const i of ["10π", "10pi", "10 π cm", "π × 10"]) assert.equal(st(circ, i), "correct", i);
  assert.equal(st(circ, "31.4"), "incorrect");
  assert.equal(st({ type: "expression", expr: "60+9pi" }, "88.27433388"), "close");
  // A rounded decimal still gets the trap's targeted feedback.
  const trap = [{ spec: { type: "number", value: 44, tolerance: 0.1 } as AnswerSpec, feedback: "Leave π as a symbol." }];
  assert.equal(checkWithTraps({ type: "expression", expr: "14pi" }, "43.98", trap).feedback, "Leave π as a symbol.");
});

test("expressions: simplified and expanded answers have each term finished", () => {
  const sim = (expr: string): AnswerSpec => ({ type: "expression", expr, form: "simplified" });
  // Products, quotients and powers left uncombined (the question typed back) are close.
  assert.equal(st(sim("10a^5"), "2a^3*5a^4/a^2"), "close");
  assert.equal(st(sim("10a^5"), "10a^7/a^2"), "close");
  assert.equal(st(sim("10a^5"), "(2a^3 * 5a^4)/a^2"), "close");
  assert.equal(st(sim("6a^7"), "2a² × 3a × a⁴"), "close");
  assert.equal(st(sim("9m^8"), "3m^4 × 3m^4"), "close");
  assert.equal(st(sim("9m^8"), "(3m^4)^2"), "close");
  assert.equal(st(sim("p^7"), "p^12 ÷ p^5"), "close");
  assert.equal(st(sim("12x^7"), "4x^6 × 3x"), "close");
  assert.equal(st(sim("3x/5"), "3/x*x^2/5"), "close");
  // A number fraction that still cancels is not simplified, with or without brackets.
  for (const i of ["12x/4", "12x ÷ 4", "(12x)/4", "6x/2"]) assert.equal(st(sim("3x"), i), "close", i);
  for (const i of ["6x/10", "(6x)/10", "6/10x", "1.2x/2"]) assert.equal(st(sim("3x/5"), i), "close", i);
  assert.equal(st(sim("x/2"), "2x/4"), "close");
  assert.match(checkAnswer(sim("12x^7"), "4x^6 × 3x").feedback ?? "", /multiply or cancel the numbers/);
  const exp: AnswerSpec = { type: "expression", expr: "12x-8", form: "expanded" };
  assert.equal(st(exp, "4×3x − 4×2"), "close");
  for (const i of ["12x-8", "-8+12x", "12x+-8"]) assert.equal(st(exp, i), "correct", i);
  // Legitimately simplified forms are still correct.
  for (const i of ["10a^5", "10a⁵", "a^5*10"]) assert.equal(st(sim("10a^5"), i), "correct", i);
  for (const i of ["3x/5", "3/5x", "0.6x", "(3/5)x", "x*3/5"]) assert.equal(st(sim("3x/5"), i), "correct", i);
  for (const i of ["1/3V", "⅓V", "V/3"]) assert.equal(st(sim("V/3"), i), "correct", i);
  for (const i of ["x/2", "0.5x", "1/2x", "½x"]) assert.equal(st(sim("x/2"), i), "correct", i);
  assert.equal(st(sim("4p^5q^2"), "4q^2p^5"), "correct");
  assert.equal(st(sim("7ab"), "7ba"), "correct");
  assert.equal(st(sim("x^2+x+6"), "6+x+x^2"), "correct");
  assert.equal(st(sim("x^-1"), "1/x"), "correct");
  assert.equal(st(sim("6a^7"), "6a^7 cm³"), "correct");
  // Only simplified/expanded forms are strict: "any" still accepts an unsimplified equivalent.
  assert.equal(st({ type: "expression", expr: "3x+6" }, "3(x+2)"), "correct");
  assert.equal(st({ type: "expression", expr: "a^5" }, "a^2 × a^3"), "correct");
});

test("expressions: harmless brackets in a simplified answer", () => {
  const sim = (expr: string): AnswerSpec => ({ type: "expression", expr, form: "simplified" });
  for (const i of ["(7x)/10", "(7/10)x", "7x/10", "-(-7x)/10"]) assert.equal(st(sim("7x/10"), i), "correct", i);
  for (const i of ["(8x^2)/15", "(8/15)x^2"]) assert.equal(st(sim("8x^2/15"), i), "correct", i);
  for (const i of ["(1/3)V", "(V)/3"]) assert.equal(st(sim("V/3"), i), "correct", i);
  // Brackets are only excused around a finished term: a sum in a power still hides work.
  assert.equal(st(sim("x^2/2"), "(x^(1+1))/2"), "close");
  // Brackets that still hide work are close.
  assert.equal(st(sim("6x"), "2(3x)"), "close");
  assert.equal(st(sim("4x+3y"), "2(2x)+3y"), "close");
  assert.equal(st(sim("10x+8"), "2(5x+4)"), "close");
  assert.equal(st(sim("3y^2-2y"), "y(3y-2)"), "close");
});
