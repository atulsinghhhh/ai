import SearchInput from "@/components/SearchInput";
import { Zap, Globe, Brain } from "lucide-react";

interface HomeViewProps {
  onSearch: (query: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  {
    icon: <Globe size={15} />,
    text: "What's happening in tech today?",
  },
  {
    icon: <Brain size={15} />,
    text: "Explain quantum computing simply",
  },
  {
    icon: <Zap size={15} />,
    text: "Best programming languages in 2025",
  },
];

export default function HomeView({ onSearch, disabled }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
      {/* Hero */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-[2.2rem] sm:text-[2.8rem] font-bold text-[oklch(0.95_0.005_260)] tracking-tight leading-tight mb-3">
          What do you want to
          <br />
          <span className="bg-gradient-to-r from-[oklch(0.65_0.18_230)] via-[oklch(0.6_0.2_270)] to-[oklch(0.58_0.22_300)] bg-clip-text text-transparent">
            know?
          </span>
        </h1>
        <p className="text-[0.95rem] text-[oklch(0.48_0.01_260)] max-w-[420px] mx-auto leading-relaxed">
          Search with AI. Get answers from the web with cited sources.
        </p>
      </div>

      {/* Search */}
      <div className="w-full flex justify-center mb-8 animate-fade-in-up delay-100" style={{ opacity: 0 }}>
        <SearchInput onSubmit={onSearch} disabled={disabled} />
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap justify-center gap-2 max-w-[600px] animate-fade-in-up delay-200" style={{ opacity: 0 }}>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSearch(prompt.text)}
            disabled={disabled}
            className="
              group flex items-center gap-2 px-4 py-2.5
              bg-[oklch(0.17_0.005_260)]
              border border-[oklch(1_0_0/6%)]
              rounded-full
              text-[0.8rem] text-[oklch(0.6_0.008_260)]
              hover:border-[oklch(1_0_0/12%)]
              hover:bg-[oklch(0.19_0.005_260)]
              hover:text-[oklch(0.82_0.005_260)]
              transition-all duration-200
              cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <span className="text-[oklch(0.45_0.01_260)] group-hover:text-[oklch(0.65_0.18_230)] transition-colors">
              {prompt.icon}
            </span>
            {prompt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
