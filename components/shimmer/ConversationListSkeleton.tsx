import { Skeleton } from "@/components/ui/skeleton";

const ConversationItemSkeleton = (): React.ReactElement => (
  <div className="flex items-center gap-2 rounded-lg px-2 py-2.5">
    <div className="relative flex shrink-0 -space-x-2">
      <Skeleton className="h-9 w-9 rounded-full border-2 border-card" />
      <Skeleton className="h-9 w-9 rounded-full border-2 border-card" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-3 w-10 shrink-0" />
      </div>
      <Skeleton className="mt-1 h-3 w-3/4" />
    </div>
  </div>
);

export const ConversationListSkeleton = (): React.ReactElement => (
  <div className="flex h-full flex-col bg-card">
    <div className="flex items-center justify-between border-b border-border/50 px-8 py-4">
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-1 h-3 w-16" />
      </div>
      <Skeleton className="h-9 w-9 rounded-xl" />
    </div>
    <div className="flex-1 overflow-y-auto px-6 py-2">
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
