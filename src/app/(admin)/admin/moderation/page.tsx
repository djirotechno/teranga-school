'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  FileText,
  ChevronRight,
  X,
  AlertTriangle,
  EyeOff,
  CheckCircle2,
  BookOpen,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { formatRelativeTime } from '@/lib/utils/formatters';
import type { Enums } from '@/types/database';

interface ReportRow {
  id: string;
  target_type: Enums<'signalement_target_type'>;
  motif: string;
  extrait: string | null;
  statut: Enums<'signalement_status'>;
  reporterName: string;
  created_at: string;
}

const TARGET_LABELS: Record<Enums<'signalement_target_type'>, string> = {
  forum_discussion: 'Forum (Discussion)',
  forum_reponse: 'Forum (Réponse)',
  bibliotheque: 'Bibliothèque',
  commentaire: 'Commentaire de cours',
};

const STATUS_LABELS: Record<Enums<'signalement_status'>, string> = {
  en_attente: 'En attente',
  traite: 'Traité',
  rejete: 'Rejeté',
};

export default function AdminModerationPage() {
  const { profile } = useCurrentProfile();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('signalements')
        .select(
          `
          id,
          target_type,
          motif,
          extrait,
          statut,
          created_at,
          reporter:profiles!signalements_reporter_id_fkey ( full_name )
        `
        )
        .order('created_at', { ascending: false });

      if (error) {
        showToast(error.message, true);
        return;
      }

      const mapped: ReportRow[] = (data ?? []).map((r) => ({
        id: r.id,
        target_type: r.target_type,
        motif: r.motif,
        extrait: r.extrait,
        statut: r.statut,
        reporterName:
          (r.reporter as unknown as { full_name: string } | null)?.full_name ?? 'Système',
        created_at: r.created_at,
      }));
      setReports(mapped);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleAction = async (
    reportId: string,
    newStatut: 'traite' | 'rejete',
    notes: string
  ) => {
    if (!profile) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('signalements')
        .update({
          statut: newStatut,
          treated_by: profile.id,
          treated_at: new Date().toISOString(),
          notes_moderation: notes,
        })
        .eq('id', reportId);

      if (error) {
        showToast(`Erreur : ${error.message}`, true);
        return;
      }

      setSelectedReport(null);
      await loadReports();
      showToast(`Décision enregistrée : ${notes}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 ${
            toast.error ? 'bg-red-700' : 'bg-[#0F3833]'
          }`}
        >
          {toast.error ? (
            <AlertCircle className="w-5 h-5 text-red-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Modération
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5">
          Forum et contenus signalés ({reports.filter((r) => r.statut === 'en_attente').length} en attente).
        </p>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
          <span>Chargement des signalements...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200/70 text-center text-stone-500 text-sm">
          Aucun signalement à traiter.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {reports.map((item) => {
            const Icon = item.target_type === 'bibliotheque' ? FileText : ShieldCheck;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedReport(item)}
                className="group flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/70 shadow-xs hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#111827] text-base truncate">
                      {item.motif}
                    </span>
                    <span className="text-sm text-stone-500 mt-0.5 truncate">
                      {TARGET_LABELS[item.target_type]} · Signalé par {item.reporterName} ·{' '}
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-3">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                      item.statut === 'en_attente'
                        ? 'bg-amber-50 text-amber-700'
                        : item.statut === 'traite'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {STATUS_LABELS[item.statut]}
                  </span>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions box */}
      <div className="bg-white rounded-3xl border border-stone-200/70 p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
          Charte & Modération
        </h2>
        <p className="text-sm text-stone-500 mb-5">
          Consultez le contexte d&apos;un signalement, masquez un contenu si nécessaire et consignez la décision.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {reports[0] && (
            <button
              type="button"
              onClick={() => setSelectedReport(reports[0])}
              className="inline-flex items-center gap-2 bg-[#E75A24] hover:bg-[#D04D1B] text-white px-5 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Examiner le dernier</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsRulesModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#0F3833] border border-stone-200 px-5 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Voir les règles</span>
          </button>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setSelectedReport(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F1EE] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#E75A24]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">{selectedReport.motif}</h3>
                  <p className="text-xs text-stone-500">
                    {TARGET_LABELS[selectedReport.target_type]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-sm">
              {selectedReport.extrait && (
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                    Extrait signalé
                  </span>
                  <p className="italic text-stone-700">« {selectedReport.extrait} »</p>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Signalé par</span>
                <span className="font-semibold text-stone-900">{selectedReport.reporterName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Statut actuel</span>
                <span className="font-semibold text-stone-800">
                  {STATUS_LABELS[selectedReport.statut]}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                disabled={saving}
                onClick={() =>
                  handleAction(selectedReport.id, 'rejete', 'Signalement rejeté (contenu conforme)')
                }
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 cursor-pointer disabled:opacity-60"
              >
                Rejeter le signalement
              </button>
              <button
                disabled={saving}
                onClick={() =>
                  handleAction(selectedReport.id, 'traite', 'Contenu masqué et consigné')
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                <span>Marquer comme traité</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsRulesModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Règles de modération</h3>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-stone-600">
              <p><strong>1. Respect mutuel</strong> : échanges courtois et bienveillants uniquement.</p>
              <p><strong>2. Droits d&apos;auteur</strong> : ne partager que des ressources autorisées.</p>
              <p><strong>3. Données personnelles</strong> : ne jamais diffuser de coordonnées privées.</p>
            </div>
            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0F3833] text-white text-sm font-semibold cursor-pointer"
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
