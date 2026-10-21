"use client";

import { useState, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";

const VOTER_KEY = "bizgrapes_voter_id";
const LIKED_KEY = "bizgrapes_liked_designs";

function readLiked(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function voterId() {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    >
      <path
        d="M8 13.5S2 10 2 5.8A3.3 3.3 0 0 1 8 4a3.3 3.3 0 0 1 6 1.8C14 10 8 13.5 8 13.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LikeButton({
  designId,
  initialCount,
}: {
  designId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [likedOverride, setLiked] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const storedLiked = useSyncExternalStore(
    () => () => {},
    () => readLiked().includes(designId),
    () => false
  );
  const liked = likedOverride ?? storedLiked;

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    const { data, error } = await supabase.rpc(
      next ? "like_design" : "unlike_design",
      { p_design_id: designId, p_voter: voterId() }
    );
    if (!error) {
      setLiked(next);
      if (typeof data === "number") setCount(data);
      const ids = readLiked().filter((i) => i !== designId);
      try {
        localStorage.setItem(
          LIKED_KEY,
          JSON.stringify(next ? [...ids, designId] : ids)
        );
      } catch {}
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        liked
          ? "border-violet-600 bg-violet-600 text-white"
          : "border-border bg-surface text-foreground hover:border-violet-600"
      }`}
    >
      <HeartIcon filled={liked} />
      {liked ? "Appreciated" : "Appreciate"} · {count}
    </button>
  );
}
