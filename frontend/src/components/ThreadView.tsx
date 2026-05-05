import { useRef, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import SourcesPanel from "@/components/SourcesPanel";
import AnswerRenderer from "@/components/AnswerRenderer";
import FollowUpQuestions from "@/components/FollowUpQuestions";
import SearchingIndicator from "@/components/SearchingIndicator";
import type { Source } from "@/lib/api";
import { User as UserIcon, Sparkles } from "lucide-react";

export interface MessageBlock {
  id: string;
  query: string;
  streamedText: string;
  finalAnswer: string;
  sources: Source[];
  followUpQuestions: string[];
  isStreaming: boolean;
  isSearching: boolean;
  error?: string;
}

interface ThreadViewProps {
  messages: MessageBlock[];
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export default function ThreadView({
  messages,
  onSearch,
  disabled,
}: ThreadViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  const lastMessageText = messages[messages.length - 1]?.streamedText;
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, lastMessageText]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-32"
      >
        <div className="max-w-[740px] mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-10">
              {/* User query */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[oklch(0.65_0.18_230/50%)] to-[oklch(0.55_0.22_300/50%)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserIcon size={13} className="text-white/80" />
                </div>
                <h2 className="text-[1.15rem] font-semibold text-[oklch(0.94_0.005_260)] leading-snug pt-0.5">
                  {msg.query}
                </h2>
              </div>

              {/* Searching indicator */}
              {msg.isSearching && <SearchingIndicator />}

              {/* Sources */}
              {(msg.sources.length > 0 || (msg.isStreaming && !msg.isSearching)) && (
                <SourcesPanel
                  sources={msg.sources}
                  loading={msg.isStreaming && msg.sources.length === 0}
                />
              )}

              {/* Answer */}
              {(msg.streamedText || msg.finalAnswer) && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[oklch(0.65_0.18_230)]" />
                    <span className="text-[0.8rem] font-medium text-[oklch(0.7_0.008_260)] uppercase tracking-wider">
                      Answer
                    </span>
                    <div className="flex-1 h-px bg-[oklch(1_0_0/5%)]" />
                  </div>
                  <AnswerRenderer
                    content={msg.finalAnswer || msg.streamedText}
                    isStreaming={msg.isStreaming}
                  />
                </div>
              )}

              {/* Error */}
              {msg.error && (
                <div className="mt-4 px-4 py-3 bg-[oklch(0.704_0.191_22/8%)] border border-[oklch(0.704_0.191_22/20%)] rounded-xl text-[0.85rem] text-[oklch(0.75_0.12_22)]">
                  {msg.error}
                </div>
              )}

              {/* Follow-up questions */}
              {!msg.isStreaming && msg.followUpQuestions.length > 0 && (
                <FollowUpQuestions
                  questions={msg.followUpQuestions}
                  onSelect={onSearch}
                  disabled={disabled}
                />
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom search bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-[740px] mx-auto px-4 pb-4">
          <div className="relative">
            {/* Gradient fade */}
            <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-[oklch(0.13_0.004_260)] to-transparent pointer-events-none" />
            <SearchInput
              onSubmit={onSearch}
              disabled={disabled}
              compact
              placeholder="Ask a follow-up..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
