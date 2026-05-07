import { useRef, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import SourcesPanel from "@/components/SourcesPanel";
import AnswerRenderer from "@/components/AnswerRenderer";
import FollowUpQuestions from "@/components/FollowUpQuestions";
import SearchingIndicator from "@/components/SearchingIndicator";
import type { Source } from "@/lib/api";
import { Sparkles, MessageSquare } from "lucide-react";

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
    <div className="flex flex-col h-full bg-background">
      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-10 pt-10 pb-40"
      >
        <div className="max-w-[800px] mx-auto">
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`mb-16 ${idx > 0 ? "pt-16 border-t border-[oklch(1_0_0/5%)]" : ""}`}>
              {/* User query */}
              <div className="flex items-start gap-4 mb-8">
                <h1 className="text-[1.8rem] sm:text-[2.2rem] font-semibold text-[oklch(0.98_0_0)] leading-tight tracking-tight">
                  {msg.query}
                </h1>
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
                <div className="animate-reveal">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="p-1 rounded-md bg-[oklch(0.65_0.18_230/10%)] text-[oklch(0.65_0.18_230)]">
                       <Sparkles size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[0.85rem] font-bold text-[oklch(0.98_0_0)] tracking-tight">
                      Vestra Answer
                    </span>
                  </div>
                  <AnswerRenderer
                    content={msg.finalAnswer || msg.streamedText}
                    isStreaming={msg.isStreaming}
                  />
                </div>
              )}

              {/* Error */}
              {msg.error && (
                <div className="mt-6 px-5 py-4 bg-[oklch(0.704_0.191_22/10%)] border border-[oklch(0.704_0.191_22/20%)] rounded-2xl text-[0.9rem] text-[oklch(0.75_0.12_22)] font-medium">
                  {msg.error}
                </div>
              )}

              {/* Follow-up questions */}
              {!msg.isStreaming && msg.followUpQuestions.length > 0 && (
                <div className="mt-10">
                   <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={14} className="text-[oklch(0.4_0.01_260)]" />
                      <span className="text-[0.8rem] font-bold text-[oklch(0.4_0.01_260)] uppercase tracking-widest">Related</span>
                   </div>
                  <FollowUpQuestions
                    questions={msg.followUpQuestions}
                    onSelect={onSearch}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom search bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-[840px] mx-auto px-4 pb-8 pt-12 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-auto">
            <SearchInput
              onSubmit={onSearch}
              disabled={disabled}
              compact
              placeholder="Ask a follow-up..."
            />
        </div>
      </div>
    </div>
  );
}

