import { useAuth } from "@/hooks/useAuth";
import type { Conversation } from "@/lib/api";
import { Plus, MessageSquare, LogOut, Search, Library, Compass } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  collapsed: boolean;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  collapsed,
}: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30
        bg-[oklch(0.12_0.002_260)]
        border-r border-[oklch(1_0_0/5%)]
        flex flex-col
        transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]
        ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-[240px]"}
      `}
    >
      {/* Header / Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-6">
        <span className="text-[1.1rem] font-bold text-[oklch(0.98_0_0)] tracking-tight">
          Astra
        </span>
      </div>

      {/* Primary Actions */}
      <div className="px-3 mb-6">
        <button
          onClick={onNewConversation}
          className="
            w-full flex items-center justify-between px-4 py-2.5
            bg-transparent
            border border-[oklch(1_0_0/8%)]
            rounded-full
            text-[0.85rem] font-medium text-[oklch(0.8_0.005_260)]
            hover:bg-[oklch(1_0_0/5%)] hover:text-[oklch(0.98_0_0)]
            hover:border-[oklch(1_0_0/15%)]
            transition-all duration-200
            cursor-pointer group
          "
        >
          <div className="flex items-center gap-2.5">
            <span>New Thread</span>
          </div>
          <div className="w-5 h-5 rounded-md border border-[oklch(1_0_0/10%)] flex items-center justify-center text-[0.65rem] text-[oklch(0.4_0.01_260)] group-hover:border-[oklch(1_0_0/20%)] transition-colors">
            Ctrl K
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="px-3 mb-4 space-y-1">
         <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[0.88rem] text-[oklch(0.6_0.01_260)] hover:bg-[oklch(1_0_0/5%)] hover:text-[oklch(0.9_0.005_260)] transition-all cursor-pointer border-none bg-transparent">
            <Compass size={18} />
            <span>Discover</span>
         </button>
         <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[0.88rem] text-[oklch(0.6_0.01_260)] hover:bg-[oklch(1_0_0/5%)] hover:text-[oklch(0.9_0.005_260)] transition-all cursor-pointer border-none bg-transparent">
            <Library size={18} />
            <span>Library</span>
         </button>
      </div>

      <div className="px-5 mb-2">
         <span className="text-[0.7rem] font-bold text-[oklch(0.4_0.01_260)] uppercase tracking-widest">Recent Threads</span>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-hide">
        {conversations.length === 0 ? (
          <div className="px-3 py-6 text-left">
            <p className="text-[0.8rem] text-[oklch(0.35_0.01_260)] italic">
              No threads yet...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 
                  rounded-lg text-left
                  text-[0.85rem] truncate
                  transition-all duration-200
                  cursor-pointer border-none
                  ${
                    activeConversationId === conv.id
                      ? "bg-[oklch(1_0_0/6%)] text-[oklch(0.98_0_0)] font-medium"
                      : "bg-transparent text-[oklch(0.55_0.01_260)] hover:bg-[oklch(1_0_0/4%)] hover:text-[oklch(0.85_0.005_260)]"
                  }
                `}
              >
                <span className="truncate flex-1">
                  {conv.title || "Untitled"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-[oklch(1_0_0/5%)] mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[oklch(0.2_0.005_260)] border border-[oklch(1_0_0/10%)] flex items-center justify-center text-[0.75rem] font-bold text-[oklch(0.8_0.005_260)] flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.8rem] font-medium text-[oklch(0.9_0.005_260)] truncate">
              {user?.user_metadata?.name || user?.email?.split("@")[0] || "User"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-lg hover:bg-[oklch(1_0_0/6%)] text-[oklch(0.4_0.01_260)] hover:text-[oklch(0.7_0.005_260)] transition-colors cursor-pointer bg-transparent border-none"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

