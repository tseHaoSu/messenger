import { create } from "zustand";

interface MessageDraftState {
  drafts: Record<string, string>;
  setDraft: (conversationId: string, text: string) => void;
  getDraft: (conversationId: string) => string;
  clearDraft: (conversationId: string) => void;
}

export const useMessageDraft = create<MessageDraftState>((set, get) => ({
  drafts: {},

  setDraft: (conversationId, text) =>
    set((state) => ({ drafts: { ...state.drafts, [conversationId]: text } })),

  getDraft: (conversationId) => get().drafts[conversationId] ?? "",

  clearDraft: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.drafts;
      return { drafts: rest };
    }),
}));
