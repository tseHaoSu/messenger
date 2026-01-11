import { Skeleton } from "@/components/ui/skeleton";

const MessageItemSkeleton = (): React.ReactElement => (
  <div className="flex items-start gap-3">
    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-1 h-4 w-full max-w-[280px]" />
    </div>
  </div>
);

export const MessageListSkeleton = (): React.ReactElement => (
  <div className="flex h-full flex-col bg-card">
    <div className="border-b border-border/50 px-4 py-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-1 h-3 w-20" />
    </div>
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <MessageItemSkeleton key={i} />
      ))}
    </div>
    <div className="flex gap-2 border-t border-border/50 p-4">
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 w-16 rounded-md" />
    </div>
  </div>
);
