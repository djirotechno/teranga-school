'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getHomePathForRole, type UserRole } from '@/types/user';

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMsg(
          'Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.'
        );
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      let target = '/accueil';
      if (userData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userData.user.id)
          .single();
        target = getHomePathForRole(profile?.role as UserRole | undefined);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(target);
        router.refresh();
      }, 1500);
    } catch {
      setErrorMsg('Une erreur inattendue est survenue. Réessaie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
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
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Choisis un nouveau mot de passe sécurisé pour ton compte.
        </p>
      </div>

      {success ? (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold">
            ✓
          </div>
          <h3 className="font-bold text-stone-900">Mot de passe mis à jour !</h3>
          <p className="text-xs text-stone-600">
            Redirection vers ton espace en cours...
          </p>
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
              Nouveau mot de passe
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 8 caractères"
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-stone-400 hover:text-stone-600 focus:outline-hidden transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Confirmer le mot de passe
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-stone-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète le mot de passe"
                required
                minLength={8}
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
            Enregistrer le nouveau mot de passe
          </button>

          <div className="pt-4 text-center">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#E75A24] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
