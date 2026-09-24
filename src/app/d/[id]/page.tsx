import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDesignById, incrementViewCount } from "@/lib/designs";
import { TypeBadge } from "@/components/TypeBadge";
import { ReportButton } from "@/components/ReportButton";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: PageProps<"/d/[id]">): Promise<Metadata> {
  const { id } = await params;
  const design = await getDesignById(id);
  if (!design) return { title: "Design not found — Bizgrapes Designs" };

  return {
    title: `${design.title} — Bizgrapes Designs`,
    description: design.description || undefined,
    openGraph: {
      images: design.thumbnail_url ? [design.thumbnail_url] : undefined,
    },
  };
}

export default async function DesignDetail({ params }: PageProps<"/d/[id]">) {
  const { id } = await params;
  const design = await getDesignById(id);

  if (!design) notFound();

  incrementViewCount(design.id, design.view_count);

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-14">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-violet-600 transition-colors"
      >
        ← Back to gallery
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-violet-50">
          <Image
            src={design.file_url}
            alt={design.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <TypeBadge type={design.design_type} />
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold tracking-tight">
              {design.title}
            </h1>
            <p className="mt-2 text-muted">by {design.creator_name}</p>
          </div>

          {design.description && (
            <p className="leading-relaxed text-foreground/90">
              {design.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              {design.view_count + 1} views
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <ReportButton designId={design.id} designTitle={design.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
