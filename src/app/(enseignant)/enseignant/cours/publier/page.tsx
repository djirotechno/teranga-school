'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';

interface MatiereOption {
  id: string;
  nom: string;
  slug: string;
}

interface ChapitreOption {
  id: string;
  matiere_id: string;
  numero: string;
  titre: string;
  slug: string;
}

export default function PublierCoursPage() {
  const { profile } = useCurrentProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [matieres, setMatieres] = useState<MatiereOption[]>([]);
  const [chapitres, setChapitres] = useState<ChapitreOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [titre, setTitre] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [chapitreId, setChapitreId] = useState('');
  const [dureeMinutes, setDureeMinutes] = useState(15);
  const [description, setDescription] = useState('');
  const [typeContenu, setTypeContenu] = useState<'video' | 'document'>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger les matières autorisées pour l'enseignant (ou toutes si admin) et leurs chapitres
  useEffect(() => {
    if (!profile) return;
    let active = true;
    (async () => {
      setLoadingOptions(true);
      try {
        const supabase = createClient();

        let matList: MatiereOption[] = [];
        if (profile.role === 'admin') {
          const { data } = await supabase
            .from('matieres')
            .select('id, nom, slug')
            .order('ordre', { ascending: true });
          matList = data ?? [];
        } else {
          const { data } = await supabase
            .from('enseignant_matieres')
            .select('matieres ( id, nom, slug )')
            .eq('enseignant_id', profile.id);

          matList = (data ?? [])
            .map((row) => (row as unknown as { matieres: MatiereOption | null }).matieres)
            .filter((m): m is MatiereOption => Boolean(m));
        }

        const { data: chapData } = await supabase
          .from('chapitres')
          .select('id, matiere_id, numero, titre, slug')
          .order('ordre', { ascending: true });

        if (!active) return;
        setMatieres(matList);
        const allChaps = chapData ?? [];
        setChapitres(allChaps);

        if (matList.length > 0) {
          const firstMatId = matList[0].id;
          setMatiereId(firstMatId);
          const firstChap = allChaps.find((c) => c.matiere_id === firstMatId);
          if (firstChap) setChapitreId(firstChap.id);
        }
      } finally {
        if (active) setLoadingOptions(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [profile]);

  const filteredChapitres = chapitres.filter((c) => c.matiere_id === matiereId);

  const handleMatiereChange = (newMatId: string) => {
    setMatiereId(newMatId);
    const firstChap = chapitres.find((c) => c.matiere_id === newMatId);
    setChapitreId(firstChap?.id ?? '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setErrorMsg(null);

    if (!chapitreId) {
      setErrorMsg('Veuillez sélectionner un chapitre pour ce cours.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let mediaUrl: string | null = null;

      if (selectedFile) {
        const matSlug = matieres.find((m) => m.id === matiereId)?.slug ?? 'general';
        const chapSlug = chapitres.find((c) => c.id === chapitreId)?.slug ?? 'chapitre';
        const bucket = typeContenu === 'video' ? 'cours-videos' : 'bibliotheque-pdf';
        const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${matSlug}/${chapSlug}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, selectedFile, { upsert: false });

        if (uploadError) {
          setErrorMsg(`Échec de l'envoi du fichier : ${uploadError.message}`);
          return;
        }
        mediaUrl = `${bucket}/${path}`;
      }

      const { error: insertError } = await supabase.from('cours').insert({
        chapitre_id: chapitreId,
        enseignant_id: profile.id,
        titre: titre.trim(),
        description: description.trim(),
        type: typeContenu,
        media_url: mediaUrl,
        thumbnail_url: '/images/course-thumbnail.png',
        duree_secondes: typeContenu === 'video' ? Math.max(0, Number(dureeMinutes) * 60) : 0,
        statut: 'publie',
      });

      if (insertError) {
        setErrorMsg(`Erreur lors de la publication : ${insertError.message}`);
        return;
      }

      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/enseignant/cours"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mes cours</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Publier un nouveau cours
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Ajoutez une leçon vidéo ou une fiche méthodologique pour vos élèves.
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Cours publié avec succès !</h2>
          <p className="text-stone-600 max-w-md mx-auto text-sm sm:text-base">
            Votre cours « {titre} » a été enregistré dans la base Supabase et est accessible à vos élèves.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/enseignant/cours"
              className="px-6 py-2.5 rounded-xl bg-[#0F3833] text-white font-medium hover:bg-[#184540] transition-colors"
            >
              Voir mes cours
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setTitre('');
                setDescription('');
                setSelectedFile(null);
              }}
              className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Publier un autre cours
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900">Format du contenu</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTypeContenu('video')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  typeContenu === 'video'
                    ? 'border-[#E75A24] bg-[#FFF5F0] text-[#E75A24] font-bold'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Vidéo de cours</span>
              </button>

              <button
                type="button"
                onClick={() => setTypeContenu('document')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  typeContenu === 'document'
                    ? 'border-[#E75A24] bg-[#FFF5F0] text-[#E75A24] font-bold'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Document / Fiche PDF</span>
              </button>
            </div>
          </div>

          {/* Course title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900">Titre du cours *</label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: La dissertation littéraire : structure et argumentation"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm"
            />
          </div>

          {/* Matière & Chapitre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900">Matière *</label>
              <select
                value={matiereId}
                onChange={(e) => handleMatiereChange(e.target.value)}
                disabled={loadingOptions}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm bg-white"
              >
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900">Chapitre *</label>
              <select
                value={chapitreId}
                onChange={(e) => setChapitreId(e.target.value)}
                disabled={loadingOptions || filteredChapitres.length === 0}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm bg-white"
              >
                {filteredChapitres.length === 0 ? (
                  <option value="">Aucun chapitre disponible</option>
                ) : (
                  filteredChapitres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numero} — {c.titre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {typeContenu === 'video' && (
            <div className="space-y-2 max-w-xs">
              <label className="text-sm font-bold text-stone-900">Durée estimée (minutes)</label>
              <input
                type="number"
                min={1}
                max={180}
                value={dureeMinutes}
                onChange={(e) => setDureeMinutes(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900">
              Description ou objectifs pédagogiques
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les compétences visées, le plan du cours et les conseils méthodologiques..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm"
            />
          </div>

          {/* File Upload zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3 bg-[#FAF7F2] hover:border-[#E75A24] transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={typeContenu === 'video' ? 'video/mp4,video/webm' : 'application/pdf'}
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#0F3833] shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">
                {selectedFile
                  ? `Fichier sélectionné : ${selectedFile.name}`
                  : 'Cliquez pour joindre votre fichier (optionnel)'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {typeContenu === 'video'
                  ? 'Formats acceptés : MP4, WEBM (bucket cours-videos)'
                  : 'Format accepté : PDF (bucket bibliotheque-pdf)'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/enseignant/cours"
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 text-sm transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loadingOptions}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Publication...' : 'Publier le cours'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
