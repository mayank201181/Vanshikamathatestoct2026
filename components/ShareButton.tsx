"use client";

import { useState } from "react";
import type { Progress } from "@/lib/store";
import { shareText } from "@/lib/share";

export function ShareButton({ progress, label = "📤 Send my scores" }: { progress: Progress; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "open">("idle");

  async function share() {
    const text = shareText(progress);
    try {
      if (navigator.share) {
        await navigator.share({ title: "My maths test prep", text });
        return;
      }
    } catch {
      /* user cancelled or share unavailable — fall back below */
    }
    setState("open");
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      /* clipboard blocked: the panel still shows the text and a WhatsApp link */
    }
  }

  return (
    <>
      <button onClick={share} className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-100">
        {label}
      </button>
      {state !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setState("idle")}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-slate-900">Send your scores</h3>
            <p className="text-sm text-slate-500">{state === "copied" ? "Copied! Paste it into a message — or tap WhatsApp." : "Copy this, or tap WhatsApp."}</p>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">{shareText(progress)}</pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText(progress))}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"
              >
                WhatsApp
              </a>
              <button onClick={() => setState("idle")} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
