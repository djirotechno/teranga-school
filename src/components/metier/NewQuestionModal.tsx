'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  Mic,
  Trash2,
  HelpCircle,
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import AudioRecorder from '../media/AudioRecorder';
import AudioPlayer from '../media/AudioPlayer';

export interface NewQuestionData {
  title: string;
  tag: 'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général';
  chapter?: string;
  content: string;
  hasAudio?: boolean;
  audioDuration?: string;
}

interface NewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewQuestionData) => void;
  initialMatiere?: 'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général';
}

const MATIERES: {
  id: 'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général';
  label: string;
  activeClass: string;
}[] = [
  {
    id: 'Français',
    label: 'Français',
    activeClass: 'bg-[#FBECE2] text-[#C85A2B] border-[#F4DACB]',
  },
  {
    id: 'Histoire-Géo',
    label: 'Histoire-Géo',
    activeClass: 'bg-[#EAF7EE] text-[#1B7843] border-[#C8EAD1]',
  },
  {
    id: 'Philosophie',
    label: 'Philosophie',
    activeClass: 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]',
  },
  {
    id: 'Général',
    label: 'Autre / Général',
    activeClass: 'bg-stone-200 text-stone-800 border-stone-300',
  },
];

export function NewQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  initialMatiere = 'Français',
}: NewQuestionModalProps) {
  const [selectedTag, setSelectedTag] = useState<'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général'>(initialMatiere);
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioDuration, setRecordedAudioDuration] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAudioFinished = (duration: string) => {
    setRecordedAudioDuration(duration);
    setIsRecording(false);
  };

  const handleRemoveAudio = () => {
    setRecordedAudioDuration(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Veuillez renseigner un titre pour votre question.');
      return;
    }

    if (!content.trim() && !recordedAudioDuration) {
      setErrorMsg('Veuillez décrire votre question par texte ou enregistrer une note vocale.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        tag: selectedTag,
        chapter: chapter.trim() || undefined,
        content: content.trim(),
        hasAudio: !!recordedAudioDuration,
        audioDuration: recordedAudioDuration || undefined,
      });

      // Reset form
      setTitle('');
      setChapter('');
      setContent('');
      setRecordedAudioDuration(null);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCEEE7] text-[#C85A2B] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Poser une question
              </h2>
              <p className="text-xs text-stone-500">
                Partage ta question avec les professeurs et les élèves de la communauté
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
          {/* Error notice */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Sélection de la matière */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Matière concernée <span className="text-[#E75A24]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MATIERES.map((mat) => {
                const isSelected = selectedTag === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedTag(mat.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      isSelected
                        ? `${mat.activeClass} shadow-xs ring-2 ring-current/20`
                        : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {mat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Titre de la question */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="q-title" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Titre de ta question <span className="text-[#E75A24]">*</span>
            </label>
            <input
              id="q-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Comment structurer l'antithèse dans un plan dialectique ?"
              className="w-full px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none transition-all"
            />
          </div>

          {/* 3. Chapitre / Notion (optionnel) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="q-chapter" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Chapitre ou notion <span className="text-stone-400 font-normal lowercase">(optionnel)</span>
            </label>
            <input
              id="q-chapter"
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Ex : La dissertation littéraire, La Guerre froide, etc."
              className="w-full px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none transition-all"
            />
          </div>

          {/* 4. Détails / Message textuel */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="q-content" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Détaille ta question <span className="text-[#E75A24]">*</span>
            </label>
            <textarea
              id="q-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explique précisément ce que tu n'as pas compris, la phrase du texte qui te bloque ou la méthode sur laquelle tu as un doute..."
              className="w-full p-4 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none resize-none transition-all leading-relaxed"
            />
          </div>

          {/* 5. Option Note Vocale (Spécifique Téranga S'cool) */}
          <div className="flex flex-col gap-2 pt-1 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Mic className="w-3.5 h-3.5 text-[#E75A24]" />
                <span>Message vocal <span className="text-stone-400 font-normal lowercase">(optionnel)</span></span>
              </div>
              <span className="text-[11px] text-stone-500">
                Wolof ou Français
              </span>
            </div>

            {/* Audio recorder / preview area */}
            {isRecording ? (
              <AudioRecorder
                onSendAudio={handleAudioFinished}
                onCancel={() => setIsRecording(false)}
              />
            ) : recordedAudioDuration ? (
              <div className="p-3 bg-[#EAF7EE] border border-[#CEEFD8] rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AudioPlayer duration={recordedAudioDuration} />
                  <span className="text-xs text-emerald-800 font-medium">
                    Note vocale enregistrée ({recordedAudioDuration})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                  title="Supprimer la note vocale"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FAF7F2] hover:bg-[#FCEEE7] text-stone-700 hover:text-[#C85A2B] rounded-2xl border border-dashed border-stone-300 hover:border-[#F4DACB] text-xs sm:text-sm font-semibold transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#E75A24] group-hover:scale-110 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <span>Enregistrer une note vocale pour expliquer à l'oral</span>
              </button>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-stone-200/80 bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Publication...' : 'Publier la question'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewQuestionModal;
