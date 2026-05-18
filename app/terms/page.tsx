import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Use | APRN",
  description:
    "Governing the access, utilization, and distribution of resources across the African Pipeline Resource Network.",
};

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main
        className="bg-navy-900 text-white"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* ── Hero ────────────────────────────────────────────── */}
        <header className="pt-40 pb-24 px-6 lg:px-12 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(212,160,23,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Institutional Governance
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Terms of{" "}
              <span className="text-gold-500 italic">Use</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Governing the access, utilization, and distribution of resources across the African
              Pipeline Resource Network. These terms establish our mutual commitment to platform
              integrity.
            </p>

            <div className="text-sm text-slate-500 font-medium">
              Last Updated:{" "}
              <span className="text-slate-100">October 15, 2024</span> · Version 4.2
            </div>
          </div>
        </header>

        {/* ── Quick Policy Summary ────────────────────────────── */}
        <section className="py-16 px-6 lg:px-12 bg-navy-800 border-y border-navy-700">
          <div className="max-w-360 mx-auto">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-10 text-center">
              Quick Policy Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "fa-server",
                  ghost: "fa-network-wired",
                  title: "Platform Usage",
                  body: "Guidelines for accessing APIs, data pipelines, and computational resources securely.",
                },
                {
                  icon: "fa-shield-halved",
                  ghost: "fa-copyright",
                  title: "Intellectual Property",
                  body: "Ownership rights, licensing terms, and protection of proprietary network models.",
                },
                {
                  icon: "fa-microscope",
                  ghost: "fa-flask",
                  title: "Research Usage",
                  body: "Academic and institutional protocols for utilising platform data in publications.",
                },
                {
                  icon: "fa-file-contract",
                  ghost: "fa-scale-balanced",
                  title: "Liability & Disclaimers",
                  body: "Limitations of liability, warranty disclaimers, and indemnification clauses.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-navy-900 rounded-xl p-8 border-t-2 border-gold-500 shadow-lg relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <i className={`fa-solid ${card.ghost} text-gold-500 text-6xl`} />
                  </div>
                  <i className={`fa-solid ${card.icon} text-slate-400 text-2xl mb-6 block`} />
                  <h3
                    className="text-xl font-semibold mb-3 text-white"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main Content + Sidebar ──────────────────────────── */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-16">

            {/* Sticky sidebar */}
            <aside className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-32">
                <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-6">
                  Contents
                </h4>
                <nav className="space-y-4 border-l border-navy-700 pl-4">
                  {[
                    { href: "#section-1", label: "1. Acceptance of Terms",         active: true },
                    { href: "#section-2", label: "2. Platform Access & Security" },
                    { href: "#section-3", label: "3. Data Governance" },
                    { href: "#section-4", label: "4. Research Protocols" },
                    { href: "#section-5", label: "5. Intellectual Property" },
                    { href: "#section-6", label: "6. Termination" },
                    { href: "#section-7", label: "7. Governing Law" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block text-sm transition-colors hover:text-gold-500 ${
                        item.active ? "text-white font-medium" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="mt-12 bg-navy-800 p-6 rounded-lg border-l-4 border-gold-500">
                  <h5
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Executive Notice
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    These terms constitute a legally binding agreement between you and APRN. By
                    accessing institutional resources, you agree to comply with all governance
                    protocols outlined herein.
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:w-3/4 max-w-3xl space-y-16">

              {/* 1 */}
              <div id="section-1" className="scroll-mt-32">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  1. Acceptance of Terms
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  By accessing or using the African Pipeline Resource Network (hereinafter referred
                  to as &ldquo;APRN&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                  &ldquo;our&rdquo;), you agree to be bound by these Terms of Use and all
                  applicable governance policies. If you do not agree to these terms, you must
                  immediately cease all use of the platform.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  These terms apply to all users, including but not limited to academic researchers,
                  institutional partners, corporate clients, and independent analysts utilising our
                  data pipelines and infrastructure intelligence network.
                </p>
              </div>

              {/* 2 */}
              <div id="section-2" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  2. Platform Access &amp; Security
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Access to APRN&apos;s proprietary infrastructure is granted conditionally based on
                  your institutional affiliation and approved use case. Users are responsible for
                  maintaining the confidentiality of their API keys and authentication credentials.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400 leading-relaxed mb-6">
                  <li>Credentials must not be shared across organisational boundaries.</li>
                  <li>Automated scraping of platform interfaces is strictly prohibited.</li>
                  <li>All API access must adhere to documented rate limits.</li>
                  <li>
                    Users must report suspected security breaches to{" "}
                    <a
                      href="mailto:info@aprn-africa.org"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      info@aprn-africa.org
                    </a>{" "}
                    within 24 hours of discovery.
                  </li>
                </ul>

                {/* Platform integrity callout */}
                <div className="bg-navy-900 border border-navy-700 rounded-xl p-8 relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 2px 2px, rgba(212,160,23,0.3) 1px, transparent 0)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div className="relative z-10 flex items-start gap-6">
                    <i className="fa-solid fa-triangle-exclamation text-gold-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <h4
                        className="text-white font-semibold mb-2"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        Platform Integrity Notice
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        APRN reserves the right to suspend or terminate access without notice in
                        cases of suspected misuse, breach of these terms, or activity that
                        compromises the integrity of our infrastructure data or network operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 */}
              <div id="section-3" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  3. Data Governance
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  All data accessed through APRN platforms is subject to strict governance
                  protocols. Users agree to handle all datasets — including pipeline telemetry,
                  geospatial data, and financial intelligence — in compliance with applicable
                  regulatory frameworks, including the Nigerian Data Protection Act and GDPR where
                  applicable.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400 leading-relaxed">
                  <li>Data may not be redistributed, resold, or sublicensed without express written consent.</li>
                  <li>Derivative works must clearly attribute the source as APRN.</li>
                  <li>
                    Users must delete all data upon termination of their institutional agreement
                    unless otherwise agreed in writing.
                  </li>
                  <li>
                    Cross-border transfers of APRN data are subject to the jurisdiction of the
                    data&apos;s country of origin.
                  </li>
                </ul>
              </div>

              {/* 4 */}
              <div id="section-4" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  4. Research Protocols
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Academic institutions and independent researchers accessing APRN data for
                  non-commercial research must comply with the following protocols:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400 leading-relaxed mb-6">
                  <li>
                    All publications using APRN data must include the citation:{" "}
                    <span className="text-slate-300 italic">
                      &ldquo;African Pipeline Resource Network (APRN), aprn-africa.org&rdquo;
                    </span>
                    .
                  </li>
                  <li>Pre-publication disclosure is required for research involving sensitive corridor data.</li>
                  <li>
                    APRN must be notified of any publication at least 14 days prior to public
                    release via{" "}
                    <a
                      href="mailto:info@aprn-africa.org"
                      className="text-gold-500 hover:text-gold-400 transition-colors"
                    >
                      info@aprn-africa.org
                    </a>
                    .
                  </li>
                  <li>Research findings must not misrepresent APRN data or methodology.</li>
                </ul>
                <p className="text-slate-400 leading-relaxed">
                  Commercial use of research outputs derived from APRN data requires a separate
                  commercial licence agreement. Contact our partnerships team to discuss terms.
                </p>
              </div>

              {/* 5 */}
              <div id="section-5" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  5. Intellectual Property
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  All content on this platform — including but not limited to research reports,
                  pipeline models, geospatial datasets, editorial analyses, training materials,
                  and software interfaces — is the exclusive intellectual property of the African
                  Pipeline Resource Network or its licensed contributors.
                </p>
                <p className="text-slate-400 leading-relaxed mb-4">
                  APRN grants users a limited, non-exclusive, non-transferable licence to access
                  and use platform content solely for purposes consistent with their registered use
                  case. This licence does not include the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400 leading-relaxed">
                  <li>Reproduce, copy, or distribute content for commercial purposes without written consent.</li>
                  <li>
                    Create derivative works that compete with APRN&apos;s core product offerings.
                  </li>
                  <li>Remove or alter any copyright, trademark, or attribution notices.</li>
                  <li>
                    Use APRN&apos;s name, logo, or brand marks without prior written authorisation.
                  </li>
                </ul>
              </div>

              {/* 6 */}
              <div id="section-6" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  6. Termination
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  APRN may, at its sole discretion, terminate or suspend your access to the
                  platform at any time, with or without notice, for conduct that violates these
                  terms or is otherwise harmful to APRN, its partners, or third parties.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Upon termination, your right to access and use the platform immediately ceases.
                  Any data derived from APRN sources that you hold must be deleted or returned as
                  directed. Provisions of these terms that, by their nature, should survive
                  termination — including intellectual property rights, disclaimers, indemnity,
                  and limitations of liability — shall continue to apply.
                </p>
              </div>

              {/* 7 */}
              <div id="section-7" className="scroll-mt-32 border-t border-navy-700 pt-16">
                <h2
                  className="text-3xl text-white mb-6"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  7. Governing Law
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  These Terms of Use shall be governed by and construed in accordance with the laws
                  of the Federal Republic of Nigeria, without regard to its conflict of law
                  provisions. Any disputes arising from these terms shall be subject to the
                  exclusive jurisdiction of the courts of Lagos State, Nigeria.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  APRN reserves the right to update these terms at any time. Material changes will
                  be communicated to registered users via the contact email on file. Continued use
                  of the platform following notice of changes constitutes acceptance of the revised
                  terms.
                </p>

                {/* Contact box */}
                <div className="mt-10 bg-navy-800 border border-navy-700 p-8 rounded-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h4
                        className="text-lg font-semibold text-white mb-1"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        Questions about these terms?
                      </h4>
                      <p className="text-sm text-slate-400">
                        Contact our legal team at{" "}
                        <a
                          href="mailto:info@aprn-africa.org"
                          className="text-gold-500 hover:text-gold-400 transition-colors"
                        >
                          info@aprn-africa.org
                        </a>
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-6 py-3 text-xs uppercase tracking-wider transition-colors"
                      >
                        Submit Inquiry <i className="fa-solid fa-arrow-right" />
                      </Link>
                      <Link
                        href="/privacy"
                        className="inline-flex items-center gap-2 border border-navy-700 hover:border-gold-500/50 text-slate-400 hover:text-white px-6 py-3 text-xs uppercase tracking-wider transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Footer banner ───────────────────────────────────── */}
        <section className="py-20 px-6 lg:px-12 bg-navy-800 border-t border-navy-700">
          <div className="max-w-360 mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Document Reference</p>
              <p className="text-slate-200 font-mono text-sm tracking-wider">APRN-TOC-USE-24V4.2</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Effective</p>
              <p className="text-slate-200 text-sm">October 15, 2024</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Jurisdiction</p>
              <p className="text-slate-200 text-sm">Federal Republic of Nigeria</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-gold-500 uppercase tracking-wider transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-navy-700">|</span>
              <Link
                href="/contact"
                className="text-xs text-slate-400 hover:text-gold-500 uppercase tracking-wider transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
