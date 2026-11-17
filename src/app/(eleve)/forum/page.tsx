'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, MessageSquare, Plus } from 'lucide-react';

export default function ForumPage() {
  const topics = [
    { title: 'Question sur la méthodologie du commentaire de texte en Français', author: 'Moussa Sall', answers: 5, time: 'Il y a 2h', tag: 'Français' },
    { title: 'Différence entre conscience et inconscient chez Freud', author: 'Fatou Ndiaye', answers: 8, time: 'Il y a 4h', tag: 'Philosophie' },
    { title: 'Les causes économiques de la colonisation au Sénégal', author: 'Amadou Ba', answers: 3, time: 'Hier', tag: 'Histoire-Géo' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/accueil" className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-sm border border-stone-200/60">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Forum d'entraide</h1>
            <p className="text-xs sm:text-sm text-stone-500">Pose tes questions aux enseignants et échange avec les autres élèves</p>
          </div>
        </div>

        <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#E75A24] text-white rounded-xl font-medium text-sm hover:bg-[#D44E1C]">
          <Plus className="w-4 h-4" />
          Poser une question
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {topics.map((t) => (
          <div key={t.title} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-stone-300 transition-colors cursor-pointer">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#E75A24] uppercase tracking-wider">{t.tag}</span>
              <h3 className="font-bold text-base text-stone-900">{t.title}</h3>
              <p className="text-xs text-stone-500">Par {t.author} · {t.time}</p>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-50">
              <MessageSquare className="w-4 h-4" />
              <span>{t.answers} réponses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

