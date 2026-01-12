"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessageDraft } from "@/app/modules/conversations/hooks/use-message-draft";
import { AttachmentDialog } from "./AttachmentDialog";

interface MessageInputProps {
  conversationId: string | null;
  disabled: boolean;
  onSend: (body: string) => void;
  onSendImage: (imageUrl: string) => void;
  onTyping?: () => void;
}

export const MessageInput = ({
  conversationId,
  disabled,
  onSend,
  onSendImage,
  onTyping,
}: MessageInputProps): React.ReactElement => {
  const { drafts, setDraft } = useMessageDraft();
  const draft = conversationId ? drafts[conversationId] ?? "" : "";
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft);
  };

  return (
    <div className="flex gap-2 border-t border-border/50 p-4">
      <Input
        data-testid="message-input"
        placeholder="Type a message..."
        value={draft}
        onChange={(e) => {
          if (conversationId) {
            setDraft(conversationId, e.target.value);
            onTyping?.();
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
      />
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={() => setAttachmentDialogOpen(true)}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button data-testid="send-button" onClick={handleSend} disabled={disabled || !draft.trim()}>
        Send
      </Button>
      <AttachmentDialog
        open={attachmentDialogOpen}
        onOpenChange={setAttachmentDialogOpen}
        onSendImage={onSendImage}
      />
    </div>
  );
};
