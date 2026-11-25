'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Settings,
  CreditCard,
  Save,
  CheckCircle2,
  Lock,
  Bell,
  Globe,
  Camera,
  Mail,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/client';
import { useCurrentProfile, getInitials } from '@/hooks/useCurrentProfile';
import { getHomePathForRole, type NiveauScolaire, type SerieScolaire } from '@/types/user';
import type { Tables } from '@/types/database';

type AbonnementRow = Tables<'abonnements'>;

const NIVEAU_OPTIONS: NiveauScolaire[] = [
  'Terminale',
  'Première',
  'Seconde',
  'Troisième',
  'Autre',
];

const SERIE_OPTIONS: { value: SerieScolaire; label: string }[] = [
  { value: 'L', label: 'Série L (Littéraire)' },
  { value: 'L1', label: 'Série L1 (Lettres & Langues)' },
  { value: 'L2', label: 'Série L2 (Sciences Humaines)' },
  { value: 'S', label: 'Série S (Scientifique)' },
  { value: 'S1', label: 'Série S1 (Sciences Exactes)' },
  { value: 'S2', label: 'Série S2 (Sciences Expérimentales)' },
  { value: 'G', label: 'Série G (Gestion & Tertiaire)' },
  { value: 'Autre', label: 'Autre / Enseignant' },
];

function splitFullName(fullName: string): { prenom: string; nom: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { prenom: parts[0] || '', nom: '' };
  return { prenom: parts[0], nom: parts.slice(1).join(' ') };
}

