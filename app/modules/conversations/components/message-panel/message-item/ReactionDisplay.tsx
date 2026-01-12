import { REACTION_EMOJI, type ReactionCounts, type ReactionType } from "@/lib/constants";

interface ReactionDisplayProps {
  counts?: ReactionCounts;
}

export const ReactionDisplay = ({ counts }: ReactionDisplayProps): React.ReactElement | null => {
  if (!counts) return null;

  const reactions = (Object.entries(counts) as [ReactionType, number][])
    .filter(([, count]) => count > 0);

  if (reactions.length === 0) return null;

  const totalCount = reactions.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="flex items-center rounded-full bg-background px-0.5 shadow-sm ring-1 ring-border/20">
      <div className="flex items-center">
        {reactions.map(([type], index) => (
          <span
            key={type}
            className={index > 0 ? "-ml-0.5" : ""}
            style={{ fontSize: "11px" }}
          >
            {REACTION_EMOJI[type]}
          </span>
        ))}
      </div>
      {totalCount > 1 && (
        <span className="ml-0.5 text-[10px] font-bold text-muted-foreground">{totalCount}</span>
      )}
    </div>
  );
};
