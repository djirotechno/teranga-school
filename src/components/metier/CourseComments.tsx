'use client';

import React, { useState } from 'react';
import { Send, Mic, CheckCircle2 } from 'lucide-react';
import AudioPlayer from '../media/AudioPlayer';
import AudioRecorder from '../media/AudioRecorder';

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole: 'Élève' | 'Enseignant';
  roleBadge?: string;
  avatarInitials: string;
  timestamp: string;
  content: string;
  hasAudio?: boolean;
  audioDuration?: string;
  audioLabel?: string;
}

interface CourseCommentsProps {
  chapterTitle?: string;
  subjectName?: string;
  className?: string;
}

export function CourseComments({
  chapterTitle = "L'argumentation",
  subjectName = 'Français',
  className = '',
}: CourseCommentsProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial comments matching the exact mockup provided
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      authorName: 'Awa Diop',
      authorRole: 'Élève',
      roleBadge: 'Élève · Aujourd’hui',
      avatarInitials: 'AD',
      timestamp: 'Aujourd’hui',
      content: 'Comment distinguer un argument d’un exemple ?',
    },
    {
      id: 'c2',
      authorName: 'M. Diop',
      authorRole: 'Enseignant',
      roleBadge: 'Enseignant · Réponse',
      avatarInitials: 'MD',
      timestamp: 'Aujourd’hui',
      content:
        'L’argument soutient l’idée ; l’exemple permet de l’illustrer. Écoute cette explication en wolof.',
      hasAudio: true,
      audioDuration: '0:38',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3500);
  };

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      authorName: 'Awa Diop',
      authorRole: 'Élève',
      roleBadge: 'Élève · À l’instant',
      avatarInitials: 'AD',
      timestamp: 'À l’instant',
      content: inputText.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setInputText('');
    showToast('Votre commentaire a été publié avec succès !');
  };

  const handleSendAudio = (duration: string) => {
    setIsRecording(false);

    const newAudioComment: CommentItem = {
      id: `c-audio-${Date.now()}`,
      authorName: 'Awa Diop',
      authorRole: 'Élève',
      roleBadge: 'Élève · À l’instant',
      avatarInitials: 'AD',
      timestamp: 'À l’instant',
      content: 'Question vocale envoyée aux enseignants :',
      hasAudio: true,
      audioDuration: duration,
    };

    setComments((prev) => [newAudioComment, ...prev]);
    showToast('Votre note vocale a été enregistrée et envoyée !');
  };

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Toast Confirmation */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* 1. Header: Commentaires du cours */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Commentaires du cours
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
          {chapterTitle} · {subjectName}
        </p>
      </div>

      {/* 2. Form Box: Ajouter un commentaire */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <label
          htmlFor="comment-input"
          className="block text-xs sm:text-sm font-bold text-stone-800 mb-2.5"
        >
          Ajouter un commentaire
        </label>

        {isRecording ? (
          <AudioRecorder
            onSendAudio={handleSendAudio}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <form onSubmit={handleSendComment} className="flex flex-col gap-3.5">
            <input
              id="comment-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écris ta question ici..."
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] text-xs sm:text-sm transition-all"
            />

            <div className="flex items-center gap-2.5">
              {/* Primary Envoyer Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs transition-all ${
                  inputText.trim()
                    ? 'bg-[#E75A24] hover:bg-[#D04D1B] hover:shadow-md cursor-pointer'
                    : 'bg-[#E75A24]/60 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Envoyer</span>
              </button>

              {/* Secondary Ajouter un vocal Button */}
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
              >
                <Mic className="w-4 h-4 text-stone-600" />
                <span>Ajouter un vocal</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. List of Comments */}
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col gap-2.5 transition-all hover:border-stone-300"
          >
            {/* Author Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${
                  comment.authorRole === 'Enseignant'
                    ? 'bg-[#0F3833] text-white'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {comment.avatarInitials}
              </div>

              <div className="flex flex-col leading-snug">
                <h4 className="font-bold text-sm sm:text-base text-stone-900">
                  {comment.authorName}
                </h4>
                <span className="text-xs text-stone-400 font-normal">
                  {comment.roleBadge || `${comment.authorRole} · ${comment.timestamp}`}
                </span>
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed pl-1 sm:pl-13">
              {comment.content}
            </p>

            {/* Audio Waveform Player if comment has voice note */}
            {comment.hasAudio && (
              <div className="pl-1 sm:pl-13 pt-1">
                <AudioPlayer duration={comment.audioDuration || '0:38'} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseComments;
