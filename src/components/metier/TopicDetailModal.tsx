'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  CheckCircle2,
  Mic,
  Clock,
  Sparkles,
  BookOpen,
  CornerDownRight,
  UserCheck
} from 'lucide-react';
import { ForumTopic, ForumReply } from '@/lib/constants/forum';
import AudioPlayer from '../media/AudioPlayer';
import AudioRecorder from '../media/AudioRecorder';

interface TopicDetailModalProps {
  topic: ForumTopic | null;
  onClose: () => void;
  onAddReply: (topicId: string, reply: { content: string; hasAudio?: boolean; audioDuration?: string }) => void;
  onToggleSolved: (topicId: string) => void;
}

export function TopicDetailModal({
  topic,
  onClose,
  onAddReply,
  onToggleSolved,
}: TopicDetailModalProps) {
  const [replyText, setReplyText] = useState('');
  const [isRecordingReply, setIsRecordingReply] = useState(false);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);

  if (!topic) return null;

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() && !audioDuration) return;

    onAddReply(topic.id, {
      content: replyText.trim(),
      hasAudio: !!audioDuration,
      audioDuration: audioDuration || undefined,
    });

    setReplyText('');
    setAudioDuration(null);
    setIsRecordingReply(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getTagColor(topic.tag)} shrink-0`}>
              {topic.tag}
            </span>
            <span className="text-xs text-stone-500 truncate">
              {topic.chapter || 'Discussion générale'} · {topic.time}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleSolved(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                topic.isSolved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${topic.isSolved ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>{topic.isSolved ? 'Résolue' : 'Marquer comme résolue'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6">
          {/* Main Question Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-stone-200/80 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E75A24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {topic.avatarInitials || topic.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{topic.author}</h4>
                  <p className="text-[11px] text-stone-500">{topic.authorRole} · {topic.time}</p>
                </div>
              </div>
            </div>

            <h1 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
              {topic.title}
            </h1>

            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
              {topic.content}
            </p>

            {/* Audio player if question has audio */}
            {topic.hasAudio && topic.audioDuration && (
              <div className="mt-2 pt-3 border-t border-stone-200/60">
                <p className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  Note vocale de l'auteur :
                </p>
                <AudioPlayer duration={topic.audioDuration} />
              </div>
            )}
          </div>

          {/* Replies Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E75A24]" />
                <span>Réponses ({topic.replies?.length || 0})</span>
              </h3>
            </div>

            {(!topic.replies || topic.replies.length === 0) ? (
              <div className="bg-stone-50 rounded-2xl p-6 text-center border border-dashed border-stone-200 text-stone-500 text-xs sm:text-sm">
                Aucune réponse pour le moment. Sois le premier à répondre ou attends le retour d'un enseignant !
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {topic.replies.map((reply) => {
                  const isTeacher = reply.authorRole === 'Enseignant';
                  return (
                    <div
                      key={reply.id}
                      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                        isTeacher
                          ? 'bg-[#F9FCFA] border-emerald-200 shadow-2xs'
                          : 'bg-white border-stone-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isTeacher
                                ? 'bg-[#1B7843] text-white shadow-xs'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {reply.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900">
                                {reply.authorName}
                              </span>
                              {isTeacher && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  <UserCheck className="w-3 h-3" />
                                  Enseignant certifié
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-400">
                              {reply.time}
                            </span>
                          </div>
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
                })}
              </div>
            )}
          </div>
        </div>

        {/* Reply input footer */}
        <div className="p-4 border-t border-stone-200/80 bg-[#FAF7F2] flex flex-col gap-2.5 shrink-0">
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
              className="p-2.5 rounded-xl text-stone-500 hover:text-[#E75A24] hover:bg-[#FCEEE7] bg-white border border-stone-200/80 transition-colors shrink-0"
              title="Répondre par message vocal"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Écrire une réponse d'aide..."
              className="flex-1 px-4 py-2.5 bg-white border border-stone-200/80 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 transition-all"
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
    </div>
  );
}

export default TopicDetailModal;
