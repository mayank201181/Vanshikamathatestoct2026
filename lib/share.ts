import type { Progress } from "./store";
import { ALL_SETS, ALL_QUESTIONS, qaMarks } from "./content";
import { SECTIONS, TOPICS, TOPIC_IDS } from "./sections";
import type { QA, TopicId } from "./types";

export interface SectionMastery {
  id: string;
  label: string;
  topic: string;
  answered: number;
  total: number;
  /** average last score over answered questions, 0..1 (NaN if none answered) */
  score: number;
}

export function sectionMastery(p: Progress): SectionMastery[] {
  return SECTIONS.map((s) => {
    const qs = ALL_QUESTIONS.filter((x) => x.q.section === s.id);
    const answered = qs.filter((x) => p.stats[x.q.id]);
    const score = answered.length ? answered.reduce((sum, x) => sum + (p.stats[x.q.id]?.lastScore ?? 0), 0) / answered.length : NaN;
    return { id: s.id, label: s.label, topic: s.topic, answered: answered.length, total: qs.length, score };
  });
}

export interface TopicProgress {
  topic: TopicId;
  answered: number;
  total: number;
  /** average last score over answered questions, 0..1 (NaN if none) */
  score: number;
  setsDone: number;
  setsTotal: number;
}

export function topicProgress(p: Progress): TopicProgress[] {
  return TOPIC_IDS.map((t) => {
    const qs = ALL_QUESTIONS.filter((x) => x.q.topic === t);
    const answered = qs.filter((x) => p.stats[x.q.id]);
    const score = answered.length ? answered.reduce((sum, x) => sum + (p.stats[x.q.id]?.lastScore ?? 0), 0) / answered.length : NaN;
    const sets = ALL_SETS.filter((s) => s.set.topic === t);
    return { topic: t, answered: answered.length, total: qs.length, score, setsDone: sets.filter((s) => p.best[s.set.id]).length, setsTotal: sets.length };
  });
}

export function openMistakes(p: Progress): string[] {
  return Object.entries(p.mistakes)
    .filter(([id, open]) => open && ALL_QUESTIONS.some((x) => x.q.id === id))
    .map(([id]) => id);
}

export function totalMarks(): number {
  return ALL_QUESTIONS.reduce((s, x) => s + (x.kind === "qa" ? qaMarks(x.q as QA) : 1), 0);
}

export function shareText(p: Progress): string {
  const who = p.name ? `${p.name}'s` : "My";
  const lines = [`📚 ${who} maths test prep — Fractions, Percentages, Ratio, Expressions, Substitution, Sequences`];
  for (const t of TOPIC_IDS) {
    const sets = ALL_SETS.filter((s) => s.set.topic === t);
    const parts = sets.map(({ set }) => {
      const best = p.best[set.id];
      const att = p.attempts[set.id];
      const short = set.id.includes("mcq") ? `MC${set.id.slice(-1)}` : `W${set.id.slice(-1)}`;
      if (best) return `${short} ${best.pct}%`;
      if (att && Object.keys(att.answers).length) return `${short} …`;
      return `${short} –`;
    });
    lines.push(`${TOPICS[t].emoji} ${TOPICS[t].title}: ${parts.join(" · ")}`);
  }
  const m = sectionMastery(p).filter((s) => s.answered >= 3 && !Number.isNaN(s.score));
  const weak = [...m].sort((a, b) => a.score - b.score).slice(0, 3).filter((s) => s.score < 0.8);
  if (weak.length) lines.push(`🎯 Needs work: ${weak.map((s) => `${s.label} (${Math.round(s.score * 100)}%)`).join(", ")}`);
  const strong = m.filter((s) => s.score >= 0.9 && s.answered >= 4).map((s) => s.label);
  if (strong.length) lines.push(`💪 Strong: ${strong.slice(0, 4).join(", ")}`);
  const mocks = p.history.filter((h) => h.setId === "mock");
  if (mocks.length) lines.push(`🎓 Mock tests: ${mocks.slice(-5).map((m) => `${m.pct}%`).join(", ")}`);
  lines.push(`🔁 Mistakes still to fix: ${openMistakes(p).length}`);
  lines.push(`⭐ Stars: ${p.stars}`);
  return lines.join("\n");
}
