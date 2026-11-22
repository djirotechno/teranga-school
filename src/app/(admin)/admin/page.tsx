import React from 'react';
import Link from 'next/link';
import {
  User,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      value: '128',
      label: 'Élèves inscrits',
    },
    {
      value: '3',
      label: 'Enseignants',
    },
    {
      value: '106',
      label: 'Accès actifs',
    },
  ];

  const actionItems = [
    {
      title: 'Gérer les utilisateurs',
      subtitle: 'Comptes et rôles',
      href: '/admin/utilisateurs',
      icon: User,
    },
    {
      title: 'Abonnements',
      subtitle: 'Vérifier les accès',
      href: '/admin/abonnements',
      icon: CreditCard,
    },
    {
      title: 'Modération',
      subtitle: '2 signalements à examiner',
      href: '/admin/moderation',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Administration
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5 font-normal">
          Vue d&apos;ensemble de la plateforme.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs flex flex-col justify-center transition-all hover:shadow-sm hover:border-stone-300"
          >
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0B2B27] tracking-tight">
              {stat.value}
            </div>
            <div className="text-stone-500 text-sm font-medium mt-1.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Management Actions Section */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mb-4">
          Actions de gestion
        </h2>

        <div className="flex flex-col gap-3.5">
          {actionItems.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className="group flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/70 shadow-xs hover:border-stone-300 hover:shadow-sm hover:bg-[#FAF8F5]/60 transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Action Icon Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>

                  {/* Texts */}
                  <div className="flex flex-col">
                    <span className="font-bold text-[#111827] text-base group-hover:text-[#0F3833] transition-colors">
                      {action.title}
                    </span>
                    <span className="text-sm text-stone-500 mt-0.5">
                      {action.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="text-stone-400 group-hover:text-stone-600 transition-colors pl-2">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
