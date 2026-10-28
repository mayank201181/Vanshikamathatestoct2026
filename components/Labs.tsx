"use client";

import type { TopicId } from "@/lib/types";
import type { WidgetDef } from "./widgets/kit";
import { widgets as fractions } from "./widgets/fractions";
import { widgets as percentages } from "./widgets/percentages";
import { widgets as ratio } from "./widgets/ratio-proportion";
import { widgets as expressions } from "./widgets/expressions";
import { widgets as sequences } from "./widgets/sequences-graphs";
import { widgets as integers } from "./widgets/integers-powers";
import { widgets as powers } from "./widgets/powers";

const pick = (list: WidgetDef[], ids: string[]) => ids.map((id) => list.find((w) => w.id === id)).filter((w): w is WidgetDef => !!w);

/** Interactive explorables for each topic (reused from the Year 8 Maths Lab). */
export const LABS: Record<TopicId, WidgetDef[]> = {
  fr: pick(fractions, ["fraction-wall", "how-many-fit"]),
  pc: pick(percentages, ["percent-bar", "multiplier-chain"]),
  ra: pick(ratio, ["ratio-bar-model", "best-buy-lines"]),
  ex: pick(expressions, ["bracket-grid"]),
  su: [...pick(expressions, ["formula-machine"]), ...pick(integers, ["zero-pair-counters"]), ...powers],
  sq: pick(sequences, ["sequence-explorer", "function-machine"]),
};
