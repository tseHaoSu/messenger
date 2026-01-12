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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm md:h-20 md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background md:h-10 md:w-10 md:rounded-xl">
          <MessageCircle className="h-4 w-4 text-foreground md:h-5 md:w-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
            Messenger
          </h1>
          <p className="hidden text-xs text-muted-foreground md:block">Stay connected</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-lg border-border md:h-10 md:w-10 md:rounded-xl"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 md:h-5 md:w-5" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 md:h-5 md:w-5" />
          </Button>
        )}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 ring-2 ring-border shadow-sm md:h-10 md:w-10",
            },
          }}
        />
      </div>
    </header>
  );
};
