import type { Id } from "@/convex/_generated/dataModel";
import type { ReactionCounts, ReactionType } from "@/lib/constants";

export interface User {
  _id: Id<"users">;
  name: string | null;
  image?: string | null;
}

export interface Participant {
  user: User;
}

export interface Message {
  _id: Id<"messages">;
  type: "text" | "system" | "image";
  body?: string;
  image?: string;
  sender: User | null;
  createdAt: number;
  reactionCounts?: ReactionCounts;
}

export interface Conversation {
  _id: Id<"conversations">;
  participants: (Participant | null)[];
  lastMessage?: { body?: string } | null;
  lastMessageAt?: number;
}

export type { ReactionType, ReactionCounts };
