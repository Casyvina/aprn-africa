import Image from "next/image";

const initiatives = [
  { label: "Engineering Academy", href: "/training" },
  { label: "Policy Think-Tank", href: "/insights" },
  { label: "Data Observatory", href: "/research" },
  { label: "Research Grants", href: "/contact" },
];

const organisation = [
  { label: "About APRN", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Member Directory", href: "/partnerships" },
  { label: "Careers", href: "/contact" },
  { label: "Press & Media", href: "/contact" },
];

const resources = [
  { label: "Pipeline Database", href: "/research" },
  { label: "Research Library", href: "/research" },
  { label: "Standards & Codes", href: "/research" },
  { label: "Training Calendar", href: "/training" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#041019] border-t border-navy-800 pt-16 pb-8">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="mb-5">
              <Image
                src="/images/logo.png"
                alt="African Pipeline Resource Network"
                width={999}
                height={453}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Building the knowledge infrastructure for Africa&apos;s energy transition through rigorous
              research and elite training.
            </p>
            <a
              href="mailto:info@aprn-africa.org"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold-500 transition-colors mb-6"
            >
              <i className="fa-solid fa-envelope text-gold-500" />
              info@aprn-africa.org
            </a>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/aprn-africa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
              >
                <i className="fa-brands fa-linkedin-in" />
              </a>
              <a
                href="https://twitter.com/aprnafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-slate-400 hover:text-gold-500 transition-colors"
              >
                <i className="fa-brands fa-twitter" />
              </a>
            </div>
          </div>

          {/* Initiatives */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Initiatives
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {initiatives.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="inline-flex items-center gap-1.5 hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200 cursor-pointer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Organisation */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Organisation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {organisation.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="inline-flex items-center gap-1.5 hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200 cursor-pointer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {resources.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="inline-flex items-center gap-1.5 hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200 cursor-pointer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} African Pipeline Resource Network. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200">Privacy Policy</a>
            <a href="/terms" className="hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200">Terms of Use</a>
            <a href="/privacy" className="hover:text-gold-500 hover:translate-x-0.5 transition-all duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
