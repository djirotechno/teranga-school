'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Check,
  CheckCircle2,
  Paperclip,
  ChevronRight,
  Upload,
  X,
  Clock,
  Award,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';

interface ExerciseItem {
  exerciceId: string;
  soumissionId?: string;
  title: string;
  subject: string;
  subtitle: string;
  status: 'todo' | 'submitted' | 'corrected';
  statusLabel: string;
  deadline?: string;
  iconBg: string;
  iconColor: string;
  iconType: 'file' | 'check';
  teacher?: string;
  instructions?: string;
  grade?: string;
  teacherFeedback?: string;
  submittedFile?: string;
}

interface SubjectProgress {
  name: string;
  progress: number;
  hours: string;
  gradient: string;
  dotColor: string;
}

const SUBJECT_STYLES: Record<string, { iconBg: string; iconColor: string; gradient: string; dotColor: string }> = {
  Français: {
    iconBg: 'bg-[#FDF0EB]',
    iconColor: 'text-[#E75A24]',
    gradient: 'from-[#E75A24] to-[#F79361]',
    dotColor: 'bg-[#E75A24]',
  },
  'Histoire-Géographie': {
    iconBg: 'bg-[#EAF7EE]',
    iconColor: 'text-[#236B48]',
    gradient: 'from-[#236B48] to-[#409A68]',
    dotColor: 'bg-[#236B48]',
  },
  Philosophie: {
    iconBg: 'bg-[#F0EEFB]',
    iconColor: 'text-[#6355D8]',
    gradient: 'from-[#6355D8] to-[#8C82EA]',
    dotColor: 'bg-[#6355D8]',
  },
};

function formatDeadline(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('fr-SN', { day: 'numeric', month: 'long' });
}

