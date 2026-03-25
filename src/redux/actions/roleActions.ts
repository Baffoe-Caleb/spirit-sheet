// src/redux/actions/roleActions.ts

import {
  RoleUser,
  RolePermissions,
  RoleInvitation,
  PaginationInfo,
  AppRole,
  GetRoleUsersParams,
  GetInvitationsParams,
  InviteUserData,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Invite User
export const INVITE_USER_REQUEST = 'roles/INVITE_REQUEST';
export const INVITE_USER_SUCCESS = 'roles/INVITE_SUCCESS';
export const INVITE_USER_FAILURE = 'roles/INVITE_FAILURE';

// Fetch Role Users
export const FETCH_ROLE_USERS_REQUEST = 'roles/FETCH_USERS_REQUEST';
export const FETCH_ROLE_USERS_SUCCESS = 'roles/FETCH_USERS_SUCCESS';
export const FETCH_ROLE_USERS_FAILURE = 'roles/FETCH_USERS_FAILURE';

// Update User Role
export const UPDATE_USER_ROLE_REQUEST = 'roles/UPDATE_USER_ROLE_REQUEST';
export const UPDATE_USER_ROLE_SUCCESS = 'roles/UPDATE_USER_ROLE_SUCCESS';
export const UPDATE_USER_ROLE_FAILURE = 'roles/UPDATE_USER_ROLE_FAILURE';

// Fetch Role Permissions
export const FETCH_ROLE_PERMISSIONS_REQUEST = 'roles/FETCH_PERMISSIONS_REQUEST';
export const FETCH_ROLE_PERMISSIONS_SUCCESS = 'roles/FETCH_PERMISSIONS_SUCCESS';
export const FETCH_ROLE_PERMISSIONS_FAILURE = 'roles/FETCH_PERMISSIONS_FAILURE';

// Update Role Permissions
export const UPDATE_ROLE_PERMISSIONS_REQUEST = 'roles/UPDATE_PERMISSIONS_REQUEST';
export const UPDATE_ROLE_PERMISSIONS_SUCCESS = 'roles/UPDATE_PERMISSIONS_SUCCESS';
export const UPDATE_ROLE_PERMISSIONS_FAILURE = 'roles/UPDATE_PERMISSIONS_FAILURE';

// Fetch Invitations
export const FETCH_INVITATIONS_REQUEST = 'roles/FETCH_INVITATIONS_REQUEST';
export const FETCH_INVITATIONS_SUCCESS = 'roles/FETCH_INVITATIONS_SUCCESS';
export const FETCH_INVITATIONS_FAILURE = 'roles/FETCH_INVITATIONS_FAILURE';

// Clear / Reset
export const CLEAR_ROLE_ERROR = 'roles/CLEAR_ERROR';
export const RESET_ROLE_OPERATION = 'roles/RESET_OPERATION';
export const RESET_ROLE_STATE = 'roles/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Invite User
interface InviteUserRequestAction {
  type: typeof INVITE_USER_REQUEST;
  payload: InviteUserData;
}
interface InviteUserSuccessAction {
  type: typeof INVITE_USER_SUCCESS;
  payload: RoleInvitation;
}
interface InviteUserFailureAction {
  type: typeof INVITE_USER_FAILURE;
  payload: string;
}

// Fetch Role Users
interface FetchRoleUsersRequestAction {
  type: typeof FETCH_ROLE_USERS_REQUEST;
  payload?: GetRoleUsersParams;
}
interface FetchRoleUsersSuccessAction {
  type: typeof FETCH_ROLE_USERS_SUCCESS;
  payload: { users: RoleUser[]; pagination: PaginationInfo };
}
interface FetchRoleUsersFailureAction {
  type: typeof FETCH_ROLE_USERS_FAILURE;
  payload: string;
}

// Update User Role
interface UpdateUserRoleRequestAction {
  type: typeof UPDATE_USER_ROLE_REQUEST;
  payload: { userId: string; role: AppRole };
}
interface UpdateUserRoleSuccessAction {
  type: typeof UPDATE_USER_ROLE_SUCCESS;
  payload: RoleUser;
}
interface UpdateUserRoleFailureAction {
  type: typeof UPDATE_USER_ROLE_FAILURE;
  payload: string;
}

// Fetch Role Permissions
interface FetchRolePermissionsRequestAction {
  type: typeof FETCH_ROLE_PERMISSIONS_REQUEST;
  payload: string; // role name
}
interface FetchRolePermissionsSuccessAction {
  type: typeof FETCH_ROLE_PERMISSIONS_SUCCESS;
  payload: RolePermissions;
}
interface FetchRolePermissionsFailureAction {
  type: typeof FETCH_ROLE_PERMISSIONS_FAILURE;
  payload: string;
}

// Update Role Permissions
interface UpdateRolePermissionsRequestAction {
  type: typeof UPDATE_ROLE_PERMISSIONS_REQUEST;
  payload: {
    role: string;
    allowedPages: string[];
    allowedEndpoints: string[];
  };
}
interface UpdateRolePermissionsSuccessAction {
  type: typeof UPDATE_ROLE_PERMISSIONS_SUCCESS;
  payload: RolePermissions;
}
interface UpdateRolePermissionsFailureAction {
  type: typeof UPDATE_ROLE_PERMISSIONS_FAILURE;
  payload: string;
}

// Fetch Invitations
interface FetchInvitationsRequestAction {
  type: typeof FETCH_INVITATIONS_REQUEST;
  payload?: GetInvitationsParams;
}
interface FetchInvitationsSuccessAction {
  type: typeof FETCH_INVITATIONS_SUCCESS;
  payload: RoleInvitation[];
}
interface FetchInvitationsFailureAction {
  type: typeof FETCH_INVITATIONS_FAILURE;
  payload: string;
}

// Clear / Reset
interface ClearRoleErrorAction {
  type: typeof CLEAR_ROLE_ERROR;
}
interface ResetRoleOperationAction {
  type: typeof RESET_ROLE_OPERATION;
}
interface ResetRoleStateAction {
  type: typeof RESET_ROLE_STATE;
}

// Union type
export type RoleActionTypes =
  | InviteUserRequestAction
  | InviteUserSuccessAction
  | InviteUserFailureAction
  | FetchRoleUsersRequestAction
  | FetchRoleUsersSuccessAction
  | FetchRoleUsersFailureAction
  | UpdateUserRoleRequestAction
  | UpdateUserRoleSuccessAction
  | UpdateUserRoleFailureAction
  | FetchRolePermissionsRequestAction
  | FetchRolePermissionsSuccessAction
  | FetchRolePermissionsFailureAction
  | UpdateRolePermissionsRequestAction
  | UpdateRolePermissionsSuccessAction
  | UpdateRolePermissionsFailureAction
  | FetchInvitationsRequestAction
  | FetchInvitationsSuccessAction
  | FetchInvitationsFailureAction
  | ClearRoleErrorAction
  | ResetRoleOperationAction
  | ResetRoleStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Invite User
export const inviteUserRequest = (data: InviteUserData): InviteUserRequestAction => ({
  type: INVITE_USER_REQUEST,
  payload: data,
});

export const inviteUserSuccess = (invitation: RoleInvitation): InviteUserSuccessAction => ({
  type: INVITE_USER_SUCCESS,
  payload: invitation,
});

export const inviteUserFailure = (error: string): InviteUserFailureAction => ({
  type: INVITE_USER_FAILURE,
  payload: error,
});

// Fetch Role Users
export const fetchRoleUsersRequest = (params?: GetRoleUsersParams): FetchRoleUsersRequestAction => ({
  type: FETCH_ROLE_USERS_REQUEST,
  payload: params,
});

export const fetchRoleUsersSuccess = (
  users: RoleUser[],
  pagination: PaginationInfo
): FetchRoleUsersSuccessAction => ({
  type: FETCH_ROLE_USERS_SUCCESS,
  payload: { users, pagination },
});

export const fetchRoleUsersFailure = (error: string): FetchRoleUsersFailureAction => ({
  type: FETCH_ROLE_USERS_FAILURE,
  payload: error,
});

// Update User Role
export const updateUserRoleRequest = (
  userId: string,
  role: AppRole
): UpdateUserRoleRequestAction => ({
  type: UPDATE_USER_ROLE_REQUEST,
  payload: { userId, role },
});

export const updateUserRoleSuccess = (user: RoleUser): UpdateUserRoleSuccessAction => ({
  type: UPDATE_USER_ROLE_SUCCESS,
  payload: user,
});

export const updateUserRoleFailure = (error: string): UpdateUserRoleFailureAction => ({
  type: UPDATE_USER_ROLE_FAILURE,
  payload: error,
});

// Fetch Role Permissions
export const fetchRolePermissionsRequest = (role: string): FetchRolePermissionsRequestAction => ({
  type: FETCH_ROLE_PERMISSIONS_REQUEST,
  payload: role,
});

export const fetchRolePermissionsSuccess = (
  permissions: RolePermissions
): FetchRolePermissionsSuccessAction => ({
  type: FETCH_ROLE_PERMISSIONS_SUCCESS,
  payload: permissions,
});

export const fetchRolePermissionsFailure = (error: string): FetchRolePermissionsFailureAction => ({
  type: FETCH_ROLE_PERMISSIONS_FAILURE,
  payload: error,
});

// Update Role Permissions
export const updateRolePermissionsRequest = (
  role: string,
  allowedPages: string[],
  allowedEndpoints: string[]
): UpdateRolePermissionsRequestAction => ({
  type: UPDATE_ROLE_PERMISSIONS_REQUEST,
  payload: { role, allowedPages, allowedEndpoints },
});

export const updateRolePermissionsSuccess = (
  permissions: RolePermissions
): UpdateRolePermissionsSuccessAction => ({
  type: UPDATE_ROLE_PERMISSIONS_SUCCESS,
  payload: permissions,
});

export const updateRolePermissionsFailure = (error: string): UpdateRolePermissionsFailureAction => ({
  type: UPDATE_ROLE_PERMISSIONS_FAILURE,
  payload: error,
});

// Fetch Invitations
export const fetchInvitationsRequest = (
  params?: GetInvitationsParams
): FetchInvitationsRequestAction => ({
  type: FETCH_INVITATIONS_REQUEST,
  payload: params,
});

export const fetchInvitationsSuccess = (
  invitations: RoleInvitation[]
): FetchInvitationsSuccessAction => ({
  type: FETCH_INVITATIONS_SUCCESS,
  payload: invitations,
});

export const fetchInvitationsFailure = (error: string): FetchInvitationsFailureAction => ({
  type: FETCH_INVITATIONS_FAILURE,
  payload: error,
});

// Clear / Reset
export const clearRoleError = (): ClearRoleErrorAction => ({
  type: CLEAR_ROLE_ERROR,
});

export const resetRoleOperation = (): ResetRoleOperationAction => ({
  type: RESET_ROLE_OPERATION,
});

export const resetRoleState = (): ResetRoleStateAction => ({
  type: RESET_ROLE_STATE,
});