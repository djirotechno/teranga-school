'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, FileText } from 'lucide-react';

export default function BibliothequePage() {
  const documents = [
    { title: 'Fascicule de Français - Terminale', type: 'PDF', pages: '84 pages', size: '4.2 Mo' },
    { title: 'Recueil de Textes et Dissertations Philosophiques', type: 'PDF', pages: '120 pages', size: '6.8 Mo' },
    { title: 'Atlas d\'Histoire-Géographie du Sénégal', type: 'PDF', pages: '56 pages', size: '12.4 Mo' },
    { title: 'Fiches de Synthèse - Grammaire & Syntaxe', type: 'PDF', pages: '28 pages', size: '1.9 Mo' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/accueil" className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-sm border border-stone-200/60">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Bibliothèque numérique</h1>
          <p className="text-xs sm:text-sm text-stone-500">Accède à tes fascicules, manuels scolaires et résumés officiels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.title} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#FBECE2] text-[#C85A2B]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">{doc.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{doc.pages} · {doc.size}</p>
              </div>
            </div>
            <button className="p-2.5 rounded-xl bg-stone-100 hover:bg-[#E75A24] hover:text-white transition-colors text-stone-700">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

