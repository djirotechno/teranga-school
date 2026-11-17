'use client';

import React, { useState } from 'react';
import SidebarEnseignant from '@/components/layout/SidebarEnseignant';
import TopBar from '@/components/layout/TopBar';

export default function EnseignantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F8F5EE] text-stone-900">
      <SidebarEnseignant
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(true)} userName="Pr. Amadou Sow" userInitials="AS" />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
