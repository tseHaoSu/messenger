import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = (): React.ReactElement => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <MessageCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
    </div>
    <Button asChild size="lg">
      <Link href="/conversations">Back to Conversations</Link>
    </Button>
  </div>
);

export default NotFound;
