// src/redux/sagas/roleSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  INVITE_USER_REQUEST,
  FETCH_ROLE_USERS_REQUEST,
  UPDATE_USER_ROLE_REQUEST,
  FETCH_ROLE_PERMISSIONS_REQUEST,
  UPDATE_ROLE_PERMISSIONS_REQUEST,
  FETCH_INVITATIONS_REQUEST,
  inviteUserSuccess,
  inviteUserFailure,
  fetchRoleUsersSuccess,
  fetchRoleUsersFailure,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  fetchRolePermissionsSuccess,
  fetchRolePermissionsFailure,
  updateRolePermissionsSuccess,
  updateRolePermissionsFailure,
  fetchInvitationsSuccess,
  fetchInvitationsFailure,
} from '../actions/roleActions';
import {
  InviteUserResponse,
  GetRoleUsersResponse,
  UpdateUserRoleResponse,
  GetRolePermissionsResponse,
  UpdateRolePermissionsResponse,
  GetInvitationsResponse,
  InviteUserData,
  GetRoleUsersParams,
  GetInvitationsParams,
  AppRole,
} from '../../services/api';

// ============================================
// INVITE USER SAGA
// ============================================
function* inviteUserSaga(action: {
  type: string;
  payload: InviteUserData;
}): Generator<any, void, ApiResponse<InviteUserResponse>> {
  try {
    const response = yield call(api.inviteUser, action.payload);

    if (response.ok && response.data?.success) {
      yield put(inviteUserSuccess(response.data.data!));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to invite user';
      yield put(inviteUserFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(inviteUserFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH ROLE USERS SAGA
// ============================================
function* fetchRoleUsersSaga(action: {
  type: string;
  payload?: GetRoleUsersParams;
}): Generator<any, void, ApiResponse<GetRoleUsersResponse>> {
  try {
    const response = yield call(api.getRoleUsers, action.payload);

    if (response.ok && response.data?.success) {
      yield put(
        fetchRoleUsersSuccess(response.data.data, response.data.pagination)
      );
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch users';
      yield put(fetchRoleUsersFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchRoleUsersFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// UPDATE USER ROLE SAGA
// ============================================
function* updateUserRoleSaga(action: {
  type: string;
  payload: { userId: string; role: AppRole };
}): Generator<any, void, ApiResponse<UpdateUserRoleResponse>> {
  try {
    const { userId, role } = action.payload;
    const response = yield call(api.updateUserRole, userId, { role });

    if (response.ok && response.data?.success) {
      yield put(updateUserRoleSuccess(response.data.data!));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to update user role';
      yield put(updateUserRoleFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(updateUserRoleFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH ROLE PERMISSIONS SAGA
// ============================================
function* fetchRolePermissionsSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<GetRolePermissionsResponse>> {
  try {
    const response = yield call(api.getRolePermissions, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchRolePermissionsSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch role permissions';
      yield put(fetchRolePermissionsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchRolePermissionsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// UPDATE ROLE PERMISSIONS SAGA
// ============================================
function* updateRolePermissionsSaga(action: {
  type: string;
  payload: { role: string; allowedPages: string[]; allowedEndpoints: string[] };
}): Generator<any, void, ApiResponse<UpdateRolePermissionsResponse>> {
  try {
    const { role, allowedPages, allowedEndpoints } = action.payload;
    const response = yield call(api.updateRolePermissions, role, {
      allowedPages,
      allowedEndpoints,
    });

    if (response.ok && response.data?.success) {
      yield put(updateRolePermissionsSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to update role permissions';
      yield put(updateRolePermissionsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(
      updateRolePermissionsFailure(error.message || 'An unexpected error occurred')
    );
  }
}

// ============================================
// FETCH INVITATIONS SAGA
// ============================================
function* fetchInvitationsSaga(action: {
  type: string;
  payload?: GetInvitationsParams;
}): Generator<any, void, ApiResponse<GetInvitationsResponse>> {
  try {
    const response = yield call(api.getRoleInvitations, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchInvitationsSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch invitations';
      yield put(fetchInvitationsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchInvitationsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ROOT ROLE SAGA
// ============================================
export default function* roleSaga() {
  yield all([
    takeLatest(INVITE_USER_REQUEST, inviteUserSaga),
    takeLatest(FETCH_ROLE_USERS_REQUEST, fetchRoleUsersSaga),
    takeLatest(UPDATE_USER_ROLE_REQUEST, updateUserRoleSaga),
    takeLatest(FETCH_ROLE_PERMISSIONS_REQUEST, fetchRolePermissionsSaga),
    takeLatest(UPDATE_ROLE_PERMISSIONS_REQUEST, updateRolePermissionsSaga),
    takeLatest(FETCH_INVITATIONS_REQUEST, fetchInvitationsSaga),
  ]);
}