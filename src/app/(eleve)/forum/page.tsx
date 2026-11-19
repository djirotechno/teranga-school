'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  MessageSquare,
  CheckCircle2,
  Mic,
  X,
  BookOpen,
  Filter,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { INITIAL_FORUM_TOPICS, ForumTopic } from '@/lib/constants/forum';
import NewQuestionModal, { NewQuestionData } from '@/components/metier/NewQuestionModal';
import TopicDetailModal from '@/components/metier/TopicDetailModal';

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS);
  const [activeTag, setActiveTag] = useState<'Tout' | 'Français' | 'Histoire-Géo' | 'Philosophie'>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchTag = activeTag === 'Tout' || t.tag === activeTag;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.chapter && t.chapter.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTag && matchSearch;
    });
  }, [topics, activeTag, searchQuery]);

  const handleCreateQuestion = (data: NewQuestionData) => {
    const newTopic: ForumTopic = {
      id: `topic-${Date.now()}`,
      title: data.title,
      author: 'Awa Diop',
      authorRole: 'Élève',
      avatarInitials: 'AD',
      time: 'À l’instant',
      tag: data.tag,
      chapter: data.chapter,
      content: data.content,
      answers: 0,
      isSolved: false,
      hasAudio: data.hasAudio,
      audioDuration: data.audioDuration,
      replies: [],
    };

    setTopics((prev) => [newTopic, ...prev]);
    setToastMessage('Votre question a été publiée sur le forum !');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddReply = (
    topicId: string,
    replyData: { content: string; hasAudio?: boolean; audioDuration?: string }
  ) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;

        const newReply = {
          id: `reply-${Date.now()}`,
          authorName: 'Awa Diop',
          authorRole: 'Élève' as const,
          avatarInitials: 'AD',
          time: 'À l’instant',
          content: replyData.content,
          hasAudio: replyData.hasAudio,
          audioDuration: replyData.audioDuration,
        };

        const updatedReplies = [...(t.replies || []), newReply];

        const updatedTopic = {
          ...t,
          answers: updatedReplies.length,
          replies: updatedReplies,
        };

        // Also update currently viewed topic
        if (selectedTopic && selectedTopic.id === topicId) {
          setSelectedTopic(updatedTopic);
        }

        return updatedTopic;
      })
    );
  };

  const handleToggleSolved = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const updated = { ...t, isSolved: !t.isSolved };
        if (selectedTopic && selectedTopic.id === topicId) {
          setSelectedTopic(updated);
        }
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
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F3833] text-white text-sm rounded-2xl shadow-xl border border-white/10 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section with Title and "Poser une question" button */}
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
              Forum d'entraide
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Pose tes questions aux enseignants et échange avec les autres élèves
            </p>
          </div>
        </div>

        {/* Bouton Poser une question */}
        <button
          type="button"
          onClick={() => setIsNewQuestionOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E75A24] hover:bg-[#D04D1B] active:scale-95 text-white rounded-2xl font-bold text-sm shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Poser une question</span>
        </button>
      </div>

      {/* Search Input */}
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

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Tout', 'Français', 'Histoire-Géo', 'Philosophie'] as const).map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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
      <div className="flex flex-col gap-3 sm:gap-3.5">
        {filteredTopics.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center flex flex-col items-center justify-center gap-3 text-stone-500 shadow-xs">
            <HelpCircle className="w-10 h-10 text-stone-300" />
            <p className="text-sm font-semibold text-stone-700">
              Aucune question trouvée dans cette catégorie.
            </p>
            <p className="text-xs text-stone-400 max-w-sm">
              Sois le premier à poser une question pour obtenir l'aide d'un professeur ou d'un camarade !
            </p>
            <button
              type="button"
              onClick={() => setIsNewQuestionOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#E75A24] text-white rounded-xl text-xs font-bold hover:bg-[#D04D1B] transition-colors"
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
              {/* Left Column: Subject Badge + Title + Details */}
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

              {/* Right Column: Answers count pill */}
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

      {/* Formulaire Modal de création de message (Poser une question) */}
      <NewQuestionModal
        isOpen={isNewQuestionOpen}
        onClose={() => setIsNewQuestionOpen(false)}
        onSubmit={handleCreateQuestion}
        initialMatiere={activeTag === 'Tout' ? 'Français' : activeTag}
      />

      {/* Modal de détail d'une discussion */}
      <TopicDetailModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onAddReply={handleAddReply}
        onToggleSolved={handleToggleSolved}
      />
    </div>
  );
}
