'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText
} from 'lucide-react';

interface PdfViewerProps {
  title: string;
  matiere?: string;
  size?: string;
  pagesCount?: number;
  url?: string;
  onDownload?: () => void;
}

export default function PdfViewer({
  title,
  matiere = 'Général',
  size = '2.4 Mo',
  pagesCount = 8,
  onDownload
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col w-full rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
      {/* Header toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-stone-100 bg-[#FAF7F2]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#FCEEE7] text-[#C85A2B]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate max-w-xs">{title}</h4>
            <p className="text-[10px] text-stone-500">{matiere} · {pagesCount} pages · {size}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(80, z - 10))}
              className="p-1 text-stone-600 hover:text-stone-900 rounded"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium px-1.5 text-stone-600">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(140, z + 10))}
              className="p-1 text-stone-600 hover:text-stone-900 rounded"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 text-stone-600 hover:text-[#C85A2B] hover:bg-[#FCEEE7] rounded-lg transition-colors"
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document Area */}
      <div className="p-6 bg-stone-100/60 flex items-center justify-center min-h-[360px]">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}
          className="w-full max-w-md bg-white rounded-xl shadow-xs border border-stone-200 p-6 transition-transform text-center flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FCEEE7] text-[#C85A2B] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h5 className="font-bold text-stone-800 text-sm">{title}</h5>
          <p className="text-xs text-stone-500">Aperçu interactif de la page {currentPage} sur {pagesCount}</p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-2.5 border-t border-stone-100 bg-white text-xs text-stone-600">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Précédent</span>
        </button>
        <span className="font-medium">Page {currentPage} / {pagesCount}</span>
        <button
          disabled={currentPage >= pagesCount}
          onClick={() => setCurrentPage((p) => Math.min(pagesCount, p + 1))}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 disabled:opacity-40"
        >
          <span>Suivant</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
