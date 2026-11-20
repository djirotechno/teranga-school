'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Globe,
  Landmark,
  Calculator,
  Atom,
  Dna,
  Languages,
  Play,
  Mic,
  MessageCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import MatiereCard, { MatiereVariant } from '@/components/metier/MatiereCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';

interface MatiereItem {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  variant: MatiereVariant;
  badge?: string;
}

export default function AccueilElevePage() {
  const [showAllMatieres, setShowAllMatieres] = useState(false);

  // The 3 primary subjects for Terminale L
  const matieresPrincipales: MatiereItem[] = [
    {
      title: 'Français',
      subtitle: 'Lire, comprendre, argumenter.',
      href: '/matieres/francais',
      icon: BookOpen,
      variant: 'francais',
    },
    {
      title: 'Histoire-Géo',
      subtitle: 'Comprendre le monde et les sociétés.',
      href: '/matieres/histoire-geo',
      icon: Globe,
      variant: 'histoire',
    },
    {
      title: 'Philosophie',
      subtitle: 'Réfléchir et construire sa pensée.',
      href: '/matieres/philosophie',
      icon: Landmark,
      variant: 'philosophie',
    },
  ];

  // The other subjects revealed when clicking "Voir tout"
  const autresMatieres: MatiereItem[] = [
    {
      title: 'Mathématiques',
      subtitle: 'Algèbre, analyse et probabilités.',
      href: '/matieres/mathematiques',
      icon: Calculator,
      variant: 'maths',
      badge: 'Terminale S & L',
    },
    {
      title: 'Sciences Physiques',
      subtitle: 'Mécanique, chimie et électricité.',
      href: '/matieres/sciences-physiques',
      icon: Atom,
      variant: 'physique',
      badge: 'Terminale S',
    },
    {
      title: 'SVT',
      subtitle: 'Sciences de la Vie et de la Terre.',
      href: '/matieres/svt',
      icon: Dna,
      variant: 'svt',
      badge: 'Terminale S',
    },
    {
      title: 'Anglais',
      subtitle: 'Compréhension et expression écrite.',
      href: '/matieres',
      icon: Languages,
      variant: 'anglais',
      badge: 'Toutes séries',
    },
  ];

  const espaces = [
    {
      title: 'Bibliothèque',
      subtitle: 'Fascicules et PDF',
      href: '/bibliotheque',
      icon: BookOpen,
    },
    {
      title: 'Forum',
      subtitle: 'Poser une question',
      href: '/forum',
      icon: Mic,
    },
    {
      title: 'Messages',
      subtitle: 'Tes enseignants',
      href: '/messages',
      icon: MessageCircle,
    },
    {
      title: 'Mon suivi',
      subtitle: 'Tes progrès',
      href: '/mon-suivi',
      icon: BarChart2,
    },
  ];

  const toggleShowAllMatieres = () => {
    setShowAllMatieres((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-7 sm:gap-8 max-w-6xl mx-auto pb-6 select-none sm:select-auto">
      {/* 1. Header Greeting */}
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Bonjour Awa !
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-normal">
          Prête à apprendre et à progresser aujourd'hui ?
        </p>
      </section>

      {/* 2. Section: Matières (Principales + Autres matières conditionnelles) */}
      <section className="flex flex-col gap-3.5 sm:gap-4" id="section-matieres">
        {/* Les 3 matières principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {matieresPrincipales.map((item) => (
            <MatiereCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              href={item.href}
              icon={item.icon}
              variant={item.variant}
            />
          ))}
        </div>

        {/* Autres matières révélées lors du clic sur "Voir tout" */}
        {showAllMatieres && (
          <div className="flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E75A24]" />
                Autres matières au programme
              </span>
              <button
                type="button"
                onClick={toggleShowAllMatieres}
                className="text-xs font-semibold text-[#E75A24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Réduire</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {autresMatieres.map((item) => (
                <MatiereCard
                  key={item.title}
                  title={item.title}
                  subtitle={item.subtitle}
                  href={item.href}
                  icon={item.icon}
                  variant={item.variant}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Section: Reprendre mon cours avec le bouton "Voir tout" interactif */}
      <section className="flex flex-col gap-3 sm:gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Reprendre mon cours
          </h2>

          {/* Bouton Voir tout / Voir moins qui contrôle l'affichage des autres matières */}
          <button
            type="button"
            onClick={toggleShowAllMatieres}
            className="text-xs sm:text-sm font-semibold text-[#E75A24] hover:text-[#C84918] transition-colors inline-flex items-center gap-1 cursor-pointer group"
            title={showAllMatieres ? "Masquer les autres matières" : "Afficher toutes les matières"}
          >
            <span>{showAllMatieres ? 'Voir moins' : 'Voir tout'}</span>
            <span className="text-base leading-none transition-transform group-hover:translate-x-0.5">
              {showAllMatieres ? '‹' : '›'}
            </span>
          </button>
        </div>

        {/* Video Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col md:flex-row gap-5 items-stretch md:items-center">
          {/* Thumbnail with Teacher & Blackboard */}
          <div className="relative group w-full md:w-[320px] lg:w-[360px] h-[190px] shrink-0 rounded-xl overflow-hidden shadow-sm bg-stone-900">
            <Image
              src="/images/course-thumbnail.png"
              alt="L'argumentation : méthodes et exemples"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {/* Play Button Overlay (Centered) */}
            <Link
              href="/matieres/francais/argumentation/cours/1"
              className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors"
              aria-label="Lire la vidéo"
            >
              <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-stone-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </Link>

            {/* Duration Badge (Bottom Right) */}
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wide">
              18:24
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col justify-between py-1 gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <Badge variant="peach" size="md">
                  Français
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
                L'argumentation : méthodes et exemples
              </h3>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-1.5 w-full max-w-xl">
              <span className="text-xs text-stone-500 font-medium">
                68 % visionné
              </span>
              <div className="w-full bg-[#EAE3D6] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E75A24] rounded-full transition-all duration-300"
                  style={{ width: '68%' }}
                />
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link href="/matieres/francais/argumentation/cours/1">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Play className="w-4 h-4 fill-current ml-0.5" />}
                >
                  Reprendre le cours
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Tes espaces */}
      <section className="flex flex-col gap-3 sm:gap-3.5">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Tes espaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {espaces.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[110px] sm:h-[120px]"
              >
                <div className="text-stone-800 group-hover:text-[#E75A24] transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#E75A24] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
