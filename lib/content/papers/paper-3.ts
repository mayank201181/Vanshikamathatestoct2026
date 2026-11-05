import type { Paper } from "../../types.ts";
import { P3_A } from "./p3-a.ts";
import { P3_B } from "./p3-b.ts";

export const PAPER_3: Paper = {
  id: "paper-3",
  title: "Practice paper 3",
  subtitle: "Same style as the class mock test: 20 questions, 57 marks. Show your working on paper.",
  minutes: 50,
  questions: [...P3_A, ...P3_B],
};
