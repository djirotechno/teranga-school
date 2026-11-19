'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ParametresRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/compte?tab=parametres');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px] text-stone-500 text-sm">
      Chargement des paramètres...
    </div>
  );
}
