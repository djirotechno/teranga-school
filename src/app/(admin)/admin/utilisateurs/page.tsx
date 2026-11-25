'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  Search,
  X,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/hooks/useCurrentProfile';
import type { UserRole, AccountStatus, NiveauScolaire } from '@/types/user';

interface AdminUserRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  niveau: NiveauScolaire | null;
  serie: string | null;
  statut: AccountStatus;
}

const ROLE_LABELS: Record<UserRole, string> = {
  eleve: 'Élève',
  enseignant: 'Enseignant',
  admin: 'Admin',
};

const STATUS_LABELS: Record<AccountStatus, string> = {
  actif: 'Actif',
  en_attente: 'En attente',
  suspendu: 'Suspendu',
};

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRole>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Edit modal state
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('eleve');
  const [editStatus, setEditStatus] = useState<AccountStatus>('actif');
  const [editNiveau, setEditNiveau] = useState<NiveauScolaire>('Terminale');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const showToast = (text: string, error = false) => {
    setToast({ text, error });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, niveau, serie, statut')
        .order('created_at', { ascending: false });

      if (error) {
        showToast(error.message, true);
        return;
      }

      setUsers((data as AdminUserRow[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (selectedRoleFilter !== 'all' && user.role !== selectedRoleFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(q) ||
        (user.email ?? '').toLowerCase().includes(q) ||
        ROLE_LABELS[user.role].toLowerCase().includes(q) ||
        STATUS_LABELS[user.statut].toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const handleOpenEdit = (user: AdminUserRow) => {
    setEditingUser(user);
    setEditName(user.full_name);
    setEditRole(user.role);
    setEditStatus(user.statut);
    setEditNiveau(user.niveau ?? 'Terminale');
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim()) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editName.trim(),
          role: editRole,
          statut: editStatus,
          niveau: editNiveau,
        })
        .eq('id', editingUser.id);

      if (error) {
        showToast(`Erreur : ${error.message}`, true);
        return;
      }

      setEditingUser(null);
      await loadUsers();
      showToast(`Utilisateur "${editName.trim()}" mis à jour !`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('profiles').delete().eq('id', editingUser.id);
      if (error) {
        showToast(`Suppression impossible : ${error.message}`, true);
        return;
      }
      const deletedName = editingUser.full_name;
      setEditingUser(null);
      await loadUsers();
      showToast(`Profil "${deletedName}" supprimé.`);
    } finally {
      setSaving(false);
    }
  };

  const roleFilterLabels: Record<'all' | UserRole, string> = {
    all: 'Tous les rôles',
    eleve: 'Élèves',
    enseignant: 'Enseignants',
    admin: 'Administrateurs',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 ${
            toast.error ? 'bg-red-700' : 'bg-[#0F3833]'
          }`}
        >
          {toast.error ? (
            <AlertCircle className="w-5 h-5 text-red-200" />
          ) : (
            <Check className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5">
          Gérer les comptes, rôles et statuts ({users.length} inscrits).
        </p>
      </div>

      {/* Filter Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 bg-[#ECE5D8] hover:bg-[#E2D9CB] text-stone-800 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors cursor-pointer"
          >
            <span>{roleFilterLabels[selectedRoleFilter]}</span>
            <ChevronDown className="w-4 h-4 text-stone-600" />
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute left-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-lg z-40 py-2">
                {(['all', 'eleve', 'enseignant', 'admin'] as const).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      setSelectedRoleFilter(roleKey);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between cursor-pointer ${
                      selectedRoleFilter === roleKey
                        ? 'text-[#0F3833] font-bold bg-[#E8F1EE]/60'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{roleFilterLabels[roleKey]}</span>
                    {selectedRoleFilter === roleKey && <Check className="w-4 h-4 text-[#0F3833]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, e-mail, rôle ou statut..."
          className="w-full bg-white border border-stone-200/80 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white rounded-3xl border border-stone-200/70 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex items-center justify-center gap-2 text-stone-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#E75A24]" />
            <span>Chargement des utilisateurs...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            <p className="text-base font-medium">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleOpenEdit(user)}
                className="group flex items-center justify-between p-4 sm:p-5 hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E2EBE8] text-[#14443F] font-bold text-sm sm:text-base flex items-center justify-center shrink-0">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#111827] text-base truncate">
                      {user.full_name}
                    </span>
                    <span className="text-sm text-stone-500 mt-0.5 truncate">
                      {ROLE_LABELS[user.role]}
                      {user.niveau && user.role === 'eleve' ? ` · ${user.niveau} ${user.serie ?? ''}` : ''}
                      {user.email ? ` · ${user.email}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      user.statut === 'actif'
                        ? 'bg-emerald-50 text-emerald-700'
                        : user.statut === 'en_attente'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {STATUS_LABELS[user.statut]}
                  </span>
                  <Pencil className="w-4 h-4 text-stone-400 group-hover:text-[#0F3833]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setEditingUser(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-xl font-bold text-[#111827]">Modifier l&apos;utilisateur</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Rôle
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                  >
                    <option value="eleve">Élève</option>
                    <option value="enseignant">Enseignant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Statut
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AccountStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                  >
                    <option value="actif">Actif</option>
                    <option value="en_attente">En attente</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Niveau
                </label>
                <select
                  value={editNiveau}
                  onChange={(e) => setEditNiveau(e.target.value as NiveauScolaire)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                >
                  <option value="Terminale">Terminale</option>
                  <option value="Première">Première</option>
                  <option value="Seconde">Seconde</option>
                  <option value="Troisième">Troisième</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {showDeleteConfirm && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-rose-800">
                  <span>Confirmer la suppression de ce profil ?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 text-stone-600 text-xs font-medium cursor-pointer"
                    >
                      Non
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      disabled={saving}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Oui, supprimer
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Enregistrer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
