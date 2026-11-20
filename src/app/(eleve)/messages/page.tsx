'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Search } from 'lucide-react';
import { INITIAL_CONVERSATIONS, Conversation, ChatMessage } from '@/lib/constants/messages';
import ChatConversationView from '@/components/metier/ChatConversationView';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const handleSendMessage = (conversationId: string, newMsg: Partial<ChatMessage>) => {
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
        if (c.id === conversationId) {
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

  // If a conversation is selected, display the Chat View matching the screenshot
  if (activeConversation) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <ChatConversationView
          conversation={activeConversation}
          onBack={() => setSelectedConversationId(null)}
          onSendMessage={handleSendMessage}
        />
      </div>
    );
  }

  // Filter conversations
  const filteredConversations = conversations.filter(
    (c) =>
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/accueil"
            className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Messages
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Communique directement avec tes professeurs
            </p>
          </div>
        </div>

        {/* Search bar inside conversation list */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une discussion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-stone-200/80 shadow-2xs outline-none focus:border-[#E75A24]/60 focus:ring-2 focus:ring-[#E75A24]/10 transition-all text-stone-800 placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm">Aucune conversation trouvée.</p>
          </div>
        ) : (
          filteredConversations.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectConversation(c.id)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#D6EADB] text-[#0F3833] font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors truncate">
                      {c.teacher}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium shrink-0">
                      {c.subject}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5 truncate">
                    {c.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                <span className="text-[11px] text-stone-400 font-medium">{c.time}</span>
                {c.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E75A24] ring-4 ring-[#E75A24]/10" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
