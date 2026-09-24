function label(type: string) {
  return type
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-900">
      {label(type)}
    </span>
  );
}
