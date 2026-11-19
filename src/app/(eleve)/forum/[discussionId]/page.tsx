'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Mic,
  Send,
  UserCheck
} from 'lucide-react';
import { INITIAL_FORUM_TOPICS, ForumTopic, ForumReply } from '@/lib/constants/forum';
import AudioPlayer from '@/components/media/AudioPlayer';
import AudioRecorder from '@/components/media/AudioRecorder';

export default function ForumDiscussionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const discussionId = params?.discussionId as string;

  const foundTopic = INITIAL_FORUM_TOPICS.find((t) => t.id === discussionId) || INITIAL_FORUM_TOPICS[0];
  const [topic, setTopic] = useState<ForumTopic>(foundTopic);
  const [replyText, setReplyText] = useState('');
  const [isRecordingReply, setIsRecordingReply] = useState(false);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !audioDuration) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: 'Awa Diop',
      authorRole: 'Élève',
      avatarInitials: 'AD',
      time: 'À l’instant',
      content: replyText.trim(),
      hasAudio: !!audioDuration,
      audioDuration: audioDuration || undefined,
    };

    setTopic((prev) => ({
      ...prev,
      answers: (prev.replies?.length || 0) + 1,
      replies: [...(prev.replies || []), newReply],
    }));

    setReplyText('');
    setAudioDuration(null);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Français':
        return 'bg-[#FBECE2] text-[#C85A2B] border-[#F4DACB]';
      case 'Histoire-Géo':
        return 'bg-[#EAF7EE] text-[#1B7843] border-[#C8EAD1]';
      case 'Philosophie':
        return 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]';
      default:
        return 'bg-stone-200 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-14">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <Link
            href="/forum"
            className="p-2.5 rounded-2xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-colors"
            title="Retour au forum"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getTagColor(topic.tag)}`}>
              {topic.tag}
            </span>
            <p className="text-xs text-stone-500 mt-1">
              {topic.chapter || 'Discussion'} · {topic.time}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTopic((t) => ({ ...t, isSolved: !t.isSolved }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            topic.isSolved
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${topic.isSolved ? 'text-emerald-600' : 'text-stone-400'}`} />
          <span>{topic.isSolved ? 'Résolue' : 'Marquer comme résolue'}</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E75A24] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {topic.avatarInitials}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-stone-900">{topic.author}</h3>
            <p className="text-xs text-stone-400">{topic.authorRole} · {topic.time}</p>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
          {topic.title}
        </h1>

        <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-wrap">
          {topic.content}
        </p>

        {topic.hasAudio && topic.audioDuration && (
          <div className="pt-3 border-t border-stone-100">
            <p className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              Note vocale de l'auteur :
            </p>
            <AudioPlayer duration={topic.audioDuration} />
          </div>
        )}
      </div>

      {/* Replies list */}
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#E75A24]" />
          <span>Réponses ({topic.replies?.length || 0})</span>
        </h2>

        {(!topic.replies || topic.replies.length === 0) ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200 text-stone-500 text-sm">
            Aucune réponse pour le moment. Sois le premier à répondre !
          </div>
        ) : (
          topic.replies.map((reply) => {
            const isTeacher = reply.authorRole === 'Enseignant';
            return (
              <div
                key={reply.id}
                className={`rounded-2xl p-5 border transition-all ${
                  isTeacher
                    ? 'bg-[#F9FCFA] border-emerald-200 shadow-2xs'
                    : 'bg-white border-stone-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isTeacher ? 'bg-[#1B7843] text-white shadow-xs' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {reply.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">{reply.authorName}</span>
                      {isTeacher && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <UserCheck className="w-3 h-3" />
                          Enseignant certifié
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">{reply.time}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap pl-1">
                  {reply.content}
                </p>

                {reply.hasAudio && reply.audioDuration && (
                  <div className="mt-3 pl-1">
                    <AudioPlayer duration={reply.audioDuration} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Reply input */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col gap-3">
        {isRecordingReply ? (
          <AudioRecorder
            onSendAudio={(dur) => {
              setAudioDuration(dur);
              setIsRecordingReply(false);
            }}
            onCancel={() => setIsRecordingReply(false)}
          />
        ) : audioDuration ? (
          <div className="p-2.5 bg-[#EAF7EE] border border-[#CEEFD8] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>Note vocale prête ({audioDuration})</span>
            </div>
            <button
              type="button"
              onClick={() => setAudioDuration(null)}
              className="text-xs text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSendReply} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRecordingReply(true)}
            className="p-2.5 rounded-xl text-stone-500 hover:text-[#E75A24] hover:bg-[#FCEEE7] border border-stone-200 transition-colors shrink-0"
            title="Répondre par message vocal"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Écrire une réponse d'aide..."
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 transition-all"
          />

          <button
            type="submit"
            disabled={!replyText.trim() && !audioDuration}
            className="p-2.5 bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-40 text-white rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
            title="Envoyer la réponse"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
