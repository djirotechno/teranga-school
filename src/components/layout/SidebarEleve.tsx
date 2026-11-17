'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  BookOpen,
  Mic,
  MessageCircle,
  BarChart2,
  X
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';

interface SidebarEleveProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarEleve({ isOpen = false, onClose }: SidebarEleveProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Accueil',
      href: '/accueil',
      icon: Home,
      exact: true,
    },
    {
      label: 'Matières',
      href: '/matieres',
      icon: Layers,
    },
    {
      label: 'Bibliothèque',
      href: '/bibliotheque',
      icon: BookOpen,
    },
    {
      label: 'Forum',
      href: '/forum',
      icon: Mic,
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      badge: '3',
    },
    {
      label: 'Mon suivi',
      href: '/mon-suivi',
      icon: BarChart2,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 flex flex-col justify-between w-64 bg-[#0F3833] text-white p-5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 select-none overflow-y-auto`}
      >
        <div className="flex flex-col gap-8">
          {/* Top Logo & Brand */}
          <div className="flex items-center justify-between">
            <Logo
              size="md"
              textVariant="light"
              subtitle="Espace Élève"
              href="/accueil"
              priority
            />

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.exact
                  ? pathname === item.href || pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E75A24] text-white shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        isActive
                          ? 'bg-white text-[#E75A24]'
                          : 'bg-[#E75A24] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#14443F] hover:bg-[#184F49] transition-colors cursor-pointer">
            <Avatar initials="AD" size="md" variant="green" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                Awa Diop
              </span>
              <span className="text-xs text-[#9DCAC2] font-medium">
                Élève
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SidebarEleve;

