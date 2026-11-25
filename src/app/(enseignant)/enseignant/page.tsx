'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  ArrowRight,
  Award,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { formatRelativeTime } from '@/lib/utils/formatters';

interface PriorityItem {
  id: string;
  targetId: string;
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
  const { profile } = useCurrentProfile();
  const [kpi, setKpi] = useState({ questions: 0, exercices: 0, cours: 0 });
  const [priorityItems, setPriorityItems] = useState<PriorityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeModalItem, setActiveModalItem] = useState<PriorityItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [grade, setGrade] = useState('16');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const [
        { data: forumRows },
        { data: soumRows },
        { count: coursCount },
        { data: convRows },
      ] = await Promise.all([
        supabase
          .from('forum_discussions')
          .select('id, titre, contenu, audio_url, created_at, profiles!forum_discussions_author_id_fkey ( full_name )')
          .eq('is_resolved', false)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('soumissions_exercices')
          .select(
            `
            id,
            commentaire_eleve,
            fichier_rendu_url,
            soumis_at,
            exercices ( titre ),
            eleve:profiles!soumissions_exercices_eleve_id_fkey ( full_name )
          `
          )
          .eq('statut', 'envoye')
          .order('soumis_at', { ascending: false })
          .limit(5),
        profile.role === 'admin'
          ? supabase.from('cours').select('id', { count: 'exact', head: true })
          : supabase
              .from('cours')
              .select('id', { count: 'exact', head: true })
              .eq('enseignant_id', profile.id),
        supabase
          .from('conversations')
          .select(
            `
            id,
            last_message_at,
            eleve:profiles!conversations_eleve_id_fkey ( full_name ),
            messages ( id, sender_id, contenu, is_read, created_at )
          `
          )
          .eq('enseignant_id', profile.id)
          .order('last_message_at', { ascending: false })
          .limit(5),
      ]);

      setKpi({
        questions: (forumRows ?? []).length,
        exercices: (soumRows ?? []).length,
        cours: coursCount ?? 0,
      });

      const items: PriorityItem[] = [];

      for (const s of soumRows ?? []) {
        const exoTitle = (s.exercices as unknown as { titre: string } | null)?.titre ?? 'Exercice';
        const eleveName = (s.eleve as unknown as { full_name: string } | null)?.full_name ?? 'Élève';
        items.push({
          id: `exo-${s.id}`,
          targetId: s.id,
          type: 'exercice',
          icon: FileText,
          title: exoTitle,
          subtitle: `Exercice reçu · ${eleveName}`,
          author: eleveName,
          time: formatRelativeTime(s.soumis_at),
          badge: 'À corriger',
          previewText:
            s.commentaire_eleve ||
            (s.fichier_rendu_url
              ? `Copie déposée : ${s.fichier_rendu_url.split('/').pop()}`
              : 'Devoir soumis par l’élève.'),
        });
      }

      for (const f of forumRows ?? []) {
        const authorName =
          (f.profiles as unknown as { full_name: string } | null)?.full_name ?? 'Élève';
        items.push({
          id: `forum-${f.id}`,
          targetId: f.id,
          type: 'forum',
          icon: Mic,
          title: f.titre,
          subtitle: `Forum · ${authorName}`,
          author: authorName,
          time: formatRelativeTime(f.created_at),
          badge: f.audio_url ? 'Vocal + Texte' : 'Question forum',
          previewText: f.contenu ?? 'Question vocale.',
        });
      }

      for (const c of convRows ?? []) {
        const eleveName =
          (c.eleve as unknown as { full_name: string } | null)?.full_name ?? 'Élève';
        const rawMsgs = (c.messages as unknown as Array<{
          id: string;
          sender_id: string;
          contenu: string | null;
          is_read: boolean;
          created_at: string;
        }>) ?? [];
        const unreadMsgs = rawMsgs.filter((m) => m.sender_id !== profile.id && !m.is_read);
        if (unreadMsgs.length > 0) {
          const latest = unreadMsgs[unreadMsgs.length - 1];
          items.push({
            id: `msg-${c.id}`,
            targetId: c.id,
            type: 'message',
            icon: MessageCircle,
            title: `Message de ${eleveName}`,
            subtitle: `Messages · ${unreadMsgs.length} non lu${unreadMsgs.length > 1 ? 's' : ''}`,
            author: eleveName,
            time: formatRelativeTime(latest.created_at),
            badge: `${unreadMsgs.length} non lu${unreadMsgs.length > 1 ? 's' : ''}`,
            previewText: latest.contenu ?? 'Note vocale reçue.',
          });
        }
      }

      setPriorityItems(items);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = [
    { label: 'Questions à traiter', value: kpi.questions, href: '/enseignant/forum' },
    { label: 'Exercices à corriger', value: kpi.exercices, href: '/enseignant/eleves' },
    { label: 'Cours publiés', value: kpi.cours, href: '/enseignant/cours' },
  ];

  const handleOpenItem = (item: PriorityItem) => {
    setActiveModalItem(item);
    setFeedbackSent(false);
    setErrorMsg(null);
    setReplyText('');
    setGrade('16');
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeModalItem || !profile) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();

      if (activeModalItem.type === 'exercice') {
        const numericGrade = Math.min(20, Math.max(0, Number(grade)));
        const { error } = await supabase
          .from('soumissions_exercices')
          .update({
            statut: 'corrige',
            note: numericGrade,
            feedback_texte: replyText.trim(),
            corrige_par: profile.id,
            corrige_at: new Date().toISOString(),
          })
          .eq('id', activeModalItem.targetId);

        if (error) {
          setErrorMsg(error.message);
          return;
        }
      } else if (activeModalItem.type === 'forum') {
        const { error } = await supabase.from('forum_reponses').insert({
          discussion_id: activeModalItem.targetId,
          author_id: profile.id,
          contenu: replyText.trim(),
          is_validated: true,
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
      } else if (activeModalItem.type === 'message') {
        const { error } = await supabase.from('messages').insert({
          conversation_id: activeModalItem.targetId,
          sender_id: profile.id,
          contenu: replyText.trim(),
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        await supabase.rpc('mark_conversation_as_read', {
          p_conversation_id: activeModalItem.targetId,
        });
      }

      setFeedbackSent(true);
      await loadDashboard();
      setTimeout(() => {
        setActiveModalItem(null);
        setFeedbackSent(false);
        setReplyText('');
      }, 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3833] tracking-tight">
          Bonjour {profile?.full_name ?? 'Enseignant'}
        </h1>
        <p className="text-stone-500 font-medium text-sm sm:text-base mt-1.5">
          Espace enseignant · Tableau de bord en direct
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

        {isLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-stone-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
            <span>Chargement des tâches prioritaires...</span>
          </div>
        ) : priorityItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EAE3D6] text-center text-stone-500 text-sm">
            Aucune tâche en attente pour le moment. Bravo !
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {priorityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-stone-300 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] flex items-center justify-center shrink-0 text-[#0F3833] group-hover:scale-105 group-hover:bg-[#d8e9e4] transition-all">
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-stone-900 text-base sm:text-lg truncate group-hover:text-[#E75A24] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-stone-500 font-medium text-xs sm:text-sm mt-0.5 truncate">
                        {item.subtitle} · {item.time}
                      </span>
                    </div>
                  </div>
                  <div className="pl-3">
                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-800 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F1EE] flex items-center justify-center text-[#0F3833] shrink-0">
                  {React.createElement(activeModalItem.icon, { className: 'w-6 h-6', strokeWidth: 2 })}
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
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#EAE3D6] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>Message de {activeModalItem.author}</span>
                  {activeModalItem.badge && (
                    <span className="bg-[#0F3833]/10 text-[#0F3833] px-2.5 py-0.5 rounded-full">
                      {activeModalItem.badge}
                    </span>
                  )}
                </div>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {activeModalItem.previewText}
                </p>
              </div>

              {activeModalItem.type === 'exercice' && (
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                  <Award className="w-6 h-6 text-emerald-700 shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Attribuer une note
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-20 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold text-center text-sm focus:outline-emerald-600"
                      />
                      <span className="text-emerald-900 font-semibold text-sm">/ 20</span>
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendFeedback} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Votre retour d&apos;enseignant
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Rédiger une réponse pédagogique pour ${activeModalItem.author}...`}
                  className="w-full p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-stone-900 text-sm focus:bg-white focus:border-[#E75A24] focus:outline-none transition-all"
                />

                {feedbackSent && (
                  <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Enregistré et envoyé à l&apos;élève !</span>
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
                    disabled={!replyText.trim() || submitting || feedbackSent}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white font-medium text-sm transition-all cursor-pointer shadow-xs"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>
                      {activeModalItem.type === 'exercice'
                        ? 'Valider la correction'
                        : 'Envoyer la réponse'}
                    </span>
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
