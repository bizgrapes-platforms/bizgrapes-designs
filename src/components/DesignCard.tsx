import Image from "next/image";
import Link from "next/link";
import type { DesignWithCreator } from "@/lib/designs";
import { TypeBadge } from "./TypeBadge";

export function DesignCard({ design }: { design: DesignWithCreator }) {
  const image = design.thumbnail_url || design.file_url;

  return (
    <Link
      href={`/d/${design.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-violet-900/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-violet-50">
        <Image
          src={image}
          alt={design.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">
            {design.title}
          </h3>
          <TypeBadge type={design.design_type} />
        </div>
        <p className="text-sm text-muted">by {design.creator_name}</p>
      </div>
    </Link>
  );
}
