import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { fetchConversations,createConversation,sendQuery,type Conversation } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import HomeView from "@/components/HomeView";
import ThreadView, { type MessageBlock } from "@/components/ThreadView";
import { PanelLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user, loading, getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageBlock[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const loadConversations = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const convos = await fetchConversations(token);
      setConversations(convos);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, [getAccessToken]);

  // Load conversations on mount
  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user, loadConversations]);

  function handleNewConversation() {
    setActiveConversationId(null);
    setMessages([]);
  }

  function handleSelectConversation(id: string) {
    setActiveConversationId(id);
    // TODO: Load existing messages for this conversation
    setMessages([]);
  }

  const handleSearch = useCallback(
    async (query: string) => {
      if (isQuerying) return;

      const token = await getAccessToken();
      if (!token) {
        navigate("/auth");
        return;
      }

      setIsQuerying(true);

      let conversationId = activeConversationId;

      // Create a new conversation if we don't have one
      if (!conversationId) {
        try {
          const title = query.length > 60 ? query.substring(0, 57) + "..." : query;
          const conv = await createConversation(token, title);
          conversationId = conv.id;
          setActiveConversationId(conv.id);
          setConversations((prev) => [conv, ...prev]);
        } catch (err) {
          console.error("Failed to create conversation:", err);
          setIsQuerying(false);
          return;
        }
      }

      const msgId = Date.now().toString();

      // Add message block
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          query,
          streamedText: "",
          finalAnswer: "",
          sources: [],
          followUpQuestions: [],
          isStreaming: true,
          isSearching: true,
        },
      ]);

      // Send the query and stream response
      await sendQuery(
        token,
        conversationId,
        query,
        // onChunk: Update streamed text (and mark searching as done once we get content)
        (text) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? { ...m, streamedText: text, isSearching: false }
                : m
            )
          );
        },
        // onComplete: Final answer with sources and follow-ups
        (result) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? {
                    ...m,
                    finalAnswer: result.answer,
                    sources: result.sources,
                    followUpQuestions: result.followUpQuestions,
                    isStreaming: false,
                    isSearching: false,
                    streamedText: "",
                  }
                : m
            )
          );
          setIsQuerying(false);
        },
        // onError
        (error) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? {
                    ...m,
                    error: error.message,
                    isStreaming: false,
                    isSearching: false,
                  }
                : m
            )
          );
          setIsQuerying(false);
        }
      );
    },
    [activeConversationId, isQuerying, getAccessToken, navigate]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-[oklch(0.65_0.18_230)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const hasActiveThread = messages.length > 0;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        collapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen flex flex-col transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]
          ${sidebarCollapsed ? "ml-0" : "ml-[240px]"}
        `}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 h-[56px] bg-background/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[oklch(1_0_0/5%)] text-[oklch(0.4_0.01_260)] hover:text-[oklch(0.8_0.005_260)] transition-all cursor-pointer bg-transparent border-none"
            title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            <PanelLeft size={18} />
          </button>
          
          {hasActiveThread && (
            <div className="flex items-center gap-2 overflow-hidden">
               <ChevronRight size={14} className="text-[oklch(0.3_0.01_260)] flex-shrink-0" />
               <span className="text-[0.85rem] font-medium text-[oklch(0.6_0.01_260)] truncate">
                 {conversations.find((c) => c.id === activeConversationId)?.title || "Current Thread"}
               </span>
            </div>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {hasActiveThread ? (
            <ThreadView
              messages={messages}
              onSearch={handleSearch}
              disabled={isQuerying}
            />
          ) : (
            <HomeView onSearch={handleSearch} disabled={isQuerying} />
          )}
        </div>
      </main>
    </div>
  );
}