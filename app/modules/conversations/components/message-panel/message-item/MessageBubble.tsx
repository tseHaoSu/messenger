import Image from "next/image";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  type: "text" | "image";
  body?: string;
  image?: string;
  isCurrentUser: boolean;
  isOptimistic?: boolean;
}

export const MessageBubble = ({
  type,
  body,
  image,
  isCurrentUser,
  isOptimistic = false,
}: MessageBubbleProps): React.ReactElement => {
  const bubbleStyles = isCurrentUser
    ? "rounded-2xl rounded-br-sm bg-primary/10 px-3 py-2 text-primary dark:bg-primary/30 dark:text-white"
    : "rounded-2xl rounded-tl-sm bg-muted px-3 py-2";

  return (
    <div className={cn(bubbleStyles, isOptimistic && "opacity-70")}>
      {type === "text" && <p className="text-sm">{body}</p>}
      {type === "image" && image && (
        <Image
          src={image}
          alt="Shared image"
          width={200}
          height={300}
          className="rounded-lg object-cover"
        />
      )}
    </div>
  );
};
