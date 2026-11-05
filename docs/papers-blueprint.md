# Class-test practice papers: blueprint

Four practice papers in the exact style of Vanshika's class mock test (5 November). Her teacher says the
real test is "similar type". Each paper has the same 18 question types in the same order with the same
marks, plus 2 **extra practice** questions on the two things that went wrong. All numbers, contexts and
answers below were chosen so that **no question repeats** across the four papers, the class mock or the
question bank. Do not change a number without re-checking all of that.

## The class mock (for wording and layout; do not reuse its numbers)
1. Find the rule for the nth term of each sequence below: (a) 3, 7, 11, 15, 19 … (b) 16, 13, 10, 7, 4, … **(4 marks)**
2. Factorise the following expressions: (a) 24y + 16 (b) 3x² − 6x **(4 marks)**
3. A calculator is normally sold for $40. A shop is having a sale where all prices are reduced by 15%. Calculate the sale price of this calculator. **(3 marks)**
4. [She] spends 25% of her leisure time reading, {{2/5}} of her time playing the piano and the rest of her time is spent socialising with friends. Express the ratio time spent reading : time spent playing the piano : time spent socialising as a ratio in its simplest form. **(2 marks)**
5. Calculate {{4 1/3}} + {{2/3}} × {{5/2}} **(3 marks)**
6. Lily uses coins to create a growing shape pattern, as shown in the table. The first pattern uses 6 coins. (a) Complete the table to show how many coins are used for the other patterns. (b) Lily correctly identifies the rule for the nth term in this pattern as n² + 4n + 1. Use this formula to calculate the number of coins she needs to create the 12th pattern of this sequence. **(3 marks)**
7. Write the answer to this calculation in its simplest form: {{36p^4/35}} × {{21/4p}} **(2 marks)**
8. Calculate the value of r − √(5a − b²) where r = 34, a = 13, b = −4. **(3 marks)**
9. Thomas, Sam and Max share some money in the ratio 3 : 9 : 7. When the money is divided between them, Max is given $180 more than Thomas. How much money did Sam receive? **(3 marks)**
10. Elina buys a bicycle for $450. Two weeks later she sells it for $600. Calculate the percentage profit that she has made in selling the bicycle. **(2 marks)**
11. Expand the brackets and simplify this expression: 2(4x + 3) − 3(x − 7) **(2 marks)**
12. Increase $800 by 450% **(2 marks)**
13. Expand the brackets and simplify this expression: (x + 3)(x − 7) **(2 marks)**
14. Bhavya is asked to increase $460 by {{17 1/2}}%. Using a calculator, she multiplies 460 by a single number to get the correct answer. What single number does she use? **(2 marks)**
15. Simone is asked to decrease $1850 by 23%. She multiplies 1850 by a single number to get the correct answer. What single number does she use? **(2 marks)**
16. Write the answer to this calculation in its simplest form: {{(20x^2y)/9}} ÷ {{(4x^2)/(15y)}} **(3 marks)**
17. Talia has a bag of sweets. Some of them are chocolate flavoured, and the rest are fruit flavoured. She notices that 40% of the sweets are chocolate flavoured. She gives a friend 20 chocolate flavoured sweets. She observes that the ratio of chocolate sweets to fruit flavoured sweets is now 1 : 4. How many fruit flavoured sweets does she have in the bag? **(3 marks)**
18. Here are the first six terms of a sequence: 2, 10, 24, 44, 70, 102. (a) Find the next term in the sequence. (b) Find an expression for the nth term in this sequence. **(5 marks)**

**How she did:** everything right except **6(a), left blank** (she jumped straight to 6(b)). On 10 she wrote
33.3% and the teacher noted the exact **{{33 1/3}}%**. Her 17 (48) is actually correct but was marked wrong;
practise the type anyway. Habit to fix: running "=" chains such as `12 × 12 = 144 + 48 + 1 = 193`;
show each step on its own line.

## House rules for the papers
- File per half: `lib/content/papers/p{N}-a.ts` exports `P{N}_A: QA[]` (questions 1–10, ids `p{N}-q01` … `p{N}-q10`);
  `p{N}-b.ts` exports `P{N}_B: QA[]` (questions 11–20, ids `p{N}-q11` … `p{N}-q20`). Import types from `../../types.ts`.
- Each question is a `QA` (written question) with the topic/section given below, so scores feed the right place.
- **Question text reads like the exam paper**: short, plain, same phrasing pattern as the class mock above
  (swap in the new numbers, names and contexts). No chatty preamble in the question itself. The two extra
  practice questions start with the given bold label.
