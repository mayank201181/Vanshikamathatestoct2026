import Link from "next/link";
import { RichInline } from "@/components/Rich";

export const metadata = { title: "Test-morning review · Maths Test Prep" };

/** One card per question type on the class mock (5 Nov), in the order the test asks them. */
const CARDS: { title: string; how: string; example: string; watch: string }[] = [
  {
    title: "nth term, going up or down",
    how: "Find the difference d, so the rule starts dn. Zeroth term = 1st term − d. Rule = dn + zeroth term.",
    example: "3, 7, 11, 15 → d = 4, zeroth = 3 − 4 = −1 → **4n − 1**. 16, 13, 10, 7 → d = −3, zeroth = 16 + 3 = 19 → **19 − 3n**",
    watch: "Check your rule with n = 1 and n = 2.",
  },
  {
    title: "Factorise fully",
    how: "Take out the biggest number AND the letters that every term shares.",
    example: "24y + 16 = **8(3y + 2)** · 3x² − 6x = **3x(x − 2)**",
    watch: "3(x² − 2x) isn't fully factorised: x is still in both terms.",
  },
  {
    title: "Sale price (% decrease)",
    how: "Multiplier = 1 − the rate. 15% off → × 0.85.",
    example: "$40 × 0.85 = **$34** (or 15% of 40 = 6, then 40 − 6 = 34)",
    watch: "Give the sale price, not the amount taken off.",
  },
  {
    title: "Fractions and % → a ratio",
    how: "Turn everything into the same kind (20ths, or %), work out “the rest”, then simplify.",
    example: "25% = {{5/20}}, {{2/5}} = {{8/20}}, the rest = {{7/20}} → **5 : 8 : 7**",
    watch: "The rest = 1 − both parts. Check the ratio parts add up to the whole.",
  },
  {
    title: "Fraction calculation (BIDMAS)",
    how: "× and ÷ before + and −. Mixed numbers → top-heavy. Cancel before you multiply.",
    example: "{{4 1/3}} + {{2/3}} × {{5/2}} = {{13/3}} + {{5/3}} = {{18/3}} = **6**",
    watch: "Don't add first. Simplify the final answer.",
  },
  {
    title: "Pattern table + its rule",
    how: "(a) Count each pattern and fill in EVERY cell; check the differences. (b) Put n in, one step per line.",
    example: "n² + 4n + 1 for pattern 12: 12² = 144, then 4 × 12 = 48, then 144 + 48 + 1 = **193**",
    watch: "Table cells are easy marks. Don't skip part (a)!",
  },
  {
    title: "Multiplying algebraic fractions",
    how: "Cancel numbers top-with-bottom, then letters (take away the powers), then multiply.",
    example: "{{(36p^4)/35}} × {{21/(4p)}} = **{{(27p^3)/5}}**",
    watch: "p⁴ ÷ p = p³: you subtract the powers.",
  },
  {
    title: "Substitution with a negative and a root",
    how: "Put negatives in brackets. Work out everything inside the root first, then take the root.",
    example: "r − √(5a − b²) with r = 34, a = 13, b = −4: (−4)² = 16, then 65 − 16 = 49, then √49 = 7, then 34 − 7 = **27**",
    watch: "(−4)² = +16, never −16.",
  },
  {
    title: "Ratio share from a difference",
    how: "Difference in parts = difference in money. That gives you 1 part.",
    example: "3 : 9 : 7 and Max gets $180 more than Thomas → 7 − 3 = 4 parts = $180 → 1 part = $45 → Sam = 9 × 45 = **$405**",
    watch: "Answer for the person asked (or the total, if it asks for the total).",
  },
  {
    title: "Percentage profit or loss",
    how: "Change ÷ ORIGINAL (cost) price × 100.",
    example: "Bought $450, sold $600 → {{150/450}} × 100 = **{{33 1/3}}%**",
    watch: "Write the exact {{33 1/3}}% when the decimal recurs. Divide by the cost, not the selling price.",
  },
  {
    title: "Expand and simplify",
    how: "Multiply every term in the bracket by the number outside, sign included. Then collect like terms.",
    example: "2(4x + 3) − 3(x − 7) = 8x + 6 − 3x + 21 = **5x + 27**",
    watch: "−3 × −7 = +21.",
  },
  {
    title: "Increase by more than 100%",
    how: "Multiplier = 1 + the rate. 450% increase → × 5.5.",
    example: "$800 × 5.5 = **$4400** (or 450% of 800 = 3600, then 800 + 3600)",
    watch: "× 4.5 only gives the increase. Add it on to the original.",
  },
  {
    title: "Double brackets",
    how: "Grid or FOIL: four multiplications, then collect the x terms.",
    example: "(x + 3)(x − 7) = x² − 7x + 3x − 21 = **x² − 4x − 21**",
    watch: "+3 × −7 = −21.",
  },
  {
    title: "Multiplier for an increase",
    how: "1 + the rate as a decimal.",
    example: "Increase by {{17 1/2}}% → **1.175** · increase by 6% → **1.06**",
    watch: "6% is 1.06, not 1.6. Keep the ½: 17½% is 0.175.",
  },
  {
    title: "Multiplier for a decrease",
    how: "1 − the rate as a decimal.",
    example: "Decrease by 23% → **0.77** · decrease by {{15 1/2}}% → **0.845**",
    watch: "0.23 is the part taken off, not the multiplier.",
  },
  {
    title: "Dividing algebraic fractions",
    how: "Keep, Change, Flip (flip the second fraction only), then cancel and multiply.",
    example: "{{(20x^2y)/9}} ÷ {{(4x^2)/(15y)}} = {{(20x^2y)/9}} × {{(15y)/(4x^2)}} = **{{(25y^2)/3}}**",
    watch: "Flip the second fraction, never the first.",
  },
  {
    title: "Changing ratio",
    how: "% → ratio, call the parts 2x and 3x, make the change, set it equal to the new ratio, cross-multiply, solve. Then answer exactly what's asked.",
    example: "40% chocolate → 2x : 3x. Give 20 away: (2x − 20) : 3x = 1 : 4 → 4(2x − 20) = 3x → 5x = 80 → x = 16 → fruit = 3x = **48**",
    watch: "Check it: 32 − 20 = 12, and 12 : 48 = 1 : 4 ✓",
  },
  {
    title: "Quadratic sequence",
    how: "Second difference ÷ 2 = the number in front of n². Take that n² away from each term, then find the rule for what's left.",
    example: "2, 10, 24, 44 → 8, 14, 20 → 6, so 3n². Terms − 3n²: −1, −2, −3, −4 = −n → **3n² − n**. Next term: 102 + 38 = **140**",
    watch: "Halve the second difference. Check your rule on the 3rd term.",
  },
];

