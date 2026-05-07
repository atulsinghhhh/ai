import { Globe, Search } from "lucide-react";

export default function SearchingIndicator() {
  return (
    <div className="flex items-center gap-4 mb-8 animate-reveal">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-[oklch(1_0_0/5%)] bg-[oklch(1_0_0/2%)] flex items-center justify-center">
          <Search size={16} className="text-[oklch(0.5_0.01_260)]" />
        </div>
        <div className="absolute inset-0 border-2 border-[oklch(0.65_0.18_230)] border-t-transparent rounded-full animate-spin [animation-duration:1.5s]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[0.95rem] font-semibold text-[oklch(0.9_0.005_260)] tracking-tight">
          Searching
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
           <Globe size={12} className="text-[oklch(0.4_0.01_260)]" />
           <span className="text-[0.75rem] text-[oklch(0.4_0.01_260)] font-medium">
             Browsing the web for answers...
           </span>
        </div>
      </div>
    </div>
  );
}

