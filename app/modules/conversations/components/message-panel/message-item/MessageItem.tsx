import type { Id } from "@/convex/_generated/dataModel";
import type { User, ReactionCounts, ReactionType } from "../../../types";
import { Avatar } from "../../Avatar";
import { ReactionDisplay } from "./ReactionDisplay";
import { MessageBubble } from "./MessageBubble";
import { ReactionContextMenu } from "./ReactionContextMenu";

interface MessageItemProps {
  id: Id<"messages">;
  type: "text" | "system" | "image";
  body?: string;
  image?: string;
  sender: User | null;
  currentUserId?: Id<"users">;
  reactionCounts?: ReactionCounts;
  onReact?: (messageId: Id<"messages">, type: ReactionType) => void;
}

const hasActiveReactions = (counts?: ReactionCounts): boolean =>
  Boolean(counts && Object.values(counts).some((c) => c > 0));

export const MessageItem = ({
  id,
  type,
  body,
  image,
  sender,
  currentUserId,
  reactionCounts,
  onReact,
}: MessageItemProps): React.ReactElement => {
  if (type === "system") {
    return (
      <p className="py-2 text-center text-xs italic text-muted-foreground">{body}</p>
    );
  }

  const isCurrentUser = Boolean(currentUserId && sender?._id === currentUserId);
  const hasReactions = hasActiveReactions(reactionCounts);
  const handleReact = (reactionType: ReactionType) => onReact?.(id, reactionType);

  if (isCurrentUser) {
    return (
      <div className={hasReactions ? "mb-3" : ""}>
        <div className="flex justify-end">
          <ReactionContextMenu onReact={handleReact}>
            <div className="relative max-w-[70%] cursor-pointer">
              <MessageBubble type={type} body={body} image={image} isCurrentUser />
              {hasReactions && (
                <div className="absolute -bottom-3 right-2">
                  <ReactionDisplay counts={reactionCounts} />
                </div>
              )}
            </div>
          </ReactionContextMenu>
        </div>
      </div>
    );
  }

  return (
    <div className={hasReactions ? "mb-3" : ""}>
      <div className="flex items-start gap-3">
        <Avatar
          name={sender?.name ?? null}
          image={sender?.image}
          size="sm"
          className="shrink-0"
        />
        <div className="max-w-[70%]">
          <span className="text-xs font-medium">{sender?.name}</span>
          <ReactionContextMenu onReact={handleReact}>
            <div className="relative cursor-pointer">
              <MessageBubble type={type} body={body} image={image} isCurrentUser={false} />
              {hasReactions && (
                <div className="absolute -bottom-3 right-2">
                  <ReactionDisplay counts={reactionCounts} />
                </div>
              )}
            </div>
          </ReactionContextMenu>
        </div>
      </div>
    </div>
  );
};
