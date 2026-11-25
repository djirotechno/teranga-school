'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile, getInitials } from '@/hooks/useCurrentProfile';
import { formatTimeShort } from '@/lib/utils/formatters';

interface TeacherConvMessage {
  id: string;
  sender: 'teacher' | 'student';
  text: string;
  time: string;
}

interface TeacherConv {
  id: string;
  studentName: string;
  studentClass: string;
  initials: string;
  unread: boolean;
  lastMessage: string;
  time: string;
  messages: TeacherConvMessage[];
}

export default function EnseignantMessagesPage() {
  const { profile } = useCurrentProfile();
  const [conversations, setConversations] = useState<TeacherConv[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('conversations')
        .select(
          `
          id,
          eleve_id,
          enseignant_id,
          last_message_at,
          eleve:profiles!conversations_eleve_id_fkey ( id, full_name, niveau, serie ),
          messages (
            id,
            sender_id,
            contenu,
            audio_url,
            attachment_name,
            is_read,
            created_at
          )
        `
        )
        .order('last_message_at', { ascending: false });

      if (profile.role !== 'admin') {
        query = query.eq('enseignant_id', profile.id);
      }

      const { data } = await query;
      const mapped: TeacherConv[] = (data ?? []).map((c) => {
        const student = c.eleve as unknown as {
          id: string;
          full_name: string;
          niveau: string | null;
          serie: string | null;
        } | null;
        const rawMsgs = (c.messages as unknown as Array<{
          id: string;
          sender_id: string;
          contenu: string | null;
          audio_url: string | null;
          attachment_name: string | null;
          is_read: boolean;
          created_at: string;
        }>) ?? [];

        const sorted = [...rawMsgs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const messages: TeacherConvMessage[] = sorted.map((m) => ({
          id: m.id,
          sender: m.sender_id === c.eleve_id ? 'student' : 'teacher',
          text:
            m.contenu ||
            (m.audio_url ? '🎤 Note vocale' : m.attachment_name ? `📎 ${m.attachment_name}` : ''),
          time: formatTimeShort(m.created_at),
        }));

        const last = sorted[sorted.length - 1];
        const unread = sorted.some((m) => m.sender_id !== profile.id && !m.is_read);
        const studentClass = [student?.niveau, student?.serie].filter(Boolean).join(' ') || 'Élève';

        return {
          id: c.id,
          studentName: student?.full_name ?? 'Élève',
          studentClass,
          initials: getInitials(student?.full_name),
          unread,
          lastMessage: last?.contenu || (last?.audio_url ? '🎤 Note vocale' : 'Aucun message'),
          time: formatTimeShort(last?.created_at ?? c.last_message_at),
          messages,
        };
      });

      setConversations(mapped);
      setActiveConvId((prev) => prev ?? mapped[0]?.id ?? null);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Realtime subscription
  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();
    const channel = supabase
      .channel('enseignant-messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, loadConversations]);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const handleSelectConv = async (id: string) => {
    setActiveConvId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
    const supabase = createClient();
    await supabase.rpc('mark_conversation_as_read', { p_conversation_id: id });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !profile) return;

    const text = inputText.trim();
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').insert({
        conversation_id: activeConv.id,
        sender_id: profile.id,
        contenu: text,
      });

      if (!error) {
        setInputText('');
        await loadConversations();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Messagerie pédagogique
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Échangez en direct avec vos élèves pour les guider individuellement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden min-h-[580px]">
        {/* Conversations List */}
        <div className="md:col-span-5 border-r border-stone-200 p-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-2 py-1">
            Conversations en cours ({conversations.length})
          </h3>

          {isLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-stone-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-[#E75A24]" />
              <span>Chargement...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              Aucune conversation pour le moment.
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectConv(c.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#E8F1EE] text-stone-900'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0F3833] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900 truncate">
                        {c.studentName}
                      </span>
                      <span className="text-[11px] text-stone-400">{c.time}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {c.studentClass}
                    </span>
                    <p className="text-xs text-stone-600 truncate mt-1">{c.lastMessage}</p>
                  </div>
                  {c.unread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E75A24] shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Chat window */}
        <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-6 bg-[#FAF7F2]/40">
          {activeConv ? (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <div className="w-10 h-10 rounded-full bg-[#0F3833] text-white font-bold text-sm flex items-center justify-center">
                  {activeConv.initials}
                </div>
                <div>
                  <h2 className="font-bold text-stone-900 text-sm sm:text-base">
                    {activeConv.studentName}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    {activeConv.studentClass}
                  </p>
                </div>
              </div>

              <div className="flex-1 py-6 space-y-4 overflow-y-auto max-h-[420px]">
                {activeConv.messages.map((msg) => {
                  const isTeacher = msg.sender === 'teacher';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed ${
                          isTeacher
                            ? 'bg-[#0F3833] text-white rounded-br-xs'
                            : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-stone-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Répondre à ${activeConv.studentName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-[#E75A24]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="p-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white transition-colors cursor-pointer"
                  aria-label="Envoyer"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500 text-sm">
              Sélectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
