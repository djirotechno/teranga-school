'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileCheck,
  ShieldAlert,
  X,
} from 'lucide-react';
import Logo from '../ui/Logo';

interface SidebarAdminProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarAdmin({ isOpen = false, onClose }: SidebarAdminProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Utilisateurs',
      href: '/admin/utilisateurs',
      icon: Users,
    },
    {
      label: 'Abonnements',
      href: '/admin/abonnements',
      icon: CreditCard,
    },
    {
      label: 'Contenus & Cours',
      href: '/admin/contenus',
      icon: FileCheck,
    },
    {
      label: 'Modération',
      href: '/admin/moderation',
      icon: ShieldAlert,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col justify-between w-64 bg-[#0F3833] text-white p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 select-none overflow-y-auto`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Logo
              size="md"
              textVariant="light"
              subtitle="Administration"
              href="/admin"
              priority
            />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E75A24] text-white shadow-xs font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;
