import { notFound } from "next/navigation";
import { TOPICS, TOPIC_IDS } from "@/lib/sections";
import { GuideView } from "@/components/GuideView";
import type { TopicId } from "@/lib/types";

export function generateStaticParams() {
  return TOPIC_IDS.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = TOPICS[topic as TopicId];
  return { title: t ? `${t.title} guide · Maths Test Prep` : "Guide" };
}

export default async function GuidePage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!TOPIC_IDS.includes(topic as TopicId)) notFound();
  return <GuideView topic={topic as TopicId} />;
}
