import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";
import { cn, getAvatarUrl } from "@/lib/utils";
import type { User } from "../../../types";

interface UserSelectItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: Id<"users">) => void;
}

export const UserSelectItem = ({
  user,
  isSelected,
  onToggle,
}: UserSelectItemProps): React.ReactElement => (
  <button
    type="button"
    onClick={() => onToggle(user._id)}
    className={cn(
      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
      isSelected
        ? "bg-primary/10 ring-1 ring-primary/20"
        : "hover:bg-muted/50"
    )}
  >
    <Image
      src={getAvatarUrl(user.name, user.image)}
      alt={user.name ?? ""}
      width={40}
      height={40}
      className={cn(
        "h-10 w-10 rounded-full object-cover ring-2 transition-all duration-200",
        isSelected ? "ring-primary" : "ring-transparent group-hover:ring-border"
      )}
    />
    <div className="flex-1 text-left">
      <p className="truncate text-sm font-medium">{user.name}</p>
      <p className="truncate text-xs text-muted-foreground">Click to select</p>
    </div>
  </button>
);
