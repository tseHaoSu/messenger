import { useCallback, useRef } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface UseConversationPrefetchReturn {
  prefetch: (conversationId: Id<"conversations">) => void;
  clearCache: () => void;
}

export const useConversationPrefetch = (): UseConversationPrefetchReturn => {
  const convex = useConvex();
  const prefetchedIds = useRef<Set<string>>(new Set());

  const prefetch = useCallback(
    (conversationId: Id<"conversations">) => {
      if (prefetchedIds.current.has(conversationId)) return;

      prefetchedIds.current.add(conversationId);
      convex.query(api.private.conversations.getOne, { conversationId });
      convex.query(api.private.messages.getMany, {
        conversationId,
        paginationOpts: { numItems: 50, cursor: null },
      });
    },
    [convex]
  );

  const clearCache = useCallback(() => {
    prefetchedIds.current.clear();
  }, []);

  return { prefetch, clearCache };
};
