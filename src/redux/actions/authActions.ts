// src/redux/actions/authActions.ts

import { UpdateChurchSettingsData, OrganizationData } from '../../services/api';

// ============================================
// AUTH0 ACTION TYPES
// ============================================

export const AUTH0_LOGIN_SUCCESS = 'AUTH0_LOGIN_SUCCESS';
export const AUTH0_LOGOUT = 'AUTH0_LOGOUT';
export const AUTH0_USER_LOADED = 'AUTH0_USER_LOADED';

// Sync
export const USER_SYNCED = 'USER_SYNCED';
export const AUTH_ERROR = 'AUTH_ERROR';

// Update Church Settings
export const UPDATE_CHURCH_REQUEST = 'auth/UPDATE_CHURCH_REQUEST';
export const UPDATE_CHURCH_SUCCESS = 'auth/UPDATE_CHURCH_SUCCESS';
export const UPDATE_CHURCH_FAILURE = 'auth/UPDATE_CHURCH_FAILURE';
export const RESET_CHURCH_OPERATION = 'auth/RESET_CHURCH_OPERATION';

// ============================================
// AUTH0 USER TYPE
// ============================================

export interface Auth0User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

// ============================================
// ACTION INTERFACES
// ============================================

interface Auth0LoginSuccessAction {
  type: typeof AUTH0_LOGIN_SUCCESS;
  payload: Auth0User;
}

interface Auth0LogoutAction {
  type: typeof AUTH0_LOGOUT;
}

interface Auth0UserLoadedAction {
  type: typeof AUTH0_USER_LOADED;
  payload: Auth0User;
}

interface UserSyncedAction {
  type: typeof USER_SYNCED;
  payload: any;
}

interface AuthErrorAction {
  type: typeof AUTH_ERROR;
  payload: string;
}

interface UpdateChurchRequestAction {
  type: typeof UPDATE_CHURCH_REQUEST;
  payload: UpdateChurchSettingsData;
}

interface UpdateChurchSuccessAction {
  type: typeof UPDATE_CHURCH_SUCCESS;
  payload: OrganizationData;
}

interface UpdateChurchFailureAction {
  type: typeof UPDATE_CHURCH_FAILURE;
  payload: string;
}

interface ResetChurchOperationAction {
  type: typeof RESET_CHURCH_OPERATION;
}

export type AuthActionTypes =
  | Auth0LoginSuccessAction
  | Auth0LogoutAction
  | Auth0UserLoadedAction
  | UserSyncedAction
  | AuthErrorAction
  | UpdateChurchRequestAction
  | UpdateChurchSuccessAction
  | UpdateChurchFailureAction
  | ResetChurchOperationAction;

// ============================================
// ACTION CREATORS
// ============================================

export const auth0LoginSuccess = (user: Auth0User): Auth0LoginSuccessAction => ({
  type: AUTH0_LOGIN_SUCCESS,
  payload: user,
});

export const auth0Logout = (): Auth0LogoutAction => ({
  type: AUTH0_LOGOUT,
});

export const auth0UserLoaded = (user: Auth0User): Auth0UserLoadedAction => ({
  type: AUTH0_USER_LOADED,
  payload: user,
});

export const userSynced = (data: any): UserSyncedAction => ({
  type: USER_SYNCED,
  payload: data,
});

export const authError = (error: string): AuthErrorAction => ({
  type: AUTH_ERROR,
  payload: error,
});

// Update Church Settings
export const updateChurchRequest = (
  data: UpdateChurchSettingsData
): UpdateChurchRequestAction => ({
  type: UPDATE_CHURCH_REQUEST,
  payload: data,
});

export const updateChurchSuccess = (
  organization: OrganizationData
): UpdateChurchSuccessAction => ({
  type: UPDATE_CHURCH_SUCCESS,
  payload: organization,
});

export const updateChurchFailure = (error: string): UpdateChurchFailureAction => ({
  type: UPDATE_CHURCH_FAILURE,
  payload: error,
});

export const resetChurchOperation = (): ResetChurchOperationAction => ({
  type: RESET_CHURCH_OPERATION,
});