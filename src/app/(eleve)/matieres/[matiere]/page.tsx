'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, Sparkles, Video, Play, FileText, ChevronRight, Lock } from 'lucide-react';

interface SubjectInfo {
  name: string;
  level: string;
  isAvailable: boolean;
  desc: string;
  chapters?: {
    id: string;
    title: string;
    videosCount: number;
    duration: string;
    isFree?: boolean;
  }[];
}

const subjectsData: Record<string, SubjectInfo> = {
  francais: {
    name: 'Français',
    level: 'Terminale L & S',
    isAvailable: true,
    desc: 'Maîtrisez la dissertation littéraire, le commentaire composé et les œuvres au programme du Bac.',
    chapters: [
      { id: 'argumentation', title: "L'argumentation : méthodes et exemples", videosCount: 3, duration: '45 min', isFree: true },
      { id: 'dissertation', title: 'La dissertation littéraire : problématisation et plan', videosCount: 4, duration: '1h 10 min', isFree: false },
      { id: 'poesie', title: 'La poésie négro-africaine et le mouvement de la Négritude', videosCount: 3, duration: '55 min', isFree: false },
      { id: 'roman', title: 'Le roman africain contemporain : thèmes et esthétique', videosCount: 3, duration: '50 min', isFree: false },
    ],
  },
  'histoire-geo': {
    name: 'Histoire-Géographie',
    level: 'Terminale L & S',
    isAvailable: true,
    desc: 'Comprenez l’histoire contemporaine du Sénégal, de l’Afrique et les dynamiques géopolitiques mondiales.',
    chapters: [
      { id: 'guerre-froide', title: 'Les relations internationales depuis 1945', videosCount: 4, duration: '1h 05 min', isFree: true },
      { id: 'decolonisation', title: "La décolonisation en Afrique et en Asie", videosCount: 3, duration: '50 min', isFree: false },
      { id: 'senegal', title: 'Le Sénégal : démographie, ressources et aménagement', videosCount: 4, duration: '1h 15 min', isFree: false },
    ],
  },
  philosophie: {
    name: 'Philosophie',
    level: 'Terminale L & S',
    isAvailable: true,
    desc: 'Développez votre esprit critique à travers les grandes notions philosophiques et auteurs phares.',
    chapters: [
      { id: 'conscience', title: 'La conscience, l’inconscient et le sujet', videosCount: 3, duration: '50 min', isFree: true },
      { id: 'etat-pouvoir', title: 'L’État, le droit et la liberté politique', videosCount: 4, duration: '1h 10 min', isFree: false },
      { id: 'verite', title: 'La science et la question de la vérité', videosCount: 3, duration: '45 min', isFree: false },
    ],
  },
  mathematiques: {
    name: 'Mathématiques',
    level: 'Terminale S & L',
    isAvailable: false,
    desc: 'Cours complets d’analyse, algèbre, géométrie et probabilités selon le programme sénégalais.',
  },
  'sciences-physiques': {
    name: 'Sciences Physiques',
    level: 'Terminale S',
    isAvailable: false,
    desc: 'Physique et chimie de Terminale : mécanique, cinématique, électricité et chimie organique.',
  },
  svt: {
    name: 'SVT',
    level: 'Terminale S',
    isAvailable: false,
    desc: 'Génétique humaine, immunologie, communication nerveuse et géologie sénégalaise.',
  },
};

export default function MatiereDetailPage() {
  const params = useParams();
  const rawSlug = (params?.matiere as string) || '';
  const slug = rawSlug.toLowerCase();
  const subject = subjectsData[slug] || {
    name: rawSlug ? rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1) : 'Matière',
    level: 'Programme officiel',
    isAvailable: false,
    desc: 'Cours en cours de préparation.',
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href="/matieres"
          className="p-2.5 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-all hover:-translate-x-0.5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Toutes les matières</span>
        </Link>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700">
              {subject.level}
            </span>
            {subject.isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300/80">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Bientôt disponible
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            {subject.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            {subject.desc}
          </p>
        </div>
      </div>

      {/* If available: display chapters list */}
      {subject.isAvailable && subject.chapters ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Chapitres du programme
          </h2>

          <div className="flex flex-col gap-3">
            {subject.chapters.map((chap, idx) => (
              <Link
                key={chap.id}
                href={`/matieres/${slug}/${chap.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 hover:border-[#E75A24]/40 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 font-bold flex items-center justify-center shrink-0 group-hover:bg-[#E75A24] group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 truncate group-hover:text-[#E75A24] transition-colors">
                      {chap.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" />
                        {chap.videosCount} vidéos
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {chap.duration}
                      </span>
                      {chap.isFree && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">Gratuit</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#E75A24] group-hover:text-white flex items-center justify-center transition-all text-stone-600">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* Coming soon subject display */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200/80 shadow-xs flex flex-col items-center gap-4 max-w-xl mx-auto w-full">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70 shadow-xs">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {subject.name} sera bientôt disponible !
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
              Nos équipes pédagogiques et professeurs partenaires finalisent les cours vidéo, fiches résumées et exercices d'entraînement pour ce programme.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link
              href="/matieres"
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#E75A24] hover:bg-[#D04D1B] text-white shadow-xs transition-all text-center"
            >
              Découvrir les cours disponibles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
