"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ConversationsView } from "@/app/modules/conversations/views/ConversationsView";
import { Header } from "@/app/modules/dashboard/components/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const useIsClient = (): boolean =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

export const DashboardLayout = ({ children }: DashboardLayoutProps): React.ReactElement | null => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const isClient = useIsClient();
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (!isClient) return null;

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const hasConversation = pathname !== "/conversations";
  const closeSheet = () => setSheetOpen(false);
  const conversationsList = <ConversationsView onNavigate={closeSheet} />;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />

      <div className="hidden min-h-0 flex-1 md:flex">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={300} minSize={300} maxSize={500}>
            <div className="h-full overflow-hidden">{conversationsList}</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="h-full overflow-hidden">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:hidden">
        {hasConversation ? (
          <>
            <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Menu className="h-4 w-4" />
                    <span>Conversations</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm p-0">
                  <VisuallyHidden>
                    <SheetTitle>Conversations</SheetTitle>
                  </VisuallyHidden>
                  <div className="h-full overflow-hidden pt-10">{conversationsList}</div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-hidden">{conversationsList}</div>
        )}
      </div>
    </div>
  );
};
