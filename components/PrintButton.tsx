"use client";

export function PrintButton({ label = "🖨️ Print" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow hover:bg-indigo-700">
      {label}
    </button>
  );
}
