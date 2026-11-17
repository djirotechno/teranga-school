'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Globe,
  Landmark,
  Calculator,
  Atom,
  Dna,
  ArrowLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  X,
  GraduationCap,
  FileText,
  Video,
} from 'lucide-react';

interface MatiereItem {
  id: string;
  name: string;
  slug: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bg: string;
  text: string;
  border: string;
  isAvailable: boolean;
  level: string;
  chaptersCount?: number;
  videosCount?: number;
  previewChapters?: string[];
}

export default function MatieresPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'coming_soon'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComingSoon, setSelectedComingSoon] = useState<MatiereItem | null>(null);
  const [notifiedSubjects, setNotifiedSubjects] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const matieres: MatiereItem[] = [
    {
      id: 'francais',
      name: 'Français',
      slug: 'francais',
      desc: 'Littérature, dissertation, grammaire, méthodologie et argumentation.',
      icon: BookOpen,
      bg: 'bg-[#FBECE2]',
      text: 'text-[#C85A2B]',
      border: 'border-[#F4DACB]',
      isAvailable: true,
      level: 'Terminale L & S',
      chaptersCount: 12,
      videosCount: 36,
      previewChapters: ["L'argumentation : méthodes et exemples", 'La dissertation littéraire', 'La poésie négro-africaine'],
    },
    {
      id: 'histoire-geo',
      name: 'Histoire-Géographie',
      slug: 'histoire-geo',
      desc: 'Le Sénégal contemporain, la décolonisation et les mutations géopolitiques mondiales.',
      icon: Globe,
      bg: 'bg-[#EBF4EE]',
      text: 'text-[#236B48]',
      border: 'border-[#D9EADB]',
      isAvailable: true,
      level: 'Terminale L & S',
      chaptersCount: 9,
      videosCount: 28,
      previewChapters: ['Les relations internationales depuis 1945', "La décolonisation de l'Afrique", 'Le Sénégal : économie et population'],
    },
    {
      id: 'philosophie',
      name: 'Philosophie',
      slug: 'philosophie',
      desc: 'Épistémologie, métaphysique, morale, esthétique et philosophie politique.',
      icon: Landmark,
      bg: 'bg-[#F0EDFA]',
      text: 'text-[#6644B8]',
      border: 'border-[#E2DCF4]',
      isAvailable: true,
      level: 'Terminale L & S',
      chaptersCount: 8,
      videosCount: 24,
      previewChapters: ['La conscience et l’inconscient', 'Science et vérité', 'L’État et la liberté'],
    },
    {
      id: 'mathematiques',
      name: 'Mathématiques',
      slug: 'mathematiques',
      desc: 'Algèbre, analyse, suites numériques, fonctions exponentielles, géométrie et probabilités.',
      icon: Calculator,
      bg: 'bg-[#E6F0FA]',
      text: 'text-[#1D63B8]',
      border: 'border-[#D0E2F7]',
      isAvailable: false,
      level: 'Terminale S & L',
      chaptersCount: 10,
      videosCount: 30,
      previewChapters: ['Fonctions logarithmes et exponentielles', 'Suites et limites', 'Nombres complexes et géométrie'],
    },
    {
      id: 'sciences-physiques',
      name: 'Sciences Physiques',
      slug: 'sciences-physiques',
      desc: 'Cinématique, dynamique, électromagnétisme, chimie organique et solutions aqueuses.',
      icon: Atom,
      bg: 'bg-[#FEF3E2]',
      text: 'text-[#B86B1D]',
      border: 'border-[#F7E5C8]',
      isAvailable: false,
      level: 'Terminale S',
      chaptersCount: 14,
      videosCount: 42,
      previewChapters: ['Lois de Newton et mouvements', 'Circuits RLC et oscillations', 'Acides, bases et réactions d’oxydoréduction'],
    },
    {
      id: 'svt',
      name: 'SVT',
      slug: 'svt',
      desc: 'Sciences de la Vie et de la Terre : génétique humaine, immunologie et géologie du Sénégal.',
      icon: Dna,
      bg: 'bg-[#EAF7EE]',
      text: 'text-[#1B7843]',
      border: 'border-[#CEEFD8]',
      isAvailable: false,
      level: 'Terminale S',
      chaptersCount: 11,
      videosCount: 33,
      previewChapters: ['Brassages génétiques et méiose', 'Le système immunitaire et ses dysfonctionnements', 'Tectonique des plaques et géologie locale'],
    },
  ];

  const filteredMatieres = useMemo(() => {
    return matieres.filter((m) => {
      // Filter tab
      if (activeFilter === 'available' && !m.isAvailable) return false;
      if (activeFilter === 'coming_soon' && m.isAvailable) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          m.name.toLowerCase().includes(query) ||
          m.desc.toLowerCase().includes(query) ||
          m.level.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeFilter, searchQuery]);

  const availableCount = matieres.filter((m) => m.isAvailable).length;
  const comingSoonCount = matieres.filter((m) => !m.isAvailable).length;

  const handleToggleNotify = (matiereId: string, matiereName: string) => {
    const isCurrentlyNotified = !!notifiedSubjects[matiereId];
    const newStatus = !isCurrentlyNotified;

    setNotifiedSubjects((prev) => ({
      ...prev,
      [matiereId]: newStatus,
    }));

    if (newStatus) {
      showToast(`Vous serez notifié(e) par email dès la sortie du cours de ${matiereName} !`);
    } else {
      showToast(`Notification désactivée pour ${matiereName}.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-stone-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-auto shrink-0 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section with back button & description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <Link
            href="/accueil"
            className="p-2.5 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-all hover:-translate-x-0.5"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Toutes les matières
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200/70 text-stone-700">
                Programme officiel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Explore tes cours structurés par chapitres, vidéos explicatives et exercices
            </p>
          </div>
        </div>

        {/* Quick stats pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {availableCount} disponibles
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {comingSoonCount} bientôt
          </div>
        </div>
      </div>

      {/* Search and Filters toolbar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Toutes ({matieres.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('available')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'available'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Disponibles ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('coming_soon')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'coming_soon'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Bientôt disponibles ({comingSoonCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une matière..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200/80 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Matieres Cards */}
      {filteredMatieres.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 shadow-xs flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">Aucune matière trouvée</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
            Aucun résultat ne correspond à votre recherche « {searchQuery} ». Essayez un autre terme ou réinitialisez les filtres.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-2 text-xs font-semibold text-[#E75A24] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMatieres.map((m) => {
            const Icon = m.icon;
            const isNotified = !!notifiedSubjects[m.id];

            // Card content (common between Link and Button)
            const CardInner = (
              <>
                {/* Header: Icon + Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`p-3.5 rounded-2xl ${m.bg} ${m.text} transition-transform duration-200 group-hover:scale-110 shadow-xs`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.9} />
                  </div>

                  {m.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300/80 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Bientôt disponible
                    </span>
                  )}
                </div>

                {/* Body: Title, Level, Description */}
                <div className="mt-4 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg sm:text-xl text-stone-900 tracking-tight group-hover:text-[#E75A24] transition-colors">
                      {m.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mt-0.5">
                    {m.level}
                  </p>
                  <p className="text-xs sm:text-[13px] text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                {/* Footer: Stats & CTA indicator */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  {m.isAvailable ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                      <Video className="w-3.5 h-3.5 text-[#E75A24]" />
                      <span>{m.chaptersCount} chapitres • {m.videosCount} vidéos</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tournage en cours</span>
                    </div>
                  )}

                  {m.isAvailable ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#E75A24] group-hover:translate-x-0.5 transition-transform">
                      <span className="hidden sm:inline">Accéder</span>
                      <div className="w-7 h-7 rounded-full bg-[#E75A24]/10 group-hover:bg-[#E75A24] group-hover:text-white flex items-center justify-center transition-all">
                        <ChevronRight className="w-4 h-4 text-[#E75A24] group-hover:text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-800">
                      <span className="hidden sm:inline">
                        {isNotified ? 'Inscrit' : 'M\'avertir'}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isNotified
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100/70 group-hover:bg-amber-500 group-hover:text-white text-amber-700'
                      }`}>
                        {isNotified ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Bell className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            );

            // If available: Link to subject page
            if (m.isAvailable) {
              return (
                <Link
                  key={m.id}
                  href={`/matieres/${m.slug}`}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#E75A24]/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                  aria-label={`Accéder aux cours de ${m.name}`}
                >
                  {CardInner}
                </Link>
              );
            }

            // If coming soon: Interactive clickable card opening modal
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedComingSoon(m)}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden text-left w-full"
                aria-label={`${m.name} - Bientôt disponible. Cliquer pour en savoir plus`}
              >
                {CardInner}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal: Details for "Bientôt disponible" subject */}
      {selectedComingSoon && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setSelectedComingSoon(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedComingSoon(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${selectedComingSoon.bg} ${selectedComingSoon.text}`}
              >
                <selectedComingSoon.icon className="w-8 h-8" strokeWidth={1.8} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300/80">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Bientôt disponible
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mt-1">
                  {selectedComingSoon.name}
                </h2>
                <p className="text-xs text-stone-500">{selectedComingSoon.level}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Le programme complet de <strong>{selectedComingSoon.name}</strong> est actuellement
                en cours d’enregistrement et de validation pédagogique avec nos professeurs certifiés du Sénégal.
              </p>

              {/* Preview of chapters being prepared */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  <GraduationCap className="w-4 h-4 text-[#E75A24]" />
                  Aperçu du contenu en préparation
                </div>
                <ul className="space-y-2">
                  {selectedComingSoon.previewChapters?.map((chap, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-[13px] text-stone-700 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{chap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Features included */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-stone-600">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <Video className="w-4 h-4 text-[#E75A24] shrink-0" />
                  <span>Vidéos structurées</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fiches PDF & Annales</span>
                </div>
              </div>
            </div>

            {/* Notification toggle CTA */}
            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleToggleNotify(selectedComingSoon.id, selectedComingSoon.name)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
                  notifiedSubjects[selectedComingSoon.id]
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[#E75A24] hover:bg-[#D04D1B] text-white hover:shadow-md'
                }`}
              >
                {notifiedSubjects[selectedComingSoon.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Notification activée !
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    M’avertir de la sortie
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedComingSoon(null)}
                className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors text-center"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
