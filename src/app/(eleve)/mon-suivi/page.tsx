'use client';

import React, { useState, useRef } from 'react';
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
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface Exercise {
  id: string;
  title: string;
  subject: string;
  subtitle: string;
  status: 'todo' | 'submitted' | 'corrected';
  statusLabel: string;
  deadline?: string;
  iconBg: string;
  iconColor: string;
  iconType: 'file' | 'check';
  // Detail modal information
  teacher?: string;
  instructions?: string;
  grade?: string;
  teacherFeedback?: string;
  submittedFile?: string;
}

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'exo-1',
    title: 'Construire une introduction',
    subject: 'Français',
    subtitle: 'Français · À remettre le 20 novembre',
    status: 'todo',
    statusLabel: 'À faire',
    deadline: '20 novembre',
    iconBg: 'bg-[#FDF0EB]',
    iconColor: 'text-[#E75A24]',
    iconType: 'file',
    teacher: 'M. Diop',
    instructions:
      'Rédige une introduction complète sur le sujet : "La littérature permet-elle de transformer la société ?". N\'oublie pas d\'inclure l\'accroche, la définition des termes clés, la problématique et l\'annonce du plan.',
  },
  {
    id: 'exo-2',
    title: 'Analyser une carte des flux',
    subject: 'Histoire-Géo',
    subtitle: 'Histoire-Géo · Travail envoyé',
    status: 'submitted',
    statusLabel: 'Envoyé',
    iconBg: 'bg-[#EAF7EE]',
    iconColor: 'text-[#236B48]',
    iconType: 'file',
    teacher: 'M. Cissé',
    instructions:
      'Étude critique de la carte des flux migratoires mondiaux au XXIe siècle.',
    submittedFile: 'analyse_flux_awa_diop.pdf',
  },
  {
    id: 'exo-3',
    title: 'Distinguer opinion et raison',
    subject: 'Philosophie',
    subtitle: 'Philosophie · Correction disponible',
    status: 'corrected',
    statusLabel: 'Corrigé',
    iconBg: 'bg-[#F0EEFB]',
    iconColor: 'text-[#6355D8]',
    iconType: 'check',
    teacher: 'Mme Sow',
    grade: '16/20',
    teacherFeedback:
      'Très bon devoir Awa. La distinction conceptuelle entre doxa et épistémè est claire et bien illustrée. Pense à approfondir l\'exemple de Platon dans la deuxième partie.',
    submittedFile: 'dissertation_philo_awa.pdf',
  },
];

