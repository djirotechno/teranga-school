export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const diffSec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSec < 60) return 'À l’instant';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Hier';
  if (diffD < 7) return `Il y a ${diffD} j`;
  return date.toLocaleDateString('fr-SN', { day: '2-digit', month: 'short' });
}

export function formatTimeShort(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('fr-SN', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-SN', { day: '2-digit', month: 'short' });
}

export function formatAudioSeconds(seconds?: number | null): string | undefined {
  if (!seconds || seconds <= 0) return undefined;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function normalizeMatiereTag(
  nom?: string | null
): 'Français' | 'Histoire-Géo' | 'Philosophie' {
  const n = (nom || '').toLowerCase();
  if (n.includes('hist')) return 'Histoire-Géo';
  if (n.includes('philo')) return 'Philosophie';
  return 'Français';
}
