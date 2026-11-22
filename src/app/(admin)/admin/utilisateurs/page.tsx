'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronDown,
  Search,
  X,
  UserCheck,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  initials: string;
  role: 'Élève' | 'Enseignant' | 'Enseignante';
  detail: string; // e.g. "Terminale", "Français", "Philosophie"
  status: 'Actif' | 'En attente';
}

const initialUsers: UserItem[] = [
  {
    id: '1',
    name: 'Awa Diop',
    initials: 'AD',
    role: 'Élève',
    detail: 'Terminale',
    status: 'Actif',
  },
  {
    id: '2',
    name: 'M. Diop',
    initials: 'MD',
    role: 'Enseignant',
    detail: 'Français',
    status: 'Actif',
  },
  {
    id: '3',
    name: 'Mme Ndiaye',
    initials: 'FN',
    role: 'Enseignante',
    detail: 'Philosophie',
    status: 'Actif',
  },
  {
    id: '4',
    name: 'Moussa S.',
    initials: 'MS',
    role: 'Élève',
    detail: 'Terminale',
    status: 'En attente',
  },
];

// Helper to generate 2-letter initials from full name
function getInitials(name: string): string {
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase() || 'TS';
}

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'eleve' | 'enseignant'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Élève' | 'Enseignant'>('Élève');
  const [newDetail, setNewDetail] = useState('');
  const [newStatus, setNewStatus] = useState<'Actif' | 'En attente'>('Actif');

  // Edit modal state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'Élève' | 'Enseignant' | 'Enseignante'>('Élève');
  const [editDetail, setEditDetail] = useState('');
  const [editStatus, setEditStatus] = useState<'Actif' | 'En attente'>('Actif');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role match
      if (selectedRoleFilter === 'eleve' && user.role !== 'Élève') return false;
      if (
        selectedRoleFilter === 'enseignant' &&
        user.role !== 'Enseignant' &&
        user.role !== 'Enseignante'
      )
        return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.detail.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.status.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newUser: UserItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      initials: getInitials(newName),
      role: newRole,
      detail: newDetail.trim() || (newRole === 'Élève' ? 'Terminale' : 'Général'),
      status: newStatus,
    };

    setUsers([newUser, ...users]);
    setNewName('');
    setNewDetail('');
    setNewRole('Élève');
    setNewStatus('Actif');
    setIsAddModalOpen(false);
    showToast(`Compte pour "${newUser.name}" créé avec succès !`);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditDetail(user.detail);
    setEditStatus(user.status);
    setShowDeleteConfirm(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim()) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name: editName.trim(),
            initials: getInitials(editName),
            role: editRole,
            detail: editDetail.trim() || u.detail,
            status: editStatus,
          };
        }
        return u;
      })
    );

    showToast(`Utilisateur "${editName.trim()}" modifié avec succès !`);
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== editingUser.id));
    showToast(`Utilisateur "${editingUser.name}" supprimé.`);
    setEditingUser(null);
  };

  const roleFilterLabels = {
    all: 'Tous les rôles',
    eleve: 'Élèves',
    enseignant: 'Enseignants',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3833] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5 font-normal">
          Gérer les élèves et les enseignants.
        </p>
      </div>

      {/* Action Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Ajouter un compte Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#E75A24] hover:bg-[#D04D1B] text-white px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Ajouter un compte</span>
        </button>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 bg-[#ECE5D8] hover:bg-[#E2D9CB] text-stone-800 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors cursor-pointer"
          >
            <span>{roleFilterLabels[selectedRoleFilter]}</span>
            <ChevronDown className="w-4 h-4 text-stone-600 transition-transform duration-200" />
          </button>

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-lg z-40 py-2 animate-in fade-in-50 zoom-in-95 duration-100">
                {(['all', 'eleve', 'enseignant'] as const).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      setSelectedRoleFilter(roleKey);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                      selectedRoleFilter === roleKey
                        ? 'text-[#0F3833] font-bold bg-[#E8F1EE]/60'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{roleFilterLabels[roleKey]}</span>
                    {selectedRoleFilter === roleKey && (
                      <Check className="w-4 h-4 text-[#0F3833]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="w-full bg-white border border-stone-200/80 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Users List Container */}
      <div className="bg-white rounded-3xl border border-stone-200/70 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            <p className="text-base font-medium">Aucun utilisateur trouvé</p>
            <p className="text-sm text-stone-400 mt-1">
              Essayez de modifier votre recherche ou vos filtres.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => handleOpenEdit(user)}
                className="group flex items-center justify-between p-4 sm:p-5 hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer"
                title="Cliquez pour modifier l'utilisateur"
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E2EBE8] text-[#14443F] font-bold text-sm sm:text-base flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {user.initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#111827] text-base truncate group-hover:text-[#0F3833] transition-colors">
                      {user.name}
                    </span>
                    <span className="text-sm text-stone-500 mt-0.5 truncate">
                      {user.role} · {user.detail}
                    </span>
                  </div>
                </div>

                {/* Right: Status + Edit Icon */}
                <div className="flex items-center gap-3 shrink-0 pl-4">
                  <span
                    className={`text-sm ${
                      user.status === 'Actif'
                        ? 'text-stone-500'
                        : 'text-stone-400 font-medium'
                    }`}
                  >
                    {user.status}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(user);
                    }}
                    className="p-2 text-stone-400 hover:text-[#0F3833] hover:bg-[#E8F1EE] rounded-xl transition-all opacity-80 group-hover:opacity-100"
                    title="Modifier l'utilisateur"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Modifier un utilisateur */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E2EBE8] text-[#14443F] font-bold text-base flex items-center justify-center">
                  {getInitials(editName || editingUser.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Modifier l&apos;utilisateur
                  </h3>
                  <p className="text-xs text-stone-500">
                    Modifiez les informations du compte
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Rôle
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) =>
                      setEditRole(
                        e.target.value as 'Élève' | 'Enseignant' | 'Enseignante'
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900 bg-white"
                  >
                    <option value="Élève">Élève</option>
                    <option value="Enseignant">Enseignant</option>
                    <option value="Enseignante">Enseignante</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Statut
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as 'Actif' | 'En attente')
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900 bg-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  {editRole === 'Élève' ? 'Classe' : 'Matière'}
                </label>
                <input
                  type="text"
                  value={editDetail}
                  onChange={(e) => setEditDetail(e.target.value)}
                  placeholder={
                    editRole === 'Élève'
                      ? 'Ex: Terminale, Première S...'
                      : 'Ex: Français, Mathématiques, Philosophie...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900"
                />
              </div>

              {/* Delete confirmation box */}
              {showDeleteConfirm ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-rose-800 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Confirmer la suppression de ce compte ?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 text-stone-600 hover:text-stone-800 text-xs font-medium"
                    >
                      Non
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Oui, supprimer
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
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
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold shadow-xs transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajouter un compte */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F1EE] text-[#0F3833] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">
                  Ajouter un compte
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Fatou Diagne"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Rôle
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      setNewRole(e.target.value as 'Élève' | 'Enseignant')
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900 bg-white"
                  >
                    <option value="Élève">Élève</option>
                    <option value="Enseignant">Enseignant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Statut
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as 'Actif' | 'En attente')
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900 bg-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  {newRole === 'Élève' ? 'Classe' : 'Matière'}
                </label>
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder={
                    newRole === 'Élève'
                      ? 'Ex: Terminale S2'
                      : 'Ex: Mathématiques'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0F3833] text-sm text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] text-white text-sm font-semibold shadow-xs transition-colors"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
