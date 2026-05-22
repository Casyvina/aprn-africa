"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { InsightCard, InsightCategory } from "@/lib/queries/insights";
import { PAGE_SIZE } from "@/lib/queries/insights";
import { fetchMoreInsights } from "@/app/actions/insights";

// -- Helpers ----------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const categoryMeta: Record<InsightCategory, { label: string; badge: string; dot: string }> = {
  intelligence: {
    label: "Intelligence Brief",
    badge: "bg-sky-400/10 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
  },
  research: {
    label: "Research Report",
    badge: "bg-gold-500/10 border-gold-500/30 text-gold-500",
    dot: "bg-gold-500",
  },
  editorial: {
    label: "Editorial Insight",
    badge: "bg-copper-500/10 border-copper-500/30 text-copper-500",
    dot: "bg-copper-500",
  },
};

// -- Card -------------------------------------------------------------------

function InsightCard({ article }: { article: InsightCard }) {
  const meta = categoryMeta[article.category];
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group glass-panel border border-navy-700 hover:border-gold-500/40 transition-colors rounded-sm overflow-hidden block"
    >
      <div
        className="aspect-video bg-cover bg-center relative bg-navy-800"
        style={{ backgroundImage: article.heroImage ? `url('${article.heroImage}')` : undefined }}
      >
        <div className="absolute inset-0 bg-navy-900/50 group-hover:bg-navy-900/30 transition-colors" />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[10px] font-semibold uppercase tracking-wider ${meta.badge}`}>
            <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="text-lg font-bold mb-3 leading-snug group-hover:text-gold-500 transition-colors"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {article.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 uppercase tracking-wider border-t border-navy-700 pt-4">
          <span>{formatDate(article.publishDate)}</span>
          {article.estimatedReadTime && (
            <>
              <span>·</span>
              <span>{article.estimatedReadTime} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// -- Grid -------------------------------------------------------------------

interface Props {
  initial: InsightCard[];
  initialOffset: number;
  hasMoreInitial: boolean;
}

export default function InsightGrid({ initial, initialOffset, hasMoreInitial }: Props) {
  const [items, setItems] = useState<InsightCard[]>(initial);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    startTransition(async () => {
      const more = await fetchMoreInsights(offset);
      setItems((prev) => [...prev, ...more]);
      setOffset((prev) => prev + more.length);
      setHasMore(more.length === PAGE_SIZE);
    });
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((article) => (
          <InsightCard key={article._id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-14 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="inline-flex items-center gap-3 border border-gold-500/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin text-sm" />
                Loading…
              </>
            ) : (
              <>
                Load More Publications
                <i className="fa-solid fa-arrow-down text-sm" />
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && items.length > initial.length && (
        <p className="mt-10 text-center text-xs text-slate-600 uppercase tracking-widest">
          All publications loaded
        </p>
      )}
    </div>
  );
}
