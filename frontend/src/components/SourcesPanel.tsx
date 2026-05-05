import type { Source } from "@/lib/api";
import { ExternalLink, Globe } from "lucide-react";
import { useState } from "react";

interface SourcesPanelProps {
  sources: Source[];
  loading?: boolean;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return "";
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function SourcesPanel({ sources, loading }: SourcesPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const displaySources = expanded ? sources : sources.slice(0, 4);

  if (loading) {
    return (
      <div className="mb-5 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-[oklch(0.65_0.18_230)]" />
          <span className="text-[0.8rem] font-medium text-[oklch(0.7_0.008_260)] uppercase tracking-wider">
            Sources
          </span>
          <div className="flex-1 h-px bg-[oklch(1_0_0/5%)]" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[180px] h-[72px] rounded-xl shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!sources.length) return null;

  return (
    <div className="mb-5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Globe size={14} className="text-[oklch(0.65_0.18_230)]" />
        <span className="text-[0.8rem] font-medium text-[oklch(0.7_0.008_260)] uppercase tracking-wider">
          Sources
        </span>
        <span className="text-[0.72rem] text-[oklch(0.45_0.01_260)]">
          {sources.length}
        </span>
        <div className="flex-1 h-px bg-[oklch(1_0_0/5%)]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {displaySources.map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group/source flex items-start gap-2.5 
              bg-[oklch(0.17_0.005_260)] 
              border border-[oklch(1_0_0/6%)] 
              rounded-xl px-3 py-2.5 
              w-[calc(50%-0.25rem)] min-w-[170px]
              hover:border-[oklch(1_0_0/12%)] 
              hover:bg-[oklch(0.19_0.005_260)]
              transition-all duration-200
              no-underline
            "
          >
            <img
              src={getFaviconUrl(source.url)}
              alt=""
              className="w-4 h-4 mt-0.5 rounded-sm flex-shrink-0 opacity-70 group-hover/source:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[0.8rem] font-medium text-[oklch(0.88_0.005_260)] truncate leading-snug group-hover/source:text-[oklch(0.65_0.18_230)] transition-colors">
                {source.title}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[0.7rem] text-[oklch(0.45_0.01_260)] truncate">
                  {getDomain(source.url)}
                </span>
                <ExternalLink
                  size={10}
                  className="text-[oklch(0.4_0.01_260)] flex-shrink-0 opacity-0 group-hover/source:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </a>
        ))}
      </div>
      {sources.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[0.78rem] text-[oklch(0.65_0.18_230)] hover:text-[oklch(0.72_0.18_230)] transition-colors cursor-pointer bg-transparent border-none"
        >
          {expanded
            ? "Show fewer"
            : `View ${sources.length - 4} more source${sources.length - 4 > 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}