- Marks per part exactly as listed; the paper totals **57 marks**: half A = 29, half B = 28.
- Every auto-marked part has an `answer` spec and a `verify` built from the question's own numbers.
- `hints`: 2–3 rungs (1 for warmup), never the answer. `solution`: one step per string, set out the way the class
  does it. `commonError`: the real slip for that question type (see "How she did").
  Add `traps` for predictable wrong answers (e.g. doing left-to-right in Q5, 1.6 for 6%, rounding in Q10).
- Money answers: `{ type: "number", value: 39, display: "$39" }`. Percentages: `display: "35%"`.
- Patterns (Q6, Q19): picture with `diagram: dotPatterns([[...], [...], [...]], "coins")` from `./dots.ts`
  (each inner array = the row lengths of one pattern, top to bottom, drawn centred), plus a `table` with "?" in the
  cells to fill. **Show patterns 1–3 only.**
- Difficulty: Q1, Q2, Q12 `warmup`; Q16, Q17, Q18, Q19, Q20 `challenge`; the rest `core`.
- Check your half with `node --no-warnings scripts/validate.ts papers "p{N}-q(0[1-9]|10)"` (half A) or
  `"p{N}-q(1[1-9]|20)"` (half B), and try typed answers with `node --no-warnings scripts/try-answer.ts p{N}-q05 1 "3 1/4"`.

## Question slots (same for every paper)
| Q | Topic · section | Marks |
|---|---|---|
| 1 | sq · sq-nth | (a) 2, (b) 2 |
| 2 | ex · ex-factorise | (a) 2, (b) 2 |
| 3 | pc · pc-change | 3 |
| 4 | ra · ra-basics | 2 |
| 5 | fr · fr-problems | 3 |
| 6 | sq · sq-generate | (a) 1 (both table values, typed as a list in order), (b) 2 |
| 7 | fr · fr-algebraic | 2 |
| 8 | su · su-negatives | 3 |
| 9 | ra · ra-sharing | 3 |
| 10 | pc · pc-percent-change | 2 |
| 11 | ex · ex-expand | 2 |
| 12 | pc · pc-change | 2 |
| 13 | ex · ex-double | 2 |
| 14 | pc · pc-multipliers | 2 |
| 15 | pc · pc-multipliers | 2 |
| 16 | fr · fr-algebraic | 3 |
| 17 | ra · ra-problems | 3 |
| 18 | sq · sq-quadratic | (a) 1, (b) 4 |
| 19 | sq · sq-generate (P1, P3) / sq-nth (P2, P4) | 4, split as listed per paper |
| 20 | ra · ra-problems | 3 |

Q19 label: `**Extra practice: completing a pattern table** (like 6(a) in your class test).` Ask for patterns 2, 3 and 4
(pattern 4 is not drawn: continue the pattern), typed as a list in order.
Q20 label: `**Extra practice: a changing ratio** (like question 17 in your class test).`
Q10 in Papers 1 and 3 has a recurring answer: say "Give your answer as an exact percentage." Accept the exact value
(fraction or mixed number, e.g. 16 2/3 or 50/3); trap the rounded 16.7 / 16.67 with feedback to write the exact value.

## Paper 1
1. (a) 7, 13, 19, 25, 31, … → **6n + 1**; (b) 41, 37, 33, 29, 25, … → **45 − 4n**
2. (a) 18a + 30 → **6(3a + 5)**; (b) 5x² − 15x → **5x(x − 3)** (fully factorised required)
3. Headphones normally sold for $60; sale reduces all prices by 35% → **$39**
4. Arjun spends 30% of his pocket money on snacks, {{1/4}} on games and saves the rest. snacks : games : saved → **6 : 5 : 9**
5. {{2 3/4}} + {{5/6}} × {{3/5}} → **{{3 1/4}}** (left-to-right trap: {{2 3/20}})
6. Noor uses counters. Rows: pattern 1 [3, 4], pattern 2 [4, 4, 4], pattern 3 [5, 5, 5, 4]; table 1 → 7.
   (a) patterns 2, 3 → **12, 19**; (b) rule n² + 2n + 4, 10th pattern → **124**
