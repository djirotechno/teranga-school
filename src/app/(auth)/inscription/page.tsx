'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function InscriptionPage() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200/80 shadow-xs p-1 flex items-center justify-center overflow-hidden mb-1">
          <Image
            src="/images/logo-teranga.jpeg"
            alt="Téranga S'cool"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Rejoindre Téranga S'cool
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Inscris-toi pour préparer ton Bac avec les meilleurs professeurs
        </p>
      </div>

      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Nom complet
          </label>
          <input
            type="text"
            placeholder="Ex : Awa Diop"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            placeholder="+221 77 000 00 00"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Série / Classe
          </label>
          <select className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all">
            <option>Terminale L2 (Littéraire)</option>
            <option>Terminale L' (Langues)</option>
            <option>Terminale S1 / S2 (Scientifique)</option>
            <option>Première</option>
            <option>Seconde</option>
          </select>
        </div>

        <Link
          href="/accueil"
          className="w-full block py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] text-white text-center shadow-xs hover:shadow-md transition-all mt-2"
        >
          Créer mon compte
        </Link>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500">
        Tu as déjà un compte ?{' '}
        <Link href="/connexion" className="font-bold text-[#E75A24] hover:underline">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
