// src/redux/reducers/roleReducer.ts

import { RoleUser, RolePermissions, RoleInvitation, PaginationInfo } from '../../services/api';
import {
  INVITE_USER_REQUEST,
  INVITE_USER_SUCCESS,
  INVITE_USER_FAILURE,
  FETCH_ROLE_USERS_REQUEST,
  FETCH_ROLE_USERS_SUCCESS,
  FETCH_ROLE_USERS_FAILURE,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAILURE,
  FETCH_ROLE_PERMISSIONS_REQUEST,
  FETCH_ROLE_PERMISSIONS_SUCCESS,
  FETCH_ROLE_PERMISSIONS_FAILURE,
  UPDATE_ROLE_PERMISSIONS_REQUEST,
  UPDATE_ROLE_PERMISSIONS_SUCCESS,
  UPDATE_ROLE_PERMISSIONS_FAILURE,
  FETCH_INVITATIONS_REQUEST,
  FETCH_INVITATIONS_SUCCESS,
  FETCH_INVITATIONS_FAILURE,
  CLEAR_ROLE_ERROR,
  RESET_ROLE_OPERATION,
  RESET_ROLE_STATE,
  RoleActionTypes,
} from '../actions/roleActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface RoleState {
  // Users list
  users: RoleUser[];
  pagination: PaginationInfo | null;

  // Permissions for a specific role
  rolePermissions: RolePermissions | null;

  // Invitations
  invitations: RoleInvitation[];

  // Loading states
  isLoading: boolean;
  isInviting: boolean;
  isUpdatingRole: boolean;
  isLoadingPermissions: boolean;
  isUpdatingPermissions: boolean;
  isLoadingInvitations: boolean;

  // Error states
  error: string | null;
  inviteError: string | null;
  updateRoleError: string | null;
  permissionsError: string | null;
  updatePermissionsError: string | null;
  invitationsError: string | null;

  // Success flags
  inviteSuccess: boolean;
  updateRoleSuccess: boolean;
  updatePermissionsSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: RoleState = {
  users: [],
  pagination: null,
  rolePermissions: null,
  invitations: [],
  isLoading: false,
  isInviting: false,
  isUpdatingRole: false,
  isLoadingPermissions: false,
  isUpdatingPermissions: false,
  isLoadingInvitations: false,
  error: null,
  inviteError: null,
  updateRoleError: null,
  permissionsError: null,
  updatePermissionsError: null,
  invitationsError: null,
  inviteSuccess: false,
  updateRoleSuccess: false,
  updatePermissionsSuccess: false,
};

// ============================================
// REDUCER
// ============================================

const roleReducer = (state = initialState, action: RoleActionTypes): RoleState => {
  switch (action.type) {
    // ============================================
    // INVITE USER
    // ============================================
    case INVITE_USER_REQUEST:
      return {
        ...state,
        isInviting: true,
        inviteError: null,
        inviteSuccess: false,
      };

    case INVITE_USER_SUCCESS:
      return {
        ...state,
        isInviting: false,
        invitations: [action.payload, ...state.invitations],
        inviteSuccess: true,
        inviteError: null,
      };

    case INVITE_USER_FAILURE:
      return {
        ...state,
        isInviting: false,
        inviteError: action.payload,
        inviteSuccess: false,
      };

    // ============================================
    // FETCH ROLE USERS
    // ============================================
    case FETCH_ROLE_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_ROLE_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: action.payload.users,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_ROLE_USERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // UPDATE USER ROLE
    // ============================================
    case UPDATE_USER_ROLE_REQUEST:
      return {
        ...state,
        isUpdatingRole: true,
        updateRoleError: null,
        updateRoleSuccess: false,
      };

    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        isUpdatingRole: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        updateRoleSuccess: true,
        updateRoleError: null,
      };

    case UPDATE_USER_ROLE_FAILURE:
      return {
        ...state,
        isUpdatingRole: false,
        updateRoleError: action.payload,
        updateRoleSuccess: false,
      };

    // ============================================
    // FETCH ROLE PERMISSIONS
    // ============================================
    case FETCH_ROLE_PERMISSIONS_REQUEST:
      return {
        ...state,
        isLoadingPermissions: true,
        permissionsError: null,
        rolePermissions: null,
      };

    case FETCH_ROLE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        isLoadingPermissions: false,
        rolePermissions: action.payload,
        permissionsError: null,
      };

    case FETCH_ROLE_PERMISSIONS_FAILURE:
      return {
        ...state,
        isLoadingPermissions: false,
        permissionsError: action.payload,
      };

    // ============================================
    // UPDATE ROLE PERMISSIONS
    // ============================================
    case UPDATE_ROLE_PERMISSIONS_REQUEST:
      return {
        ...state,
        isUpdatingPermissions: true,
        updatePermissionsError: null,
        updatePermissionsSuccess: false,
      };

    case UPDATE_ROLE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        isUpdatingPermissions: false,
        rolePermissions: action.payload,
        updatePermissionsSuccess: true,
        updatePermissionsError: null,
      };

    case UPDATE_ROLE_PERMISSIONS_FAILURE:
      return {
        ...state,
        isUpdatingPermissions: false,
        updatePermissionsError: action.payload,
        updatePermissionsSuccess: false,
      };

    // ============================================
    // FETCH INVITATIONS
    // ============================================
    case FETCH_INVITATIONS_REQUEST:
      return {
        ...state,
        isLoadingInvitations: true,
        invitationsError: null,
      };

    case FETCH_INVITATIONS_SUCCESS:
      return {
        ...state,
        isLoadingInvitations: false,
        invitations: action.payload,
        invitationsError: null,
      };

    case FETCH_INVITATIONS_FAILURE:
      return {
        ...state,
        isLoadingInvitations: false,
        invitationsError: action.payload,
      };

    // ============================================
    // CLEAR / RESET
    // ============================================
    case CLEAR_ROLE_ERROR:
      return {
        ...state,
        error: null,
        inviteError: null,
        updateRoleError: null,
        permissionsError: null,
        updatePermissionsError: null,
        invitationsError: null,
      };

    case RESET_ROLE_OPERATION:
      return {
        ...state,
        isInviting: false,
        isUpdatingRole: false,
        isUpdatingPermissions: false,
        inviteSuccess: false,
        updateRoleSuccess: false,
        updatePermissionsSuccess: false,
        inviteError: null,
        updateRoleError: null,
        updatePermissionsError: null,
      };

    case RESET_ROLE_STATE:
      return initialState;

    default:
      return state;
  }
};

export default roleReducer;