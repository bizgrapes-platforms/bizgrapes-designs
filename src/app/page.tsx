import { getDesignTypes, getPublicDesigns } from "@/lib/designs";
import { DesignCard } from "@/components/DesignCard";
import { CategoryFilter } from "@/components/CategoryFilter";

export const revalidate = 60;

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const typeParam = params?.type;
  const activeType = Array.isArray(typeParam) ? typeParam[0] : typeParam;

  const [designs, types] = await Promise.all([
    getPublicDesigns(activeType || undefined),
    getDesignTypes(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Made with Bizgrapes AI
        </h1>
        <p className="mt-3 text-muted">
          Real logos, branding kits, and social posts published by Bizgrapes
          AI users. Every piece here was generated in the app.
        </p>
      </div>

      {types.length > 0 && (
        <div className="mb-8">
          <CategoryFilter types={types} active={activeType} />
        </div>
      )}

      {designs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-24 text-center text-muted">
          No designs published yet{activeType ? " in this category" : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}
