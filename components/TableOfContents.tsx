"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/extractHeadings";

interface Props {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="rounded-sm overflow-hidden" style={{ backgroundColor: "#071B2A" }}>
      <div className="px-6 py-4 border-b border-navy-800">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#D4A017" }}>
          Contents
        </p>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block py-1.5 text-xs leading-snug transition-colors ${
                  h.level === 3 ? "pl-4" : "pl-0"
                } ${
                  active === h.id
                    ? "text-gold-500 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  setActive(h.id);
                }}
              >
                {h.level === 3 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-600 mr-2 mb-0.5" />
                )}
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
