import { supabase, type PublishedDesign } from "./supabase";

export type DesignWithCreator = PublishedDesign & { creator_name: string };

export const PAGE_SIZE = 12;

export const CATEGORIES = ["Logo", "Branding Kit", "Social Post", "Poster"];

export type SortKey = "trending" | "newest" | "viewed";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "newest", label: "Newest" },
  { key: "viewed", label: "Most Viewed" },
];

export function parseSort(value?: string): SortKey {
  return SORT_OPTIONS.some((o) => o.key === value)
    ? (value as SortKey)
    : "trending";
}

async function attachCreatorNames(
  rows: PublishedDesign[]
): Promise<DesignWithCreator[]> {
  if (rows.length === 0) return [];

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: creators } = await supabase
    .from("public_design_creator_names")
    .select("id, display_name")
    .in("id", userIds);

  const nameById = new Map(
    (creators ?? []).map((p) => [p.id, p.display_name])
  );

  return rows.map((r) => ({
    ...r,
    creator_name: nameById.get(r.user_id) || "Bizgrapes creator",
  }));
}

export type GalleryQuery = {
  type?: string;
  sort?: SortKey;
  search?: string;
  page?: number;
};

export async function getPublicDesigns({
  type,
  sort = "trending",
  search,
  page = 1,
}: GalleryQuery) {
  let query = supabase
    .from("published_designs")
    .select("*", { count: "exact" })
    .eq("is_public", true)
    .eq("status", "approved");

  if (type) query = query.eq("design_type", type);

  // Strip characters that have meaning in PostgREST filter syntax or ilike patterns.
  const term = search?.replace(/[,()%*\_]/g, " ").trim();
  if (term) {
    const { data: matches } = await supabase
      .from("public_design_creator_names")
      .select("id")
      .ilike("display_name", `%${term}%`)
      .limit(200);
    const ids = (matches ?? []).map((m) => m.id);
    query = query.or(
      [`title.ilike.%${term}%`, ids.length ? `user_id.in.(${ids.join(",")})` : null]
        .filter(Boolean)
        .join(",")
    );
  }

  if (sort === "newest") {
    query = query.order("published_at", { ascending: false });
  } else if (sort === "viewed") {
    query = query
      .order("view_count", { ascending: false })
      .order("published_at", { ascending: false });
  } else {
    query = query
      .order("like_count", { ascending: false })
      .order("view_count", { ascending: false })
      .order("published_at", { ascending: false });
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return {
    designs: await attachCreatorNames(data ?? []),
    total: count ?? 0,
  };
}

export async function getFeaturedDesigns(limit = 4) {
  const { data, error } = await supabase
    .from("published_designs")
    .select("*")
    .eq("is_public", true)
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return attachCreatorNames(data ?? []);
}

export async function getGalleryStats() {
  const { data, error } = await supabase
    .from("published_designs")
    .select("user_id, design_type")
    .eq("is_public", true)
    .eq("status", "approved");
  if (error) throw error;

  const rows = data ?? [];
  return {
    designs: rows.length,
    creators: new Set(rows.map((r) => r.user_id)).size,
    categories: new Set(rows.map((r) => r.design_type)).size,
  };
}

export async function getDesignTypes() {
  const { data, error } = await supabase
    .from("published_designs")
    .select("design_type")
    .eq("is_public", true)
    .eq("status", "approved");

  if (error) throw error;

  const found = (data ?? []).map((d) => d.design_type);
  return [...CATEGORIES, ...found.filter((t) => !CATEGORIES.includes(t))].filter(
    (t, i, all) => all.indexOf(t) === i
  );
}

export async function getDesignById(id: string) {
  const { data, error } = await supabase
    .from("published_designs")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .eq("status", "approved")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [withCreator] = await attachCreatorNames([data]);
  return withCreator;
}

export async function getCreatorProfile(userId: string) {
  const { data: creator } = await supabase
    .from("public_design_creator_names")
    .select("id, display_name")
    .eq("id", userId)
    .maybeSingle();
  if (!creator) return null;

  const { data, error } = await supabase
    .from("published_designs")
    .select("*")
    .eq("is_public", true)
    .eq("status", "approved")
    .eq("user_id", userId)
    .order("published_at", { ascending: false });
  if (error) throw error;

  return {
    name: creator.display_name || "Bizgrapes creator",
    designs: await attachCreatorNames(data ?? []),
  };
}

export async function incrementViewCount(id: string) {
  await supabase.rpc("increment_design_view", { design_id: id });
}
