'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Play,
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Mic,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MATIERES_DATA, getChapter, ChapterData } from '@/lib/constants/matieres';
import ChapitreItem from '@/components/metier/ChapitreItem';
import CourseComments from '@/components/metier/CourseComments';

export default function ChapitreDetailPage() {
  const params = useParams();
  const rawMatiere = (params?.matiere as string) || 'francais';
  const rawChapitre = (params?.chapitre as string) || 'argumentation';

  const matiereSlug = rawMatiere.toLowerCase();
  const chapitreSlug = rawChapitre.toLowerCase();

  const [activeTab, setActiveTab] = useState<'cours' | 'exercices' | 'ressources' | 'discussions'>('cours');
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Retrieve chapter data or fallback to dynamically synthesized chapter
  const foundChapter = getChapter(matiereSlug, chapitreSlug);
  const subjectMeta = MATIERES_DATA[matiereSlug];

  const chapter: ChapterData = foundChapter || {
    id: chapitreSlug,
    number: 'Chapitre 01',
    title: chapitreSlug.charAt(0).toUpperCase() + chapitreSlug.slice(1).replace(/-/g, ' '),
    objective: 'comprendre et assimiler les notions fondamentales du cours.',
    subjectId: matiereSlug,
    subjectName: subjectMeta?.name || 'Matière',
    subjectColor: subjectMeta?.color || {
      bg: 'bg-[#FBECE2]',
      text: 'text-[#C85A2B]',
      border: 'border-[#F4DACB]',
      pillBg: 'bg-[#FBECE2]',
      pillText: 'text-[#C85A2B]',
    },
    featuredLesson: {
      videoId: '1',
      title: `${chapitreSlug.charAt(0).toUpperCase() + chapitreSlug.slice(1).replace(/-/g, ' ')} : cours complet et exemples`,
      duration: '18:24',
      progressPercent: 68,
      thumbnailUrl: '/images/course-thumbnail.png',
      desc: 'Cours structuré du programme sénégalais avec explications méthodologiques et applications au Baccalauréat.',
    },
    lessons: [
      {
        id: '1',
        order: 1,
        title: `${chapitreSlug.charAt(0).toUpperCase() + chapitreSlug.slice(1).replace(/-/g, ' ')} : méthodes et exemples`,
        type: 'video',
        duration: '18:24',
        progressPercent: 68,
        isCompleted: false,
      },
      {
        id: '2',
        order: 2,
        title: "Les notions clés et définitions",
        type: 'video',
        duration: '12 min',
        progressPercent: 0,
        isCompleted: false,
      },
      {
        id: '3',
        order: 3,
        title: 'Fiche de synthèse',
        type: 'pdf',
        fileSize: '1,2 Mo',
        isCompleted: false,
      },
      {
        id: '4',
        order: 4,
        title: "S'entraîner sur ce chapitre",
        type: 'exercise',
        questionsCount: 8,
        isCompleted: false,
      },
    ],
    exercises: [
      {
        id: 'ex-1',
        title: 'Quiz de validation des connaissances',
        type: 'qcm',
        questionsCount: 10,
        estimatedTime: '15 min',
        difficulty: 'Facile',
        isCompleted: false,
      },
    ],
    resources: [
      {
        id: 'res-1',
        title: 'Fiche de synthèse complète en PDF',
        type: 'fiche',
        fileSize: '1,2 Mo',
        pages: 4,
        desc: 'Fiche mémo téléchargeable récapitulant l’essentiel du cours.',
      },
    ],
    discussions: [],
  };

  const handleDownload = (resTitle: string) => {
    setDownloadNotification(`Téléchargement de « ${resTitle} » démarré.`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-14 select-none">
      {/* Toast Notification */}
      {downloadNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{downloadNotification}</p>
        </div>
      )}

      {/* 1. Header with Breadcrumb pill & Title */}
      <section className="flex flex-col gap-2">
        {/* Subject Pill Breadcrumb */}
        <div>
          <Link
            href={`/matieres/${matiereSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 bg-[#FBECE2] text-[#C85A2B]"
          >
            <span>{chapter.subjectName}</span>
          </Link>
        </div>

        {/* Chapter Title & Objective Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {chapter.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            {chapter.number} · Objectif : {chapter.objective}
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs (Cours | Exercices | Ressources | Discussions) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('cours')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'cours'
              ? 'bg-[#FBECE2] text-[#E75A24] shadow-xs'
              : 'bg-stone-200/60 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          Cours
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('exercices')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'exercices'
              ? 'bg-[#FBECE2] text-[#E75A24] shadow-xs'
              : 'bg-stone-200/60 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          Exercices {chapter.exercises.length > 0 && `(${chapter.exercises.length})`}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ressources')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'ressources'
              ? 'bg-[#FBECE2] text-[#E75A24] shadow-xs'
              : 'bg-stone-200/60 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          Ressources {chapter.resources.length > 0 && `(${chapter.resources.length})`}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'discussions'
              ? 'bg-[#FBECE2] text-[#E75A24] shadow-xs'
              : 'bg-stone-200/60 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          Discussions {chapter.discussions.length > 0 && `(${chapter.discussions.length})`}
        </button>
      </div>

      {/* 3. TAB: COURS */}
      {activeTab === 'cours' && (
        <div className="flex flex-col gap-7 animate-in fade-in duration-200">
          {/* Featured Resume Course Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-5 items-stretch md:items-center">
            {/* Thumbnail with Teacher & Blackboard */}
            <div className="relative group w-full md:w-[320px] lg:w-[360px] h-[190px] shrink-0 rounded-2xl overflow-hidden shadow-xs bg-stone-900">
              <Image
                src={chapter.featuredLesson.thumbnailUrl || '/images/course-thumbnail.png'}
                alt={chapter.featuredLesson.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />

              {/* Centered Play Button Overlay */}
              <Link
                href={`/matieres/${matiereSlug}/${chapitreSlug}/cours/${chapter.featuredLesson.videoId}`}
                className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors"
                aria-label="Lire la vidéo"
              >
                <div className="w-12 h-12 rounded-full bg-white/95 group-hover:bg-white text-stone-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </Link>

              {/* Duration Badge (Bottom Right) */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide">
                {chapter.featuredLesson.duration}
              </div>
            </div>

            {/* Details & Resume CTA */}
            <div className="flex-1 flex flex-col justify-between py-1 gap-4">
              <div className="flex flex-col gap-2">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBECE2] text-[#C85A2B]">
                    {chapter.subjectName}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
                  {chapter.featuredLesson.title}
                </h3>
              </div>

              {/* Progress Bar Section */}
              <div className="flex flex-col gap-1.5 w-full max-w-xl">
                <span className="text-xs text-stone-500 font-medium">
                  {chapter.featuredLesson.progressPercent} % visionné
                </span>
                <div className="w-full bg-[#EAE3D6] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E75A24] rounded-full transition-all duration-300"
                    style={{ width: `${chapter.featuredLesson.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Reprendre le cours CTA Button */}
              <div>
                <Link
                  href={`/matieres/${matiereSlug}/${chapitreSlug}/cours/${chapter.featuredLesson.videoId}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Reprendre le cours</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section: Dans ce chapitre */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Dans ce chapitre
            </h2>

            <div className="flex flex-col gap-2.5">
              {chapter.lessons.map((lesson) => {
                const subtitle =
                  lesson.type === 'video'
                    ? `Vidéo · ${lesson.duration}`
                    : lesson.type === 'pdf'
                    ? `PDF · ${lesson.fileSize}`
                    : `Exercice · ${lesson.questionsCount || 8} questions`;

                const lessonHref =
                  lesson.type === 'video'
                    ? `/matieres/${matiereSlug}/${chapitreSlug}/cours/${lesson.id}`
                    : undefined;

                return (
                  <ChapitreItem
                    key={lesson.id}
                    title={lesson.title}
                    type={lesson.type}
                    subtitle={subtitle}
                    href={lessonHref}
                    onClick={
                      lesson.type === 'pdf'
                        ? () => handleDownload(lesson.title)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 4. TAB: EXERCICES */}
      {activeTab === 'exercices' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Exercices & Entraînements du chapitre
            </h2>
            <span className="text-xs text-stone-500">
              {chapter.exercises.length} exercice(s) disponible(s)
            </span>
          </div>

          {chapter.exercises.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-xs text-stone-500 text-sm">
              Les exercices pour ce chapitre seront mis en ligne très prochainement.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E75A24]/40 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#236B48] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{ex.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {ex.questionsCount} questions · Durée estimée : {ex.estimatedTime} · Difficulté :{' '}
                        <span className="font-semibold text-stone-700">{ex.difficulty}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {ex.isCompleted && ex.score && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        Score : {ex.score}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => alert(`Lancement de l'exercice : ${ex.title}`)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E75A24] hover:bg-[#D04D1B] text-white transition-all shadow-xs"
                    >
                      {ex.isCompleted ? 'Recommencer' : "Commencer l'exercice"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: RESSOURCES */}
      {activeTab === 'ressources' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Fiches PDF & Annales à télécharger
            </h2>
          </div>

          {chapter.resources.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-xs text-stone-500 text-sm">
              Aucune ressource supplémentaire pour ce chapitre.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chapter.resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FBECE2] text-[#C85A2B] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{res.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{res.desc}</p>
                      <span className="inline-block text-[11px] font-semibold text-stone-400 mt-1">
                        Format PDF · {res.fileSize} · {res.pages} pages
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(res.title)}
                    className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 hover:bg-[#E75A24] hover:text-white text-stone-700 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB: DISCUSSIONS */}
      {activeTab === 'discussions' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-200">
          <CourseComments
            chapterTitle={chapter.title}
            subjectName={chapter.subjectName}
          />
        </div>
      )}
    </div>
  );
}
