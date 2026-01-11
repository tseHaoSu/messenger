import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";
import type { OptimisticMessage } from "@/app/modules/conversations/hooks/use-optimistic-messages";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";

interface MessageSender {
  _id: Id<"users">;
  name: string | null;
  image?: string | null;
}

interface Message {
  _id: Id<"messages">;
  type: "text" | "system" | "image";
  body?: string;
  image?: string;
  sender: MessageSender | null;
}

interface ConversationParticipant {
  user: {
    _id: Id<"users">;
    name: string | null;
    image?: string | null;
  };
}

interface CurrentUser {
  name: string | null;
  image?: string | null;
}

interface MessageListProps {
  messages: Message[];
  optimisticMessages: OptimisticMessage[];
  participants: (ConversationParticipant | null)[];
  hasSelectedConversation: boolean;
  onSendMessage: (body: string) => void;
  conversationId: string | null;
  currentUser?: CurrentUser | null;
}

const getAvatarUrl = (user?: CurrentUser | null): string =>
  user?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name ?? "user"}`;

export const MessageList = ({
  messages,
  optimisticMessages,
  participants,
  hasSelectedConversation,
  onSendMessage,
  conversationId,
  currentUser,
}: MessageListProps): React.ReactElement => {
  const validParticipants = participants.filter(
    (participant): participant is ConversationParticipant => Boolean(participant)
  );
  const participantNames = validParticipants.map((participant) => participant.user.name).join(", ");

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border/50 px-4 py-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {participantNames || "Messages"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {messages.length + optimisticMessages.length} messages
        </p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageItem
            key={message._id}
            id={message._id}
            type={message.type}
            body={message.body}
            image={message.image}
            sender={message.sender}
          />
        ))}
        {optimisticMessages.map((message) => (
          <div key={message.id} className="flex items-start gap-3 opacity-70">
            <Image
              src={getAvatarUrl(currentUser)}
              alt={currentUser?.name ?? "You"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <span className="text-xs font-medium">{currentUser?.name ?? "You"}</span>
              <p className="text-sm">{message.body}</p>
              <span className="text-xs text-muted-foreground">
                {message.status === "pending" ? "Sending..." : "Failed to send"}
              </span>
            </div>
          </div>
        ))}
        {!hasSelectedConversation && (
          <p className="text-sm text-muted-foreground">Select a conversation</p>
        )}
      </div>
      <MessageInput
        conversationId={conversationId}
        disabled={!hasSelectedConversation}
        onSend={onSendMessage}
      />
    </div>
  );
};
