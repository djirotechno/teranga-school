'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Mic,
  Trash2,
  HelpCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import AudioRecorder from '@/components/media/AudioRecorder';
import AudioPlayer from '@/components/media/AudioPlayer';

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

export default function NouveauMessageForumPage() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<'Français' | 'Histoire-Géo' | 'Philosophie' | 'Général'>('Français');
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioDuration, setRecordedAudioDuration] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push('/forum');
      }, 1500);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full pb-14">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/forum"
          className="p-2.5 rounded-2xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-colors"
          title="Retour au forum"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Poser une question
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Partage ta question avec les professeurs et les élèves de la communauté
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200/80 shadow-xs text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Question publiée !</h2>
          <p className="text-sm text-stone-500">
            Redirection vers le forum en cours...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-5"
        >
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Matière */}
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

          {/* Titre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Titre de ta question <span className="text-[#E75A24]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Comment structurer l'antithèse dans un plan dialectique ?"
              className="w-full px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none transition-all"
            />
          </div>

          {/* Chapitre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="chapter" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Chapitre ou notion <span className="text-stone-400 font-normal lowercase">(optionnel)</span>
            </label>
            <input
              id="chapter"
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Ex : La dissertation littéraire, La Guerre froide, etc."
              className="w-full px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none transition-all"
            />
          </div>

          {/* Contenu */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Détaille ta question <span className="text-[#E75A24]">*</span>
            </label>
            <textarea
              id="content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explique précisément ce que tu n'as pas compris, la phrase du texte qui te bloque ou la méthode sur laquelle tu as un doute..."
              className="w-full p-4 bg-[#F8F5EE] focus:bg-white text-stone-900 placeholder-stone-400 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:ring-2 focus:ring-[#E75A24]/10 focus:outline-none resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Vocal */}
          <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Mic className="w-3.5 h-3.5 text-[#E75A24]" />
                <span>Message vocal <span className="text-stone-400 font-normal lowercase">(optionnel)</span></span>
              </div>
              <span className="text-[11px] text-stone-500">Wolof ou Français</span>
            </div>

            {isRecording ? (
              <AudioRecorder
                onSendAudio={(dur) => {
                  setRecordedAudioDuration(dur);
                  setIsRecording(false);
                }}
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
                  onClick={() => setRecordedAudioDuration(null)}
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

          {/* Footer buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/forum"
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-semibold text-sm transition-colors"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E75A24] hover:bg-[#D04D1B] text-white rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Publication...' : 'Publier ma question'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