export default function MonSuiviPage() {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'submitted' | 'corrected'>('todo');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState('Français');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadComment, setUploadComment] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Cours suivis', value: '14', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Temps passé', value: '28h', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Exercices réussis', value: '42', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const subjectsProgress = [
    {
      name: 'Français',
      progress: 68,
      hours: '12h d\'étude',
      gradient: 'from-[#E75A24] to-[#F79361]',
      dotColor: 'bg-[#E75A24]',
    },
    {
      name: 'Histoire-Géographie',
      progress: 45,
      hours: '8h d\'étude',
      gradient: 'from-[#236B48] to-[#409A68]',
      dotColor: 'bg-[#236B48]',
    },
    {
      name: 'Philosophie',
      progress: 30,
      hours: '5h d\'étude',
      gradient: 'from-[#6355D8] to-[#8C82EA]',
      dotColor: 'bg-[#6355D8]',
    },
    {
      name: 'Mathématiques',
      progress: 55,
      hours: '9h d\'étude',
      gradient: 'from-[#0F3833] to-[#257366]',
      dotColor: 'bg-[#0F3833]',
    },
  ];

  const filteredExercises = exercises.filter((exo) => {
    if (activeFilter === 'all') return true;
    return exo.status === activeFilter;
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newExo: Exercise = {
      id: `exo-${Date.now()}`,
      title: uploadTitle.trim(),
      subject: uploadSubject,
      subtitle: `${uploadSubject} · Travail envoyé`,
      status: 'submitted',
      statusLabel: 'Envoyé',
      iconBg: 'bg-[#EAF7EE]',
      iconColor: 'text-[#236B48]',
      iconType: 'file',
      teacher: uploadSubject === 'Français' ? 'M. Diop' : uploadSubject === 'Philosophie' ? 'Mme Sow' : 'M. Cissé',
      instructions: uploadComment || 'Exercice déposé par l\'élève.',
      submittedFile: uploadFile ? uploadFile.name : 'devoir_soumis.pdf',
    };

    setExercises((prev) => [newExo, ...prev]);
    setIsUploadOpen(false);
    setUploadTitle('');
    setUploadComment('');
    setUploadFile(null);
    setUploadSuccessMessage('Votre travail a été déposé avec succès auprès de votre enseignant !');
    setTimeout(() => setUploadSuccessMessage(''), 5000);
  };

  return (
    <div className="flex flex-col gap-7 max-w-5xl mx-auto pb-10">
      {/* 1. Header Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href="/accueil"
          className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-2xs border border-stone-200/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Mes exercices
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Retrouve les travaux recommandés par tes enseignants.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {uploadSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{uploadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMessage('')}
            className="text-emerald-600 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Filter Tabs (Matching the screenshot) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          type="button"
          onClick={() => setActiveFilter('todo')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'todo'
              ? 'bg-[#FDF0EB] text-[#E75A24] shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          À faire
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('submitted')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'submitted'
              ? 'bg-[#FDF0EB] text-[#E75A24] shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Envoyés
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('corrected')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'corrected'
              ? 'bg-[#FDF0EB] text-[#E75A24] shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Corrigés
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#FDF0EB] text-[#E75A24] shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          Tous ({exercises.length})
        </button>
      </div>

      {/* 3. Exercises List Card (Matching the screenshot) */}
      <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {filteredExercises.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium">Aucun exercice dans cette catégorie.</p>
          </div>
        ) : (
          filteredExercises.map((exo) => (
            <div
              key={exo.id}
              onClick={() => setSelectedExercise(exo)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Icon square */}
                <div
                  className={`w-11 h-11 rounded-xl ${exo.iconBg} ${exo.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {exo.iconType === 'check' ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                {/* Title & metadata */}
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors truncate">
                    {exo.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-0.5 truncate">
                    {exo.subtitle}
                  </p>
                </div>
              </div>

              {/* Status pill & chevron */}
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

      {/* 4. Déposer un exercice Card (Matching the screenshot) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="font-bold text-base sm:text-lg text-stone-900">
          Déposer un exercice
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-normal">
          Envoie un document ou une photo lisible à ton enseignant.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] text-white hover:bg-[#D04D1B] font-medium text-sm transition-all shadow-xs active:scale-95"
          >
            <Paperclip className="w-4 h-4" />
            <span>Joindre mon travail</span>
          </button>
        </div>
      </div>

      {/* 5. Statistiques & Progression par matière (Enhanced Progress Bars) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Progression par matière & Statistiques</span>
            <Sparkles className="w-4 h-4 text-[#E75A24]" />
          </h2>
        </div>

        {/* 3 Stats Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3.5 hover:shadow-sm transition-shadow"
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

        {/* Enhanced Progress Bars Grid */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Avancement par discipline
              </h3>
              <p className="text-xs text-stone-500">
                Évolution de tes chapitres et exercices validés
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EAF7EE] text-[#236B48]">
              Objectif Bac : 75%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {subjectsProgress.map((sp) => (
              <div
                key={sp.name}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100/90 flex flex-col gap-2.5 hover:bg-stone-50 transition-colors"
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

                {/* Enhanced modern progress bar */}
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
      </div>

      {/* Modal: Exercise Details */}
      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-100 space-y-5 animate-in zoom-in-95"
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
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
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
                  Consigne de l'enseignant
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
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-800 truncate">
                  <FileText className="w-4 h-4 text-stone-500 shrink-0" />
                  <span className="truncate">{selectedExercise.submittedFile}</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#E75A24] hover:underline shrink-0 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              {selectedExercise.status === 'todo' && (
                <button
                  onClick={() => {
                    setSelectedExercise(null);
                    setUploadSubject(selectedExercise.subject);
                    setUploadTitle(`Rendu : ${selectedExercise.title}`);
                    setIsUploadOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E75A24] text-white hover:bg-[#D04D1B] font-semibold text-sm transition-colors shadow-xs"
                >
                  Joindre ma copie
                </button>
              )}
              {selectedExercise.status !== 'todo' && (
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Déposer un exercice */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-100 space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF0EB] text-[#E75A24] flex items-center justify-center">
                  <Paperclip className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  Déposer un travail
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              {/* Matière */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Matière
                </label>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-medium text-stone-800 outline-none focus:border-[#E75A24]"
                >
                  <option value="Français">Français</option>
                  <option value="Histoire-Géo">Histoire-Géographie</option>
                  <option value="Philosophie">Philosophie</option>
                  <option value="Mathématiques">Mathématiques</option>
                </select>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Titre du travail ou de l'exercice
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Dissertation sur l'art, Fiche de révision..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-medium text-stone-800 outline-none focus:border-[#E75A24] placeholder:text-stone-400"
                />
              </div>

              {/* File upload box */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Fichier ou photo (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
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
                        Max 10 Mo · PDF, JPG, PNG
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Commentaire optionnel */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message ou note pour l'enseignant (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Une question ou précision sur votre travail..."
                  value={uploadComment}
                  onChange={(e) => setUploadComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm text-stone-800 outline-none focus:border-[#E75A24] placeholder:text-stone-400 resize-none"
                />
              </div>

              {/* Submit buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!uploadTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  Envoyer à l'enseignant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
