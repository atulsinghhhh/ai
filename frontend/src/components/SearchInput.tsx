import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";

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
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [query]);

  return (
    <div
      className={`
        relative group w-full
        ${compact ? "max-w-[720px]" : "max-w-[680px]"}
      `}
    >
      <div
        className={`
          relative flex items-end gap-2
          bg-[oklch(0.17_0.005_260)] 
          border border-[oklch(1_0_0/8%)]
          rounded-2xl
          transition-all duration-300
          group-focus-within:border-[oklch(0.65_0.18_230/40%)]
          group-focus-within:shadow-[0_0_0_1px_oklch(0.65_0.18_230/15%),0_4px_24px_oklch(0_0_0/30%)]
          ${compact ? "px-3 py-2" : "px-4 py-3"}
        `}
      >
        <Search
          size={compact ? 16 : 18}
          className="text-[oklch(0.5_0.01_260)] flex-shrink-0 mb-[5px]"
        />
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
            text-[oklch(0.92_0.005_260)] placeholder:text-[oklch(0.42_0.01_260)]
            disabled:opacity-40
            ${compact ? "text-[0.9rem] leading-[1.5]" : "text-[1rem] leading-[1.6]"}
          `}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !query.trim()}
          className={`
            flex-shrink-0 flex items-center justify-center
            rounded-lg transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            ${compact ? "w-7 h-7" : "w-8 h-8"}
            ${
              query.trim()
                ? "bg-[oklch(0.65_0.18_230)] text-white hover:bg-[oklch(0.58_0.18_230)] cursor-pointer"
                : "bg-[oklch(1_0_0/6%)] text-[oklch(0.45_0.01_260)]"
            }
            mb-[1px]
          `}
        >
          <ArrowRight size={compact ? 14 : 16} />
        </button>
      </div>

      {!compact && (
        <div className="flex items-center gap-1.5 mt-2.5 pl-1">
          <Sparkles size={12} className="text-[oklch(0.5_0.01_260)]" />
          <span className="text-[0.72rem] text-[oklch(0.42_0.01_260)] tracking-wide">
            Powered by AI · Sources from the web
          </span>
        </div>
      )}
    </div>
  );
}
