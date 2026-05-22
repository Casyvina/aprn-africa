import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | APRN",
  description:
    "The African Pipeline Resource Network is committed to protecting the privacy and security of our institutional partners, stakeholders, and digital infrastructure networks.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main
        className="bg-navy-900 text-white"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* -- Hero ---------------------------------------------- */}
        <section className="pt-32 pb-20 px-6 lg:px-12 max-w-360 mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              Governance &amp; Compliance
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-8"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Privacy Policy
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mb-12">
              The African Pipeline Resource Network (APRN) is committed to protecting the privacy
              and security of our institutional partners, stakeholders, and digital infrastructure
              networks.
            </p>

            <div className="flex flex-wrap gap-8 text-sm border-t border-navy-700 pt-8">
              <div>
                <span className="block text-slate-500 mb-1">Effective Date</span>
                <span className="text-slate-200 font-medium">October 1, 2023</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Last Updated</span>
                <span className="text-slate-200 font-medium">November 15, 2023</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Document Ref</span>
                <span className="text-slate-200 font-medium font-mono text-xs tracking-wider">
                  APRN-POL-PRIV-23V4
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* -- Overview Cards ------------------------------------ */}
        <section className="py-16 px-6 lg:px-12 max-w-360 mx-auto border-t border-navy-700/50 bg-linear-to-b from-navy-900 to-navy-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "fa-database",
                title: "Data Collection",
                body: "We collect only essential operational data required to maintain and optimize pipeline infrastructure networks.",
              },
              {
                icon: "fa-bullseye",
                title: "Purpose",
                body: "Information is utilized strictly for network monitoring, compliance reporting, and institutional coordination.",
              },
              {
                icon: "fa-shield-halved",
                title: "Protection",
                body: "Enterprise-grade encryption and strict access controls safeguard all institutional and operational datasets.",
              },
              {
                icon: "fa-scale-balanced",
                title: "User Rights",
                body: "Stakeholders maintain full rights to access, audit, and request deletion of non-essential institutional records.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8 border border-navy-700 bg-navy-800/50 hover:border-gold-500/50 transition-colors"
              >
                <i className={`fa-solid ${card.icon} text-gold-500 text-2xl mb-6 block`} />
                <h3
                  className="text-xl text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- Main Policy Content ------------------------------- */}
        <section className="py-24 px-6 lg:px-12 max-w-360 mx-auto bg-navy-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Sidebar nav */}
            <div className="lg:col-span-3 hidden lg:block">
              <nav className="sticky top-32 border-l border-navy-700 pl-6 flex flex-col gap-4 text-sm">
                {[
                  { href: "#collection", label: "1. Information We Collect", active: true },
                  { href: "#use",        label: "2. How We Use Information" },
                  { href: "#sharing",    label: "3. Information Sharing" },
                  { href: "#security",   label: "4. Data Security" },
                  { href: "#cookies",    label: "5. Cookies & Tracking" },
                  { href: "#rights",     label: "6. Your Rights" },
                  { href: "#contact-dpo",label: "7. Contact & DPO" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`transition-colors ${
                      item.active
                        ? "text-gold-500 font-medium"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Policy text */}
            <div className="lg:col-span-7 space-y-2">

              {/* 1 */}
              <div id="collection">
                <h2
                  className="text-3xl font-medium text-white mt-0 mb-6 pt-0"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  1. Information We Collect
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  The African Pipeline Resource Network (APRN) collects information to provide better
                  services to our institutional partners and network participants. The types of
                  information we collect depend on how you interact with our platforms and services.
                </p>
                <h3 className="text-lg font-semibold text-slate-200 mt-8 mb-4">
                  Operational and Infrastructure Data
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  We collect data related to the operation, monitoring, and maintenance of pipeline
                  infrastructure. This may include telemetry data, flow rates, pressure metrics, and
                  geographic coordinates. While primarily technical, this data may occasionally be
                  linked to specific operator accounts.
                </p>
                <h3 className="text-lg font-semibold text-slate-200 mt-8 mb-4">
                  Institutional Contact Information
                </h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  When you register on our portal, subscribe to our intelligence reports, or contact
                  our compliance team, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300 leading-relaxed mb-6">
                  <li>Full name and professional title</li>
                  <li>Institutional affiliation and organizational role</li>
                  <li>Professional email address and direct contact numbers</li>
                  <li>Physical business address and operational jurisdiction</li>
                </ul>
                <h3 className="text-lg font-semibold text-slate-200 mt-8 mb-4">
                  Newsletter & Communications Data
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  When you subscribe to the APRN Intelligence Briefing, we store your email address
                  in our secure database. This is used solely to deliver the newsletter and related
                  communications. You may unsubscribe at any time by contacting us at{" "}
                  <a
                    href="mailto:info@aprn-africa.org"
                    className="text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    info@aprn-africa.org
                  </a>
                  .
                </p>
              </div>

              {/* 2 */}
              <div id="use" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  2. How We Use Information
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  APRN uses the collected data to maintain the integrity of our network, fulfil our
                  contractual obligations, and ensure compliance with international energy and
                  infrastructure regulations. Specifically, we utilise your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300 leading-relaxed mb-6">
                  <li>Provide, maintain, and improve our infrastructure monitoring services.</li>
                  <li>
                    Process transactions and send related information, including confirmations and
                    invoices.
                  </li>
                  <li>
                    Send technical notices, updates, security alerts, and support messages.
                  </li>
                  <li>
                    Respond to your comments, questions, and requests, and provide customer service.
                  </li>
                  <li>
                    Communicate about products, services, offers, and events offered by APRN and
                    select partners.
                  </li>
                  <li>
                    Deliver the APRN Intelligence Briefing newsletter to subscribed recipients.
                  </li>
                </ul>
              </div>

              {/* 3 */}
              <div id="sharing" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  3. Information Sharing
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  APRN does not sell, trade, or otherwise transfer your personal information to
                  outside parties without your consent, except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300 leading-relaxed mb-6">
                  <li>
                    <strong className="text-slate-200">Service Providers:</strong> Trusted third
                    parties that assist us in operating our website, conducting our business (e.g.
                    Resend for transactional email delivery), or servicing you — bound by
                    confidentiality agreements.
                  </li>
                  <li>
                    <strong className="text-slate-200">Regulatory Compliance:</strong> When required
                    by applicable law, legal process, or government request.
                  </li>
                  <li>
                    <strong className="text-slate-200">Business Transfers:</strong> In connection
                    with any merger, acquisition, or sale of APRN assets, with prior notice to
                    affected parties.
                  </li>
                </ul>
              </div>

              {/* 4 */}
              <div id="security" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  4. Data Security Protocol
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  APRN implements physical, technical, and administrative safeguards designed to
                  protect your information against unauthorised access, destruction, or alteration.
                  Our security framework aligns with international standards for critical
                  infrastructure operators.
                </p>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Despite our efforts, no security measures are completely impenetrable. We cannot
                  guarantee the absolute security of our databases, nor can we guarantee that
                  information you supply will not be intercepted while being transmitted to us over
                  the Internet.
                </p>
              </div>

              {/* 5 */}
              <div id="cookies" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  5. Cookies &amp; Tracking
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Our website uses cookies and similar tracking technologies to enhance your
                  experience, analyse site traffic, and understand where our visitors come from.
                  You can instruct your browser to refuse all cookies or to indicate when a cookie
                  is being sent. However, if you do not accept cookies, some portions of our site
                  may not function correctly.
                </p>
                <p className="text-slate-300 leading-relaxed mb-6">
                  We use analytics tools (such as Vercel Analytics) to collect anonymous usage data.
                  This data is not linked to personally identifiable information and is used
                  exclusively to improve our platform.
                </p>
              </div>

              {/* 6 */}
              <div id="rights" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  6. Your Rights
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have the following rights with respect to
                  your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300 leading-relaxed mb-6">
                  <li>
                    <strong className="text-slate-200">Access:</strong> Request a copy of the
                    personal data we hold about you.
                  </li>
                  <li>
                    <strong className="text-slate-200">Rectification:</strong> Request correction
                    of inaccurate or incomplete data.
                  </li>
                  <li>
                    <strong className="text-slate-200">Erasure:</strong> Request deletion of your
                    personal data, subject to legal retention obligations.
                  </li>
                  <li>
                    <strong className="text-slate-200">Objection:</strong> Object to specific
                    processing activities, including direct marketing.
                  </li>
                  <li>
                    <strong className="text-slate-200">Portability:</strong> Request transfer of
                    your data in a structured, machine-readable format.
                  </li>
                </ul>
                <p className="text-slate-300 leading-relaxed">
                  To exercise any of these rights, contact our Data Protection Officer at{" "}
                  <a
                    href="mailto:info@aprn-africa.org"
                    className="text-gold-500 hover:text-gold-400 transition-colors"
                  >
                    info@aprn-africa.org
                  </a>
                  . We will respond within 30 days.
                </p>
              </div>

              {/* 7 */}
              <div id="contact-dpo" className="pt-8">
                <h2
                  className="text-3xl font-medium text-white mb-6 border-t border-navy-700 pt-10"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  7. Contact &amp; Data Protection Officer
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Questions, comments, and requests regarding this Privacy Policy are welcomed and
                  should be addressed to:
                </p>
                <div className="bg-navy-900 border border-navy-700 p-6 rounded-sm space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="text-slate-500 w-28 shrink-0">Organisation</span>
                    <span className="text-slate-200">
                      African Pipeline Resource Network (APRN)
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-slate-500 w-28 shrink-0">DPO Email</span>
                    <a
                      href="mailto:info@aprn-africa.org"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      info@aprn-africa.org
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-slate-500 w-28 shrink-0">Website</span>
                    <span className="text-slate-200">aprn-africa.org</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-6 leading-relaxed">
                  This policy may be updated periodically. Material changes will be communicated to
                  registered stakeholders via the contact email on file. Continued use of APRN
                  services after changes constitutes acceptance of the revised policy.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* -- Security Visual ----------------------------------- */}
        <section className="py-32 relative border-y border-navy-700 bg-navy-900 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(212,160,23,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,160,23,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(7,27,42,0.95) 100%)",
            }}
          />

          <div className="relative z-10 max-w-360 mx-auto px-6 lg:px-12 text-center">
            <i className="fa-solid fa-network-wired text-gold-500 text-4xl mb-6 block" />
            <h2
              className="text-3xl md:text-5xl text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Institutional-Grade Security
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Our data infrastructure is built on the same rigorous standards as our physical
              pipeline networks, ensuring absolute integrity and operational continuity.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
              {[
                {
                  title: "ISO 27001",
                  body: "Certified information security management systems across all operational nodes.",
                },
                {
                  title: "End-to-End Encryption",
                  body: "AES-256 encryption for all data at rest and in transit across the APRN network.",
                },
                {
                  title: "Continuous Audit",
                  body: "24/7 monitoring and quarterly third-party penetration testing of all systems.",
                },
              ].map((item) => (
                <div key={item.title} className="border-l border-gold-500 pl-6">
                  <div
                    className="text-white text-xl mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {item.title}
                  </div>
                  <div className="text-sm text-slate-400 leading-relaxed">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Contact Module ------------------------------------ */}
        <section className="py-24 px-6 lg:px-12 max-w-360 mx-auto bg-navy-800">
          <div className="max-w-4xl mx-auto bg-navy-900 border border-navy-700 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-[100px]" />

            <h2
              className="text-3xl text-white mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Compliance &amp; Privacy Inquiries
            </h2>
            <p className="text-slate-400 mb-10 max-w-2xl leading-relaxed">
              For specific questions regarding our data practices, to exercise your rights, or to
              contact our Data Protection Officer, please reach out through our official channels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-envelope text-gold-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:info@aprn-africa.org"
                      className="text-slate-200 hover:text-gold-500 transition-colors text-sm"
                    >
                      info@aprn-africa.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-globe text-gold-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                      Website
                    </div>
                    <span className="text-slate-200 text-sm">aprn-africa.org</span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-file-contract text-gold-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                      Document Ref
                    </div>
                    <span className="text-slate-200 text-sm font-mono tracking-wider">
                      APRN-POL-PRIV-23V4
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  We are committed to resolving privacy concerns within 30 business days. For
                  urgent compliance matters related to critical infrastructure data, please mark
                  your inquiry as &ldquo;URGENT — DPO&rdquo;.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
                  >
                    Submit Inquiry <i className="fa-solid fa-arrow-right" />
                  </Link>
                  <Link
                    href="/terms"
                    className="inline-flex items-center justify-center gap-2 border border-navy-700 hover:border-gold-500/50 text-slate-400 hover:text-white px-6 py-3 text-xs uppercase tracking-wider transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
