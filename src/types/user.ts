export type UserRole = 'eleve' | 'enseignant' | 'admin';
export type AccountStatus = 'actif' | 'en_attente' | 'suspendu';
export type NiveauScolaire =
  | 'Terminale'
  | 'Première'
  | 'Seconde'
  | 'Troisième'
  | 'Autre';
export type SerieScolaire = 'L' | 'L1' | 'L2' | 'S' | 'S1' | 'S2' | 'G' | 'Autre';

export interface UserPreferences {
  wolof_support: boolean;
  notif_forum: boolean;
  notif_cours: boolean;
  notif_rappels: boolean;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string | null;
  phone: string | null;
  ville: string | null;
  etablissement: string | null;
  niveau: NiveauScolaire | null;
  serie: SerieScolaire | null;
  avatar_url: string | null;
  statut: AccountStatus;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export function getHomePathForRole(role?: UserRole | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'enseignant':
      return '/enseignant';
    case 'eleve':
    default:
      return '/accueil';
  }
}
