'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mic,
  MessageSquare,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ForumTopic, ForumReply } from '@/lib/constants/forum';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile, getInitials } from '@/hooks/useCurrentProfile';
import {
  formatRelativeTime,
  formatAudioSeconds,
  normalizeMatiereTag,
} from '@/lib/utils/formatters';

export default function EnseignantForumPage() {
  const { profile } = useCurrentProfile();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unsolved'>('all');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('forum_discussions')
        .select(
          `
          id,
          titre,
          contenu,
          audio_url,
          audio_duration,
          is_resolved,
          created_at,
          matieres ( nom ),
          chapitres ( titre ),
          profiles!forum_discussions_author_id_fkey ( full_name, role ),
          forum_reponses (
            id,
            contenu,
            audio_url,
            audio_duration,
            is_teacher_reply,
            created_at,
            profiles!forum_reponses_author_id_fkey ( full_name, role )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        showToast(error.message, true);
        return;
      }

      const mapped: ForumTopic[] = (data ?? []).map((row) => {
        const author = row.profiles as unknown as { full_name: string; role: string } | null;
        const mat = row.matieres as unknown as { nom: string } | null;
        const chap = row.chapitres as unknown as { titre: string } | null;
        const rawReplies = (row.forum_reponses as unknown as Array<{
          id: string;
          contenu: string | null;
          audio_url: string | null;
          audio_duration: number | null;
          is_teacher_reply: boolean;
          created_at: string;
          profiles: { full_name: string; role: string } | null;
        }>) ?? [];

        const replies: ForumReply[] = [...rawReplies]
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((r) => ({
            id: r.id,
            authorName: r.profiles?.full_name ?? 'Utilisateur',
            authorRole:
              r.is_teacher_reply ||
              r.profiles?.role === 'enseignant' ||
              r.profiles?.role === 'admin'
                ? 'Enseignant'
                : 'Élève',
            avatarInitials: getInitials(r.profiles?.full_name),
            time: formatRelativeTime(r.created_at),
            content: r.contenu ?? '',
            hasAudio: Boolean(r.audio_url),
            audioDuration: formatAudioSeconds(r.audio_duration),
          }));

        return {
          id: row.id,
          title: row.titre,
          author: author?.full_name ?? 'Élève',
          authorRole: author?.role === 'enseignant' || author?.role === 'admin' ? 'Enseignant' : 'Élève',
          avatarInitials: getInitials(author?.full_name),
          time: formatRelativeTime(row.created_at),
          tag: normalizeMatiereTag(mat?.nom),
          chapter: chap?.titre ?? undefined,
          content: row.contenu ?? '',
          answers: replies.length,
          isSolved: row.is_resolved,
          hasAudio: Boolean(row.audio_url),
          audioDuration: formatAudioSeconds(row.audio_duration),
          replies,
        };
      });

      setTopics(mapped);
      setActiveTopic((prev) =>
        prev ? mapped.find((t) => t.id === prev.id) ?? mapped[0] ?? null : mapped[0] ?? null
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const displayedTopics = topics.filter((t) => (filter === 'unsolved' ? !t.isSolved : true));

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTopic || !profile) return;

    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('forum_reponses').insert({
        discussion_id: activeTopic.id,
        author_id: profile.id,
        contenu: replyText.trim(),
        is_validated: true,
      });

      if (error) {
        showToast(`Erreur : ${error.message}`, true);
        return;
      }

      setReplyText('');
      await loadTopics();
      showToast('Réponse pédagogique publiée !');
    } finally {
      setSending(false);
    }
  };

  const handleToggleResolved = async (topic: ForumTopic) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('forum_discussions')
      .update({ is_resolved: !topic.isSolved })
      .eq('id', topic.id);

    if (error) {
      showToast(error.message, true);
      return;
    }
    await loadTopics();
    showToast(topic.isSolved ? 'Question rouverte.' : 'Question marquée comme résolue !');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm rounded-2xl shadow-xl border border-white/10 ${
            toast.error ? 'bg-red-700' : 'bg-[#0F3833]'
          }`}
        >
          {toast.error ? (
            <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Questions des élèves & Forum
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Répondez aux questions méthodologiques de vos élèves et validez les résolutions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#0F3833] text-white'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          Toutes les questions ({topics.length})
        </button>
        <button
          onClick={() => setFilter('unsolved')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            filter === 'unsolved'
              ? 'bg-[#E75A24] text-white'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          À traiter en priorité ({topics.filter((t) => !t.isSolved).length})
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
          <span>Chargement du forum...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Topics List */}
          <div className="lg:col-span-7 space-y-3.5">
            {displayedTopics.map((topic) => {
              const isSelected = activeTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#E75A24] ring-2 ring-[#E75A24]/20 shadow-md'
                      : 'border-[#EAE3D6] hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#E8F1EE] text-[#0F3833] font-bold text-xs flex items-center justify-center">
                        {topic.avatarInitials}
                      </span>
                      <span className="text-xs font-semibold text-stone-700">
                        {topic.author}
                      </span>
                      {topic.isSolved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" /> Résolue
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">{topic.time}</span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5">
                    {topic.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-3 mt-3 border-t border-stone-100">
                    <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md text-[#0F3833] font-medium border border-stone-200">
                      {topic.tag}
                    </span>
                    <div className="flex items-center gap-3">
                      {topic.hasAudio && (
                        <span className="flex items-center gap-1 text-[#E75A24] font-medium">
                          <Mic className="w-3.5 h-3.5" /> Note vocale
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {topic.answers} rép.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Topic Thread View */}
          <div className="lg:col-span-5 sticky top-20">
            {activeTopic ? (
              <div className="bg-white rounded-3xl p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-4">
                <div className="border-b border-stone-100 pb-3 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E75A24]">
                      Discussion active
                    </span>
                    <h2 className="font-bold text-stone-900 text-lg mt-1">
                      {activeTopic.title}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Posée par {activeTopic.author} · {activeTopic.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleResolved(activeTopic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                      activeTopic.isSolved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {activeTopic.isSolved ? '✓ Résolue' : 'Marquer résolue'}
                  </button>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl text-stone-800 text-sm leading-relaxed">
                  {activeTopic.content}
                </div>

                {/* Replies list */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {activeTopic.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0F3833]">
                          {reply.authorName}{' '}
                          {reply.authorRole === 'Enseignant' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0F3833]/10 text-[#0F3833] ml-1">
                              Prof
                            </span>
                          )}
                        </span>
                        <span className="text-stone-400">{reply.time}</span>
                      </div>
                      <p className="text-stone-700 text-xs sm:text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply form */}
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-stone-100">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Rédiger votre réponse pédagogique..."
                    className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#E75A24]"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="w-full py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Répondre à l&apos;élève</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-stone-300 text-center text-stone-500 text-sm">
                Sélectionnez une question à gauche pour afficher la discussion et répondre.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
