import Image from "next/image";
import Link from "next/link";
import type { DesignWithCreator } from "@/lib/designs";
import { TypeBadge } from "./TypeBadge";
import { HeartIcon } from "./LikeButton";

export function DesignCard({ design }: { design: DesignWithCreator }) {
  const image = design.thumbnail_url || design.file_url;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-violet-900/5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-violet-50">
        <Image
          src={image}
          alt={design.title}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-snug line-clamp-2 sm:text-base">
            <Link
              href={`/d/${design.id}`}
              className="after:absolute after:inset-0"
            >
              {design.title}
            </Link>
          </h3>
          <span className="hidden sm:block">
            <TypeBadge type={design.design_type} />
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted sm:text-sm">
          <Link
            href={`/u/${design.user_id}`}
            className="relative z-10 truncate hover:text-violet-600"
          >
            by {design.creator_name}
          </Link>
          <span className="inline-flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <HeartIcon /> {design.like_count}
            </span>
            <span>{design.view_count} views</span>
          </span>
        </div>
      </div>
    </article>
  );
}
