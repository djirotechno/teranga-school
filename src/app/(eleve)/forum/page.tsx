'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  MessageSquare,
  CheckCircle2,
  Mic,
  X,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ForumTopic, ForumReply } from '@/lib/constants/forum';
import NewQuestionModal, { NewQuestionData } from '@/components/metier/NewQuestionModal';
import TopicDetailModal from '@/components/metier/TopicDetailModal';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile, getInitials } from '@/hooks/useCurrentProfile';
import {
  formatRelativeTime,
  formatAudioSeconds,
  normalizeMatiereTag,
} from '@/lib/utils/formatters';

interface MatiereRef {
  id: string;
  nom: string;
}

export default function ForumPage() {
  const { profile } = useCurrentProfile();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [matieres, setMatieres] = useState<MatiereRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<'Tout' | 'Français' | 'Histoire-Géo' | 'Philosophie'>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadForum = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const [{ data: matData }, { data: discData, error }] = await Promise.all([
        supabase.from('matieres').select('id, nom').order('ordre', { ascending: true }),
        supabase
          .from('forum_discussions')
          .select(
            `
            id,
            titre,
            contenu,
            audio_url,
            audio_duration,
            is_resolved,
            reponses_count,
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
          .order('created_at', { ascending: false }),
      ]);

      if (matData) setMatieres(matData);
      if (error) {
        showToast(`Erreur chargement forum : ${error.message}`, true);
        return;
      }

      const mapped: ForumTopic[] = (discData ?? []).map((row) => {
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
          .map((r) => {
            const rAuthor = r.profiles;
            const roleLabel: 'Élève' | 'Enseignant' =
              r.is_teacher_reply || rAuthor?.role === 'enseignant' || rAuthor?.role === 'admin'
                ? 'Enseignant'
                : 'Élève';
            return {
              id: r.id,
              authorName: rAuthor?.full_name ?? 'Utilisateur',
              authorRole: roleLabel,
              avatarInitials: getInitials(rAuthor?.full_name),
              time: formatRelativeTime(r.created_at),
              content: r.contenu ?? '',
              hasAudio: Boolean(r.audio_url),
              audioDuration: formatAudioSeconds(r.audio_duration),
            };
          });

        return {
          id: row.id,
          title: row.titre,
          author: author?.full_name ?? 'Utilisateur',
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
      setSelectedTopic((prev) => (prev ? mapped.find((t) => t.id === prev.id) ?? null : null));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForum();
  }, [loadForum]);

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchTag = activeTag === 'Tout' || t.tag === activeTag;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        (t.chapter && t.chapter.toLowerCase().includes(q));
      return matchTag && matchSearch;
    });
  }, [topics, activeTag, searchQuery]);

  const handleCreateQuestion = async (data: NewQuestionData) => {
    if (!profile) return;
    const supabase = createClient();

    const matchedMatiere = matieres.find(
      (m) => normalizeMatiereTag(m.nom) === data.tag
    );

    const { error } = await supabase.from('forum_discussions').insert({
      author_id: profile.id,
      matiere_id: matchedMatiere?.id ?? null,
      titre: data.title.trim(),
      contenu: data.content.trim() || (data.hasAudio ? 'Question vocale' : null),
    });

    if (error) {
      showToast(`Impossible de publier : ${error.message}`, true);
      return;
    }

    await loadForum();
    showToast('Votre question a été publiée sur le forum !');
  };

  const handleAddReply = async (
    topicId: string,
    replyData: { content: string; hasAudio?: boolean; audioDuration?: string }
  ) => {
    if (!profile) return;
    const supabase = createClient();

    const { error } = await supabase.from('forum_reponses').insert({
      discussion_id: topicId,
      author_id: profile.id,
      contenu: replyData.content.trim() || (replyData.hasAudio ? 'Réponse vocale' : null),
    });

    if (error) {
      showToast(`Erreur lors de l'envoi : ${error.message}`, true);
      return;
    }

    await loadForum();
    showToast('Réponse ajoutée !');
  };

  const handleToggleSolved = async (topicId: string) => {
    const target = topics.find((t) => t.id === topicId);
    if (!target) return;

    const supabase = createClient();
    const nextSolved = !target.isSolved;
    const { error } = await supabase
      .from('forum_discussions')
      .update({ is_resolved: nextSolved })
      .eq('id', topicId);

    if (error) {
      showToast(`Action non autorisée : ${error.message}`, true);
      return;
    }

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const updated = { ...t, isSolved: nextSolved };
        if (selectedTopic?.id === topicId) setSelectedTopic(updated);
        return updated;
      })
    );
  };

  const getTagClasses = (tag: string) => {
    switch (tag) {
      case 'Français':
        return 'bg-[#FBECE2] text-[#C85A2B] border-[#F4DACB]';
      case 'Histoire-Géo':
        return 'bg-[#EAF7EE] text-[#1B7843] border-[#C8EAD1]';
      case 'Philosophie':
        return 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-14 select-none sm:select-auto">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/accueil"
            className="p-2.5 rounded-2xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-colors"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Forum d&apos;entraide
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Pose tes questions aux enseignants et échange avec les autres élèves
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsNewQuestionOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E75A24] hover:bg-[#D04D1B] active:scale-95 text-white rounded-2xl font-bold text-sm shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Poser une question</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative flex items-center w-full bg-white rounded-2xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] px-4 py-3 transition-all focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200/50">
        <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une discussion, un mot-clé, une question..."
          className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Tout', 'Français', 'Histoire-Géo', 'Philosophie'] as const).map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#FBE8DE] text-[#C25425] font-semibold shadow-xs'
                  : 'bg-[#EAE4D9]/80 text-stone-600 hover:bg-[#EAE4D9] hover:text-stone-900'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Discussion Topics List */}
      {isLoading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
          <span>Chargement des discussions...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-3.5">
          {filteredTopics.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center flex flex-col items-center justify-center gap-3 text-stone-500 shadow-xs">
              <HelpCircle className="w-10 h-10 text-stone-300" />
              <p className="text-sm font-semibold text-stone-700">
                Aucune question trouvée dans cette catégorie.
              </p>
              <button
                type="button"
                onClick={() => setIsNewQuestionOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#E75A24] text-white rounded-xl text-xs font-bold hover:bg-[#D04D1B] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Poser ma question maintenant</span>
              </button>
            </div>
          ) : (
            filteredTopics.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTopic(t)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E75A24]/50 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${getTagClasses(
                        t.tag
                      )}`}
                    >
                      {t.tag}
                    </span>
                    {t.chapter && (
                      <span className="text-[11px] font-medium text-stone-400 truncate max-w-xs">
                        · {t.chapter}
                      </span>
                    )}
                    {t.isSolved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        Résolue
                      </span>
                    )}
                    {t.hasAudio && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C85A2B] bg-[#FCEEE7] px-2 py-0.5 rounded-md">
                        <Mic className="w-3 h-3" />
                        Note vocale
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors leading-snug">
                    {t.title}
                  </h3>

                  <p className="text-xs text-stone-500">
                    Par <span className="font-semibold text-stone-700">{t.author}</span> ({t.authorRole}) · {t.time}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <div className="flex items-center gap-1.5 text-stone-600 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-100 group-hover:bg-[#FCEEE7] group-hover:text-[#C85A2B] transition-colors">
                    <MessageSquare className="w-4 h-4 text-stone-400 group-hover:text-[#C85A2B]" />
                    <span>
                      {t.answers} {t.answers > 1 ? 'réponses' : 'réponse'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <NewQuestionModal
        isOpen={isNewQuestionOpen}
        onClose={() => setIsNewQuestionOpen(false)}
        onSubmit={handleCreateQuestion}
        initialMatiere={activeTag === 'Tout' ? 'Français' : activeTag}
      />

      <TopicDetailModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onAddReply={handleAddReply}
        onToggleSolved={handleToggleSolved}
      />
    </div>
  );
}
