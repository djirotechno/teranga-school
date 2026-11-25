'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Play,
  FileText,
  Eye,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import type { Enums } from '@/types/database';

type PublicationStatus = Enums<'publication_status'>;

interface CoursItem {
  id: string;
  titre: string;
  description: string;
  type: Enums<'cours_type'>;
  duree_secondes: number;
  vues_count: number;
  statut: PublicationStatus;
  created_at: string;
  chapitres: {
    titre: string;
    niveau: string;
    serie: string | null;
    matieres: {
      nom: string;
      couleur_bg: string;
      couleur_text: string;
    } | null;
  } | null;
}

function formatDuration(seconds: number, type: Enums<'cours_type'>): string {
  if (type === 'document') return 'Document PDF';
  if (!seconds || seconds <= 0) return 'Vidéo';
  const mins = Math.max(1, Math.round(seconds / 60));
  return `${mins} min`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-SN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MesCoursPage() {
  const { profile } = useCurrentProfile();
  const [coursList, setCoursList] = useState<CoursItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit modal state
  const [editing, setEditing] = useState<CoursItem | null>(null);
  const [editTitre, setEditTitre] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMinutes, setEditMinutes] = useState(15);
  const [editStatut, setEditStatut] = useState<PublicationStatus>('publie');
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete loading id
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCours = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      let query = supabase
        .from('cours')
        .select(
          `
          id,
          titre,
          description,
          type,
          duree_secondes,
          vues_count,
          statut,
          created_at,
          chapitres (
            titre,
            niveau,
            serie,
            matieres (
              nom,
              couleur_bg,
              couleur_text
            )
          )
        `
        )
        .order('created_at', { ascending: false });

      if (profile.role !== 'admin') {
        query = query.eq('enseignant_id', profile.id);
      }

      const { data, error } = await query;
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setCoursList((data as unknown as CoursItem[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadCours();
  }, [loadCours]);

  const openEditModal = (item: CoursItem) => {
    setEditing(item);
    setEditTitre(item.titre);
    setEditDesc(item.description);
    setEditMinutes(Math.max(0, Math.round(item.duree_secondes / 60)));
    setEditStatut(item.statut);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSavingEdit(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('cours')
        .update({
          titre: editTitre.trim(),
          description: editDesc.trim(),
          duree_secondes: Math.max(0, Number(editMinutes) * 60),
          statut: editStatut,
        })
        .eq('id', editing.id);

      if (error) {
        showToast(`Erreur lors de la modification : ${error.message}`, true);
        return;
      }

      setCoursList((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                titre: editTitre.trim(),
                description: editDesc.trim(),
                duree_secondes: Math.max(0, Number(editMinutes) * 60),
                statut: editStatut,
              }
            : c
        )
      );
      setEditing(null);
      showToast('Cours mis à jour avec succès !');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (item: CoursItem) => {
    if (!window.confirm(`Supprimer définitivement le cours « ${item.titre} » ?`)) {
      return;
    }
    setDeletingId(item.id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('cours').delete().eq('id', item.id);
      if (error) {
        showToast(`Impossible de supprimer : ${error.message}`, true);
        return;
      }
      setCoursList((prev) => prev.filter((c) => c.id !== item.id));
      showToast('Cours supprimé.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
            Mes cours publiés
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Gérez vos {coursList.length} cours et fiches méthodologiques en ligne.
          </p>
        </div>

        <Link
          href="/enseignant/cours/publier"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-semibold text-sm shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publier un cours</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
          <span>Chargement de vos cours...</span>
        </div>
      ) : coursList.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#EAE3D6] text-center space-y-3">
          <p className="text-stone-700 font-bold">Aucun cours publié pour le moment.</p>
          <p className="text-sm text-stone-500">
            Cliquez sur « Publier un cours » pour ajouter votre première leçon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coursList.map((cours) => {
            const matiere = cours.chapitres?.matieres;
            const niveauLabel = [cours.chapitres?.niveau, cours.chapitres?.serie]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={cours.id}
                className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-500 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {matiere && (
                        <span
                          className="px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: matiere.couleur_bg,
                            color: matiere.couleur_text,
                          }}
                        >
                          {matiere.nom}
                        </span>
                      )}
                      {niveauLabel && (
                        <span className="bg-[#0F3833]/10 text-[#0F3833] px-2.5 py-0.5 rounded-full">
                          {niveauLabel}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 shrink-0">
                      {cours.type === 'video' ? (
                        <Play className="w-3.5 h-3.5 text-[#E75A24]" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-[#0F3833]" />
                      )}
                      {formatDuration(cours.duree_secondes, cours.type)}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {cours.titre}
                  </h3>
                  {cours.chapitres?.titre && (
                    <p className="text-xs text-stone-500 mt-1">
                      Chapitre : {cours.chapitres.titre}
                    </p>
                  )}
                  {cours.description && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      {cours.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {cours.vues_count} vues
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        cours.statut === 'publie'
                          ? 'bg-emerald-50 text-emerald-700'
                          : cours.statut === 'brouillon'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cours.statut === 'publie'
                        ? 'Publié'
                        : cours.statut === 'brouillon'
                        ? 'Brouillon'
                        : 'Archivé'}
                    </span>
                    <span>{formatDate(cours.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(cours)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-200/70 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cours)}
                      disabled={deletingId === cours.id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Supprimer ce cours"
                    >
                      {deletingId === cours.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de modification */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#0F3833]">Modifier le cours</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Titre *</label>
                <input
                  type="text"
                  required
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#E75A24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#E75A24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editMinutes}
                    onChange={(e) => setEditMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#E75A24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Statut</label>
                  <select
                    value={editStatut}
                    onChange={(e) => setEditStatut(e.target.value as PublicationStatus)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-[#E75A24]"
                  >
                    <option value="publie">Publié</option>
                    <option value="brouillon">Brouillon</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-bold cursor-pointer disabled:opacity-60"
                >
                  {savingEdit ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
