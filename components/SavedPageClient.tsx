"use client";

import { useState } from "react";
import Link from "next/link";

interface SavedItem {
  id: string;
  item_id: string;
  item_type: string;
  item_slug: string | null;
  item_title: string | null;
  saved_at: string | null;
}

function getItemHref(item_type: string, item_slug: string | null): string {
  if (!item_slug) return "/research";
  if (item_type === "researchReport") return `/research/${item_slug}`;
  if (item_type === "editorialInsight") return `/insights/${item_slug}`;
  return `/research/${item_slug}`;
}

function getItemTypeLabel(item_type: string): string {
  if (item_type === "researchReport") return "Research";
  if (item_type === "editorialInsight") return "Editorial";
  if (item_type === "intelligenceUpdate") return "Intelligence";
  return item_type;
}

function getItemTypeColor(item_type: string): string {
  if (item_type === "researchReport") return "text-gold-500";
  if (item_type === "editorialInsight") return "text-blue-400";
  return "text-emerald-400";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const FILTERS = ["All", "Research", "Editorial", "Intelligence"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(item: SavedItem, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Research") return item.item_type === "researchReport";
  if (filter === "Editorial") return item.item_type === "editorialInsight";
  if (filter === "Intelligence") return item.item_type === "intelligenceUpdate";
  return true;
}

export default function SavedPageClient({ initialItems }: { initialItems: SavedItem[] }) {
  const [items, setItems]       = useState<SavedItem[]>(initialItems);
  const [filter, setFilter]     = useState<Filter>("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  const visible = items.filter((i) => matchesFilter(i, filter));

  async function handleRemove(id: string) {
    setDeleting(id);
    await fetch(`/api/dashboard/saved?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleting(null);
  }

  return (
    <div className="flex flex-col gap-8 max-w-225">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Saved Articles
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Research and intelligence you&apos;ve bookmarked for later.
          </p>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase shrink-0">
          {items.length} saved
        </span>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-gold-500 text-navy-900"
                : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Saved list */}
      {visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="bg-navy-800 border border-white/5 p-6 flex gap-5 hover:border-gold-500/20 transition-colors group"
            >
              <div className="w-10 h-10 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-file-lines text-slate-500 group-hover:text-gold-500 transition-colors text-sm" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 bg-navy-900 border border-white/5 text-[9px] font-bold tracking-widest uppercase ${getItemTypeColor(item.item_type)}`}>
                    {getItemTypeLabel(item.item_type)}
                  </span>
                  {item.saved_at && (
                    <span className="text-[10px] text-slate-500">Saved {formatDate(item.saved_at)}</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors leading-snug">
                  {item.item_title ?? item.item_slug ?? item.item_id}
                </h4>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href={getItemHref(item.item_type, item.item_slug)}
                  className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-gold-500/30 transition-colors group/btn"
                  title="Read"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-slate-500 group-hover/btn:text-gold-500 transition-colors text-[10px]" />
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={deleting === item.id}
                  className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center hover:border-red-500/30 transition-colors group/btn disabled:opacity-40"
                  title="Remove"
                >
                  {deleting === item.id ? (
                    <i className="fa-solid fa-spinner fa-spin text-slate-500 text-[10px]" />
                  ) : (
                    <i className="fa-solid fa-bookmark text-gold-500 group-hover/btn:text-red-400 transition-colors text-[10px]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-navy-800 border border-white/5 p-12 flex flex-col items-center text-center gap-3">
          <i className="fa-solid fa-bookmark text-slate-600 text-2xl mb-1" />
          <p className="text-sm text-white font-medium">
            {filter === "All" ? "Nothing saved yet" : `No ${filter} items saved`}
          </p>
          <p className="text-xs text-slate-500 max-w-xs">
            Browse the research hub and click the bookmark icon on any article to save it here.
          </p>
          <Link
            href="/research"
            className="mt-2 px-6 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
          >
            Browse Research Archive
          </Link>
        </div>
      )}

      {/* Browse CTA — only show when items exist */}
      {items.length > 0 && (
        <div className="bg-navy-800 border border-white/5 border-dashed p-8 flex flex-col items-center text-center gap-3">
          <i className="fa-solid fa-books text-slate-600 text-2xl" />
          <p className="text-sm text-white font-medium">Discover more research</p>
          <p className="text-xs text-slate-400">
            Browse the full APRN archive and bookmark papers relevant to your work.
          </p>
          <Link
            href="/research"
            className="mt-2 px-6 py-2.5 bg-gold-500 text-navy-900 text-xs font-bold tracking-widest uppercase hover:bg-gold-400 transition-colors"
          >
            Browse Research Archive
          </Link>
        </div>
      )}
    </div>
  );
}
