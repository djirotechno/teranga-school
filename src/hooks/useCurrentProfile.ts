'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserPreferences } from '@/types/user';

const DEFAULT_PREFERENCES: UserPreferences = {
  wolof_support: false,
  notif_forum: true,
  notif_cours: true,
  notif_rappels: true,
};

export function getInitials(fullName?: string | null): string {
  if (!fullName) return 'TS';
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((p) => !/^(M\.|Mme|Mlle|Dr\.?)$/i.test(p));
  if (parts.length === 0) return 'TS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatRoleLabel(profile?: Profile | null): string {
  if (!profile) return 'Utilisateur';
  if (profile.role === 'admin') return 'Administrateur';
  if (profile.role === 'enseignant') return 'Enseignant';
  const classe = [profile.niveau, profile.serie].filter(Boolean).join(' ');
  return classe ? `Élève · ${classe}` : 'Élève';
}

export function useCurrentProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        const rawPrefs =
          data.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences)
            ? (data.preferences as Partial<UserPreferences>)
            : {};

        setProfile({
          ...data,
          preferences: {
            ...DEFAULT_PREFERENCES,
            ...rawPrefs,
          },
        });
      }
    } catch {
      // Fallback silencieux si hors-ligne
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (
          event === 'SIGNED_IN' ||
          event === 'USER_UPDATED' ||
          event === 'TOKEN_REFRESHED'
        ) {
          loadProfile();
        }
      });
      subscription = data.subscription;
    } catch {
      // ignore
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    initials: getInitials(profile?.full_name),
    roleLabel: formatRoleLabel(profile),
    refreshProfile: loadProfile,
  };
}
