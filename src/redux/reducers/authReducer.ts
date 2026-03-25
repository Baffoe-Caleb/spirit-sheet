// src/redux/reducers/authReducer.ts

import { OrganizationData } from '../../services/api';
import {
  AUTH0_LOGIN_SUCCESS,
  AUTH0_LOGOUT,
  AUTH0_USER_LOADED,
  USER_SYNCED,
  AUTH_ERROR,
  UPDATE_CHURCH_REQUEST,
  UPDATE_CHURCH_SUCCESS,
  UPDATE_CHURCH_FAILURE,
  RESET_CHURCH_OPERATION,
  Auth0User,
  AuthActionTypes,
} from '../actions/authActions';

// ============================================
// STATE INTERFACE
// ============================================

interface AuthState {
  user: Auth0User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Synced backend data
  syncedUser: any | null;
  organization: OrganizationData | null;
  syncError: string | null;

  // Church update
  isUpdatingChurch: boolean;
  updateChurchSuccess: boolean;
  updateChurchError: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  syncedUser: null,
  organization: null,
  syncError: null,
  isUpdatingChurch: false,
  updateChurchSuccess: false,
  updateChurchError: null,
};

// ============================================
// REDUCER
// ============================================

const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case AUTH0_LOGIN_SUCCESS:
    case AUTH0_USER_LOADED:
      return {
        ...state,
        loading: false,
        user: action.payload as Auth0User,
        isAuthenticated: true,
      };

    case AUTH0_LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case USER_SYNCED:
      return {
        ...state,
        syncedUser: action.payload?.user || action.payload,
        organization: action.payload?.organization || state.organization,
        syncError: null,
      };

    case AUTH_ERROR:
      return {
        ...state,
        syncError: action.payload as string,
      };

    // ============================================
    // UPDATE CHURCH SETTINGS
    // ============================================
    case UPDATE_CHURCH_REQUEST:
      return {
        ...state,
        isUpdatingChurch: true,
        updateChurchError: null,
        updateChurchSuccess: false,
      };

    case UPDATE_CHURCH_SUCCESS:
      return {
        ...state,
        isUpdatingChurch: false,
        organization: action.payload as OrganizationData,
        updateChurchSuccess: true,
        updateChurchError: null,
      };

    case UPDATE_CHURCH_FAILURE:
      return {
        ...state,
        isUpdatingChurch: false,
        updateChurchError: action.payload as string,
        updateChurchSuccess: false,
      };

    case RESET_CHURCH_OPERATION:
      return {
        ...state,
        isUpdatingChurch: false,
        updateChurchSuccess: false,
        updateChurchError: null,
      };

    default:
      return state;
  }
};

export default authReducer;