'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { INITIAL_CONVERSATIONS, Conversation, ChatMessage } from '@/lib/constants/messages';
import ChatConversationView from '@/components/metier/ChatConversationView';

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const router = useRouter();
  const { conversationId } = use(params);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  const conversation = conversations.find((c) => c.id === conversationId) || conversations[0];

  const handleSendMessage = (id: string, newMsg: Partial<ChatMessage>) => {
    const messageId = `msg-${Date.now()}`;
    const fullMsg: ChatMessage = {
      id: messageId,
      sender: newMsg.sender || 'student',
      text: newMsg.text,
      audioDuration: newMsg.audioDuration,
      attachment: newMsg.attachment,
      time: newMsg.time || 'Maintenant',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedMessages = [...c.messages, fullMsg];
          const lastMsgText = newMsg.text || (newMsg.audioDuration ? 'Note vocale' : 'Document joint');
          return {
            ...c,
            lastMessage: lastMsgText,
            time: newMsg.time || 'Maintenant',
            messages: updatedMessages,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <ChatConversationView
        conversation={conversation}
        onBack={() => router.push('/messages')}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
