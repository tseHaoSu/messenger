"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface TypingIndicatorProps {
  conversationId: Id<"conversations"> | null;
}

export const TypingIndicator = ({ conversationId }: TypingIndicatorProps): React.ReactElement | null => {
  const typingUsers = useQuery(
    api.private.typing.getTyping,
    conversationId ? { conversationId } : "skip"
  );

  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((u) => u?.name ?? "Someone").join(", ");
  const text = typingUsers.length === 1 ? `${names} is typing` : `${names} are typing`;

  return (
    <div className="px-4 py-2 text-xs text-muted-foreground">
      <span>{text}</span>
      <span className="inline-flex ml-1">
        <span className="animate-bounce [animation-delay:-0.3s]">.</span>
        <span className="animate-bounce [animation-delay:-0.15s]">.</span>
        <span className="animate-bounce">.</span>
      </span>
    </div>
  );
};
