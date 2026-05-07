import { useState, useRef, useEffect } from "react";
import { Search, ArrowUp, Globe, Plus } from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
}

export default function SearchInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask anything...",
  compact = false,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setQuery("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [query]);

  return (
    <div
      className={`
        relative group w-full transition-all duration-300
        ${compact ? "max-w-[760px]" : "max-w-[720px]"}
      `}
    >
      <div
        className={`
          relative flex flex-col gap-2
          bg-[oklch(0.15_0.005_260)] 
          border border-[oklch(1_0_0/10%)]
          rounded-[24px]
          transition-all duration-300 ease-in-out
          focus-within:border-[oklch(1_0_0/20%)]
          focus-within:bg-[oklch(0.16_0.005_260)]
          focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
          ${compact ? "p-2" : "p-4 pb-3"}
        `}
      >
        <div className="flex items-start gap-3">
          {!compact && (
            <div className="mt-2.5 ml-1">
              <Search
                size={18}
                className="text-[oklch(0.5_0.01_260)] flex-shrink-0"
              />
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`
              flex-1 bg-transparent border-none outline-none resize-none
              text-[oklch(0.95_0.005_260)] placeholder:text-[oklch(0.45_0.01_260)]
              disabled:opacity-40 font-medium
              ${compact ? "text-[0.95rem] py-1.5" : "text-[1.05rem] py-1.5"}
            `}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {!compact && (
              <>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(1_0_0/5%)] hover:bg-[oklch(1_0_0/10%)] text-[0.78rem] text-[oklch(0.6_0.008_260)] transition-colors border-none cursor-pointer">
                  <Plus size={14} />
                  <span>Attach</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(1_0_0/5%)] hover:bg-[oklch(1_0_0/10%)] text-[0.78rem] text-[oklch(0.6_0.008_260)] transition-colors border-none cursor-pointer">
                  <Globe size={14} />
                  <span>Search</span>
                </button>
              </>
            )}
            {compact && (
               <div className="flex items-center gap-1.5 px-2 py-1">
                  <Search
                    size={14}
                    className="text-[oklch(0.4_0.01_260)] flex-shrink-0"
                  />
               </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={disabled || !query.trim()}
            className={`
              flex-shrink-0 flex items-center justify-center
              rounded-full transition-all duration-300
              disabled:opacity-20 disabled:cursor-not-allowed
              ${compact ? "w-8 h-8" : "w-10 h-10"}
              ${
                query.trim()
                  ? "bg-[oklch(0.65_0.18_230)] text-white shadow-[0_4px_12px_oklch(0.65_0.18_230/30%)] scale-100 hover:scale-105"
                  : "bg-[oklch(1_0_0/10%)] text-[oklch(0.4_0.01_260)] scale-95"
              }
              cursor-pointer border-none
            `}
          >
            <ArrowUp size={compact ? 16 : 20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

