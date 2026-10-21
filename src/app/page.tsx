import Link from "next/link";
import {
  PAGE_SIZE,
  getDesignTypes,
  getFeaturedDesigns,
  getGalleryStats,
  getPublicDesigns,
  parseSort,
} from "@/lib/designs";
import { galleryHref } from "@/lib/url";
import { DesignCard } from "@/components/DesignCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SortSelect } from "@/components/SortSelect";
import { CtaBand } from "@/components/CtaBand";

export const revalidate = 60;

function first(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v) || undefined;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const type = first(params?.type);
  const search = first(params?.q)?.slice(0, 80);
  const sort = parseSort(first(params?.sort));
  const page = Math.max(1, parseInt(first(params?.page) ?? "1", 10) || 1);
  const filtering = Boolean(type || search);

  const [{ designs, total }, types, stats, featured] = await Promise.all([
    getPublicDesigns({ type, sort, search, page }),
    getDesignTypes(),
    getGalleryStats(),
    filtering || page > 1 ? Promise.resolve([]) : getFeaturedDesigns(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="bg-violet-100">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <h1 className="font-display max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Made with Bizgrapes AI
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Real logos, branding kits, and social posts published by the people
            who made them. Every piece here was generated in the app.
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["Designs published", stats.designs],
              ["Creators", stats.creators],
              ["Categories", stats.categories],
            ].map(([label, value]) => (
              <div key={label}>
                <dd className="font-display text-3xl font-semibold text-violet-900">
                  {value}
                </dd>
                <dt className="text-sm text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display mb-4 text-2xl font-semibold tracking-tight">
              Featured this week
            </h2>
            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-5 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
              {featured.map((d) => (
                <DesignCard key={d.id} design={d} />
              ))}
            </div>
          </section>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <CategoryFilter types={types} active={type} sort={sort} search={search} />
          <SortSelect sort={sort} type={type} search={search} />
        </div>

        {search && (
          <p className="mb-6 text-sm text-muted">
            {total} result{total === 1 ? "" : "s"} for “{search}”.{" "}
            <Link
              href={galleryHref({ type, sort })}
              className="text-violet-600 hover:underline"
            >
              Clear search
            </Link>
          </p>
        )}

        {designs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-24 text-center text-muted">
            {filtering
              ? "No designs match your filters."
              : "No designs published yet."}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:gap-5 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            {designs.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4 text-sm">
            {page > 1 ? (
              <Link
                href={galleryHref({ type, sort, q: search, page: page - 1 })}
                className="rounded-full border border-border bg-surface px-4 py-1.5 font-medium hover:border-violet-600"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-muted">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={galleryHref({ type, sort, q: search, page: page + 1 })}
                className="rounded-full border border-border bg-surface px-4 py-1.5 font-medium hover:border-violet-600"
              >
                Next →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        <CtaBand />
      </div>
    </>
  );
}
