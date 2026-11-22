'use client';

import React, { useState } from 'react';
import SidebarAdmin from '@/components/layout/SidebarAdmin';
import TopBar from '@/components/layout/TopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F8F5EE] text-stone-900 font-sans">
      <SidebarAdmin
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(true)}
          userName="Admin"
          userInitials="TS"
          userRole="Administrateur"
          userEmail="admin@terangaschool.sn"
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