7. {{(18m^3)/25}} × {{15/(4m)}} → **{{(27m^2)/10}}**
8. m − √(2n + k²) where m = 20, n = 18, k = −8 → **10**
9. Aisha, Ben and Chloe share money in the ratio 2 : 5 : 8. Chloe gets $72 more than Ben. How much does Aisha get? → **$48**
10. Rohan buys a phone for $240 and sells it for $280. Percentage profit (exact) → **{{16 2/3}}%**
11. 3(2x + 5) − 4(x − 2) → **2x + 23**
12. Increase $600 by 250% → **$2100**
13. (x + 8)(x − 3) → **x² + 5x − 24**
14. Priya increases $520 by {{12 1/2}}% → **1.125**
15. Daniel decreases $2400 by 8% → **0.92**
16. {{(12a^2b)/7}} ÷ {{(9a)/(14b)}} → **{{(8ab^2)/3}}**
17. A box of pens: 30% are red, the rest blue. 12 red pens are taken out; red : blue is now 1 : 7. How many blue pens? → **42** (60 pens: 18 red, 42 blue; 6 : 42 = 1 : 7)
18. 4, 13, 26, 43, 64, 89 → (a) **118**; (b) **2n² + 3n − 1**
19. Dots. Rows: pattern 1 [1, 2], pattern 2 [1, 4, 4], pattern 3 [1, 6, 6, 6]; table 1 → 3.
    (a) patterns 2, 3, 4 → **9, 19, 33** (2); (b) the rule is 2n² + 1: dots in pattern 15 → **451** (2)
20. In a car park {{3/8}} of the cars are white and the rest are other colours. 14 white cars leave; white : other is now 1 : 4. How many cars were there at the start? → **64** (24 white, 40 other; 10 : 40)

## Paper 2
1. (a) 4, 11, 18, 25, 32, … → **7n − 3**; (b) 25, 20, 15, 10, 5, … → **30 − 5n**
2. (a) 28m − 21 → **7(4m − 3)**; (b) 4y² + 10y → **2y(2y + 5)**
3. A jacket normally sold for $85; reduced by 20% → **$68**
4. In a garden {{3/8}} of the flowers are roses, 25% are tulips and the rest are daisies. roses : tulips : daisies → **3 : 2 : 3**
5. {{5 1/2}} − {{3/4}} × {{2/9}} → **{{5 1/3}}**
6. Kai uses coins. Rows: pattern 1 [2, 2, 2], pattern 2 [3, 3, 3, 3], pattern 3 [4, 4, 4, 4, 4]; table 1 → 6.
   (a) **12, 20**; (b) rule n² + 3n + 2, 15th pattern → **272**
7. {{(14a^5)/9}} × {{15/(28a^2)}} → **{{(5a^3)/6}}**
8. 3x + √(y² − 4z) where x = −5, y = −6, z = 5 → **−11**
9. Dev, Ella and Finn share money in the ratio 4 : 7 : 2. Ella gets $45 more than Dev. How much money was shared altogether? → **$195**
10. A shopkeeper buys a lamp for $80 and sells it for $108. Percentage profit → **35%**
11. 5(3y − 1) − 2(4y + 3) → **7y − 11**
12. Increase $350 by 120% → **$770**
13. (x − 6)(x − 4) → **x² − 10x + 24**
14. Mei increases $380 by 6% → **1.06** (trap 1.6)
15. Omar decreases $1340 by 37% → **0.63**
16. {{(18p^2q)/5}} ÷ {{(6pq^2)/25}} → **{{(15p)/q}}**
17. 25% of the books in a class library are fiction, the rest non-fiction. 30 new fiction books are added; fiction : non-fiction is now 2 : 3. How many non-fiction books? → **90** (120 books: 30 + 30 = 60 : 90)
18. 1, 12, 29, 52, 81, 116 → (a) **157**; (b) **3n² + 2n − 4**
19. Dots in a plus shape. Rows: pattern 1 [1, 3, 1], pattern 2 [1, 1, 5, 1, 1], pattern 3 [1, 1, 1, 7, 1, 1, 1]; table 1 → 5.
    (a) patterns 2, 3, 4 → **9, 13, 17** (2); (b) expression for the number of dots in pattern n → **4n + 1** (1); (c) which pattern uses 81 dots → **20** (1)
20. 60% of the members of a youth club are girls, the rest boys. 4 girls leave and 8 boys join; girls : boys is now 1 : 1. How many members were there at the start? → **60** (36 girls, 24 boys → 32 : 32)

## Paper 3
1. (a) 11, 14, 17, 20, 23, … → **3n + 8**; (b) 12, 10, 8, 6, 4, … → **14 − 2n**
2. (a) 36t + 27 → **9(4t + 3)**; (b) 6p² − 8p → **2p(3p − 4)**
3. A skateboard normally sold for $120; reduced by 45% → **$66**
4. In a sports club 40% play football, {{1/3}} play basketball and the rest play cricket. football : basketball : cricket → **6 : 5 : 4**
5. {{1 2/5}} + {{4/7}} × {{7/10}} → **{{1 4/5}}**
6. Zara uses buttons. Rows: pattern 1 [2, 3], pattern 2 [3, 3, 3], pattern 3 [4, 4, 4, 3]; table 1 → 5.
   (a) **9, 15**; (b) rule n² + n + 3, 20th pattern → **423**
