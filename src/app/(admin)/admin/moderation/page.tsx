'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  ChevronRight,
  X,
  AlertTriangle,
  EyeOff,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  reason: string;
  status: 'Nouveau' | 'En attente' | 'Traité';
  author: string;
  reportedBy: string;
  date: string;
  contentSnippet: string;
  iconType: 'shield' | 'file';
}

const initialReports: ReportItem[] = [
  {
    id: '1',
    title: 'Discussion signalée',
    category: 'Forum',
    reason: 'À examiner',
    status: 'Nouveau',
    author: 'El Hadji M.',
    reportedBy: 'Awa Diop',
    date: 'Aujourd\'hui à 14:20',
    contentSnippet: 'Message contenant des propos inappropriés sur le sujet de révision du Bac L.',
    iconType: 'shield',
  },
  {
    id: '2',
    title: 'Document à vérifier',
    category: 'Bibliothèque',
    reason: 'Droit de diffusion',
    status: 'En attente',
    author: 'M. Diop',
    reportedBy: 'Système automatique',
    date: 'Hier à 18:05',
    contentSnippet: 'Manuel scolaire complet scanné au format PDF sans autorisation explicite d\'éditeur.',
    iconType: 'file',
  },
];

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAction = (reportId: string, actionName: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'Traité' as const } : r
      )
    );
    setSelectedReport(null);
    showToast(`Action effectuée : ${actionName}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3833] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Modération
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5 font-normal">
          Forum et contenus signalés.
        </p>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-3.5">
        {reports.map((item) => {
          const Icon = item.iconType === 'shield' ? ShieldCheck : FileText;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedReport(item)}
              className="group flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/70 shadow-xs hover:border-stone-300 hover:shadow-sm hover:bg-[#FAF8F5]/60 transition-all duration-150 cursor-pointer"
            >
              {/* Left icon + info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#111827] text-base truncate group-hover:text-[#0F3833] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-sm text-stone-500 mt-0.5 truncate">
                    {item.category} · {item.reason}
                  </span>
                </div>
              </div>

              {/* Right pill badge + chevron */}
              <div className="flex items-center gap-2 shrink-0 pl-3">
                <span className="px-3.5 py-1 rounded-full bg-[#ECE5D8]/80 text-stone-700 text-xs font-medium">
                  {item.status}
                </span>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions de modération Section */}
      <div className="bg-white rounded-3xl border border-stone-200/70 p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight mb-2">
          Actions de modération
        </h2>
        <p className="text-sm text-stone-500 mb-6 leading-relaxed">
          Consulter le contexte, masquer un contenu si nécessaire, contacter son auteur et consigner la décision.
        </p>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedReport(reports[0])}
            className="inline-flex items-center gap-2 bg-[#E75A24] hover:bg-[#D04D1B] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2]" />
            <span>Examiner</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRulesModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#0F3833] border border-stone-200/80 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            <FileText className="w-4 h-4 stroke-[2]" />
            <span>Voir les règles</span>
          </button>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedReport(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#E75A24]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    {selectedReport.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedReport.category} · {selectedReport.reason}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="py-4 space-y-3.5 text-sm">
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/60 text-stone-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                  Contenu signalé
                </span>
                <p className="italic text-stone-700">« {selectedReport.contentSnippet} »</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-500 block text-xs">Auteur</span>
                  <span className="font-semibold text-stone-900">{selectedReport.author}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-500 block text-xs">Signalé par</span>
                  <span className="font-semibold text-stone-900">{selectedReport.reportedBy}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-500">Date du signalement</span>
                <span className="font-medium text-stone-800">{selectedReport.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-500">Statut actuel</span>
                <span className="px-3 py-0.5 rounded-full bg-[#ECE5D8] text-stone-800 text-xs font-medium">
                  {selectedReport.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                onClick={() => handleAction(selectedReport.id, 'Signalement rejeté (contenu maintenu)')}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors text-center"
              >
                Rejeter le signalement
              </button>
              <button
                onClick={() => handleAction(selectedReport.id, 'Contenu masqué et consigné')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                <span>Masquer le contenu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsRulesModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Règles de modération
                  </h3>
                  <p className="text-xs text-stone-500">
                    Charte de la communauté Téranga S&apos;cool
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-stone-700 max-h-96 overflow-y-auto">
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/60">
                <h4 className="font-bold text-[#0F3833] mb-1">1. Respect mutuel et bienveillance</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tous les échanges sur les forums et espaces d&apos;entraide doivent rester courtois et constructifs. Tout propos injurieux, diffamatoire ou discriminatoire est strictement banni.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/60">
                <h4 className="font-bold text-[#0F3833] mb-1">2. Droits d&apos;auteur et diffusion</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Les ressources partagées dans la bibliothèque doivent respecter le droit de la propriété intellectuelle. Ne publiez que des fiches, cours et exercices dont vous détenez les droits ou issus du domaine public.
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/60">
                <h4 className="font-bold text-[#0F3833] mb-1">3. Protection des données personnelles</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Il est formellement interdit de diffuser des coordonnées privées (numéros de téléphone, adresses personnelles, mots de passe) sur les espaces publics de la plateforme.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0F3833] hover:bg-[#184540] text-white text-sm font-semibold shadow-xs transition-colors"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
