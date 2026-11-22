'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Play,
  FileText,
  Clock,
  Eye,
  MoreVertical,
} from 'lucide-react';

export default function MesCoursPage() {
  const coursList = [
    {
      id: 'c1',
      title: 'La dissertation littéraire : structure et argumentation',
      niveau: 'Terminale L',
      type: 'video',
      duration: '18 min',
      views: 142,
      date: '12 nov. 2026',
    },
    {
      id: 'c2',
      title: 'Méthodologie du commentaire composé',
      niveau: 'Terminale L & S',
      type: 'video',
      duration: '24 min',
      views: 230,
      date: '08 nov. 2026',
    },
    {
      id: 'c3',
      title: 'Fiche synthétique : Les figures de style indispensables',
      niveau: 'Terminale',
      type: 'document',
      duration: 'PDF · 4 pages',
      views: 315,
      date: '02 nov. 2026',
    },
    {
      id: 'c4',
      title: 'La poésie de la Négritude : Senghor et Césaire',
      niveau: 'Terminale L',
      type: 'video',
      duration: '32 min',
      views: 189,
      date: '28 oct. 2026',
    },
    {
      id: 'c5',
      title: 'L’engagement littéraire dans le roman africain contemporain',
      niveau: 'Terminale L',
      type: 'video',
      duration: '21 min',
      views: 95,
      date: '20 oct. 2026',
    },
    {
      id: 'c6',
      title: 'Sujets types Bac de Français commentés et corrigés',
      niveau: 'Terminale L',
      type: 'document',
      duration: 'PDF · 12 pages',
      views: 450,
      date: '15 oct. 2026',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
            Mes cours publiés
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Gérez vos 12 cours et fiches méthodologiques en ligne.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coursList.map((cours) => (
          <div
            key={cours.id}
            className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-3">
                <span className="bg-[#0F3833]/10 text-[#0F3833] px-2.5 py-0.5 rounded-full">
                  {cours.niveau}
                </span>
                <span className="flex items-center gap-1">
                  {cours.type === 'video' ? (
                    <Play className="w-3.5 h-3.5 text-[#E75A24]" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-[#0F3833]" />
                  )}
                  {cours.duration}
                </span>
              </div>

              <h3 className="font-bold text-stone-900 text-base leading-snug hover:text-[#E75A24] transition-colors cursor-pointer">
                {cours.title}
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-4 mt-4 border-t border-stone-100">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {cours.views} vues
              </span>
              <span>{cours.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
