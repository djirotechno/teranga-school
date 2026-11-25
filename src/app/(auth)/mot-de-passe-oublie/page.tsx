'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@')) {
      setErrorMsg('Merci de saisir une adresse e-mail valide pour recevoir le lien.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
      });

      if (error) {
        setErrorMsg('Impossible d\'envoyer le lien pour le moment. Réessaie dans quelques minutes.');
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMsg('Une erreur réseau est survenue. Vérifie ta connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200/80 p-1 flex items-center justify-center mb-5">
          <Image
            src="/images/logo-teranga.jpeg"
            alt="Téranga S'cool"
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Saisis ton adresse e-mail pour réinitialiser ton accès.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold">
            ✓
          </div>
          <h3 className="font-bold text-stone-900">Instructions envoyées !</h3>
          <p className="text-xs text-stone-600">
            Si un compte correspond à <strong>{email}</strong>, tu recevras un lien de réinitialisation sous peu.
          </p>
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#E75A24] hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Adresse e-mail
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="awa.diop@terangascool.sn"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] active:bg-[#B83E12] text-white text-center shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-70"
          >
            {isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            Envoyer le lien de réinitialisation
          </button>

          <div className="pt-4 text-center">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#E75A24] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la page de connexion
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
