'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  School,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';

function CompteContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'profil' | 'parametres' | 'abonnement' | null;

  const [activeTab, setActiveTab] = useState<'profil' | 'parametres' | 'abonnement'>('profil');

  useEffect(() => {
    if (initialTab === 'parametres' || initialTab === 'abonnement' || initialTab === 'profil') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Profile Form State
  const [prenom, setPrenom] = useState('Awa');
  const [nom, setNom] = useState('Diop');
  const [email, setEmail] = useState('awa.diop@terangaschool.sn');
  const [telephone, setTelephone] = useState('+221 77 123 45 67');
  const [ville, setVille] = useState('Dakar');
  const [etablissement, setEtablissement] = useState('Lycée Lamine Guèye');
  const [serie, setSerie] = useState('Terminale L (Littéraire)');

  // Settings State
  const [langueWolof, setLangueWolof] = useState(true);
  const [notifForum, setNotifForum] = useState(true);
  const [notifCours, setNotifCours] = useState(true);
  const [notifRappels, setNotifRappels] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Vos informations de profil ont été enregistrées avec succès !');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Vos préférences et paramètres ont été mis à jour !');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ text: 'Veuillez remplir tous les champs du mot de passe.', error: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Le nouveau mot de passe doit comporter au moins 6 caractères.', error: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Les deux nouveaux mots de passe ne correspondent pas.', error: true });
      return;
    }

    setPasswordMsg({ text: 'Mot de passe modifié avec succès !', error: false });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Votre mot de passe a été modifié avec succès.');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-14 select-none sm:select-auto">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0F3833] text-white text-sm rounded-2xl shadow-xl border border-white/10 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section with back button */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/accueil"
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
          {/* Avatar with edit badge */}
          <div className="relative group cursor-pointer">
            <Avatar initials="AD" size="lg" variant="green" className="w-20 h-20 text-2xl shadow-sm" />
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#E75A24] text-white shadow-sm ring-2 ring-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {prenom} {nom}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#FCEEE7] text-[#C85A2B] text-xs font-bold">
                Élève
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {serie} · {etablissement} ({ville})
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {email}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Compte certifié
              </span>
            </div>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="p-3 bg-[#EAF7EE] border border-[#CEEFD8] rounded-2xl flex items-center gap-2.5 self-stretch sm:self-auto justify-center">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-left">
            <div className="text-xs font-bold text-emerald-900">Pass Bac 2027 Actif</div>
            <div className="text-[11px] text-emerald-700">Accès illimité aux cours</div>
          </div>
        </div>
      </div>

      {/* Tabs navigation: 3 tabs (Profil, Paramètres, Mon Abonnement) */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  required
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
                    Série & Niveau
                  </label>
                  <select
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  >
                    <option value="Terminale L (Littéraire)">Terminale L (Littéraire)</option>
                    <option value="Terminale S1 (Sciences Exactes)">Terminale S1 (Sciences Exactes)</option>
                    <option value="Terminale S2 (Sciences Expérimentales)">Terminale S2 (Sciences Expérimentales)</option>
                    <option value="Terminale G (Gestion & Tertiaire)">Terminale G (Gestion & Tertiaire)</option>
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
                    className="px-4 py-3 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Matières principales suivies
                  </label>
                  <div className="px-4 py-3 bg-stone-100 text-stone-700 text-xs sm:text-sm rounded-xl border border-stone-200/80 font-medium">
                    Français · Histoire-Géographie · Philosophie
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E75A24] hover:bg-[#D04D1B] active:scale-95 text-white rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PARAMÈTRES (Préférences linguistiques, Notifications, Sécurité) */}
      {activeTab === 'parametres' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
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
                  Adapte la langue de l'interface et les explications orales
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
                    Notification dès qu'un professeur répond à l'une de tes questions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifForum}
                  onChange={(e) => setNotifForum(e.target.checked)}
                  className="w-4 h-4 text-[#E75A24] rounded-md focus:ring-[#E75A24]"
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
                  className="w-4 h-4 text-[#E75A24] rounded-md focus:ring-[#E75A24]"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    Rappels de révisions pour le Bac
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Rappels quotidiens d'exercices et de quiz
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifRappels}
                  onChange={(e) => setNotifRappels(e.target.checked)}
                  className="w-4 h-4 text-[#E75A24] rounded-md focus:ring-[#E75A24]"
                />
              </div>
            </div>
          </div>

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
                  Protège l'accès à ton compte Téranga S'cool
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
                {passwordMsg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 max-w-md">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-4 py-2.5 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
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
                  className="px-4 py-2.5 bg-[#F8F5EE] focus:bg-white text-stone-900 text-sm rounded-xl border border-stone-200 focus:border-[#E75A24] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MON ABONNEMENT */}
      {activeTab === 'abonnement' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Abonnement actif
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  Pass Révision Bac 2027
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Accès complet à la plateforme Téranga S'cool pour la Terminale L
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#E75A24]">
                  Actif
                </span>
                <p className="text-[11px] text-stone-400">Valide jusqu'au 31 Juillet 2027</p>
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
                  <span>Forum d'entraide avec professeurs certifiés</span>
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
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  WAVE
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Payé via Wave Money</div>
                  <div className="text-xs text-stone-500">Compte : +221 77 123 45 67</div>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Paiement à jour
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComptePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500 text-sm">Chargement du compte...</div>}>
      <CompteContent />
    </Suspense>
  );
}
