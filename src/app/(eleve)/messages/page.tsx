'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Search, Plus, Loader2 } from 'lucide-react';
import type { Conversation, ChatMessage } from '@/lib/constants/messages';
import ChatConversationView from '@/components/metier/ChatConversationView';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile, getInitials } from '@/hooks/useCurrentProfile';
import { formatTimeShort, formatAudioSeconds } from '@/lib/utils/formatters';

interface TeacherOption {
  id: string;
  full_name: string;
  matiere_id?: string | null;
  matiere_nom?: string;
}

export default function MessagesPage() {
  const { profile } = useCurrentProfile();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPicker, setShowNewPicker] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const [{ data: convData }, { data: profData }] = await Promise.all([
        supabase
          .from('conversations')
          .select(
            `
            id,
            eleve_id,
            enseignant_id,
            last_message_at,
            matieres ( nom ),
            enseignant:profiles!conversations_enseignant_id_fkey ( id, full_name ),
            messages (
              id,
              sender_id,
              contenu,
              audio_url,
              audio_duration,
              attachment_name,
              attachment_size_bytes,
              is_read,
              created_at
            )
          `
          )
          .eq('eleve_id', profile.id)
          .order('last_message_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, full_name, enseignant_matieres ( matiere_id, matieres ( nom ) )')
          .eq('role', 'enseignant'),
      ]);

      const mappedTeachers: TeacherOption[] = (profData ?? []).map((p) => {
        const em = (p.enseignant_matieres as unknown as Array<{
          matiere_id: string;
          matieres: { nom: string } | null;
        }>)?.[0];
        return {
          id: p.id,
          full_name: p.full_name,
          matiere_id: em?.matiere_id ?? null,
          matiere_nom: em?.matieres?.nom ?? 'Enseignant',
        };
      });
      setTeachers(mappedTeachers);

      const mapped: Conversation[] = (convData ?? []).map((c) => {
        const teacher = c.enseignant as unknown as { id: string; full_name: string } | null;
        const mat = c.matieres as unknown as { nom: string } | null;
        const rawMsgs = (c.messages as unknown as Array<{
          id: string;
          sender_id: string;
          contenu: string | null;
          audio_url: string | null;
          audio_duration: number | null;
          attachment_name: string | null;
          attachment_size_bytes: number | null;
          is_read: boolean;
          created_at: string;
        }>) ?? [];

        const sorted = [...rawMsgs].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const messages: ChatMessage[] = sorted.map((m) => ({
          id: m.id,
          sender: m.sender_id === profile.id ? 'student' : 'teacher',
          text: m.contenu ?? undefined,
          audioDuration: formatAudioSeconds(m.audio_duration),
          attachment: m.attachment_name
            ? {
                title: m.attachment_name,
                format: m.attachment_name.split('.').pop()?.toUpperCase() || 'PDF',
                size: m.attachment_size_bytes
                  ? `${Math.round(m.attachment_size_bytes / 1024)} Ko`
                  : 'PDF',
              }
            : undefined,
          time: formatTimeShort(m.created_at),
        }));

        const last = sorted[sorted.length - 1];
        const unread = sorted.some((m) => m.sender_id !== profile.id && !m.is_read);

        return {
          id: c.id,
          teacher: teacher?.full_name ?? 'Enseignant',
          initials: getInitials(teacher?.full_name),
          role: mat?.nom ? `Enseignant de ${mat.nom}` : 'Enseignant',
          subject: mat?.nom ?? 'Accompagnement',
          lastMessage:
            last?.contenu ||
            (last?.audio_url ? 'Note vocale' : last?.attachment_name ? `📎 ${last.attachment_name}` : 'Démarrez la discussion'),
          time: formatTimeShort(last?.created_at ?? c.last_message_at),
          unread,
          messages,
        };
      });

      setConversations(mapped);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Realtime subscription for incoming messages
  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();
    const channel = supabase
      .channel('eleve-messages-realtime')
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

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);

  const handleSelectConversation = async (id: string) => {
    setSelectedConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
    const supabase = createClient();
    await supabase.rpc('mark_conversation_as_read', { p_conversation_id: id });
  };

  const handleStartConversation = async (teacher: TeacherOption) => {
    if (!profile) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('conversations')
      .upsert(
        {
          eleve_id: profile.id,
          enseignant_id: teacher.id,
          matiere_id: teacher.matiere_id ?? null,
        },
        { onConflict: 'eleve_id,enseignant_id' }
      )
      .select('id')
      .single();

    setShowNewPicker(false);
    await loadConversations();
    if (data?.id) setSelectedConversationId(data.id);
  };

  const handleSendMessage = async (conversationId: string, newMsg: Partial<ChatMessage>) => {
    if (!profile) return;
    const supabase = createClient();
    const contenu = newMsg.text?.trim() || (newMsg.audioDuration ? 'Note vocale' : null);

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      contenu,
    });

    if (!error) {
      await loadConversations();
    }
  };

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

  const filteredConversations = conversations.filter(
    (c) =>
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-stone-200/80 shadow-2xs outline-none focus:border-[#E75A24]/60 text-stone-800 placeholder:text-stone-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowNewPicker((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-xs sm:text-sm font-bold cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Écrire à un prof</span>
          </button>
        </div>
      </div>

      {showNewPicker && (
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3D6] shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Choisis un enseignant :
          </p>
          <div className="flex flex-wrap gap-2">
            {teachers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleStartConversation(t)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#FCEEE7] text-stone-800 hover:text-[#C85A2B] text-xs font-semibold border border-stone-200 cursor-pointer transition-colors"
              >
                {t.full_name} · {t.matiere_nom}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex items-center justify-center gap-2 text-stone-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#E75A24]" />
            <span>Chargement des messages...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm">Aucune conversation pour le moment.</p>
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