7. {{(24k^2)/49}} × {{35/(16k)}} → **{{(15k)/14}}**
8. a² − √(6b − c²) where a = 4, b = 15, c = −3 → **7**
9. Grace, Hari and Ivy share prize money in the ratio 5 : 3 : 11. Ivy receives $240 more than Grace. How much does Hari receive? → **$120**
10. Mia buys a bike for $360 and sells it for $390. Percentage profit (exact) → **{{8 1/3}}%**
11. 4(a − 6) − 3(2a − 5) → **−2a − 9**
12. Increase $90 by 300% → **$360** (trap $270 = 300% of 90)
13. (2x + 1)(x + 4) → **2x² + 9x + 4**
14. Ravi increases $940 by {{2 1/2}}% → **1.025** (trap 1.25)
15. Sofia decreases $760 by 4% → **0.96**
16. {{(16xy^2)/15}} ÷ {{(4x^2y)/9}} → **{{(12y)/(5x)}}**
17. {{3/5}} of the marbles in a jar are green, the rest yellow. Sam takes out 18 green marbles; green : yellow is now 3 : 4. How many marbles were in the jar at the start? → **60** (36 green, 24 yellow; 18 : 24 = 3 : 4)
18. 2, 13, 32, 59, 94, 137 → (a) **188**; (b) **4n² − n − 1**
19. Dots. Rows: pattern 1 [3], pattern 2 [4, 4], pattern 3 [5, 5, 5]; table 1 → 3.
    (a) patterns 2, 3, 4 → **8, 15, 24** (2); (b) the rule is n² + 2n: dots in pattern 14 → **224** (2)
20. {{2/7}} of the counters in a bag are red, the rest blue. 10 red counters are added; red : blue is now 3 : 5. How many blue counters? → **50** (20 red, 50 blue; 30 : 50)

## Paper 4
1. (a) 1, 9, 17, 25, 33, … → **8n − 7**; (b) 22, 15, 8, 1, −6, … → **29 − 7n**
2. (a) 40k − 24 → **8(5k − 3)**; (b) 7x² + 14x → **7x(x + 2)**
3. A board game normally sold for $36; reduced by 25% → **$27**
4. In a fruit bowl 15% of the fruit are apples, {{7/20}} are bananas and the rest are oranges. apples : bananas : oranges → **3 : 7 : 10**
5. {{3 5/6}} − {{5/8}} × {{4/3}} → **3**
6. Ana uses coins. Rows: pattern 1 [6, 2], pattern 2 [7, 7, 2], pattern 3 [8, 8, 8, 2]; table 1 → 8.
   (a) **16, 26**; (b) rule n² + 5n + 2, 11th pattern → **178**
7. {{(45t^4)/16}} × {{12/(25t^3)}} → **{{(27t)/20}}**
8. 2w − √(k² − 3m) where w = 11, k = −7, m = 8 → **17**
9. Jay, Kim and Leo share money in the ratio 6 : 1 : 4. Jay gets $90 more than Leo. How much does Kim get? → **$45**
10. Sam buys a guitar for $250 and sells it for $190. Percentage loss → **24%**
11. 6(2m + 1) − 5(m − 4) → **7m + 26**
12. Increase $1200 by 175% → **$3300**
13. (x − 9)(x + 3) → **x² − 6x − 27**
14. Tom increases $275 by {{32 1/2}}% → **1.325**
15. Aditi decreases $3100 by {{15 1/2}}% → **0.845**
16. {{(21k^2)/10}} ÷ {{(14k)/(25m)}} → **{{(15km)/4}}**
17. 45% of the people at a concert are adults, the rest children. 22 more adults arrive; adults : children is now 1 : 1. How many children? → **121** (220 people: 99 + 22 = 121 : 121)
18. 0, 13, 36, 69, 112, 165 → (a) **228**; (b) **5n² − 2n − 3**
19. Dots in a T shape. Rows: pattern 1 [3, 1], pattern 2 [6, 1, 1, 1], pattern 3 [9, 1, 1, 1, 1, 1]; table 1 → 4.
    (a) patterns 2, 3, 4 → **9, 14, 19** (2); (b) expression for pattern n → **5n − 1** (1); (c) which pattern uses 124 dots → **25** (1)
    (Changed from 3n + 1 / 100 dots after the audit: the bank's sq-w2-q03 already uses 4, 7, 10 → 3n + 1 and 100 → 33.)
20. 35% of the animals at a rescue centre are cats, the rest dogs. 9 cats are rehomed; cats : dogs is now 2 : 5. How many dogs? → **65** (35 cats, 65 dogs; 26 : 65)
