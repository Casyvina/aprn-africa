"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

const TYPE_MAP: Record<string, string> = {
  editorial: "editorialInsight",
  intelligence: "intelligenceUpdate",
  research: "researchReport",
};

interface Props {
  itemId: string;
  itemType: string;       // Sanity _type or InsightCategory key
  itemSlug: string;
  itemTitle: string;
  className?: string;
}

export default function SaveButton({ itemId, itemType, itemSlug, itemTitle, className = "" }: Props) {
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resolvedType = TYPE_MAP[itemType] ?? itemType;

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading || saved) return;
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/dashboard/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: itemId,
        item_type: resolvedType,
        item_slug: itemSlug,
        item_title: itemTitle,
      }),
    });
    setLoading(false);
    if (res.ok) setSaved(true);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Saved to library" : "Save to library"}
      title={saved ? "Saved" : "Save to library"}
      className={`w-9 h-9 flex items-center justify-center transition-all backdrop-blur-sm ${
        saved
          ? "text-gold-500 bg-gold-500/15"
          : "text-slate-400 hover:text-gold-500 bg-navy-900/70 hover:bg-navy-900/90"
      } ${className}`}
    >
      {loading ? (
        <i className="fa-solid fa-circle-notch animate-spin text-sm" />
      ) : (
        <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark text-sm`} />
      )}
    </button>
  );
}
