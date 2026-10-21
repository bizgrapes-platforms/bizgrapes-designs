export function galleryHref(params: {
  type?: string;
  sort?: string;
  q?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.sort && params.sort !== "trending") qs.set("sort", params.sort);
  if (params.q) qs.set("q", params.q);
  if (params.page && params.page > 1) qs.set("page", String(params.page));
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}
