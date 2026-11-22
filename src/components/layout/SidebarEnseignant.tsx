'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Play,
  Mic,
  MessageSquare,
  User,
  X,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

interface SidebarEnseignantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarEnseignant({ isOpen = false, onClose }: SidebarEnseignantProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Tableau de bord',
      href: '/enseignant',
      icon: Home,
      exact: true,
    },
    {
      label: 'Mes cours',
      href: '/enseignant/cours',
      icon: Play,
    },
    {
      label: 'Forum',
      href: '/enseignant/forum',
      icon: Mic,
    },
    {
      label: 'Messages',
      href: '/enseignant/messages',
      icon: MessageSquare,
    },
    {
      label: 'Mes élèves',
      href: '/enseignant/eleves',
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col justify-between w-64 bg-[#0F3833] text-white p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 select-none overflow-y-auto`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo brand */}
          <div className="flex items-center justify-between">
            <Link
              href="/enseignant"
              onClick={onClose}
              className="inline-flex items-center gap-3 group focus:outline-hidden"
            >
              <div className="relative w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1 shadow-xs overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo-teranga.jpeg"
                  alt="Téranga S'cool"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight select-none">
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Téranga
                </span>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  S&apos;cool
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E75A24] text-white shadow-xs font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="pt-4">
          <Link
            href="/compte"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#133F39] hover:bg-[#184F49] transition-colors cursor-pointer group"
            title="Mon profil enseignant"
          >
            <div className="w-10 h-10 rounded-full bg-[#D6EADB] text-[#14443F] font-bold text-sm flex items-center justify-center shrink-0">
              MD
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-white truncate group-hover:text-[#E75A24] transition-colors">
                M. Diop
              </span>
              <span className="text-xs text-[#9DCAC2] font-medium">
                Enseignant
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default SidebarEnseignant;
