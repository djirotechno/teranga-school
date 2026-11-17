import React from 'react';
import Logo from '@/components/ui/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#F8F5EE] flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header with Brand Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Logo
          size="md"
          textVariant="dark"
          subtitle="Plateforme d'apprentissage"
          href="/accueil"
          priority
        />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 text-xs text-stone-500">
        © {new Date().getFullYear()} Téranga S'cool • Tous droits réservés • Sénégal
      </footer>
    </div>
  );
}
