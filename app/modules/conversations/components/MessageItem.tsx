import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

interface MessageSender {
  _id: Id<"users">;
  name: string | null;
  image?: string | null;
}

interface MessageItemProps {
  id: Id<"messages">;
  type: "text" | "system" | "image";
  body?: string;
  image?: string;
  sender: MessageSender | null;
}

const getAvatarUrl = (sender: MessageSender | null): string =>
  sender?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name}`;

export const MessageItem = ({ type, body, image, sender }: MessageItemProps): React.ReactElement => {
  if (type === "system") {
    return (
      <p className="py-2 text-center text-xs italic text-muted-foreground">{body}</p>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <Image
        src={getAvatarUrl(sender)}
        alt={sender?.name ?? ""}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full"
      />
      <div className="flex-1">
        <span className="text-xs font-medium">{sender?.name}</span>
        {type === "text" && <p className="text-sm">{body}</p>}
        {type === "image" && image && (
          <Image
            src={image}
            alt="Shared image"
            width={200}
            height={300}
            className="mt-1 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};
