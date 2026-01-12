"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MessageList } from "@/app/modules/conversations/components/message-panel/MessageList";
import { MessageListSkeleton } from "@/components/shimmer/MessageListSkeleton";
import { GrainOverlay } from "@/components/grain-overlay";
import { useOptimisticMessages, MAX_RETRIES } from "@/app/modules/conversations/hooks/use-optimistic-messages";
import { useMessageDraft } from "@/app/modules/conversations/hooks/use-message-draft";
import { useTypingIndicator } from "@/app/modules/conversations/hooks/use-typing-indicator";

interface ConversationViewProps {
  conversationId: string;
}

export const ConversationView = ({ conversationId }: ConversationViewProps): React.ReactElement => {
  const id = conversationId as Id<"conversations">;

  const { add, markFailed, incrementRetry, remove, getByConversation, getRetryCount } = useOptimisticMessages();
  const { clearDraft } = useMessageDraft();
  const { handleTyping, stopTyping } = useTypingIndicator(id);

  const currentUser = useQuery(api.users.current);
  const conversation = useQuery(api.private.conversations.getOne, { conversationId: id });
  const messages = useQuery(
    api.private.messages.getMany,
    conversation ? { conversationId: id, paginationOpts: { numItems: 50, cursor: null } } : "skip"
  );
  const sendMessage = useMutation(api.private.messages.create);
  const toggleReaction = useMutation(api.private.messages.toggleReaction);

  if (conversation === undefined || messages === undefined) {
    return (
      <div className="relative h-full">
        <GrainOverlay />
        <MessageListSkeleton />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="relative flex h-full items-center justify-center bg-card">
        <GrainOverlay />
        <p className="text-sm text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const handleSendMessage = (body: string) => {
    const optimisticId = add({ conversationId, body, type: "text" });
    clearDraft(conversationId);
    stopTyping();

    const attemptSend = async () => {
      try {
        await sendMessage({ conversationId: id, type: "text", body });
        remove(optimisticId);
      } catch {
        if (getRetryCount(optimisticId) < MAX_RETRIES) {
          incrementRetry(optimisticId);
          setTimeout(attemptSend, 1000);
        } else {
          markFailed(optimisticId);
        }
      }
    };

    attemptSend();
  };

  const handleSendImage = async (imageUrl: string) => {
    try {
      await sendMessage({ conversationId: id, type: "image", image: imageUrl });
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  const handleReact = (messageId: Id<"messages">, type: "like" | "love" | "laugh") => {
    toggleReaction({ messageId, type });
  };

  return (
    <div className="relative h-full">
      <GrainOverlay />
      <MessageList
        messages={messages.page}
        optimisticMessages={getByConversation(conversationId)}
        participants={conversation.participants}
        hasSelectedConversation={true}
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onTyping={handleTyping}
        onReact={handleReact}
        conversationId={conversationId}
        currentUser={currentUser}
      />
    </div>
  );
};
