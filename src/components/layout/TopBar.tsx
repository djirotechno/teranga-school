'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';
import ProfileDropdown from './ProfileDropdown';

interface TopBarProps {
  onToggleSidebar?: () => void;
  userName?: string;
  userInitials?: string;
}

export function TopBar({
  onToggleSidebar,
  userName = "Awa Diop",
  userInitials = "AD",
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-[#F8F5EE]/95 backdrop-blur-sm border-b border-[#EAE3D6]/70">
      {/* Mobile sidebar toggle button + Mobile Brand Logo */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Ouvrir le menu"
          className="p-2 -ml-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo size="xs" textVariant="dark" href="/accueil" />
      </div>

      {/* Central Search Bar */}
      <div className="flex-1 max-w-2xl">
        <SearchBar />
      </div>

      {/* Right icons: Notifications + User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-200/50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E75A24] rounded-full ring-2 ring-[#F8F5EE]" />
        </button>

        {/* Profile Dropdown */}
        <ProfileDropdown
          userName={userName}
          userInitials={userInitials}
          userEmail="awa.diop@terangaschool.sn"
          userRole="Élève · Terminale L"
        />
      </div>
    </header>
  );
}

export default TopBar;

