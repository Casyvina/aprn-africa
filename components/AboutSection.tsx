import Image from "next/image";

const leadership = [
  {
    name: "Lucy Okeke",
    title: "Founder & Executive Director",
    photo: "/images/lucy-okeke.jpg",
  },
  {
    name: "Joseph Agwuh",
    title: "Director, Applied Energy and Innovation",
    photo: "/images/joseph-agwuhu.jpg",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-navy-900 relative border-t border-navy-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
              The Institutional Foundation for{" "}
              <span className="text-gold-500">African Energy</span>.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              The African Pipeline Resource Network (APRN) is the premier continental think-tank and
              training ecosystem dedicated to the engineering, policy, and operational excellence of
              Africa&apos;s midstream infrastructure.
            </p>

            {/* EITEP strategic partner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-gold-500/30 bg-gold-500/5 mb-8">
              <i className="fa-solid fa-handshake text-gold-500 text-xs" />
              <span className="text-xs text-slate-300 tracking-wide">
                Strategic Partner: <span className="text-gold-500 font-semibold">EITEP</span>
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 border-t border-navy-700 pt-8 mb-10">
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  15<span className="text-gold-500">+</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Partner Nations</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-white mb-2">
                  50<span className="text-gold-500">k</span>
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Km of Pipeline Tracked</div>
              </div>
            </div>

            {/* Leadership */}
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4 block">
                Leadership
              </span>
              <div className="flex flex-col sm:flex-row gap-4">
                {leadership.map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center gap-3 glass-panel px-4 py-3 rounded-sm border-l-2 border-gold-500/50"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gold-500/30">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{person.name}</p>
                      <p className="text-xs text-slate-400 leading-tight">{person.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] rounded-sm overflow-hidden border border-navy-700 relative group">
              <div className="absolute inset-0 bg-navy-800/50 mix-blend-multiply z-10 transition-opacity group-hover:opacity-0" />
              <Image
                fill
                className="object-cover"
                src="/images/engineers-group.png"
                alt="African engineers in hard hats and safety vests inspecting pipeline infrastructure"
              />
              <div className="absolute bottom-6 left-6 z-20 glass-panel px-4 py-3 border-l-4 border-gold-500">
                <span className="block text-xs text-gold-500 uppercase tracking-widest mb-1">Facility</span>
                <span className="text-sm font-semibold text-white">Regional Training Facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
