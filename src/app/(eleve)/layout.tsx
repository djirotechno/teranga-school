'use client';

import React, { useState } from 'react';
import SidebarEleve from '@/components/layout/SidebarEleve';
import TopBar from '@/components/layout/TopBar';

export default function EleveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F8F5EE] text-stone-900">
      {/* Left Sidebar */}
      <SidebarEleve
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar */}
        <TopBar onToggleSidebar={() => setIsSidebarOpen(true)} />

        {/* Dashboard / Sub-page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

