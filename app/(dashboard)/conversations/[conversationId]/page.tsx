import { ConversationView } from "@/app/modules/conversations/views/ConversationView";

interface Props {
  params: Promise<{ conversationId: string }>;
}

const ConversationPage = async ({ params }: Props) => {
  const { conversationId } = await params;
  return <ConversationView conversationId={conversationId} />;
};

export default ConversationPage;
