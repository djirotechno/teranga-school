'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Clock,
  ChevronRight,
  Check,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import type { Enums } from '@/types/database';

interface SubscriptionRow {
  id: string;
  eleve_id: string;
  eleveName: string;
  plan_nom: string;
  statut: Enums<'abonnement_status'>;
  date_fin: string | null;
  montant_xof: number;
  methode_paiement: Enums<'paiement_methode'>;
  paytech_ref: string | null;
}

interface StudentOption {
  id: string;
  full_name: string;
}

const STATUS_LABEL: Record<Enums<'abonnement_status'>, string> = {
  actif: 'Actif',
  en_attente: 'En attente',
  a_renouveler: 'À renouveler',
  expire: 'Expiré',
};

function formatDateFr(iso?: string | null): string {
  if (!iso) return 'Paiement à vérifier';
  return `Expire le ${new Date(iso).toLocaleDateString('fr-SN')}`;
}

export default function AdminAbonnementsPage() {
  const { profile } = useCurrentProfile();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedEleveId, setSelectedEleveId] = useState('');
  const [selectedDetailModal, setSelectedDetailModal] = useState<SubscriptionRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const [{ data: aboData }, { data: eleveData }] = await Promise.all([
        supabase
          .from('abonnements')
          .select(
            `
            id,
            eleve_id,
            plan_nom,
            statut,
            date_fin,
            montant_xof,
            methode_paiement,
            paytech_ref,
            eleve:profiles!abonnements_eleve_id_fkey ( full_name )
          `
          )
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'eleve')
          .order('full_name', { ascending: true }),
      ]);

      const mapped: SubscriptionRow[] = (aboData ?? []).map((a) => ({
        id: a.id,
        eleve_id: a.eleve_id,
        eleveName: (a.eleve as unknown as { full_name: string } | null)?.full_name ?? 'Élève',
        plan_nom: a.plan_nom,
        statut: a.statut,
        date_fin: a.date_fin,
        montant_xof: a.montant_xof,
        methode_paiement: a.methode_paiement,
        paytech_ref: a.paytech_ref,
      }));

      setSubscriptions(mapped);
      const stuList = eleveData ?? [];
      setStudents(stuList);
      if (stuList.length > 0 && !selectedEleveId) {
        const pending = mapped.find((m) => m.statut === 'en_attente');
        setSelectedEleveId(pending?.eleve_id ?? stuList[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedEleveId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCount = subscriptions.filter((s) => s.statut === 'actif').length;
  const pendingCount = subscriptions.filter((s) => s.statut !== 'actif').length;

  const handleValidateForStudent = async (eleveId: string) => {
    if (!profile || !eleveId) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const now = new Date();
      const nextYear = new Date(now);
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      const existing = subscriptions.find((s) => s.eleve_id === eleveId);

      if (existing) {
        const { error } = await supabase
          .from('abonnements')
          .update({
            statut: 'actif',
            date_debut: now.toISOString(),
            date_fin: nextYear.toISOString(),
            validated_by: profile.id,
            validated_at: now.toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          showToast(`Erreur : ${error.message}`, true);
          return;
        }
      } else {
        const { error } = await supabase.from('abonnements').insert({
          eleve_id: eleveId,
          plan_nom: 'Pack Terminale Annuel',
          statut: 'actif',
          date_debut: now.toISOString(),
          date_fin: nextYear.toISOString(),
          montant_xof: 15000,
          methode_paiement: 'manuel',
          paytech_ref: `MAN-${Date.now().toString().slice(-6)}`,
          validated_by: profile.id,
          validated_at: now.toISOString(),
        });

        if (error) {
          showToast(`Erreur : ${error.message}`, true);
          return;
        }
      }

      const name = students.find((s) => s.id === eleveId)?.full_name ?? 'l’élève';
      setSelectedDetailModal(null);
      await loadData();
      showToast(`Accès validé et prolongé d'un an pour ${name} !`);
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
            <Check className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Abonnements
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5">
          Suivre les accès payants (Wave / Orange Money) et valider les activations.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2B27]">{activeCount}</div>
          <div className="text-stone-500 text-sm font-medium mt-1.5">Actifs</div>
        </div>
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#E75A24]">{pendingCount}</div>
          <div className="text-stone-500 text-sm font-medium mt-1.5">
            En attente / À renouveler
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
          <span>Chargement des abonnements...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {subscriptions.map((item) => {
            const Icon = item.statut === 'actif' ? CreditCard : Clock;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedDetailModal(item)}
                className="group flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/70 shadow-xs hover:border-stone-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#111827] text-base truncate">
                      {item.eleveName}
                    </span>
                    <span className="text-sm text-stone-500 mt-0.5 truncate">
                      {item.plan_nom} · {formatDateFr(item.date_fin)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-3">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                      item.statut === 'actif'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {STATUS_LABEL[item.statut]}
                  </span>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action manuelle */}
      <div className="bg-white rounded-3xl border border-stone-200/70 p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
          Validation manuelle d&apos;accès
        </h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
            Compte élève
          </label>
          <select
            value={selectedEleveId}
            onChange={(e) => setSelectedEleveId(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-[#0F3833]"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => handleValidateForStudent(selectedEleveId)}
          disabled={saving || !selectedEleveId}
          className="inline-flex items-center gap-2 bg-[#E75A24] hover:bg-[#D04D1B] text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Valider / prolonger l&apos;accès (1 an)</span>
        </button>
      </div>

      {/* Detail Modal */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setSelectedDetailModal(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-xl font-bold text-[#111827]">Détails de l&apos;abonnement</h3>
              <button
                onClick={() => setSelectedDetailModal(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Bénéficiaire</span>
                <span className="font-semibold text-stone-900">{selectedDetailModal.eleveName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Formule</span>
                <span className="font-medium text-stone-800">{selectedDetailModal.plan_nom}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Montant</span>
                <span className="font-bold text-stone-900">
                  {selectedDetailModal.montant_xof.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Référence</span>
                <span className="font-mono text-xs text-stone-700">
                  {selectedDetailModal.paytech_ref ?? '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedDetailModal(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => handleValidateForStudent(selectedDetailModal.eleve_id)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Valider / prolonger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
