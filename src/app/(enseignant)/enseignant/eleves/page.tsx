'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function EnseignantElevesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const eleves = [
    {
      id: 'e1',
      name: 'Awa Diop',
      initials: 'AD',
      classe: 'Terminale L',
      statut: 'Exercice à corriger',
      devoir: 'Introduction - Dissertation littéraire',
      noteMoyenne: '16.5/20',
      progression: '92%',
      urgent: true,
    },
    {
      id: 'e2',
      name: 'Moussa Sall',
      initials: 'MS',
      classe: 'Terminale L',
      statut: 'À jour',
      devoir: 'Commentaire composé - Senghor',
      noteMoyenne: '14.0/20',
      progression: '85%',
      urgent: false,
    },
    {
      id: 'e3',
      name: 'Fatou Ndiaye',
      initials: 'FN',
      classe: 'Terminale L',
      statut: 'Exercice à corriger',
      devoir: 'Plan détaillé - Tragédie classique',
      noteMoyenne: '15.0/20',
      progression: '78%',
      urgent: true,
    },
    {
      id: 'e4',
      name: 'Amadou Ba',
      initials: 'AB',
      classe: 'Terminale L',
      statut: 'À jour',
      devoir: 'Fiche de lecture - Les Bouts de bois de Dieu',
      noteMoyenne: '13.5/20',
      progression: '65%',
      urgent: false,
    },
  ];

  const filteredEleves = eleves.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
            Suivi de mes élèves
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-1">
            Consultez les devoirs soumis et suivez la progression de votre classe de Terminale L.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un élève..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#E75A24]"
          />
        </div>
      </div>

      {/* Students list */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredEleves.map((eleve) => (
            <div
              key={eleve.id}
              className="p-5 flex items-center justify-between hover:bg-stone-50/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F1EE] text-[#0F3833] font-bold text-sm flex items-center justify-center shrink-0">
                  {eleve.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-base">
                      {eleve.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                      {eleve.classe}
                    </span>
                    {eleve.urgent && (
                      <span className="text-xs bg-[#FFF5F0] text-[#E75A24] font-semibold px-2 py-0.5 rounded-md border border-[#E75A24]/30">
                        Devoir à corriger
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dernier travail : {eleve.devoir}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-stone-400 font-medium">Moyenne</span>
                  <span className="text-sm font-bold text-[#0F3833]">
                    {eleve.noteMoyenne}
                  </span>
                </div>

                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs text-stone-400 font-medium">Progression</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {eleve.progression}
                  </span>
                </div>

                <Link
                  href="/enseignant"
                  className="p-2 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
