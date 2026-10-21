import Link from "next/link";
import { galleryHref } from "@/lib/url";

export function CategoryFilter({
  types,
  active,
  sort,
  search,
}: {
  types: string[];
  active?: string;
  sort?: string;
  search?: string;
}) {
  const pill = (isActive: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-violet-600 text-white"
        : "bg-violet-100 text-violet-900 hover:bg-violet-400/40"
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={galleryHref({ sort, q: search })} className={pill(!active)}>
        All
      </Link>
      {types.map((type) => (
        <Link
          key={type}
          href={galleryHref({ type, sort, q: search })}
          className={pill(active === type)}
        >
          {type}
        </Link>
      ))}
    </div>
  );
}
