'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getHomePathForRole, type UserRole } from '@/types/user';

function formatSenegalPhone(raw: string): string {
  const digits = raw.replace(/[\s\-().]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00221')) return `+${digits.slice(2)}`;
  if (digits.startsWith('221')) return `+${digits}`;
  return `+221${digits}`;
}

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    errorParam === 'compte_suspendu'
      ? 'Ton compte est temporairement suspendu. Contacte le support Téranga S\'cool.'
      : errorParam === 'auth_callback_failed'
      ? 'Le lien de confirmation ou de réinitialisation est invalide ou expiré.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const trimmed = identifier.trim();
      const isEmail = trimmed.includes('@');

      const credentials = isEmail
        ? { email: trimmed.toLowerCase(), password }
        : { phone: formatSenegalPhone(trimmed), password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error || !data.user) {
        if (error?.message?.toLowerCase().includes('email not confirmed')) {
          setErrorMsg(
            'Ton adresse e-mail n\'est pas encore confirmée. Vérifie ta boîte de réception.'
          );
        } else {
          setErrorMsg('Identifiant ou mot de passe incorrect.');
        }
        return;
      }

      // Redirection vers le paramètre ?next= s'il est interne, sinon selon le rôle
      if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')) {
        router.push(nextParam);
        router.refresh();
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const target = getHomePathForRole(profile?.role as UserRole | undefined);
      router.push(target);
      router.refresh();
    } catch {
      setErrorMsg('Impossible de se connecter pour le moment. Vérifie ta connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* En-tête du formulaire */}
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
          Heureux de te revoir !
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Connecte-toi à ton espace personnel.
        </p>
      </div>

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Téléphone ou adresse e-mail
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-stone-400 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="awa.diop@terangascool.sn"
              required
              autoComplete="username"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-stone-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              autoComplete="current-password"
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

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-[#E75A24] focus:ring-[#E75A24]/30 accent-[#E75A24] cursor-pointer"
            />
            <span className="text-xs text-stone-600 font-medium">
              Se souvenir de moi
            </span>
          </label>

          <Link
            href="/mot-de-passe-oublie"
            className="text-xs font-semibold text-[#E75A24] hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] active:bg-[#B83E12] text-white text-center shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          Se connecter
        </button>
      </form>

      <div className="mt-8 text-center text-xs sm:text-sm text-stone-600">
        Pas encore de compte ?{' '}
        <Link
          href="/inscription"
          className="font-bold text-stone-900 hover:text-[#E75A24] transition-colors"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="w-full py-12 text-center text-sm text-stone-500">Chargement...</div>}>
      <ConnexionForm />
    </Suspense>
  );
}
