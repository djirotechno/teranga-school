'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function PublierCoursPage() {
  const [titre, setTitre] = useState('');
  const [matiere, setMatiere] = useState('Français');
  const [niveau, setNiveau] = useState('Terminale L');
  const [description, setDescription] = useState('');
  const [typeContenu, setTypeContenu] = useState<'video' | 'document'>('video');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/enseignant"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Publier un nouveau cours
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Ajoutez une leçon vidéo, une fiche de méthodologie ou des exercices pour vos élèves.
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            Cours publié avec succès !
          </h2>
          <p className="text-stone-600 max-w-md mx-auto text-sm sm:text-base">
            Votre cours « {titre || 'Nouveau cours'} » est maintenant accessible à vos élèves de {niveau}.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/enseignant/cours"
              className="px-6 py-2.5 rounded-xl bg-[#0F3833] text-white font-medium hover:bg-[#184540] transition-colors"
            >
              Voir mes cours
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setTitre('');
                setDescription('');
              }}
              className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
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
          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-900">
              Format du contenu
            </label>
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
            <label className="text-sm font-bold text-stone-900">
              Titre du cours *
            </label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: La dissertation littéraire : structure et argumentation"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm"
            />
          </div>

          {/* Metadata: Matière & Niveau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900">
                Matière
              </label>
              <select
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm bg-white"
              >
                <option value="Français">Français</option>
                <option value="Philosophie">Philosophie</option>
                <option value="Histoire-Géo">Histoire-Géo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-900">
                Niveau ciblé
              </label>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-[#E75A24] text-stone-900 text-sm bg-white"
              >
                <option value="Terminale L">Terminale L</option>
                <option value="Terminale S">Terminale S</option>
                <option value="Première">Première</option>
                <option value="Seconde">Seconde</option>
              </select>
            </div>
          </div>

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
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center space-y-3 bg-[#FAF7F2] hover:border-[#E75A24] transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#0F3833] shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">
                Glissez votre fichier ici ou cliquez pour parcourir
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Formats acceptés : MP4, WEBM (jusqu&apos;à 200 Mo) ou PDF (jusqu&apos;à 50 Mo)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Link
              href="/enseignant"
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 text-sm transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer"
            >
              Publier le cours
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
