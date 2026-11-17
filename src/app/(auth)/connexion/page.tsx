'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ConnexionPage() {
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
          Connexion à Téranga S'cool
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Accède à tes cours, tes vidéos et ton espace d'apprentissage
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Numéro de téléphone ou Email
          </label>
          <input
            type="text"
            placeholder="+221 77 000 00 00"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Mot de passe
            </label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs font-semibold text-[#E75A24] hover:underline"
            >
              Oublié ?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <Link
          href="/accueil"
          className="w-full block py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] text-white text-center shadow-xs hover:shadow-md transition-all"
        >
          Se connecter
        </Link>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-bold text-[#E75A24] hover:underline">
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
