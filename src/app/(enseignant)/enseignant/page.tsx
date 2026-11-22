'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  FileText,
  MessageCircle,
  Plus,
  ChevronRight,
  X,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
  Download,
} from 'lucide-react';

interface PriorityItem {
  id: string;
  type: 'forum' | 'exercice' | 'message';
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  author: string;
  time: string;
  badge?: string;
  previewText?: string;
}

export default function DashboardEnseignantPage() {
  const [activeModalItem, setActiveModalItem] = useState<PriorityItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [grade, setGrade] = useState('16');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Statistics from the design
  const stats = [
    {
      label: 'Questions à traiter',
      value: 8,
      href: '/enseignant/forum',
    },
    {
      label: 'Exercices reçus',
      value: 4,
      href: '/enseignant/eleves',
    },
    {
      label: 'Cours publiés',
      value: 12,
      href: '/enseignant/cours',
    },
  ];

  // Priority tasks from the design
  const priorityItems: PriorityItem[] = [
    {
      id: 'priority-forum-1',
      type: 'forum',
      icon: Mic,
      title: 'Argument ou exemple ?',
      subtitle: 'Forum · Awa Diop',
      author: 'Awa Diop',
      time: 'Il y a 25 min',
      badge: 'Vocal + Texte',
      previewText:
        "Bonjour M. Diop, dans la sous-partie de ma dissertation littéraire, je n'arrive pas bien à distinguer si ma référence à Senghor doit servir d'argument direct ou simplement d'exemple d'illustration. Pouvez-vous m'éclairer ?",
    },
    {
      id: 'priority-exercice-2',
      type: 'exercice',
      icon: FileText,
      title: 'Introduction à corriger',
      subtitle: 'Exercice reçu · Awa Diop',
      author: 'Awa Diop',
      time: 'Il y a 1h',
      badge: 'Exercice N°3',
      previewText:
        "Sujet : « L'écrivain est-il le reflet de son époque ? »\n\nIntroduction rédigée :\nDepuis les origines de la littérature, les auteurs s'inspirent des bouleversements sociopolitiques pour forger leurs œuvres. De la négritude aux romans contemporains, l'écriture semble indissociable du contexte historique. Dès lors, convient-il de concevoir l'auteur comme un témoin passif ou comme un acteur engagé ?",
    },
    {
      id: 'priority-message-3',
      type: 'message',
      icon: MessageCircle,
      title: 'Une nouvelle question privée',
      subtitle: 'Messages · 2 non lus',
      author: 'Awa Diop',
      time: 'Il y a 10 min',
      badge: '2 messages non lus',
      previewText:
        "Bonjour Monsieur, est-ce que le devoir sur table de vendredi portera uniquement sur le théâtre ou également sur la poésie engagée ?",
    },
  ];

  const handleOpenItem = (item: PriorityItem) => {
    setActiveModalItem(item);
    setFeedbackSent(false);
    setReplyText('');
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setActiveModalItem(null);
      setFeedbackSent(false);
      setReplyText('');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Greetings */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3833] tracking-tight">
          Bonjour M. Diop
        </h1>
        <p className="text-stone-500 font-medium text-sm sm:text-base mt-1.5">
          Espace enseignant · Français
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-stone-300 hover:shadow-md transition-all group flex flex-col justify-center"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#0F3833] tracking-tight group-hover:text-[#E75A24] transition-colors">
              {stat.value}
            </div>
            <div className="text-stone-500 font-medium text-xs sm:text-sm mt-1.5">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Priority Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            À traiter en priorité
          </h2>
          <Link
            href="/enseignant/cours/publier"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-semibold text-sm sm:text-base shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Publier un cours</span>
          </Link>
        </div>

        {/* Priority items list */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {priorityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-stone-300 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
              >
                {/* Left side: Icon badge + titles */}
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] flex items-center justify-center shrink-0 text-[#0F3833] group-hover:scale-105 group-hover:bg-[#d8e9e4] transition-all">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-stone-900 text-base sm:text-lg truncate group-hover:text-[#E75A24] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-stone-500 font-medium text-xs sm:text-sm mt-0.5 truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right chevron */}
                <div className="pl-3">
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View & Action Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F1EE] flex items-center justify-center text-[#0F3833] shrink-0">
                  {React.createElement(activeModalItem.icon, {
                    className: 'w-6 h-6',
                    strokeWidth: 2,
                  })}
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-stone-900">
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {activeModalItem.subtitle} · {activeModalItem.time}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#EAE3D6] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Message de {activeModalItem.author}</span>
                  <span className="bg-[#0F3833]/10 text-[#0F3833] px-2.5 py-0.5 rounded-full">
                    {activeModalItem.badge}
                  </span>
                </div>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {activeModalItem.previewText}
                </p>
              </div>

              {/* Specific controls for Exercice correction */}
              {activeModalItem.type === 'exercice' && (
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                  <Award className="w-6 h-6 text-emerald-700 shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Attribuer une note indicative
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-16 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold text-center text-sm focus:outline-emerald-600"
                      />
                      <span className="text-emerald-900 font-semibold text-sm">
                        / 20
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Form */}
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Votre retour d&apos;enseignant (texte ou note)
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Rédiger une réponse pédagogique pour ${activeModalItem.author}...`}
                  className="w-full p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-stone-900 text-sm focus:bg-white focus:border-[#E75A24] focus:outline-none transition-all placeholder:text-stone-400"
                />

                {feedbackSent && (
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Réponse envoyée avec succès à l&apos;élève !</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <Link
                    href={
                      activeModalItem.type === 'forum'
                        ? '/enseignant/forum'
                        : activeModalItem.type === 'exercice'
                        ? '/enseignant/eleves'
                        : '/enseignant/messages'
                    }
                    className="text-xs sm:text-sm font-semibold text-[#0F3833] hover:underline flex items-center gap-1"
                  >
                    <span>Ouvrir l&apos;espace complet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="submit"
                    disabled={!replyText.trim() || feedbackSent}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white font-medium text-sm transition-all cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer la réponse</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
