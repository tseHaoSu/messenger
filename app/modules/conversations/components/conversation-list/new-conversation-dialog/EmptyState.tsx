import { Plus } from "lucide-react";

export const EmptyState = (): React.ReactElement => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <Plus className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-muted-foreground">No users available</p>
    <p className="text-xs text-muted-foreground/70">Invite others to get started</p>
  </div>
);
