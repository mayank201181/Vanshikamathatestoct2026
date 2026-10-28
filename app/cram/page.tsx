"use client";

import Link from "next/link";
import { GUIDES } from "@/lib/content";
import { TOPICS, UNITS } from "@/lib/sections";
import { RichInline } from "@/components/Rich";

export default function CramPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">⚡ Cram sheet</h1>
          <p className="text-slate-600">Every method that matters, on one page — read it the night before and on the morning of the test.</p>
        </div>
        <button onClick={() => window.print()} className="no-print rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">
          🖨️ Print
        </button>
      </div>
      {UNITS.map((u) => (
        <section key={u.unit} className="space-y-3">
          <h2 className="text-xl font-extrabold text-slate-900">{u.title}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {u.topics.map((t) => (
              <div key={t} className="break-inside-avoid rounded-2xl border border-slate-200 bg-white p-4" style={{ borderTop: `4px solid ${TOPICS[t].color}` }}>
                <h3 className="mb-2 font-extrabold text-slate-900">
                  {TOPICS[t].emoji} {TOPICS[t].title}
                </h3>
                <ul className="space-y-1.5 text-sm leading-relaxed text-slate-800">
                  {GUIDES[t].cram.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-slate-400">•</span>
                      <span>
                        <RichInline text={line} />
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={`/guide/${t}`} className="no-print mt-2 inline-block text-xs font-semibold text-indigo-600 hover:underline">
                  Full guide →
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="break-inside-avoid rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <h3 className="mb-1 font-extrabold">✍️ In the test</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Show every step — method marks count even if you slip at the end.</li>
          <li>Read the last line of the question again: simplest form? mixed number? fully factorised? units?</li>
          <li>Check by substituting a number (algebra) or by estimating (percentages and fractions).</li>
          <li>Stuck? Draw it — a bar model for ratio, a grid for brackets, a differences table for sequences.</li>
        </ul>
      </section>
    </div>
  );
}
