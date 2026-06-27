"use client";

import { useState, useMemo } from "react";
import type { PaymentRow } from "@/app/admin/payments/page";

const STATUS_STYLE: Record<string, { label: string; cls: string; icon: string }> = {
  success: { label: "Success",  cls: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400", icon: "fa-circle-check" },
  pending: { label: "Pending",  cls: "bg-gold-500/10 border-gold-500/20 text-gold-500",           icon: "fa-clock"        },
  failed:  { label: "Failed",   cls: "bg-red-400/10 border-red-400/20 text-red-400",               icon: "fa-circle-xmark" },
};

const TIER_BADGE: Record<string, string> = {
  student:      "text-sky-400",
  graduate:     "text-blue-400",
  professional: "text-gold-500",
  associate:    "text-copper-500",
  corporate:    "text-purple-400",
  free:         "text-slate-500",
};

function fmtNGN(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtType(t: string): string {
  return t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type FilterStatus = "all" | "success" | "pending" | "failed";

export default function AdminPaymentsClient({ payments }: { payments: PaymentRow[] }) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = payments;
    if (filter !== "all") list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(q) ||
          p.paystack_ref.toLowerCase().includes(q) ||
          p.payment_type.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      );
    }
    return list;
  }, [payments, filter, search]);

  const totalRevenue = useMemo(
    () => payments.filter((p) => p.status === "success").reduce((acc, p) => acc + p.amount_ngn, 0),
    [payments]
  );
  const successCount = useMemo(() => payments.filter((p) => p.status === "success").length, [payments]);
  const pendingCount = useMemo(() => payments.filter((p) => p.status === "pending").length, [payments]);
  const avgValue = successCount > 0 ? Math.round(totalRevenue / successCount) : 0;

  async function copyRef(ref: string) {
    await navigator.clipboard.writeText(ref);
    setCopied(ref);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex flex-col gap-8 max-w-360">

      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Payments
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paystack transaction history for APRN memberships.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    value: fmtNGN(totalRevenue),      icon: "fa-naira-sign",   note: "successful only" },
          { label: "Transactions",     value: String(payments.length),    icon: "fa-receipt",      note: "all time"        },
          { label: "Successful",       value: String(successCount),       icon: "fa-circle-check", note: `${pendingCount} pending` },
          { label: "Average Value",    value: fmtNGN(avgValue),           icon: "fa-chart-line",   note: "per success"     },
        ].map((s) => (
          <div key={s.label} className="bg-navy-800 border border-white/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-navy-900 border border-white/5 flex items-center justify-center shrink-0">
                <i className={`fa-solid ${s.icon} text-gold-500 text-xs`} />
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
              {s.value}
            </p>
            <p className="text-[10px] text-slate-600 mt-1">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2">
          {(["all", "success", "pending", "failed"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-semibold transition-colors capitalize ${
                filter === f
                  ? "bg-gold-500 text-navy-900"
                  : "bg-navy-800 border border-white/10 text-slate-400 hover:text-white hover:border-gold-500/30"
              }`}
            >
              {f === "all" ? `All (${payments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${payments.filter((p) => p.status === f).length})`}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ref, type..."
            className="bg-navy-800 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-gold-500/40 transition-colors w-64"
          />
        </div>
      </div>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="bg-navy-800 border border-white/5 border-dashed p-16 flex flex-col items-center gap-3 text-center">
          <i className="fa-solid fa-credit-card text-slate-700 text-3xl" />
          <p className="text-sm font-semibold text-slate-400">No transactions yet</p>
          <p className="text-xs text-slate-600 max-w-xs">
            Payments will appear here once members complete checkout through Paystack.
          </p>
        </div>
      ) : (
        <div className="bg-navy-800 border border-white/5 overflow-x-auto">
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="border-b border-white/5">
                {["Member", "Amount", "Type", "Status", "Date", "Reference"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-600">
                    No results for this filter
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const statusMeta = STATUS_STYLE[p.status] ?? STATUS_STYLE.pending;
                  const tierColor = TIER_BADGE[p.membership_tier ?? "free"] ?? "text-slate-500";
                  const dateStr = fmtDate(p.paid_at ?? p.created_at);
                  return (
                    <tr key={p.id} className="hover:bg-navy-700/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white truncate max-w-[180px]">
                          {p.full_name ?? <span className="text-slate-600 italic">Unknown</span>}
                        </p>
                        {p.membership_tier && (
                          <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${tierColor}`}>
                            {p.membership_tier}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 font-bold text-white whitespace-nowrap">
                        {fmtNGN(p.amount_ngn)}
                        <span className="text-slate-600 font-normal ml-1 text-[10px]">{p.currency.toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {fmtType(p.payment_type)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] font-bold uppercase tracking-wider ${statusMeta.cls}`}>
                          <i className={`fa-solid ${statusMeta.icon} text-[9px]`} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">{dateStr}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-slate-400 text-[10px] font-mono truncate max-w-[100px]" title={p.paystack_ref}>
                            {p.paystack_ref}
                          </code>
                          <button
                            onClick={() => copyRef(p.paystack_ref)}
                            className="text-slate-600 hover:text-gold-500 transition-colors shrink-0"
                            title="Copy reference"
                          >
                            <i className={`fa-${copied === p.paystack_ref ? "solid fa-check text-emerald-400" : "regular fa-copy"} text-[10px]`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-600">
              Showing {filtered.length} of {payments.length} transactions
            </p>
            <a
              href="https://dashboard.paystack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-gold-500 transition-colors flex items-center gap-1.5"
            >
              Open Paystack Dashboard <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
