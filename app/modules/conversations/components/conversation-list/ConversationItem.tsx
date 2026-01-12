import Link from "next/link";
import { Trash2 } from "lucide-react";

import { cn, formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";
import type { Participant } from "../../types";
import { Avatar } from "../Avatar";

interface ConversationItemProps {
  id: Id<"conversations">;
  participants: (Participant | null)[];
  lastMessageBody?: string;
  lastMessageAt?: number;
  isSelected: boolean;
  onRemove: (id: Id<"conversations">) => void;
  onHover?: (id: Id<"conversations">) => void;
  onSelect?: () => void;
}

export const ConversationItem = ({
  id,
  participants,
  lastMessageBody,
  lastMessageAt,
  isSelected,
  onRemove,
  onHover,
  onSelect,
}: ConversationItemProps): React.ReactElement => {
  const validParticipants = participants.filter((p): p is Participant => Boolean(p));
  const isLargeGroup = validParticipants.length >= 4;

  const handleRemove = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <Link
      href={`/conversations/${id}`}
      data-testid="conversation-item"
      className={cn(
        "group flex items-center gap-2 overflow-hidden rounded-lg px-2 py-2.5 transition-all duration-200 hover:bg-accent/50",
        isSelected && "bg-accent shadow-sm"
      )}
      onMouseEnter={() => onHover?.(id)}
      onClick={onSelect}
    >
      <div className={cn("relative flex shrink-0", isLargeGroup ? "-space-x-4" : "-space-x-2")}>
        {validParticipants.slice(0, 4).map((p, i) => (
          <Avatar
            key={p.user._id}
            name={p.user.name}
            image={p.user.image}
            size={isLargeGroup ? "sm" : "md"}
            className="border-2 border-card"
            style={{ zIndex: 4 - i }}
          />
        ))}
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium">
            {validParticipants.map((p) => p.user.name).join(", ")}
          </p>
          {lastMessageAt && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatTimestamp(lastMessageAt)}
            </span>
          )}
        </div>
        {lastMessageBody && (
          <p className="truncate text-xs text-muted-foreground">{lastMessageBody}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="hidden h-8 w-8 shrink-0 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 sm:flex"
        onClick={handleRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Link>
  );
};
