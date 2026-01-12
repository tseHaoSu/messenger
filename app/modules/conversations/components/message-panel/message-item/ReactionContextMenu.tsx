import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { REACTION_EMOJI, type ReactionType } from "@/lib/constants";

interface ReactionContextMenuProps {
  children: React.ReactNode;
  onReact: (type: ReactionType) => void;
}

export const ReactionContextMenu = ({
  children,
  onReact,
}: ReactionContextMenuProps): React.ReactElement => (
  <ContextMenu>
    <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
    <ContextMenuContent className="min-w-0 rounded-full border-border/50 bg-background/95 p-1 backdrop-blur-sm">
      <div className="flex items-center gap-0.5">
        {(Object.entries(REACTION_EMOJI) as [ReactionType, string][]).map(([type, emoji]) => (
          <ContextMenuItem
            key={type}
            onClick={() => onReact(type)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 text-lg hover:bg-muted focus:bg-muted"
          >
            {emoji}
          </ContextMenuItem>
        ))}
      </div>
    </ContextMenuContent>
  </ContextMenu>
);
