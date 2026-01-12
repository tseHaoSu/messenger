"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Plus } from "lucide-react";

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

import { UserSelectItem } from "./UserSelectItem";
import { EmptyState } from "./EmptyState";

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