const HABITS = [
  "**Answer every part**, tables too. Blank = 0, a try can get marks.",
  "**Exact when it recurs**: {{33 1/3}}%, not 33.3%.",
  "**One step per line**: not 12 × 12 = 144 + 48 + 1 = 193.",
  "**Negatives in brackets**: (−4)² = +16.",
  "**Re-read the last line**: whose share? the total or one part? sale price or discount?",
];

export default function BusReview() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🚌 Test-morning review</h1>
        <p className="mt-1 text-slate-600">
          Ten minutes on the way to school. These are the 18 question types from your class mock, in the same order, each with the method, the class example and the
          slip to avoid. No new questions: you already know all of this.
        </p>
      </div>

      <section className="break-inside-avoid rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-4">
        <h2 className="font-extrabold text-indigo-900">Your 5 habits for today</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-indigo-950">
          {HABITS.map((h, i) => (
            <li key={i}>
              <RichInline text={h} />
            </li>
          ))}
        </ol>
      </section>

      <ol className="space-y-3">
        {CARDS.map((c, i) => (
          <li key={i} className="break-inside-avoid rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="text-lg font-extrabold text-slate-900">{c.title}</h3>
            </div>
            <p className="mt-2 text-slate-800">
              <RichInline text={c.how} />
            </p>
            <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-slate-900">
              <RichInline text={c.example} />
            </p>
            <p className="mt-2 text-sm font-semibold text-amber-800">
              ⚠️ <RichInline text={c.watch} />
            </p>
          </li>
        ))}
      </ol>

      <section className="break-inside-avoid rounded-2xl bg-emerald-600 p-5 text-white">
        <p className="text-lg font-extrabold">You&apos;ve done four full papers and fixed your mistakes. You&apos;re ready.</p>
        <p className="mt-1 text-emerald-50">
          In the test: read each question once, do the ones you&apos;re sure of first, then come back. Show your working: method marks count even if the last step slips.
        </p>
      </section>

      <p className="no-print text-sm text-slate-500">
        Two spare minutes? Go through the{" "}
        <Link href="/flashcards" className="font-semibold text-indigo-600 underline">
          flashcards
        </Link>{" "}
        you marked “still learning”.
      </p>
    </div>
  );
}
