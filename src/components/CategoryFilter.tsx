import Link from "next/link";

function label(type: string) {
  return type
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CategoryFilter({
  types,
  active,
}: {
  types: string[];
  active?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? "bg-violet-600 text-white"
            : "bg-violet-50 text-violet-900 hover:bg-violet-100"
        }`}
      >
        All
      </Link>
      {types.map((type) => (
        <Link
          key={type}
          href={`/?type=${encodeURIComponent(type)}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === type
              ? "bg-violet-600 text-white"
              : "bg-violet-50 text-violet-900 hover:bg-violet-100"
          }`}
        >
          {label(type)}
        </Link>
      ))}
    </div>
  );
}
