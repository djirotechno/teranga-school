import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getHomePathForRole, type UserRole } from '@/types/user';

const PUBLIC_AUTH_ROUTES = [
  '/connexion',
  '/inscription',
  '/mot-de-passe-oublie',
];

const PUBLIC_UTILITY_ROUTES = [
  '/auth/callback',
  '/reinitialiser-mot-de-passe',
];

function isRouteMatch(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les clés Supabase ne sont pas encore renseignées, on laisse passer
  // afin de ne pas bloquer le développement local.
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT : toujours utiliser getUser() côté serveur (valide le JWT auprès de Supabase)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPage = isRouteMatch(pathname, PUBLIC_AUTH_ROUTES);
  const isPublicUtility = isRouteMatch(pathname, PUBLIC_UTILITY_ROUTES);
  const isApiRoute = pathname.startsWith('/api/');

  // Laisser passer les routes utilitaires d'auth et les endpoints API
  if (isPublicUtility || isApiRoute) {
    return supabaseResponse;
  }

  // Utilisateur non connecté
  if (!user) {
    if (isAuthPage || pathname === '/') {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/connexion';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Utilisateur connecté : récupérer son rôle depuis public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, statut')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as UserRole | undefined) ?? 'eleve';
  const roleHome = getHomePathForRole(role);

  // Bloquer les comptes suspendus
  if (profile?.statut === 'suspendu' && !isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/connexion';
    redirectUrl.searchParams.set('error', 'compte_suspendu');
    return NextResponse.redirect(redirectUrl);
  }

  // Rediriger un utilisateur déjà connecté qui visite / ou une page d'auth
  if (pathname === '/' || isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHome;
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  // Contrôle d'accès par rôle (RBAC)
  if (pathname.startsWith('/admin') && role !== 'admin') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHome;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    pathname.startsWith('/enseignant') &&
    role !== 'enseignant' &&
    role !== 'admin'
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHome;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
