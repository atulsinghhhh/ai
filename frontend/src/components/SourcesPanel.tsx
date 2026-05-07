import type { Source } from "@/lib/api";
import { Globe, Layers } from "lucide-react";
import { useState } from "react";

interface SourcesPanelProps {
  sources: Source[];
  loading?: boolean;
}

function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
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
      <div className="mb-8 animate-reveal">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} className="text-[oklch(0.5_0.01_260)]" />
          <span className="text-[0.8rem] font-bold text-[oklch(0.5_0.01_260)] uppercase tracking-widest">
            Sources
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[64px] rounded-xl shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!sources.length) return null;

  return (
    <div className="mb-8 animate-reveal">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={16} className="text-[oklch(0.5_0.01_260)]" />
        <span className="text-[0.8rem] font-bold text-[oklch(0.5_0.01_260)] uppercase tracking-widest">
          Sources
        </span>
        <span className="text-[0.7rem] font-medium px-1.5 py-0.5 rounded bg-[oklch(1_0_0/5%)] text-[oklch(0.4_0.01_260)] ml-1">
          {sources.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displaySources.map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group/source flex flex-col justify-between p-3
              bg-[oklch(0.15_0.005_260)] 
              border border-[oklch(1_0_0/6%)] 
              rounded-xl
              hover:border-[oklch(1_0_0/15%)] 
              hover:bg-[oklch(0.17_0.005_260)]
              hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
              transition-all duration-300
              no-underline min-h-[70px]
            "
          >
            <div className="text-[0.82rem] font-medium text-[oklch(0.85_0.005_260)] line-clamp-2 leading-tight group-hover/source:text-[oklch(0.98_0_0)] transition-colors mb-2">
              {source.title}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <img
                src={getFaviconUrl(source.url)}
                alt=""
                className="w-3.5 h-3.5 rounded-sm flex-shrink-0 grayscale group-hover/source:grayscale-0 transition-all opacity-60 group-hover/source:opacity-100"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${getDomain(source.url)}&background=random`;
                }}
              />
              <span className="text-[0.7rem] text-[oklch(0.4_0.01_260)] truncate font-medium">
                {getDomain(source.url)}
              </span>
              <span className="text-[0.65rem] text-[oklch(0.3_0.01_260)] font-bold ml-auto opacity-0 group-hover/source:opacity-100 transition-opacity">
                {idx + 1}
              </span>
            </div>
          </a>
        ))}

        {!expanded && sources.length > 4 && (
          <button
            onClick={() => setExpanded(true)}
            className="
              flex flex-col items-center justify-center p-3
              bg-[oklch(0.15_0.005_260)] 
              border border-dashed border-[oklch(1_0_0/10%)] 
              rounded-xl text-[0.8rem] font-medium text-[oklch(0.5_0.01_260)]
              hover:border-[oklch(1_0_0/20%)] hover:bg-[oklch(0.17_0.005_260)] hover:text-[oklch(0.7_0.005_260)]
              transition-all duration-300 cursor-pointer
            "
          >
             <span>+ {sources.length - 4} more</span>
          </button>
        )}
      </div>
      
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-3 text-[0.78rem] font-medium text-[oklch(0.65_0.18_230)] hover:text-[oklch(0.72_0.18_230)] transition-colors cursor-pointer bg-transparent border-none"
        >
          Show fewer
        </button>
      )}
    </div>
  );
}

