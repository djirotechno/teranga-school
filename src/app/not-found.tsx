import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8F5EE] text-stone-900 text-center gap-6">
      <Logo size="lg" textVariant="dark" subtitle="Plateforme d'apprentissage" href="/accueil" priority />
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200/80 shadow-xs flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-2">Page introuvable</h2>
        <p className="text-stone-600 mb-6 text-sm">La ressource que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link
          href="/accueil"
          className="px-6 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white font-bold text-sm shadow-xs transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
