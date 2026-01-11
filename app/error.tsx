"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps): React.ReactElement => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
        <p className="text-lg text-muted-foreground">An unexpected error occurred</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline" size="lg">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = "/conversations")} size="lg">
          Back to Conversations
        </Button>
      </div>
    </div>
  );
};

export default Error;
