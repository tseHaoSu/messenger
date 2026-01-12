export const REACTION_EMOJI = {
  like: "👍",
  love: "❤️",
  laugh: "😂",
} as const;

export type ReactionType = keyof typeof REACTION_EMOJI;

export interface ReactionCounts {
  like: number;
  love: number;
  laugh: number;
}

export const TIMESTAMP_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_RETRIES = 3;
