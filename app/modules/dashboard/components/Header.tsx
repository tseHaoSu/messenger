"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MessageCircle, Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const useIsMounted = (): boolean =>
  useSyncExternalStore(() => () => {}, () => true, () => false);

export const Header = (): React.ReactElement => {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-card px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
          <MessageCircle className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Messenger
          </h1>
          <p className="text-xs text-muted-foreground">Stay connected</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-10 w-10 rounded-xl border-border"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
        )}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-10 w-10 ring-2 ring-border shadow-sm",
            },
          }}
        />
      </div>
    </header>
  );
};
