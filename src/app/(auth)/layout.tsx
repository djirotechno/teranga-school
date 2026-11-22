import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-2">
      {/* Colonne gauche : Présentation de la marque (Vert foncé) */}
      <div className="bg-[#0F3833] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 relative overflow-hidden text-center select-none">
        {/* Cercles d'ambiance subtils en arrière-plan */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center max-w-sm z-10 py-6">
          {/* Carte blanche avec le logo officiel Téranga S'cool */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center justify-center mb-6 sm:mb-8 border border-white/10 transition-transform duration-300 hover:scale-105">
            <Image
              src="/images/logo-teranga.jpeg"
              alt="Téranga S'cool"
              width={160}
              height={160}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Slogan */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Bien plus que des cours.
          </h2>

          <p className="text-emerald-100/80 text-sm sm:text-base font-normal leading-relaxed max-w-xs">
            Un espace pour comprendre, échanger et réussir.
          </p>
        </div>
      </div>

      {/* Colonne droite : Formulaires (Fond crème / clair) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FAF8F4] px-6 py-10 sm:px-10 lg:px-16 min-h-[calc(100vh-280px)] md:min-h-screen">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
