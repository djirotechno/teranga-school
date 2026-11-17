'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart2, CheckCircle2, Clock, Award } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

export default function MonSuiviPage() {
  const stats = [
    { label: 'Cours suivis', value: '14', icon: Award, color: 'text-amber-500' },
    { label: 'Temps passé', value: '28h', icon: Clock, color: 'text-blue-500' },
    { label: 'Exercices réussis', value: '42', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const subjectsProgress = [
    { name: 'Français', progress: 68, hours: '12h d\'étude' },
    { name: 'Histoire-Géographie', progress: 45, hours: '8h d\'étude' },
    { name: 'Philosophie', progress: 30, hours: '5h d\'étude' },
    { name: 'Mathématiques', progress: 55, hours: '9h d\'étude' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/accueil" className="p-2 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-sm border border-stone-200/60">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Mon Suivi & Statistiques</h1>
          <p className="text-xs sm:text-sm text-stone-500">Visualise ton assiduité, tes progrès et tes objectifs de révision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-stone-100 ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900">{s.value}</span>
                <p className="text-xs text-stone-500 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
        <h2 className="font-bold text-lg text-stone-900">Progression par matière</h2>
        <div className="flex flex-col gap-4">
          {subjectsProgress.map((sp) => (
            <div key={sp.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-stone-800">{sp.name}</span>
                <span className="text-xs text-stone-500 font-medium">{sp.hours} · {sp.progress}%</span>
              </div>
              <ProgressBar progress={sp.progress} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

