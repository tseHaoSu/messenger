import type { Metadata } from "next";
import { EmptyConversation } from "@/app/modules/conversations/components/conversation-list/EmptyConversation";

export const metadata: Metadata = {
  title: "Conversations",
};

const ConversationsPage = () => <EmptyConversation />;

export default ConversationsPage;
