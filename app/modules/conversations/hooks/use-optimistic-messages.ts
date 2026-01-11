import { create } from "zustand";

export const MAX_RETRIES = 2;

type MessageStatus = "pending" | "failed";

export interface OptimisticMessage {
  id: string;
  conversationId: string;
  body: string;
  type: "text" | "image";
  status: MessageStatus;
  retryCount: number;
  createdAt: number;
}

interface OptimisticMessagesState {
  messages: OptimisticMessage[];
  add: (msg: { conversationId: string; body: string; type: "text" | "image" }) => string;
  markFailed: (id: string) => void;
  incrementRetry: (id: string) => void;
  remove: (id: string) => void;
  getByConversation: (conversationId: string) => OptimisticMessage[];
  getRetryCount: (id: string) => number;
}

export const useOptimisticMessages = create<OptimisticMessagesState>((set, get) => ({
  messages: [],

  add: (msg) => {
    const id = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({
      messages: [...state.messages, { id, ...msg, status: "pending", retryCount: 0, createdAt: Date.now() }],
    }));
    return id;
  },

  markFailed: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, status: "failed" as const } : msg
      ),
    })),

  incrementRetry: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, retryCount: msg.retryCount + 1, status: "pending" as const } : msg
      ),
    })),

  remove: (id) =>
    set((state) => ({ messages: state.messages.filter((msg) => msg.id !== id) })),

  getByConversation: (conversationId) =>
    get().messages.filter((msg) => msg.conversationId === conversationId),

  getRetryCount: (id) => get().messages.find((msg) => msg.id === id)?.retryCount ?? 0,
}));
