'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

interface ProfileDropdownProps {
  userName?: string;
  userInitials?: string;
  userEmail?: string;
  userRole?: string;
  compact?: boolean;
}

export function ProfileDropdown({
  userName = 'Awa Diop',
  userInitials = 'AD',
  userEmail = 'awa.diop@terangaschool.sn',
  userRole = 'Élève · Terminale L',
  compact = false,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu du profil utilisateur"
        className={`flex items-center gap-2 ${
          compact ? 'p-1 rounded-full' : 'p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl'
        } hover:bg-stone-200/60 focus:outline-none focus:ring-2 focus:ring-[#E75A24]/30 transition-all select-none cursor-pointer`}
      >
        <Avatar
          initials={userInitials}
          name={userName}
          size="md"
          variant="green"
        />

        {!compact && (
          <>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[120px]">
                {userName}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                {userRole.split('·')[0].trim()}
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-stone-700' : ''
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-xl border border-stone-200/90 py-2.5 px-2 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
          {/* User Profile Header */}
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-100 flex items-center gap-3 mb-1.5">
            <div className="relative shrink-0">
              <Avatar
                initials={userInitials}
                name={userName}
                size="md"
                variant="green"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-stone-900 truncate">
                  {userName}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#FCEEE7] text-[#C85A2B] text-[10px] font-bold">
                  PRO
                </span>
              </div>
              <span className="text-xs text-stone-500 truncate">
                {userEmail}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                {userRole}
              </span>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="flex flex-col gap-0.5">
            {/* 1. Page de Profil */}
            <Link
              href="/compte"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] text-stone-700 hover:text-stone-950 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FCEEE7] text-[#C85A2B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  Mon Profil
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Informations scolaires & personnelles
                </span>
              </div>
            </Link>

            {/* 2. Page des Paramètres */}
            <Link
              href="/compte/parametres"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAF7F2] text-stone-700 hover:text-stone-950 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  Paramètres
                </span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Préférences, langues & sécurité
                </span>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-200/80 my-2 mx-1" />

          {/* Logout Action */}
          <Link
            href="/connexion"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold">
                Se déconnecter
              </span>
              <span className="text-[10px] text-red-400">
                Fermer la session en cours
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
