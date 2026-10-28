import { notFound } from "next/navigation";
import { ALL_SETS, getSet } from "@/lib/content";
import { TOPICS } from "@/lib/sections";
import { SetClient } from "./SetClient";

export function generateStaticParams() {
  return ALL_SETS.map((s) => ({ id: s.set.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSet(id);
  return { title: s ? `${TOPICS[s.set.topic].title} · ${s.set.title} · Maths Test Prep` : "Question set" };
}

export default async function SetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getSet(id)) notFound();
  return <SetClient id={id} />;
}
