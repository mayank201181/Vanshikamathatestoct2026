import { notFound } from "next/navigation";
import { SECTIONS, sectionMeta } from "@/lib/sections";
import { PracticeClient } from "./PracticeClient";

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = sectionMeta(section);
  return { title: s ? `Practise: ${s.label} · Maths Test Prep` : "Practice" };
}

export default async function PracticePage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sectionMeta(section)) notFound();
  return <PracticeClient section={section} />;
}
