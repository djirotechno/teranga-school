import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getHomePathForRole, type UserRole } from '@/types/user';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sécurité : n'autoriser que les chemins relatifs internes
      if (next && next.startsWith('/') && !next.startsWith('//')) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const home = getHomePathForRole(profile?.role as UserRole | undefined);
      return NextResponse.redirect(`${origin}${home}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=auth_callback_failed`);
}
