'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
  CornerDownRight,
  Filter,
} from 'lucide-react';
import { INITIAL_FORUM_TOPICS, ForumTopic } from '@/lib/constants/forum';

export default function EnseignantForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS);
  const [filter, setFilter] = useState<'all' | 'unsolved'>('all');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const [replyText, setReplyText] = useState('');

  const displayedTopics = topics.filter((t) => {
    if (filter === 'unsolved') return !t.isSolved;
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTopic) return;

    const newReply = {
      id: `r-${Date.now()}`,
      authorName: 'M. Diop',
      authorRole: 'Enseignant' as const,
      avatarInitials: 'MD',
      time: 'À l’instant',
      content: replyText.trim(),
    };

    setTopics((prev) =>
      prev.map((t) =>
        t.id === activeTopic.id
          ? {
              ...t,
              answers: t.answers + 1,
              replies: [...t.replies, newReply],
            }
          : t
      )
    );

    setActiveTopic((prev) =>
      prev
        ? {
            ...prev,
            answers: prev.answers + 1,
            replies: [...prev.replies, newReply],
          }
        : null
    );

    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Questions des élèves & Forum
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Répondez aux questions méthodologiques de vos élèves en texte ou note vocale.
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
              <div className="border-b border-stone-100 pb-3">
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
                        {reply.authorName}
                      </span>
                      <span className="text-stone-400">{reply.time}</span>
                    </div>
                    <p className="text-stone-700 text-xs sm:text-sm">
                      {reply.content}
                    </p>
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
                  disabled={!replyText.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
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
    </div>
  );
}
