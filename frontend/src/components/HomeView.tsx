import SearchInput from "@/components/SearchInput";
import { Zap, Globe, Brain, Sparkles } from "lucide-react";

interface HomeViewProps {
  onSearch: (query: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  {
    icon: <Globe size={14} />,
    text: "Recent breakthroughs in AI",
  },
  {
    icon: <Brain size={14} />,
    text: "How do quantum computers work?",
  },
  {
    icon: <Zap size={14} />,
    text: "Planning a 3-day trip to Tokyo",
  },
];

export default function HomeView({ onSearch, disabled }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 max-w-[800px] mx-auto">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[oklch(0.65_0.18_230/3%)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[oklch(0.6_0.2_270/3%)] blur-[120px]" />
      </div>

      {/* Hero */}
      <div className="text-center mb-10 z-10 animate-reveal">
        <h1 className="text-[2.5rem] sm:text-[3.2rem] font-semibold text-[oklch(0.98_0_0)] tracking-tight leading-[1.1] mb-6">
          What do you want to know?
        </h1>
      </div>

      {/* Search */}
      <div className="w-full flex justify-center mb-10 z-10 animate-reveal [animation-delay:100ms]">
        <SearchInput onSubmit={onSearch} disabled={disabled} />
      </div>

      {/* Quick prompts / Discover */}
      <div className="w-full z-10 animate-reveal [animation-delay:200ms]">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Sparkles size={14} className="text-[oklch(0.5_0.01_260)]" />
          <span className="text-[0.8rem] font-semibold text-[oklch(0.5_0.01_260)] uppercase tracking-wider">
            Try asking
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSearch(prompt.text)}
              disabled={disabled}
              className="
                group flex items-center gap-2.5 px-4 py-2.5
                bg-[oklch(0.15_0.005_260)]
                border border-[oklch(1_0_0/6%)]
                rounded-2xl
                text-[0.9rem] text-[oklch(0.8_0.005_260)]
                hover:border-[oklch(1_0_0/15%)]
                hover:bg-[oklch(0.18_0.005_260)]
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
                transition-all duration-300
                cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              <span className="text-[oklch(0.5_0.01_260)] group-hover:text-[oklch(0.65_0.18_230)] transition-colors">
                {prompt.icon}
              </span>
              <span className="font-medium">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

