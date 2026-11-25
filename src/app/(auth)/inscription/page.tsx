'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function formatSenegalPhone(raw: string): string {
  const digits = raw.replace(/[\s\-().]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00221')) return `+${digits.slice(2)}`;
  if (digits.startsWith('221')) return `+${digits}`;
  return `+221${digits}`;
}

export default function InscriptionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [niveau, setNiveau] = useState('Terminale');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!acceptTerms) {
      setErrorMsg('Veuillez accepter les conditions et les règles de la communauté.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const trimmed = identifier.trim();
      const isEmail = trimmed.includes('@');
      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      const metadata = {
        full_name: fullName.trim(),
        niveau,
        serie: 'L',
        phone: isEmail ? null : formatSenegalPhone(trimmed),
      };

      const { data, error } = isEmail
        ? await supabase.auth.signUp({
            email: trimmed.toLowerCase(),
            password,
            options: {
              data: metadata,
              emailRedirectTo: `${origin}/auth/callback`,
            },
          })
        : await supabase.auth.signUp({
            phone: formatSenegalPhone(trimmed),
            password,
            options: {
              data: metadata,
            },
          });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setErrorMsg('Un compte existe déjà avec cet identifiant. Essaie de te connecter.');
        } else {
          setErrorMsg(error.message || 'Erreur lors de la création du compte.');
        }
        return;
      }

      // Si une session est immédiatement active (confirmation e-mail désactivée), redirection directe
      if (data.session) {
        router.push('/accueil');
        router.refresh();
        return;
      }

      // Sinon, afficher l'écran de confirmation e-mail
      setConfirmationEmail(trimmed);
    } catch {
      setErrorMsg('Une erreur réseau est survenue. Réessaie dans un instant.');
    } finally {
      setIsLoading(false);
    }
  };

  if (confirmationEmail) {
    return (
      <div className="w-full">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
            ✓
          </div>
          <h2 className="text-xl font-extrabold text-stone-900">
            Vérifie ta boîte de réception !
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Un lien de confirmation vient d&apos;être envoyé à{' '}
            <strong className="text-stone-900">{confirmationEmail}</strong>. Clique dessus pour activer ton compte Téranga S&apos;cool.
          </p>
          <Link
            href="/connexion"
            className="inline-block w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] text-white transition-colors"
          >
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Créer mon compte
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Rejoins ton espace d&apos;apprentissage.
        </p>
      </div>

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Prénom et nom
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Awa Diop"
            required
            className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Adresse e-mail ou téléphone
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="awa.diop@exemple.sn ou 77 000 00 00"
            required
            className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Niveau
          </label>
          <div className="relative flex items-center">
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 sm:py-3 text-sm bg-white rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#E75A24]/20 focus:border-[#E75A24] transition-all cursor-pointer pr-10"
            >
              <option value="Terminale">Terminale</option>
              <option value="Première">Première</option>
              <option value="Seconde">Seconde</option>
              <option value="Troisième">Troisième</option>
              <option value="Autre">Autre / Enseignant</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 pointer-events-none" />
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

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#E75A24] focus:ring-[#E75A24]/30 accent-[#E75A24] cursor-pointer shrink-0"
            />
            <span className="text-xs text-stone-600 leading-snug">
              J&apos;accepte les conditions et les règles de la communauté.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#E75A24] hover:bg-[#D04D1B] active:bg-[#B83E12] text-white text-center shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          Créer mon compte
        </button>
      </form>

      <div className="mt-7 text-center text-xs sm:text-sm text-stone-600">
        Tu as déjà un compte ?{' '}
        <Link
          href="/connexion"
          className="font-bold text-[#E75A24] hover:underline transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
