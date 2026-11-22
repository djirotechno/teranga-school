'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  ChevronRight,
  Check,
  ChevronDown,
  Calendar,
  X,
} from 'lucide-react';

interface SubscriptionItem {
  id: string;
  name: string;
  detail: string;
  status: 'Actif' | 'En attente' | 'Expiré';
  iconType: 'card' | 'clock';
}

const initialSubscriptions: SubscriptionItem[] = [
  {
    id: '1',
    name: 'Awa Diop',
    detail: 'Expire le 31/12/2026',
    status: 'Actif',
    iconType: 'card',
  },
  {
    id: '2',
    name: 'Moussa S.',
    detail: 'Paiement à vérifier',
    status: 'En attente',
    iconType: 'clock',
  },
];

export default function AdminAbonnementsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(initialSubscriptions);
  const [activeCount, setActiveCount] = useState(106);
  const [toRenewCount, setToRenewCount] = useState(12);

  const [selectedUser, setSelectedUser] = useState('Moussa S.');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDetailModal, setSelectedDetailModal] = useState<SubscriptionItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const availableAccounts = [
    'Moussa S.',
    'Awa Diop',
    'M. Diop',
    'Mme Ndiaye',
  ];

  const handleValidateAccess = () => {
    // Check if the selected user already has an entry
    const existingIndex = subscriptions.findIndex((s) => s.name === selectedUser);

    if (existingIndex !== -1) {
      const existing = subscriptions[existingIndex];
      const wasPending = existing.status !== 'Actif';

      const updatedList = [...subscriptions];
      updatedList[existingIndex] = {
        ...existing,
        detail: 'Expire le 31/12/2027',
        status: 'Actif',
        iconType: 'card',
      };
      setSubscriptions(updatedList);

      if (wasPending) {
        setActiveCount((prev) => prev + 1);
        setToRenewCount((prev) => Math.max(0, prev - 1));
      }
      showToast(`Accès validé et prolongé avec succès pour ${selectedUser} (jusqu'au 31/12/2027) !`);
    } else {
      const newSub: SubscriptionItem = {
        id: Date.now().toString(),
        name: selectedUser,
        detail: 'Expire le 31/12/2027',
        status: 'Actif',
        iconType: 'card',
      };
      setSubscriptions([...subscriptions, newSub]);
      setActiveCount((prev) => prev + 1);
      showToast(`Nouvel accès validé pour ${selectedUser} !`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3833] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Abonnements
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5 font-normal">
          Suivre les accès payants et leur expiration.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {/* Actifs */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs flex flex-col justify-center transition-all hover:shadow-sm hover:border-stone-300">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2B27] tracking-tight">
            {activeCount}
          </div>
          <div className="text-stone-500 text-sm font-medium mt-1.5">
            Actifs
          </div>
        </div>

        {/* À renouveler */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs flex flex-col justify-center transition-all hover:shadow-sm hover:border-stone-300">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2B27] tracking-tight">
            {toRenewCount}
          </div>
          <div className="text-stone-500 text-sm font-medium mt-1.5">
            À renouveler
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="flex flex-col gap-3.5">
        {subscriptions.map((item) => {
          const Icon = item.iconType === 'card' ? CreditCard : Clock;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedDetailModal(item)}
              className="group flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/70 shadow-xs hover:border-stone-300 hover:shadow-sm hover:bg-[#FAF8F5]/60 transition-all duration-150 cursor-pointer"
            >
              {/* Left icon + info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#111827] text-base truncate group-hover:text-[#0F3833] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm text-stone-500 mt-0.5 truncate">
                    {item.detail}
                  </span>
                </div>
              </div>

              {/* Right pill badge + chevron */}
              <div className="flex items-center gap-2 shrink-0 pl-3">
                <span className="px-3.5 py-1 rounded-full bg-[#ECE5D8]/80 text-stone-700 text-xs font-medium">
                  {item.status}
                </span>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action manuelle Section */}
      <div className="bg-white rounded-3xl border border-stone-200/70 p-6 sm:p-7 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight mb-4">
          Action manuelle
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              Compte
            </label>

            {/* Custom Select Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectOpen((prev) => !prev)}
                className="w-full bg-[#FAF8F5]/40 hover:bg-[#FAF8F5] border border-stone-200/90 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-stone-800 flex items-center justify-between text-left transition-colors focus:outline-none focus:border-stone-400"
              >
                <span className="font-medium text-stone-900">{selectedUser}</span>
                <ChevronDown className="w-4 h-4 text-stone-500 transition-transform duration-200" />
              </button>

              {isSelectOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSelectOpen(false)}
                  />
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg z-40 py-2 animate-in fade-in-50 zoom-in-95 duration-100">
                    {availableAccounts.map((account) => (
                      <button
                        key={account}
                        type="button"
                        onClick={() => {
                          setSelectedUser(account);
                          setIsSelectOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                          selectedUser === account
                            ? 'text-[#0F3833] font-bold bg-[#E8F1EE]/70'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{account}</span>
                        {selectedUser === account && (
                          <Check className="w-4 h-4 text-[#0F3833]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action button */}
          <div>
            <button
              type="button"
              onClick={handleValidateAccess}
              className="inline-flex items-center gap-2 bg-[#E75A24] hover:bg-[#D04D1B] text-white px-5 sm:px-6 py-3 rounded-2xl font-semibold text-sm shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Valider / prolonger l&apos;accès</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Details Modal */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedDetailModal(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Détails de l&apos;abonnement
                  </h3>
                  <p className="text-xs text-stone-500">
                    Compte : {selectedDetailModal.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailModal(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Bénéficiaire</span>
                <span className="font-semibold text-stone-900">{selectedDetailModal.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Statut actuel</span>
                <span className="px-3 py-0.5 rounded-full bg-[#ECE5D8] text-stone-800 text-xs font-medium">
                  {selectedDetailModal.status}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Information / Échéance</span>
                <span className="font-medium text-stone-800">{selectedDetailModal.detail}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500">Formule</span>
                <span className="font-medium text-stone-800">Accès Premium annuel</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedDetailModal(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSelectedUser(selectedDetailModal.name);
                  setSelectedDetailModal(null);
                  handleValidateAccess();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold shadow-xs transition-colors"
              >
                Prolonger l&apos;accès
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
