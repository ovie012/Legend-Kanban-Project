import { create } from 'zustand';
import type { Role } from '@/features/board/types';

interface PermissionState {
  role: Role;
  setRole: (role: Role) => void;
}

export const usePermissions = create<PermissionState>((set) => ({
  role: 'admin',
  setRole: (role) => set({ role }),
}));

export const canCreate = (role: Role) => role !== 'viewer';
export const canEdit = (role: Role) => role !== 'viewer';
export const canDelete = (role: Role) => role === 'admin';
export const canDrag = (role: Role) => role !== 'viewer';
