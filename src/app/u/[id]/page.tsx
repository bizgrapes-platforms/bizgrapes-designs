import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCreatorProfile } from "@/lib/designs";
import { DesignCard } from "@/components/DesignCard";
import { CtaBand } from "@/components/CtaBand";

export const revalidate = 60;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: PageProps<"/u/[id]">): Promise<Metadata> {
  const { id } = await params;
  const profile = UUID.test(id) ? await getCreatorProfile(id) : null;
  if (!profile) return { title: "Creator not found — Bizgrapes Designs" };
  return {
    title: `${profile.name} — Bizgrapes Designs`,
    description: `Designs by ${profile.name}, made with Bizgrapes AI.`,
  };
}

export default async function CreatorPage({ params }: PageProps<"/u/[id]">) {
  const { id } = await params;
  const profile = UUID.test(id) ? await getCreatorProfile(id) : null;
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/"
        className="mb-6 inline-flex text-sm font-medium text-muted transition-colors hover:text-violet-600"
      >
        ← Back to gallery
      </Link>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {profile.name}
      </h1>
      <p className="mt-2 mb-8 text-muted">
        {profile.designs.length} published design
        {profile.designs.length === 1 ? "" : "s"}
      </p>
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-5 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {profile.designs.map((d) => (
          <DesignCard key={d.id} design={d} />
        ))}
      </div>
      <CtaBand />
    </div>
  );
}
