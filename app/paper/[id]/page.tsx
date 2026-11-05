import { notFound } from "next/navigation";
import { PAPERS, getPaper } from "@/lib/content";
import { PaperClient } from "./PaperClient";

export function generateStaticParams() {
  return PAPERS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = getPaper(id);
  return { title: paper ? `${paper.title} · Maths Test Prep` : "Practice paper" };
}

export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getPaper(id)) notFound();
  return <PaperClient id={id} />;
}
