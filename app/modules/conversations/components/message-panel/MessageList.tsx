"use client";

import { useEffect, useRef } from "react";

import type { Id } from "@/convex/_generated/dataModel";
import type { OptimisticMessage } from "@/app/modules/conversations/hooks/use-optimistic-messages";
import { TIMESTAMP_THRESHOLD_MS } from "@/lib/constants";
import type { Message, Participant, User, ReactionType } from "../../types";
import { MessageItem } from "./message-item/MessageItem";
import { MessageBubble } from "./message-item/MessageBubble";
import { MessageInput } from "./message-input/MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { TimestampDivider } from "./TimestampDivider";

const shouldShowTimestamp = (currentTime: number, previousTime?: number): boolean => {
  if (!previousTime) return true;
  return currentTime - previousTime >= TIMESTAMP_THRESHOLD_MS;
};

interface MessageListProps {
  messages: Message[];
  optimisticMessages: OptimisticMessage[];
  participants: (Participant | null)[];
  hasSelectedConversation: boolean;
  onSendMessage: (body: string) => void;
  onSendImage: (imageUrl: string) => void;
  onTyping?: () => void;
  onReact?: (messageId: Id<"messages">, type: ReactionType) => void;
  conversationId: string | null;
  currentUser?: User | null;
}

export const MessageList = ({
  messages,
  optimisticMessages,
  participants,
  hasSelectedConversation,
  onSendMessage,
  onSendImage,
  onTyping,
  onReact,
  conversationId,
  currentUser,
}: MessageListProps): React.ReactElement => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const validParticipants = participants.filter((p): p is Participant => Boolean(p));
  const participantNames = validParticipants.map((p) => p.user.name).join(", ");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, optimisticMessages.length]);

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
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const showTimestamp = shouldShowTimestamp(
            message.createdAt,
            previousMessage?.createdAt
          );

          return (
            <div key={message._id}>
              {showTimestamp && <TimestampDivider timestamp={message.createdAt} />}
              <MessageItem
                id={message._id}
                type={message.type}
                body={message.body}
                image={message.image}
                sender={message.sender}
                currentUserId={currentUser?._id}
                reactionCounts={message.reactionCounts}
                onReact={onReact}
              />
            </div>
          );
        })}
        {optimisticMessages.map((message) => (
          <div key={message.id} className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[70%]">
              <MessageBubble
                type="text"
                body={message.body}
                isCurrentUser
                isOptimistic
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {message.status === "pending" ? "Sending..." : "Failed to send"}
              </p>
            </div>
          </div>
        ))}
        {!hasSelectedConversation && (
          <p className="text-sm text-muted-foreground">Select a conversation</p>
        )}
        <div ref={bottomRef} />
      </div>
      <TypingIndicator conversationId={conversationId as Id<"conversations"> | null} />
      <MessageInput
        conversationId={conversationId}
        disabled={!hasSelectedConversation}
        onSend={onSendMessage}
        onSendImage={onSendImage}
        onTyping={onTyping}
      />
    </div>
  );
};
