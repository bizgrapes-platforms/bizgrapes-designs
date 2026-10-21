"use client";

import { useRouter } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/designs";
import { galleryHref } from "@/lib/url";

export function SortSelect({
  sort,
  type,
  search,
}: {
  sort: string;
  type?: string;
  search?: string;
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only sm:not-sr-only">Sort</span>
      <select
        value={sort}
        onChange={(e) =>
          router.push(galleryHref({ type, q: search, sort: e.target.value }))
        }
        className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground outline-none focus:border-violet-600"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
