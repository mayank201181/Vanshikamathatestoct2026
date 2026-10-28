import type { MCQ, QuestionSet } from "../../types";
import { MCQ_FR_A } from "./mcq-a.ts";
import { MCQ_FR_B } from "./mcq-b.ts";

// Fractions multiple-choice sets: 1–2 in mcq-a.ts, 3–4 in mcq-b.ts (written by two authors in parallel).
export const MCQ_FR: QuestionSet<MCQ>[] = [...MCQ_FR_A, ...MCQ_FR_B];
