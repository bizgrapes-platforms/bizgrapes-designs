import { supabase, type PublishedDesign } from "./supabase";

export type DesignWithCreator = PublishedDesign & { creator_name: string };

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

export async function getPublicDesigns(designType?: string) {
  let query = supabase
    .from("published_designs")
    .select("*")
    .eq("is_public", true)
    .order("published_at", { ascending: false });

  if (designType) {
    query = query.eq("design_type", designType);
  }

  const { data, error } = await query;
  if (error) throw error;

  return attachCreatorNames(data ?? []);
}

export async function getDesignTypes() {
  const { data, error } = await supabase
    .from("published_designs")
    .select("design_type")
    .eq("is_public", true);

  if (error) throw error;

  return Array.from(new Set((data ?? []).map((d) => d.design_type))).sort();
}

export async function getDesignById(id: string) {
  const { data, error } = await supabase
    .from("published_designs")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [withCreator] = await attachCreatorNames([data]);
  return withCreator;
}

export async function incrementViewCount(id: string) {
  await supabase.rpc("increment_design_view", { design_id: id });
}
