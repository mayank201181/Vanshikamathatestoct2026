import Link from "next/link";
import { notFound } from "next/navigation";
import { PAPERS, getPaper, qaMarks } from "@/lib/content";
import { Rich, RichInline } from "@/components/Rich";
import { PrintButton } from "@/components/PrintButton";
import type { DataTable, QA } from "@/lib/types";

export function generateStaticParams() {
  return PAPERS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getPaper(id);
  return {
    title: paper
      ? `${paper.title} (print) · Maths Test Prep`
      : "Practice paper",
  };
}

/** A table to fill in on paper: "?" cells print as empty boxes. */
function PaperTable({ table }: { table: DataTable }) {
  return (
    <table className="my-3 border-collapse text-sm">
      <thead>
        <tr>
          {table.headers.map((h, i) => (
            <th
              key={i}
              className="border border-slate-500 bg-slate-100 px-3 py-1.5 text-center font-semibold"
            >
              <RichInline text={h} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((r, ri) => (
          <tr key={ri}>
            {r.map((c, ci) => (
              <td
                key={ci}
                className={`border border-slate-500 px-3 py-2 text-center ${ci === 0 ? "font-semibold" : "min-w-14"}`}
              >
                {c.trim() === "?" ? "" : <RichInline text={c} />}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Working space grows with the marks, like on the school's paper. */
function Answer({ marks }: { marks: number }) {
  return (
    <div className="mt-1">
      <div style={{ minHeight: `${2.2 + marks * 1.3}rem` }} />
      <div className="flex items-end justify-end gap-3">
        <span className="inline-block w-44 border-b border-slate-700" />
        <span className="whitespace-nowrap text-sm text-slate-600">
          ({marks} mark{marks === 1 ? "" : "s"})
        </span>
      </div>
    </div>
  );
}

/** Drops sentences that only say how to type an answer on screen ("type the bottom in brackets"); paper doesn't need them. */
function forPaper(text?: string): string | undefined {
  if (!text) return text;
  const kept = text
    .split(/(?<=[.!?:])(?<!\be\.g\.)(?<!\bi\.e\.)\s+/)
    .filter((sentence) => !/\b(type|typing|typed)\b/i.test(sentence))
    .join(" ")
    .trim();
  return kept || undefined;
}

function Question({ q, n }: { q: QA; n: number }) {
  return (
    <li className="break-inside-avoid border-b border-slate-300 pb-4">
      <div className="flex gap-3">
        <span className="w-6 shrink-0 font-bold">{n}.</span>
        <div className="min-w-0 flex-1 space-y-2">
          <Rich text={forPaper(q.question) ?? ""} />
          {q.diagram && (
            <div
              className="diagram-svg max-w-lg"
              dangerouslySetInnerHTML={{ __html: q.diagram }}
            />
          )}
          {q.table && <PaperTable table={q.table} />}
          {q.parts.map((p, i) => {
            const prompt = forPaper(p.prompt);
            return (
              <div key={i}>
                {(p.label || prompt) && (
                  <div className="flex gap-2">
                    {p.label && (
                      <span className="font-semibold">({p.label})</span>
                    )}
                    {prompt && <Rich text={prompt} className="flex-1" />}
                  </div>
                )}
                <Answer marks={p.marks} />
              </div>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export default async function PrintPaper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();
  const total = paper.questions.reduce((s, q) => s + qaMarks(q), 0);
  return (
    <div className="paper mx-auto max-w-3xl rounded-2xl bg-white p-6 text-slate-900 shadow-sm print:rounded-none print:p-0 print:shadow-none">
      <div className="no-print mb-5 flex flex-wrap items-center gap-2 text-sm">
        <PrintButton />
        <Link
          href={`/paper/${id}/answers`}
          className="rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          ✅ Answers
        </Link>
        <Link
          href={`/paper/${id}`}
          className="rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          Do it on screen instead
        </Link>
      </div>
      <div className="border-b-2 border-slate-800 pb-3">
        <h1 className="text-2xl font-extrabold">
          Year 8 Maths · {paper.title}
        </h1>
        <p className="text-sm text-slate-600">
          Fractions, percentages, ratio and proportion · Expressions,
          substitution, sequences
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <span>Name: ____________</span>
          <span>Date: ________</span>
          <span className="text-right">Total: ______ / {total}</span>
        </div>
        <p className="mt-3 text-sm">
          Time: about {paper.minutes} minutes. Show all your working. Write each
          answer on its answer line. Questions {paper.questions.length - 1} and{" "}
          {paper.questions.length} are extra practice: a pattern table and a
          changing ratio.
        </p>
      </div>
      <ol className="mt-5 space-y-5">
        {paper.questions.map((q, i) => (
          <Question key={q.id} q={q} n={i + 1} />
        ))}
      </ol>
      <p className="mt-8 text-center text-lg font-extrabold tracking-wide">
        END OF PAPER
      </p>
    </div>
  );
}
