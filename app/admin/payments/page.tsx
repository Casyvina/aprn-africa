export const metadata = { title: "Payments | APRN Admin" };

export default function AdminPaymentsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-275">
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

      <div className="bg-navy-800 border border-white/5 border-dashed p-12 flex flex-col items-center text-center gap-3">
        <i className="fa-solid fa-credit-card text-slate-600 text-3xl" />
        <p className="text-sm font-semibold text-white">Payments dashboard coming soon</p>
        <p className="text-xs text-slate-400 max-w-sm">
          Full Paystack webhook integration and transaction reporting will be available here.
          For now, review payments in your{" "}
          <a
            href="https://dashboard.paystack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 hover:text-gold-400 transition-colors"
          >
            Paystack dashboard →
          </a>
        </p>
      </div>
    </div>
  );
}
