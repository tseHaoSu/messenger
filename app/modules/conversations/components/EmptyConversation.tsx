import { Card, CardContent } from "@/components/ui/card";

export const EmptyConversation = (): React.ReactElement => (
  <Card className="flex h-full items-center justify-center">
    <CardContent>
      <p className="text-muted-foreground">
        Select a conversation to view messages
      </p>
    </CardContent>
  </Card>
);
