"use client";

import { useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import type { Id } from "@/convex/_generated/dataModel";

const DEBOUNCE_MS = 300;
const STOP_TYPING_MS = 3000;

export const useTypingIndicator = (conversationId: Id<"conversations"> | null) => {
  const setTyping = useMutation(api.private.typing.setTyping);
  const clearTyping = useMutation(api.private.typing.clearTyping);

  const debouncedSetTyping = useDebouncedCallback(() => {
    if (conversationId) setTyping({ conversationId });
  }, DEBOUNCE_MS);

  const debouncedClearTyping = useDebouncedCallback(() => {
    if (conversationId) clearTyping({ conversationId });
  }, STOP_TYPING_MS);

  const handleTyping = useCallback(() => {
    if (!conversationId) return;
    debouncedSetTyping();
    debouncedClearTyping();
  }, [conversationId, debouncedSetTyping, debouncedClearTyping]);

  const stopTyping = useCallback(() => {
    if (!conversationId) return;
    clearTyping({ conversationId });
  }, [conversationId, clearTyping]);

  // Cleanup on conversation change
  useEffect(() => {
    return () => {
      if (conversationId) clearTyping({ conversationId });
    };
  }, [conversationId, clearTyping]);

  return { handleTyping, stopTyping };
};
