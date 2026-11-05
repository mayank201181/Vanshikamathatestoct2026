import type { Paper } from "../../types.ts";
import { P1_A } from "./p1-a.ts";
import { P1_B } from "./p1-b.ts";

export const PAPER_1: Paper = {
  id: "paper-1",
  title: "Practice paper 1",
  subtitle: "Same style as the class mock test: 20 questions, 57 marks. Show your working on paper.",
  minutes: 50,
  questions: [...P1_A, ...P1_B],
};
