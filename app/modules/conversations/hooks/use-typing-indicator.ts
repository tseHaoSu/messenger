"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const DEBOUNCE_MS = 300;
const STOP_TYPING_MS = 3000;

export const useTypingIndicator = (conversationId: Id<"conversations"> | null) => {
  const setTyping = useMutation(api.private.typing.setTyping);
  const clearTyping = useMutation(api.private.typing.clearTyping);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const stopTypingRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback(() => {
    if (!conversationId) return;

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the setTyping call
    debounceRef.current = setTimeout(() => {
      setTyping({ conversationId });
    }, DEBOUNCE_MS);

    // Reset stop typing timer
    if (stopTypingRef.current) {
      clearTimeout(stopTypingRef.current);
    }

    stopTypingRef.current = setTimeout(() => {
      clearTyping({ conversationId });
    }, STOP_TYPING_MS);
  }, [conversationId, setTyping, clearTyping]);

  const stopTyping = useCallback(() => {
    if (!conversationId) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (stopTypingRef.current) {
      clearTimeout(stopTypingRef.current);
    }

    clearTyping({ conversationId });
  }, [conversationId, clearTyping]);

  // Cleanup on unmount or conversation change
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (stopTypingRef.current) clearTimeout(stopTypingRef.current);
      if (conversationId) {
        clearTyping({ conversationId });
      }
    };
  }, [conversationId, clearTyping]);

  return { handleTyping, stopTyping };
};
