'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  Download,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle,
  BookMarked
} from 'lucide-react';
import { BIBLIOTHEQUE_DOCUMENTS, DocumentItem } from '@/lib/constants/bibliotheque';

export default function BibliothequePage() {
  const [activeMatiere, setActiveMatiere] = useState<'Tout' | 'Français' | 'Histoire-Géo' | 'Philosophie'>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingDoc, setReadingDoc] = useState<DocumentItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Filtered documents according to selected filter tab and search bar
  const filteredDocuments = useMemo(() => {
    return BIBLIOTHEQUE_DOCUMENTS.filter((doc) => {
      const matchMatiere =
        activeMatiere === 'Tout' || doc.matiere === activeMatiere;
      const matchSearch =
        searchQuery.trim() === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.matiere.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMatiere && matchSearch;
    });
  }, [activeMatiere, searchQuery]);

  const handleOpenReader = (doc: DocumentItem) => {
    setReadingDoc(doc);
    setCurrentPage(1);
    setZoomLevel(100);
  };

  const handleCloseReader = () => {
    setReadingDoc(null);
  };

  const handleDownload = (doc: DocumentItem) => {
    setDownloadToast(`Téléchargement lancé : ${doc.title}.pdf (${doc.size})`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto w-full pb-12 select-none sm:select-auto">
      {/* Toast notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F3833] text-white text-sm rounded-2xl shadow-xl border border-white/10 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header section matching exact layout */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Bibliothèque
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Retrouve les supports pédagogiques de tes trois matières.
        </p>
      </div>

      {/* Search Input matching exact design in screenshot */}
      <div className="relative flex items-center w-full bg-white rounded-2xl border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] px-4 py-3 transition-all focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200/50">
        <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un document..."
          className="w-full bg-transparent text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Effacer la recherche"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills matching exact styling in image */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Tout', 'Français', 'Histoire-Géo', 'Philosophie'] as const).map(
          (matiere) => {
            const isActive = activeMatiere === matiere;
            return (
              <button
                key={matiere}
                type="button"
                onClick={() => setActiveMatiere(matiere)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FBE8DE] text-[#C25425] font-semibold shadow-xs'
                    : 'bg-[#EAE4D9]/80 text-stone-600 hover:bg-[#EAE4D9] hover:text-stone-900'
                }`}
              >
                {matiere}
              </button>
            );
          }
        )}
      </div>

      {/* Document cards list matching provided image */}
      <div className="flex flex-col gap-3 sm:gap-3.5">
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-stone-200/70 text-center flex flex-col items-center justify-center gap-3 text-stone-500">
            <FileText className="w-10 h-10 text-stone-300" />
            <p className="text-sm font-medium">
              Aucun document ne correspond à votre recherche.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveMatiere('Tout');
              }}
              className="text-xs text-[#E75A24] font-semibold underline underline-offset-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 sm:gap-4 hover:border-stone-300 hover:shadow-xs transition-all"
            >
              {/* Left: Document icon + Title & Metadata */}
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                {/* Terracotta/Peach icon box */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FCEEE7] flex items-center justify-center shrink-0 text-[#C85A2B]">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
                </div>

                {/* Text details */}
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight truncate sm:whitespace-normal">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {doc.matiere} · {doc.format} · {doc.size}
                  </p>
                </div>
              </div>

              {/* Right: Reading option + Download button */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Reading button requested by user next to download button */}
                <button
                  type="button"
                  onClick={() => handleOpenReader(doc)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-700 bg-stone-100 hover:bg-[#FCEEE7] hover:text-[#C85A2B] active:scale-95 transition-all"
                  title="Lire le document"
                >
                  <BookOpen className="w-4 h-4 text-[#C85A2B]" />
                  <span>Lire</span>
                </button>

                {/* Download button */}
                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="p-2 sm:p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:scale-95 rounded-xl transition-all"
                  title="Télécharger le document"
                  aria-label="Télécharger"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reader Modal (Interactive Reading Experience) */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-stone-200/80 bg-[#FAF7F2] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#FCEEE7] text-[#C85A2B] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {readingDoc.matiere}
                    </span>
                    <span className="text-xs text-stone-400">
                      Document pédagogique officiel
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 truncate">
                    {readingDoc.title}
                  </h2>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom buttons */}
                <div className="hidden sm:flex items-center bg-stone-200/70 rounded-xl p-0.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold px-2 text-stone-600">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct link to dedicated page */}
                <Link
                  href={`/bibliotheque/${readingDoc.id}`}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors"
                  title="Plein écran (page dédiée)"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>

                {/* Download inside reader */}
                <button
                  onClick={() => handleDownload(readingDoc)}
                  className="p-2 text-stone-600 hover:text-[#C85A2B] hover:bg-[#FCEEE7] rounded-xl transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Close modal */}
                <button
                  onClick={handleCloseReader}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 rounded-xl transition-colors"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body (Scrollable Sheet) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFECE6]/70 flex justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-stone-200/90 p-6 sm:p-10 transition-transform duration-150 flex flex-col gap-6"
              >
                {/* Academic Header Banner */}
                <div className="border-b border-stone-200 pb-5 text-center">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                    République du Sénégal · Espace Élève Téranga S'cool
                  </p>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                    {readingDoc.content.title}
                  </h1>
                  <p className="text-xs font-semibold text-[#C85A2B] mt-1">
                    {readingDoc.content.level} · {readingDoc.matiere}
                  </p>
                </div>

                {/* Introduction Box */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border-l-4 border-[#C85A2B] text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <p className="font-semibold text-stone-900 mb-1">Introduction</p>
                  <p>{readingDoc.content.intro}</p>
                </div>

                {/* Document Sections */}
                <div className="space-y-6">
                  {readingDoc.content.sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 border-b border-stone-100 pb-1">
                        {section.heading}
                      </h3>
                      <ul className="space-y-1.5 pl-2">
                        {section.points.map((pt, pIdx) => (
                          <li
                            key={pIdx}
                            className="text-xs sm:text-sm text-stone-700 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A2B] mt-2 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {section.tip && (
                        <div className="mt-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <BookMarked className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Conseil pour l'examen : </span>
                            {section.tip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Retained Key Points Box */}
                <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>L'essentiel à retenir pour le Bac</span>
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-800">
                    {readingDoc.content.retainedPoints.map((item, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sheet Footer */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>Page {currentPage} sur {readingDoc.pagesCount}</span>
                  <span>Téranga S'cool — Tous droits réservés</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Pagination & Actions Bar */}
            <div className="px-5 py-3 border-t border-stone-200/80 bg-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>
                <span className="text-xs text-stone-600 font-medium">
                  Page {currentPage} / {readingDoc.pagesCount}
                </span>
                <button
                  disabled={currentPage >= readingDoc.pagesCount}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(readingDoc.pagesCount, p + 1))
                  }
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(readingDoc)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#E75A24] hover:bg-[#d44f1c] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger ({readingDoc.size})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
