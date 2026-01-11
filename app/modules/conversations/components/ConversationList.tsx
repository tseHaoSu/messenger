import type { Id } from "@/convex/_generated/dataModel";
import { ConversationItem } from "./ConversationItem";
import { NewConversationDialog } from "./NewConversationDialog";

interface ConversationParticipant {
  user: {
    _id: Id<"users">;
    name: string | null;
    image?: string | null;
  };
}

interface Conversation {
  _id: Id<"conversations">;
  participants: (ConversationParticipant | null)[];
  lastMessage?: { body?: string } | null;
  lastMessageAt?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string | null;
  onRemoveConversation: (id: Id<"conversations">) => void;
  onHoverConversation?: (id: Id<"conversations">) => void;
  onSelectConversation?: () => void;
}

export const ConversationList = ({
  conversations,
  selectedConversationId,
  onRemoveConversation,
  onHoverConversation,
  onSelectConversation,
}: ConversationListProps): React.ReactElement => (
  <div className="flex h-full flex-col bg-card" data-testid="conversation-list">
    <div className="flex items-center justify-between border-b border-border/50 px-8 py-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Conversations</h2>
        <p className="text-xs text-muted-foreground">{conversations.length} chats</p>
      </div>
      <NewConversationDialog />
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-2">
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            id={conversation._id}
            participants={conversation.participants}
            lastMessageBody={conversation.lastMessage?.body}
            lastMessageAt={conversation.lastMessageAt}
            isSelected={selectedConversationId === conversation._id}
            onRemove={onRemoveConversation}
            onHover={onHoverConversation}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
      {conversations.length === 0 && (
        <p className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No conversations yet
        </p>
      )}
    </div>
  </div>
);
