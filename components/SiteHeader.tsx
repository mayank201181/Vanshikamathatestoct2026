"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore, rankFor } from "@/lib/store";
import { openMistakes } from "@/lib/share";

const NAV = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/guide", label: "Guides", emoji: "📖" },
  { href: "/bank", label: "Question bank", emoji: "📝" },
  { href: "/review", label: "Mistakes", emoji: "🔁" },
  { href: "/flashcards", label: "Flashcards", emoji: "🃏" },
  { href: "/lab", label: "Labs", emoji: "🔬" },
  { href: "/cram", label: "Cram sheet", emoji: "⚡" },
];

export function SiteHeader() {
  const path = usePathname();
  const { p, ready } = useStore();
  const mistakes = ready ? openMistakes(p).length : 0;
  const rank = rankFor(p.stars);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-black text-white shadow-sm">∑</span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-slate-900">Maths Test Prep</span>
            <span className="block text-[11px] font-medium text-slate-500">Year 8 · FDP & Ratio · Expressions & Sequences</span>
          </span>
        </Link>
        {ready && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-800" title={rank.title}>
            ⭐ {p.stars}
            <span className="hidden font-semibold text-amber-700 sm:inline">· {rank.emoji} {rank.title}</span>
          </div>
        )}
      </div>
      <nav className="nav-scroll mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 pb-2">
        {NAV.map((n) => {
          const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`relative flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{n.emoji}</span>
              {n.label}
              {n.href === "/review" && mistakes > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 text-xs ${active ? "bg-white text-indigo-700" : "bg-rose-500 text-white"}`}>{mistakes}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
