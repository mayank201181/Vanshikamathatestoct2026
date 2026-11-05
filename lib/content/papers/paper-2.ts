import type { Paper } from "../../types.ts";
import { P2_A } from "./p2-a.ts";
import { P2_B } from "./p2-b.ts";

export const PAPER_2: Paper = {
  id: "paper-2",
  title: "Practice paper 2",
  subtitle: "Same style as the class mock test: 20 questions, 57 marks. Show your working on paper.",
  minutes: 50,
  questions: [...P2_A, ...P2_B],
};
