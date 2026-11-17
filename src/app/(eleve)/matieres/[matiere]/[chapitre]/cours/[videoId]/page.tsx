'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Share2,
  FileText,
  Download,
  MessageSquare,
  Mic,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { MATIERES_DATA, getChapter, ChapterData, LessonItem } from '@/lib/constants/matieres';
import VideoPlayer from '@/components/media/VideoPlayer';
import ChapitreItem from '@/components/metier/ChapitreItem';
import CourseComments from '@/components/metier/CourseComments';

export default function CoursVideoPage() {
  const params = useParams();
  const router = useRouter();

  const rawMatiere = (params?.matiere as string) || 'francais';
  const rawChapitre = (params?.chapitre as string) || 'argumentation';
  const rawVideoId = (params?.videoId as string) || '1';

  const matiereSlug = rawMatiere.toLowerCase();
  const chapitreSlug = rawChapitre.toLowerCase();
  const videoId = rawVideoId.toLowerCase();

  const [activeTab, setActiveTab] = useState<'cours' | 'exercices' | 'ressources' | 'discussions'>('cours');
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  // Retrieve chapter or dynamic fallback
  const foundChapter = getChapter(matiereSlug, chapitreSlug);
  const subjectMeta = MATIERES_DATA[matiereSlug];

  const chapter: ChapterData = foundChapter || {
    id: chapitreSlug,
    number: 'Chapitre 01',
    title: chapitreSlug.charAt(0).toUpperCase() + chapitreSlug.slice(1).replace(/-/g, ' '),
    objective: 'construire un raisonnement convaincant.',
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
      title: `${chapitreSlug.charAt(0).toUpperCase() + chapitreSlug.slice(1).replace(/-/g, ' ')} : méthodes et exemples`,
      duration: '18:24',
      progressPercent: 68,
      thumbnailUrl: '/images/course-thumbnail.png',
      desc: 'Méthodes et exemples structurés pour le Baccalauréat.',
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
        title: "Les types d'arguments et procédés",
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
        title: "S'entraîner à argumenter",
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

  // Find active lesson or default to first video
  const activeLesson: LessonItem =
    chapter.lessons.find((l) => l.id === videoId && l.type === 'video') ||
    chapter.lessons.find((l) => l.type === 'video') ||
    chapter.lessons[0];

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

      {/* Navigation header with back link */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/matieres/${matiereSlug}/${chapitreSlug}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200/80 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au chapitre</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/matieres/${matiereSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBECE2] text-[#C85A2B] hover:scale-105 transition-transform"
          >
            <span>{chapter.subjectName}</span>
          </Link>
        </div>
      </div>

      {/* Primary Video Player Area */}
      <div className="w-full">
        <VideoPlayer
          title={activeLesson.title}
          duration={activeLesson.duration || chapter.featuredLesson.duration}
          thumbnailUrl={activeLesson.thumbnailUrl || chapter.featuredLesson.thumbnailUrl}
          initialProgressPercent={activeLesson.progressPercent ?? chapter.featuredLesson.progressPercent}
        />
      </div>

      {/* Course Title, Chapter and Progress Meta */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
          <span>{chapter.subjectName}</span>
          <span>•</span>
          <span>{chapter.number}</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">Vidéo en cours</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
          {activeLesson.title}
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 font-normal">
          {chapter.title} · Objectif : {chapter.objective}
        </p>
      </div>

      {/* Navigation Tabs (Cours | Exercices | Ressources | Discussions) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200/60 pt-2">
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

      {/* TAB CONTENT */}

      {/* 1. COURS TAB: Dans ce chapitre */}
      {activeTab === 'cours' && (
        <section className="flex flex-col gap-3.5 animate-in fade-in duration-200">
          {/* Section: Dans ce chapitre */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Dans ce chapitre
              </h2>
              <span className="text-xs text-stone-500">
                {chapter.lessons.length} élément(s) au programme
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {chapter.lessons.map((lesson) => {
                const isCurrent = lesson.id === activeLesson.id && lesson.type === 'video';

                const subtitle =
                  lesson.type === 'video'
                    ? `Vidéo · ${lesson.duration}${isCurrent ? ' • En cours de lecture' : ''}`
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
                    isActive={isCurrent}
                    onClick={
                      lesson.type === 'pdf'
                        ? () => handleDownload(lesson.title)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Section: Commentaires du cours (directement sous la vidéo) */}
          <div className="mt-6 pt-6 border-t border-stone-200/80">
            <CourseComments
              chapterTitle={chapter.title}
              subjectName={chapter.subjectName}
            />
          </div>
        </section>
      )}

      {/* 2. EXERCICES TAB */}
      {activeTab === 'exercices' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Exercices du chapitre
          </h2>

          {chapter.exercises.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-xs text-stone-500 text-sm">
              Les exercices pour ce chapitre seront mis en ligne très prochainement.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#236B48] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">{ex.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {ex.questionsCount} questions · Durée : {ex.estimatedTime} · Difficulté : {ex.difficulty}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Lancement de l'exercice : ${ex.title}`)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E75A24] hover:bg-[#D04D1B] text-white transition-all shadow-xs self-end sm:self-auto"
                  >
                    Commencer l'exercice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. RESSOURCES TAB */}
      {activeTab === 'ressources' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
            Ressources et fiches de synthèse
          </h2>

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

      {/* 4. DISCUSSIONS TAB */}
      {activeTab === 'discussions' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <CourseComments
            chapterTitle={chapter.title}
            subjectName={chapter.subjectName}
          />
        </div>
      )}
    </div>
  );
}
