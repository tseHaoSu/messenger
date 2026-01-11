"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Plus, Check } from "lucide-react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface User {
  _id: Id<"users">;
  name: string;
  image?: string;
}

interface UserSelectItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (userId: Id<"users">) => void;
}

const getAvatarUrl = (name?: string | null, image?: string | null): string =>
  image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name ?? "user"}`;

const UserSelectItem = ({
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
    <div className="relative">
      <Image
        src={getAvatarUrl(user.name, user.image)}
        alt={user.name}
        width={40}
        height={40}
        className={cn(
          "h-10 w-10 rounded-full object-cover ring-2 transition-all duration-200",
          isSelected ? "ring-primary" : "ring-transparent group-hover:ring-border"
        )}
      />
      {isSelected && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
    </div>
    <div className="flex-1 text-left">
      <p className="truncate text-sm font-medium">{user.name}</p>
      <p className="truncate text-xs text-muted-foreground">Click to select</p>
    </div>
  </button>
);

const EmptyState = (): React.ReactElement => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <Plus className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-muted-foreground">No users available</p>
    <p className="text-xs text-muted-foreground/70">Invite others to get started</p>
  </div>
);

export const NewConversationDialog = (): React.ReactElement => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);

  const users = useQuery(api.users.getAll);
  const currentUser = useQuery(api.users.current);
  const createConversation = useMutation(api.private.conversations.create);

  const otherUsers = users?.filter((u) => u._id !== currentUser?._id) ?? [];

  const toggleUser = (userId: Id<"users">): void => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async (): Promise<void> => {
    if (selectedUsers.length === 0) return;

    const conversationId = await createConversation({
      participantIds: selectedUsers,
    });

    setSelectedUsers([]);
    setOpen(false);
    router.push(`/conversations/${conversationId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/50 px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            New Conversation
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select people to start a conversation
          </p>
        </DialogHeader>
        <div className="max-h-72 space-y-1 overflow-y-auto px-4 py-3">
          {otherUsers.length > 0 ? (
            otherUsers.map((user) => (
              <UserSelectItem
                key={user._id}
                user={user}
                isSelected={selectedUsers.includes(user._id)}
                onToggle={toggleUser}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
        <div className="border-t border-border/50 bg-muted/30 px-6 py-4">
          <Button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0}
            className="w-full rounded-xl font-medium shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {selectedUsers.length > 0
              ? `Start Conversation (${selectedUsers.length})`
              : "Select users to continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
