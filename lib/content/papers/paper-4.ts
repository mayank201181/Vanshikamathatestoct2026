import type { Paper } from "../../types.ts";
import { P4_A } from "./p4-a.ts";
import { P4_B } from "./p4-b.ts";

export const PAPER_4: Paper = {
  id: "paper-4",
  title: "Practice paper 4",
  subtitle: "Same style as the class mock test: 20 questions, 57 marks. Show your working on paper.",
  minutes: 50,
  questions: [...P4_A, ...P4_B],
};
