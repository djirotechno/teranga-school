'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

export default function MessagesPage() {
  const conversations = [
    { teacher: 'M. Diallo', subject: 'Français', message: 'N\'oublie pas de rendre ton devoir sur la dissertation avant vendredi.', unread: true, time: '14:32' },
    { teacher: 'Mme Sow', subject: 'Philosophie', message: 'Excellente progression sur le chapitre de la morale !', unread: true, time: '11:15' },
    { teacher: 'M. Cissé', subject: 'Histoire-Géo', message: 'Voici les cartes complémentaires pour la révision.', unread: true, time: 'Hier' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/accueil" className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-sm border border-stone-200/60">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Messages</h1>
          <p className="text-xs sm:text-sm text-stone-500">Communique directement avec tes professeurs</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        {conversations.map((c) => (
          <div key={c.teacher} className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/70 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <Avatar initials={c.teacher.split(' ')[1]?.slice(0, 2) || 'PR'} variant="default" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900">{c.teacher}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">{c.subject}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{c.message}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
              <span className="text-[11px] text-stone-400">{c.time}</span>
              {c.unread && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#E75A24]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

