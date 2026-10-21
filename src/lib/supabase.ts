import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type PublishedDesign = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  design_type: string;
  file_url: string;
  thumbnail_url: string | null;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
  view_count: number;
  like_count: number;
  is_featured: boolean;
};

export type Creator = {
  id: string;
  display_name: string | null;
};
