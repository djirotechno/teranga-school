'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AbonnementRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/compte?tab=abonnement');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px] text-stone-500 text-sm">
      Chargement de l'abonnement...
    </div>
  );
}
