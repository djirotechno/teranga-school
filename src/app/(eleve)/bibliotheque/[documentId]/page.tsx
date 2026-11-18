'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Download,
  CheckCircle,
  BookMarked,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { BIBLIOTHEQUE_DOCUMENTS } from '@/lib/constants/bibliotheque';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.documentId as string;

  const doc = BIBLIOTHEQUE_DOCUMENTS.find((d) => d.id === documentId) || BIBLIOTHEQUE_DOCUMENTS[0];
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = () => {
    setDownloadToast(`Téléchargement lancé : ${doc.title}.pdf (${doc.size})`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full pb-12">
      {/* Toast notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F3833] text-white text-sm rounded-2xl shadow-xl border border-white/10 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top navigation bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/bibliotheque"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Retour à la bibliothèque"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FCEEE7] text-[#C85A2B]">
                {doc.matiere}
              </span>
              <span className="text-xs text-stone-400">
                {doc.format} · {doc.size}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-stone-900">
              {doc.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom buttons */}
          <div className="hidden sm:flex items-center bg-stone-100 rounded-xl p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-stone-600">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#E75A24] hover:bg-[#d44f1c] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Télécharger</span>
          </button>
        </div>
      </div>

      {/* Document Sheet */}
      <div className="flex justify-center p-2 sm:p-6 bg-[#EFECE6]/60 rounded-3xl border border-stone-200/80">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-stone-200/90 p-6 sm:p-10 transition-transform duration-150 flex flex-col gap-6"
        >
          {/* Academic Header Banner */}
          <div className="border-b border-stone-200 pb-5 text-center">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
              République du Sénégal · Espace Élève Téranga S'cool
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
              {doc.content.title}
            </h2>
            <p className="text-xs font-semibold text-[#C85A2B] mt-1">
              {doc.content.level} · {doc.matiere}
            </p>
          </div>

          {/* Introduction Box */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border-l-4 border-[#C85A2B] text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p className="font-semibold text-stone-900 mb-1">Introduction</p>
            <p>{doc.content.intro}</p>
          </div>

          {/* Document Sections */}
          <div className="space-y-6">
            {doc.content.sections.map((section, idx) => (
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
              {doc.content.retainedPoints.map((item, rIdx) => (
                <li key={rIdx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sheet Footer */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <span>Page {currentPage} sur {doc.pagesCount}</span>
            <span>Téranga S'cool — Document d'apprentissage</span>
          </div>
        </div>
      </div>

      {/* Bottom pagination */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-stone-200/80 shadow-xs">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Page précédente</span>
        </button>

        <span className="text-xs sm:text-sm text-stone-600 font-semibold">
          Page {currentPage} sur {doc.pagesCount}
        </span>

        <button
          disabled={currentPage >= doc.pagesCount}
          onClick={() => setCurrentPage((p) => Math.min(doc.pagesCount, p + 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Page suivante</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
