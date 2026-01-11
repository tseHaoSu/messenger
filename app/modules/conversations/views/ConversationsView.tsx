"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ConversationList } from "@/app/modules/conversations/components/ConversationList";
import { ConversationListSkeleton } from "@/components/shimmer/ConversationListSkeleton";
import { useConversationPrefetch } from "@/app/modules/conversations/hooks/use-conversation-prefetch";
import { GrainOverlay } from "@/components/grain-overlay";

interface ConversationsViewProps {
  onNavigate?: () => void;
}

export const ConversationsView = ({ onNavigate }: ConversationsViewProps): React.ReactElement => {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string | undefined;
  const { prefetch } = useConversationPrefetch();

  const conversations = useQuery(api.private.conversations.getMany, {
    paginationOpts: { numItems: 10, cursor: null },
  });
  const removeConversation = useMutation(api.private.conversations.remove);

  const handleRemove = async (id: Id<"conversations">) => {
    if (conversationId === id) {
      router.push("/conversations");
    }
    await removeConversation({ conversationId: id });
  };

  if (conversations === undefined) {
    return (
      <div className="relative h-full">
        <GrainOverlay />
        <ConversationListSkeleton />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <GrainOverlay />
      <ConversationList
        conversations={conversations.page}
        selectedConversationId={conversationId}
        onRemoveConversation={handleRemove}
        onHoverConversation={prefetch}
        onSelectConversation={onNavigate}
      />
    </div>
  );
};
