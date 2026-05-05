import { Search, Loader2 } from "lucide-react";

export default function SearchingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-[oklch(0.65_0.18_230/12%)] flex items-center justify-center pulse-glow">
          <Search size={14} className="text-[oklch(0.65_0.18_230)]" />
        </div>
        <Loader2
          size={28}
          className="absolute -top-[2px] -left-[2px] text-[oklch(0.65_0.18_230/40%)] animate-spin"
        />
      </div>
      <div>
        <p className="text-[0.88rem] text-[oklch(0.8_0.005_260)] font-medium">
          Searching the web...
        </p>
        <p className="text-[0.75rem] text-[oklch(0.45_0.01_260)]">
          Finding relevant sources
        </p>
      </div>
    </div>
  );
}