function formatDateFr(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-SN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatRoleBadge(role?: string): string {
  if (role === 'admin') return 'Administrateur';
  if (role === 'enseignant') return 'Enseignant';
  return 'Élève';
}

function CompteContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'profil' | 'parametres' | 'abonnement' | null;
  const { profile, isLoading: profileLoading, refreshProfile } = useCurrentProfile();

  const [activeTab, setActiveTab] = useState<'profil' | 'parametres' | 'abonnement'>('profil');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTab === 'parametres' || initialTab === 'abonnement' || initialTab === 'profil') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Profile Form State
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ville, setVille] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [niveau, setNiveau] = useState<NiveauScolaire>('Terminale');
  const [serie, setSerie] = useState<SerieScolaire>('L');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Settings State
  const [langueWolof, setLangueWolof] = useState(false);
  const [notifForum, setNotifForum] = useState(true);
  const [notifCours, setNotifCours] = useState(true);
  const [notifRappels, setNotifRappels] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Abonnement State
  const [abonnement, setAbonnement] = useState<AbonnementRow | null>(null);
  const [loadingAbo, setLoadingAbo] = useState(true);
  const [creatingAbo, setCreatingAbo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'mensuel' | 'annuel'>('annuel');
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money'>('wave');

  // Toast notification
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Hydrate form from live Supabase profile
  useEffect(() => {
    if (!profile) return;
    const { prenom: p, nom: n } = splitFullName(profile.full_name);
    setPrenom(p);
    setNom(n);
    setEmail(profile.email ?? '');
    setTelephone(profile.phone ?? '');
    setVille(profile.ville ?? '');
    setEtablissement(profile.etablissement ?? '');
    setNiveau((profile.niveau as NiveauScolaire) ?? 'Terminale');
    setSerie((profile.serie as SerieScolaire) ?? 'L');
    setAvatarUrl(profile.avatar_url ?? null);

    setLangueWolof(Boolean(profile.preferences?.wolof_support));
    setNotifForum(profile.preferences?.notif_forum ?? true);
    setNotifCours(profile.preferences?.notif_cours ?? true);
    setNotifRappels(profile.preferences?.notif_rappels ?? true);
  }, [profile]);

  // Load latest subscription from public.abonnements
  useEffect(() => {
    if (!profile?.id) return;
    let active = true;
    (async () => {
      setLoadingAbo(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('abonnements')
          .select('*')
          .eq('eleve_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (active) setAbonnement(data ?? null);
      } finally {
        if (active) setLoadingAbo(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [profile?.id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image trop lourde (maximum 2 Mo).', true);
      return;
    }

    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) {
        showToast(`Échec de l'envoi : ${uploadError.message}`, true);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) {
        showToast(updateError.message, true);
        return;
      }

      setAvatarUrl(publicUrl);
      await refreshProfile();
      showToast('Photo de profil mise à jour !');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const fullName = [prenom.trim(), nom.trim()].filter(Boolean).join(' ');
    if (fullName.length < 2) {
      showToast('Veuillez saisir un prénom et un nom valides.', true);
      return;
    }

    setSavingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: telephone.trim() || null,
          ville: ville.trim() || null,
          etablissement: etablissement.trim() || null,
          niveau,
          serie,
        })
        .eq('id', profile.id);

      if (error) {
        showToast(`Erreur lors de l'enregistrement : ${error.message}`, true);
        return;
      }

      await refreshProfile();
      showToast('Vos informations de profil ont été enregistrées !');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSavingSettings(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            wolof_support: langueWolof,
            notif_forum: notifForum,
            notif_cours: notifCours,
            notif_rappels: notifRappels,
          },
        })
        .eq('id', profile.id);

      if (error) {
        showToast(`Erreur : ${error.message}`, true);
        return;
      }

      await refreshProfile();
      showToast('Vos préférences et paramètres ont été enregistrés !');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword || !confirmPassword) {
      setPasswordMsg({ text: 'Veuillez remplir tous les champs du mot de passe.', error: true });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ text: 'Le nouveau mot de passe doit comporter au moins 8 caractères.', error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Les deux nouveaux mots de passe ne correspondent pas.', error: true });
      return;
    }

    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setPasswordMsg({ text: error.message, error: true });
        return;
      }

      setPasswordMsg({ text: 'Mot de passe modifié avec succès !', error: false });
      setNewPassword('');
      setConfirmPassword('');
      showToast('Votre mot de passe a été mis à jour.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRequestSubscription = async () => {
    if (!profile) return;
    setCreatingAbo(true);
    try {
      const supabase = createClient();
      const planNom =
        selectedPlan === 'annuel' ? 'Pack Terminale Annuel' : 'Pack Terminale Mensuel';
      const montant = selectedPlan === 'annuel' ? 15000 : 2500;
      const ref = `PT-SN-${Date.now().toString().slice(-6)}`;

      const { data, error } = await supabase
        .from('abonnements')
        .insert({
          eleve_id: profile.id,
          plan_nom: planNom,
          statut: 'en_attente',
          montant_xof: montant,
          methode_paiement: selectedMethod,
          paytech_ref: ref,
        })
        .select('*')
        .single();

      if (error) {
        showToast(`Impossible d'initier la demande : ${error.message}`, true);
        return;
      }

      setAbonnement(data);
      showToast('Demande d’abonnement enregistrée ! Un administrateur va valider votre accès.');
    } finally {
      setCreatingAbo(false);
    }
  };

  const displayFullName = [prenom, nom].filter(Boolean).join(' ') || profile?.full_name || 'Utilisateur';
  const backHref = getHomePathForRole(profile?.role);

  if (profileLoading && !profile) {
    return (
      <div className="flex items-center justify-center py-24 text-stone-500 gap-2 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
        <span>Chargement de ton compte...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-14 select-none sm:select-auto">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 text-white text-sm rounded-2xl shadow-xl border border-white/10 ${
            toast.error ? 'bg-red-700' : 'bg-[#0F3833]'
          }`}
        >
          {toast.error ? (
            <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header section with back button */}
      <div className="flex items-center gap-3.5">
        <Link
          href={backHref}
          className="p-2.5 rounded-2xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/80 hover:bg-stone-50 transition-colors"
          title="Retour à l'accueil"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Mon Compte
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Gère tes informations personnelles, tes préférences et ton abonnement
          </p>
        </div>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar with upload trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
            title="Changer ma photo de profil"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayFullName}
                className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-[#0F3833]/10"
              />
            ) : (
              <Avatar
                initials={getInitials(displayFullName)}
                size="lg"
                variant="green"
                className="w-20 h-20 text-2xl shadow-sm"
              />
            )}
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#E75A24] text-white shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform">
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {displayFullName}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#FCEEE7] text-[#C85A2B] text-xs font-bold">
                {formatRoleBadge(profile?.role)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {[niveau, serie !== 'Autre' ? `Série ${serie}` : null, etablissement, ville ? `(${ville})` : null]
                .filter(Boolean)
                .join(' · ') || 'Complète ton profil scolaire ci-dessous'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-stone-400">
              {email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </span>
              )}
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile?.statut === 'actif' ? 'Compte actif' : profile?.statut ?? 'Actif'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick status pill */}
        {abonnement?.statut === 'actif' ? (
          <div className="p-3 bg-[#EAF7EE] border border-[#CEEFD8] rounded-2xl flex items-center gap-2.5 self-stretch sm:self-auto justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-emerald-900">{abonnement.plan_nom}</div>
              <div className="text-[11px] text-emerald-700">
                Actif jusqu&apos;au {formatDateFr(abonnement.date_fin)}
              </div>
            </div>
          </div>
        ) : abonnement?.statut === 'en_attente' ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 self-stretch sm:self-auto justify-center">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-amber-900">Validation en cours</div>
              <div className="text-[11px] text-amber-700">{abonnement.plan_nom}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'profil'
              ? 'bg-[#E75A24] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Mon Profil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('parametres')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'parametres'
              ? 'bg-[#E75A24] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('abonnement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'abonnement'
              ? 'bg-[#E75A24] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Mon Abonnement</span>
        </button>
      </div>

      {/* TAB 1: MON PROFIL */}
      {activeTab === 'profil' && (
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Informations Personnelles
              </h3>
              <p className="text-xs text-stone-500">
                Ces informations permettent de personnaliser ton accompagnement pédagogique
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Prénom
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Nom de famille
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="px-4 py-3 bg-stone-100 text-stone-500 text-sm rounded-xl border border-stone-200 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Numéro de téléphone (Sénégal)
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                Cursus & Établissement
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Programme officiel sénégalais
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Niveau
                  </label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value as NiveauScolaire)}
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  >
                    {NIVEAU_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Série
                  </label>
                  <select
                    value={serie}
                    onChange={(e) => setSerie(e.target.value as SerieScolaire)}
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  >
                    {SERIE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Lycée / Établissement
                  </label>
                  <input
                    type="text"
                    value={etablissement}
                    onChange={(e) => setEtablissement(e.target.value)}
                    placeholder="Lycée Lamine Guèye"
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Ville / Région
                  </label>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Dakar"
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E75A24] hover:bg-[#D04D1B] active:scale-95 text-white rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                {savingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PARAMÈTRES */}
      {activeTab === 'parametres' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
            {/* Preferences Linguistiques & Audio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF7EE] text-[#1B7843] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Langues & Pédagogie bilingue
                  </h3>
                  <p className="text-xs text-stone-500">
                    Adapte la langue de l&apos;interface et les explications orales
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80">
                <div className="flex flex-col pr-4">
                  <span className="text-sm font-bold text-stone-900">
                    Explications audio en Wolof
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5">
                    Permet aux enseignants de joindre des résumés oraux et explications en Wolof sous les cours et dans le forum
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={langueWolof}
                    onChange={(e) => setLangueWolof(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E75A24]"></div>
                </label>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCEEE7] text-[#C85A2B] flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Notifications & Alertes
                  </h3>
                  <p className="text-xs text-stone-500">
                    Choisis les notifications que tu souhaites recevoir
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900">
                      Réponses des enseignants sur le forum
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Notification dès qu&apos;un professeur répond à l&apos;une de tes questions
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifForum}
                    onChange={(e) => setNotifForum(e.target.checked)}
                    className="w-4 h-4 accent-[#E75A24] rounded-md cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900">
                      Nouveaux cours et fascicules publiés
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Alerte lorsque de nouvelles fiches ou vidéos sont ajoutées
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifCours}
                    onChange={(e) => setNotifCours(e.target.checked)}
                    className="w-4 h-4 accent-[#E75A24] rounded-md cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-stone-900">
                      Rappels de révisions pour le Bac
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Rappels quotidiens d&apos;exercices et de quiz
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifRappels}
                    onChange={(e) => setNotifRappels(e.target.checked)}
                    className="w-4 h-4 accent-[#E75A24] rounded-md cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E75A24] hover:bg-[#D04D1B] text-white rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {savingSettings ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingSettings ? 'Enregistrement...' : 'Enregistrer mes préférences'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Sécurité & Mot de passe */}
          <form onSubmit={handleUpdatePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Sécurité & Mot de passe
                </h3>
                <p className="text-xs text-stone-500">
                  Protège l&apos;accès à ton compte Téranga S&apos;cool
                </p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 ${
                  passwordMsg.error
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {passwordMsg.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 max-w-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Au moins 8 caractères"
                  minLength={8}
                  className="px-4 py-2.5 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répète le nouveau mot de passe"
                  minLength={8}
                  className="px-4 py-2.5 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60"
              >
                {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Mettre à jour le mot de passe</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MON ABONNEMENT */}
      {activeTab === 'abonnement' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          {loadingAbo ? (
            <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center text-stone-500 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#E75A24]" />
              <span>Chargement de ton abonnement...</span>
            </div>
          ) : abonnement ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      abonnement.statut === 'actif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : abonnement.statut === 'en_attente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {abonnement.statut === 'actif'
                      ? 'Abonnement actif'
                      : abonnement.statut === 'en_attente'
                      ? 'En attente de validation'
                      : abonnement.statut === 'a_renouveler'
                      ? 'À renouveler'
                      : 'Expiré'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                    {abonnement.plan_nom}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Référence : {abonnement.paytech_ref ?? '—'} ·{' '}
                    {abonnement.montant_xof.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#E75A24]">
                    {abonnement.statut === 'actif' ? 'Actif' : 'En attente'}
                  </span>
                  <p className="text-[11px] text-stone-400">
                    {abonnement.date_fin
                      ? `Valide jusqu'au ${formatDateFr(abonnement.date_fin)}`
                      : `Demandé le ${formatDateFr(abonnement.created_at)}`}
                  </p>
                </div>
              </div>

              {/* Inclus dans l'abonnement */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-stone-900">
                  Services inclus dans ta formule :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
                  <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tous les cours vidéo en haute définition</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fascicules et fiches de synthèse PDF téléchargeables</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Forum d&apos;entraide avec professeurs certifiés</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Explications orales bilingues en Wolof & Français</span>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                    {abonnement.methode_paiement === 'wave'
                      ? 'WAVE'
                      : abonnement.methode_paiement === 'orange_money'
                      ? 'OM'
                      : 'MANUEL'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-900">
                      {abonnement.methode_paiement === 'wave'
                        ? 'Wave Money'
                        : abonnement.methode_paiement === 'orange_money'
                        ? 'Orange Money'
                        : 'Validation manuelle'}
                    </div>
                    <div className="text-xs text-stone-500">
                      {telephone || email || 'Compte Téranga S’cool'}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                    abonnement.statut === 'actif'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}
                >
                  {abonnement.statut === 'actif' ? 'Paiement validé' : 'En attente'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-black text-stone-900">
                  Activer mon Pass Téranga S&apos;cool
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Choisis ta formule et ton moyen de paiement local (Wave ou Orange Money).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('mensuel')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPlan === 'mensuel'
                      ? 'border-[#E75A24] bg-[#FCEEE7]/40'
                      : 'border-stone-200 bg-[#FAF7F2]'
                  }`}
                >
                  <div className="text-sm font-bold text-stone-900">Pack Terminale Mensuel</div>
                  <div className="text-xl font-black text-[#E75A24] mt-1">2 500 FCFA / mois</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('annuel')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPlan === 'annuel'
                      ? 'border-[#E75A24] bg-[#FCEEE7]/40'
                      : 'border-stone-200 bg-[#FAF7F2]'
                  }`}
                >
                  <div className="text-sm font-bold text-stone-900">Pack Terminale Annuel</div>
                  <div className="text-xl font-black text-[#E75A24] mt-1">15 000 FCFA / an</div>
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wave')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    selectedMethod === 'wave'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  Wave Money
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('orange_money')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    selectedMethod === 'orange_money'
                      ? 'bg-[#E75A24] text-white border-[#E75A24]'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  Orange Money
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleRequestSubscription}
                  disabled={creatingAbo}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E75A24] hover:bg-[#D04D1B] text-white rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {creatingAbo && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Demander l&apos;activation de mon abonnement</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ComptePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-stone-500 text-sm">Chargement du compte...</div>
      }
    >
      <CompteContent />
    </Suspense>
  );
}
