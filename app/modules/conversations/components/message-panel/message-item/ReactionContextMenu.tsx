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
    <ContextMenuContent>
      {(Object.entries(REACTION_EMOJI) as [ReactionType, string][]).map(([type, emoji]) => (
        <ContextMenuItem key={type} onClick={() => onReact(type)}>
          {emoji} {type.charAt(0).toUpperCase() + type.slice(1)}
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
  </ContextMenu>
);
