import { useAuth } from "@/hooks/useAuth";
import type { Conversation } from "@/lib/api";
import { Plus, MessageSquare, LogOut, Search } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  collapsed,
  onToggle,
}: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30
        bg-[oklch(0.11_0.004_260)]
        border-r border-[oklch(1_0_0/5%)]
        flex flex-col
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-[260px]"}
      `}
    >


      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[1.1rem] font-bold text-[oklch(0.95_0.005_260)] tracking-tight">
            Vestra AI
          </span>
        </div>
      </div>

      {/* New thread button */}
      <div className="px-3 py-2">
        <button
          onClick={onNewConversation}
          className="
            w-full flex items-center gap-2 px-3 py-2.5
            bg-[oklch(1_0_0/5%)] 
            border border-[oklch(1_0_0/8%)]
            rounded-xl
            text-[0.82rem] text-[oklch(0.75_0.008_260)]
            hover:bg-[oklch(1_0_0/8%)] hover:text-[oklch(0.9_0.005_260)]
            transition-all duration-200
            cursor-pointer
          "
        >
          <Plus size={15} />
          <span>New Thread</span>
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {conversations.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-[0.78rem] text-[oklch(0.4_0.01_260)]">
              No threads yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 
                  rounded-lg text-left
                  text-[0.82rem] truncate
                  transition-all duration-150
                  cursor-pointer border-none
                  ${
                    activeConversationId === conv.id
                      ? "bg-[oklch(1_0_0/8%)] text-[oklch(0.92_0.005_260)]"
                      : "bg-transparent text-[oklch(0.6_0.008_260)] hover:bg-[oklch(1_0_0/4%)] hover:text-[oklch(0.82_0.005_260)]"
                  }
                `}
              >
                <MessageSquare
                  size={14}
                  className={`flex-shrink-0 ${
                    activeConversationId === conv.id
                      ? "text-[oklch(0.65_0.18_230)]"
                      : "text-[oklch(0.4_0.01_260)]"
                  }`}
                />
                <span className="truncate">
                  {conv.title || "Untitled"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-[oklch(1_0_0/5%)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.65_0.18_230/60%)] to-[oklch(0.55_0.22_300/60%)] flex items-center justify-center text-[0.75rem] font-semibold text-white flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.78rem] text-[oklch(0.8_0.005_260)] truncate">
              {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[0.68rem] text-[oklch(0.42_0.01_260)] truncate">
              {user?.email || ""}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-md hover:bg-[oklch(1_0_0/6%)] text-[oklch(0.45_0.01_260)] hover:text-[oklch(0.7_0.008_260)] transition-colors cursor-pointer bg-transparent border-none"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
