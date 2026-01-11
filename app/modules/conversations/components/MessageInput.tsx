import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessageDraft } from "@/app/modules/conversations/hooks/use-message-draft";

interface MessageInputProps {
  conversationId: string | null;
  disabled: boolean;
  onSend: (body: string) => void;
}

export const MessageInput = ({ conversationId, disabled, onSend }: MessageInputProps): React.ReactElement => {
  const { drafts, setDraft } = useMessageDraft();
  const draft = conversationId ? drafts[conversationId] ?? "" : "";

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
        onChange={(e) => conversationId && setDraft(conversationId, e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
      />
      <Button data-testid="send-button" onClick={handleSend} disabled={disabled || !draft.trim()}>
        Send
      </Button>
    </div>
  );
};
