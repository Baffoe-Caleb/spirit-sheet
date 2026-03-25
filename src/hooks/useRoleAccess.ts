// src/hooks/useRoleAccess.ts

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';

export type UserRole = 'owner' | 'administrator' | 'secretary' | 'usher' | 'member';

const ROLE_PAGE_ACCESS: Record<UserRole, string[]> = {
  owner: ['dashboard', 'members', 'attendance', 'groups', 'reports', 'finance', 'settings', 'profile', 'cell-zones'],
  administrator: ['dashboard', 'members', 'attendance', 'groups', 'reports', 'finance', 'settings', 'profile', 'cell-zones'],
  secretary: ['dashboard', 'members', 'attendance', 'groups', 'reports', 'profile', 'cell-zones'],
  usher: ['attendance', 'profile'],
  member: ['profile'],
};

const ROLE_FEATURE_ACCESS: Record<UserRole, string[]> = {
  owner: [
    'members:create', 'members:edit', 'members:delete', 'members:bulk_upload', 'members:photo',
    'events:create', 'events:edit', 'events:delete',
    'attendance:checkin', 'attendance:bulk_checkin',
    'groups:create', 'groups:edit', 'groups:delete',
    'reports:view', 'reports:export',
    'finance:view', 'finance:create', 'finance:edit', 'finance:delete',
    'settings:edit', 'settings:roles', 'settings:invites', 'settings:permissions',
    'settings:lateness', 'settings:inactivity',
    'cell_zones:create', 'cell_zones:edit', 'cell_zones:delete',
  ],
  administrator: [
    'members:create', 'members:edit', 'members:delete', 'members:bulk_upload', 'members:photo',
    'events:create', 'events:edit', 'events:delete',
    'attendance:checkin', 'attendance:bulk_checkin',
    'groups:create', 'groups:edit', 'groups:delete',
    'reports:view', 'reports:export',
    'finance:view', 'finance:create', 'finance:edit', 'finance:delete',
    'settings:edit', 'settings:roles', 'settings:invites', 'settings:permissions',
    'settings:lateness', 'settings:inactivity',
    'cell_zones:create', 'cell_zones:edit', 'cell_zones:delete',
  ],
  secretary: [
    'members:create', 'members:edit', 'members:photo', 'members:bulk_upload',
    'events:create', 'events:edit',
    'attendance:checkin', 'attendance:bulk_checkin',
    'groups:create', 'groups:edit',
    'reports:view', 'reports:export',
    'cell_zones:create', 'cell_zones:edit',
  ],
  usher: [
    'attendance:checkin', 'attendance:bulk_checkin',
  ],
  member: [],
};

export function useRoleAccess() {
  const { syncedUser, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // True when auth is done but syncedUser hasn't arrived yet
  const isRoleLoading = useMemo(() => {
    return isAuthenticated && !syncedUser;
  }, [isAuthenticated, syncedUser]);

  const userRole: UserRole = useMemo(() => {
    const role = syncedUser?.role;

    // Normalize backend "admin" → "administrator"
    const normalized = role === 'admin' ? 'administrator' : role;

    if (normalized && ROLE_PAGE_ACCESS[normalized as UserRole]) {
      return normalized as UserRole;
    }
    return 'member';
  }, [syncedUser]);

  const canAccessPage = useMemo(() => {
    return (page: string): boolean => {
      if (isRoleLoading) return false;
      return ROLE_PAGE_ACCESS[userRole]?.includes(page) ?? false;
    };
  }, [userRole, isRoleLoading]);

  const canUseFeature = useMemo(() => {
    return (feature: string): boolean => {
      if (isRoleLoading) return false;
      return ROLE_FEATURE_ACCESS[userRole]?.includes(feature) ?? false;
    };
  }, [userRole, isRoleLoading]);

  const isOwnerOrAdmin = useMemo(() => {
    return userRole === 'owner' || userRole === 'administrator';
  }, [userRole]);

  const isAtLeastSecretary = useMemo(() => {
    return ['owner', 'administrator', 'secretary'].includes(userRole);
  }, [userRole]);

  const isUsher = useMemo(() => userRole === 'usher', [userRole]);

  const allowedPages = useMemo(() => {
    return ROLE_PAGE_ACCESS[userRole] || [];
  }, [userRole]);

  return {
    userRole,
    isRoleLoading,
    canAccessPage,
    canUseFeature,
    isOwnerOrAdmin,
    isAtLeastSecretary,
    isUsher,
    allowedPages,
  };
}