export default function MonSuiviPage() {
  const { profile } = useCurrentProfile();
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);
  const [statsData, setStatsData] = useState({ coursSuivis: 0, heures: 0, corriges: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'submitted' | 'corrected'>('all');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [targetExerciceId, setTargetExerciceId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadComment, setUploadComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSuivi = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const [{ data: exos }, { data: soums }, { data: progs }] = await Promise.all([
        supabase
          .from('exercices')
          .select(
            `
            id,
            titre,
            consignes,
            date_limite,
            matieres ( nom ),
            profiles!exercices_enseignant_id_fkey ( full_name )
          `
          )
          .eq('statut', 'publie')
          .order('created_at', { ascending: false }),
        supabase.from('soumissions_exercices').select('*').eq('eleve_id', profile.id),
        supabase
          .from('progression_cours')
          .select(
            `
            pourcentage,
            temps_passe_secondes,
            cours (
              chapitres (
                matieres ( nom )
              )
            )
          `
          )
          .eq('eleve_id', profile.id),
      ]);

      const soumByExo = new Map((soums ?? []).map((s) => [s.exercice_id, s]));

      const mappedExos: ExerciseItem[] = (exos ?? []).map((e) => {
        const mat = (e.matieres as unknown as { nom: string } | null)?.nom ?? 'Matière';
        const teacher =
          (e.profiles as unknown as { full_name: string } | null)?.full_name ?? 'Enseignant';
        const s = soumByExo.get(e.id);
        const style = SUBJECT_STYLES[mat] ?? {
          iconBg: 'bg-stone-100',
          iconColor: 'text-[#0F3833]',
          gradient: 'from-[#0F3833] to-[#257366]',
          dotColor: 'bg-[#0F3833]',
        };

        const status: 'todo' | 'submitted' | 'corrected' =
          s?.statut === 'corrige'
            ? 'corrected'
            : s?.statut === 'envoye'
            ? 'submitted'
            : 'todo';

        const statusLabel =
          status === 'corrected' ? 'Corrigé' : status === 'submitted' ? 'Envoyé' : 'À faire';

        const dl = formatDeadline(e.date_limite);
        const subtitle =
          status === 'corrected'
            ? `${mat} · Correction disponible${s?.note != null ? ` (${s.note}/20)` : ''}`
            : status === 'submitted'
            ? `${mat} · Travail envoyé`
            : `${mat}${dl ? ` · À remettre le ${dl}` : ''}`;

        return {
          exerciceId: e.id,
          soumissionId: s?.id,
          title: e.titre,
          subject: mat,
          subtitle,
          status,
          statusLabel,
          deadline: dl,
          iconBg: style.iconBg,
          iconColor: style.iconColor,
          iconType: status === 'corrected' ? 'check' : 'file',
          teacher,
          instructions: e.consignes,
          grade: s?.note != null ? `${s.note}/20` : undefined,
          teacherFeedback: s?.feedback_texte ?? undefined,
          submittedFile: s?.fichier_rendu_url?.split('/').pop(),
        };
      });

      setExercises(mappedExos);
      if (mappedExos.length > 0 && !targetExerciceId) {
        setTargetExerciceId(mappedExos[0].exerciceId);
      }

      const bySubject = new Map<string, { sumPct: number; count: number; secs: number }>();
      let totalSecs = 0;
      for (const p of progs ?? []) {
        totalSecs += p.temps_passe_secondes ?? 0;
        const matNom =
          (p.cours as unknown as { chapitres?: { matieres?: { nom?: string } } })?.chapitres
            ?.matieres?.nom ?? 'Général';
        const cur = bySubject.get(matNom) ?? { sumPct: 0, count: 0, secs: 0 };
        cur.sumPct += p.pourcentage;
        cur.count += 1;
        cur.secs += p.temps_passe_secondes ?? 0;
        bySubject.set(matNom, cur);
      }

      const progressList: SubjectProgress[] = Array.from(bySubject.entries()).map(([name, agg]) => {
        const style = SUBJECT_STYLES[name] ?? {
          gradient: 'from-[#0F3833] to-[#257366]',
          dotColor: 'bg-[#0F3833]',
        };
        const mins = Math.round(agg.secs / 60);
        return {
          name,
          progress: Math.round(agg.sumPct / Math.max(1, agg.count)),
          hours: mins >= 60 ? `${(mins / 60).toFixed(1)}h d'étude` : `${mins} min d'étude`,
          gradient: style.gradient,
          dotColor: style.dotColor,
        };
      });

      setSubjectsProgress(progressList);
      setStatsData({
        coursSuivis: (progs ?? []).length,
        heures: Math.max(1, Math.round(totalSecs / 3600)),
        corriges: mappedExos.filter((x) => x.status === 'corrected').length,
      });
    } finally {
      setIsLoading(false);
    }
  }, [profile, targetExerciceId]);

  useEffect(() => {
    loadSuivi();
  }, [loadSuivi]);

  const filteredExercises = exercises.filter((exo) =>
    activeFilter === 'all' ? true : exo.status === activeFilter
  );

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !targetExerciceId) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      let filePath: string | null = null;

      if (uploadFile) {
        const safeName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${profile.id}/${targetExerciceId}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from('devoirs-eleves')
          .upload(path, uploadFile, { upsert: true });

        if (upErr) {
          showToast(`Échec de l'envoi du fichier : ${upErr.message}`, true);
          return;
        }
        filePath = `devoirs-eleves/${path}`;
      }

      const { error } = await supabase.from('soumissions_exercices').upsert(
        {
          exercice_id: targetExerciceId,
          eleve_id: profile.id,
          fichier_rendu_url: filePath,
          commentaire_eleve: uploadComment.trim() || null,
          statut: 'envoye',
          soumis_at: new Date().toISOString(),
        },
        { onConflict: 'exercice_id,eleve_id' }
      );

      if (error) {
        showToast(`Impossible d'enregistrer le rendu : ${error.message}`, true);
        return;
      }

      setIsUploadOpen(false);
      setUploadComment('');
      setUploadFile(null);
      await loadSuivi();
      showToast('Votre travail a été déposé auprès de votre enseignant !');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { label: 'Cours suivis', value: String(statsData.coursSuivis), icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Temps passé', value: `${statsData.heures}h`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Exercices corrigés', value: String(statsData.corriges), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex flex-col gap-7 max-w-5xl mx-auto pb-10">
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

      <div className="flex items-center gap-3">
        <Link
          href="/accueil"
          className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-2xs border border-stone-200/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Mes exercices & suivi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Retrouve tes travaux, dépose tes copies et consulte les corrections de tes enseignants.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {(
          [
            { key: 'all', label: `Tous (${exercises.length})` },
            { key: 'todo', label: 'À faire' },
            { key: 'submitted', label: 'Envoyés' },
            { key: 'corrected', label: 'Corrigés' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-[#FDF0EB] text-[#E75A24] shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex items-center justify-center gap-2 text-stone-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#E75A24]" />
            <span>Chargement de vos exercices...</span>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium">Aucun exercice dans cette catégorie.</p>
          </div>
        ) : (
          filteredExercises.map((exo) => (
            <div
              key={exo.exerciceId}
              onClick={() => setSelectedExercise(exo)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl ${exo.iconBg} ${exo.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {exo.iconType === 'check' ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors truncate">
                    {exo.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                    {exo.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="bg-stone-100 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {exo.statusLabel}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="font-bold text-base sm:text-lg text-stone-900">Déposer un exercice</h3>
        <p className="text-xs sm:text-sm text-stone-500 font-normal">
          Envoie un document ou une photo lisible à ton enseignant.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            disabled={exercises.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] text-white hover:bg-[#D04D1B] font-medium text-sm transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Paperclip className="w-4 h-4" />
            <span>Joindre mon travail</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Progression par matière & Statistiques</span>
          <Sparkles className="w-4 h-4 text-[#E75A24]" />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5"
              >
                <div className={`p-3 rounded-xl ${s.bg} ${s.color} shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-stone-900">{s.value}</span>
                  <p className="text-xs text-stone-500 font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {subjectsProgress.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">Avancement par discipline</h3>
                <p className="text-xs text-stone-500">Calculé en direct depuis votre progression</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EAF7EE] text-[#236B48]">
                Objectif Bac : 75%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {subjectsProgress.map((sp) => (
                <div
                  key={sp.name}
                  className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100/90 flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${sp.dotColor} shrink-0`} />
                      <span className="font-bold text-stone-900 truncate">{sp.name}</span>
                    </div>
                    <span className="text-xs text-stone-500 font-semibold shrink-0">
                      {sp.hours}
                    </span>
                  </div>
                  <ProgressBar
                    progress={sp.progress}
                    gradientClass={sp.gradient}
                    heightClass="h-2.5"
                    showPercentage={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${selectedExercise.iconBg} ${selectedExercise.iconColor} flex items-center justify-center`}
                >
                  {selectedExercise.iconType === 'check' ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900 leading-snug">
                    {selectedExercise.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {selectedExercise.subject} · {selectedExercise.teacher}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-100 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 text-xs font-medium">Statut</span>
                <span className="bg-white px-3 py-0.5 rounded-full border border-stone-200 text-xs font-bold text-stone-800">
                  {selectedExercise.statusLabel}
                </span>
              </div>
              {selectedExercise.deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs font-medium">Date limite</span>
                  <span className="font-semibold text-stone-800 text-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E75A24]" />
                    {selectedExercise.deadline}
                  </span>
                </div>
              )}
              {selectedExercise.grade && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 text-xs font-medium">Note obtenue</span>
                  <span className="font-black text-emerald-700 text-base bg-emerald-100/80 px-2.5 py-0.5 rounded-lg">
                    {selectedExercise.grade}
                  </span>
                </div>
              )}
            </div>

            {selectedExercise.instructions && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Consigne de l&apos;enseignant
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                  {selectedExercise.instructions}
                </p>
              </div>
            )}

            {selectedExercise.teacherFeedback && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Commentaire du professeur
                </h4>
                <p className="text-sm text-emerald-900 leading-relaxed bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                  {selectedExercise.teacherFeedback}
                </p>
              </div>
            )}

            {selectedExercise.submittedFile && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                <FileText className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">Copie déposée : {selectedExercise.submittedFile}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              {selectedExercise.status !== 'corrected' ? (
                <button
                  onClick={() => {
                    setTargetExerciceId(selectedExercise.exerciceId);
                    setSelectedExercise(null);
                    setIsUploadOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E75A24] text-white hover:bg-[#D04D1B] font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                >
                  {selectedExercise.status === 'submitted'
                    ? 'Remplacer ma copie'
                    : 'Joindre ma copie'}
                </button>
              ) : (
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF0EB] text-[#E75A24] flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">Déposer un travail</h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Exercice concerné
                </label>
                <select
                  value={targetExerciceId}
                  onChange={(e) => setTargetExerciceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-medium text-stone-800 outline-none focus:border-[#E75A24]"
                >
                  {exercises.map((exo) => (
                    <option key={exo.exerciceId} value={exo.exerciceId}>
                      {exo.subject} — {exo.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Fichier ou photo (PDF, PNG, JPG, DOCX)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-[#E75A24] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50"
                >
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#E75A24]">
                      <FileText className="w-5 h-5" />
                      <span className="truncate">{uploadFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-stone-500">
                      <Upload className="w-6 h-6 text-stone-400" />
                      <span className="text-xs font-semibold text-stone-700">
                        Clique pour choisir un fichier ou une photo
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Max 15 Mo · PDF, JPG, PNG, DOCX
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message ou réponse écrite pour l&apos;enseignant
                </label>
                <textarea
                  rows={3}
                  placeholder="Rédige ton commentaire ou ta réponse..."
                  value={uploadComment}
                  onChange={(e) => setUploadComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm text-stone-800 outline-none focus:border-[#E75A24] placeholder:text-stone-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || (!uploadFile && !uploadComment.trim())}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Envoyer à l&apos;enseignant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
