import Link from "next/link";
import { notFound } from "next/navigation";
import { PAPERS, getPaper, qaMarks } from "@/lib/content";
import { displayAnswer } from "@/lib/answerCheck";
import { Rich, RichInline } from "@/components/Rich";
import { PrintButton } from "@/components/PrintButton";

export function generateStaticParams() {
  return PAPERS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);
  return { title: paper ? `${paper.title} answers · Maths Test Prep` : "Answers" };
}

/** Mark scheme for a printed paper: the answers first, then the working to compare against. */
export default async function PaperAnswers({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();
  const total = paper.questions.reduce((s, q) => s + qaMarks(q), 0);
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-slate-900 shadow-sm print:rounded-none print:p-0 print:shadow-none">
      <div className="no-print mb-5 flex flex-wrap items-center gap-2 text-sm">
        <PrintButton label="🖨️ Print answers" />
        <Link href={`/paper/${id}/print`} className="rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
          📄 The paper
        </Link>
      </div>
      <header className="border-b-2 border-slate-800 pb-3">
        <h1 className="text-2xl font-extrabold">{paper.title}: answers and working</h1>
        <p className="mt-1 text-sm text-slate-600">
          {total} marks. Give the marks for a correct final answer; if the answer is wrong but the working matches the steps below, give method marks for each
          correct step.
        </p>
      </header>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-slate-400 bg-slate-100 px-2 py-1.5 text-left">Q</th>
            <th className="border border-slate-400 bg-slate-100 px-2 py-1.5 text-left">Answer</th>
            <th className="border border-slate-400 bg-slate-100 px-2 py-1.5 text-right">Marks</th>
          </tr>
        </thead>
        <tbody>
          {paper.questions.flatMap((q, i) =>
            q.parts.map((p, j) => (
              <tr key={`${q.id}-${j}`}>
                <td className="border border-slate-400 px-2 py-1.5 font-semibold">
                  {i + 1}
                  {p.label ? `(${p.label})` : ""}
                </td>
                <td className="border border-slate-400 px-2 py-1.5">
                  {p.answer ? <RichInline text={displayAnswer(p.answer)} /> : <Rich text={p.model ?? ""} />}
                </td>
                <td className="border border-slate-400 px-2 py-1.5 text-right">{p.marks}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>

      <h2 className="mt-8 text-xl font-extrabold">Worked solutions</h2>
      <ol className="mt-3 space-y-5">
        {paper.questions.map((q, i) => (
          <li key={q.id} className="break-inside-avoid border-b border-slate-200 pb-4">
            <div className="flex gap-3">
              <span className="w-6 shrink-0 font-bold">{i + 1}.</span>
              <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                <ol className="list-decimal space-y-1 pl-5">
                  {q.solution.map((s, k) => (
                    <li key={k}>
                      <Rich text={s} />
                    </li>
                  ))}
                </ol>
                <p className="text-slate-600">
                  <span className="font-semibold text-rose-700">Watch out: </span>
                  <RichInline text={q.commonError} />
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
