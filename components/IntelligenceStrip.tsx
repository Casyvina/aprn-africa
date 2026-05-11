export default function IntelligenceStrip() {
  return (
    <div className="fixed top-20 w-full z-40 bg-navy-800 border-b border-navy-700 h-10 flex items-center overflow-hidden">
      <div className="absolute left-0 z-10 h-full w-24 bg-gradient-to-r from-navy-800 to-transparent flex items-center px-4 border-r border-navy-700/50">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">
          <i className="fa-solid fa-bolt mr-2"></i>Live
        </span>
      </div>
      <div className="flex whitespace-nowrap animate-ticker pr-8">
        <div className="flex items-center gap-12 text-xs font-medium text-slate-400 tracking-wide px-8">
          <span><span className="text-white">OB3 Pipeline:</span> Final tie-in completed.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">Nigeria-Morocco Gas Pipeline:</span> FEED Phase II commenced.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">Ajaokuta-Kaduna-Kano (AKK):</span> 70% physical completion.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">East African Crude Oil Pipeline:</span> Land acquisition at 85%.</span>
          <span className="text-navy-700">•</span>
          {/* Duplicate for seamless loop */}
          <span><span className="text-white">OB3 Pipeline:</span> Final tie-in completed.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">Nigeria-Morocco Gas Pipeline:</span> FEED Phase II commenced.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">Ajaokuta-Kaduna-Kano (AKK):</span> 70% physical completion.</span>
          <span className="text-navy-700">•</span>
          <span><span className="text-white">East African Crude Oil Pipeline:</span> Land acquisition at 85%.</span>
        </div>
      </div>
    </div>
  );
}
