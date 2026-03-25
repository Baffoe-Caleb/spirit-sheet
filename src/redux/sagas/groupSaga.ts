// src/redux/sagas/groupSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  FETCH_GROUPS_REQUEST,
  FETCH_GROUP_REQUEST,
  CREATE_GROUP_REQUEST,
  UPDATE_GROUP_REQUEST,
  DELETE_GROUP_REQUEST,
  FETCH_CATEGORIES_REQUEST,
  FETCH_GROUP_MEMBERS_REQUEST,
  ADD_GROUP_MEMBER_REQUEST,
  REMOVE_GROUP_MEMBER_REQUEST,
  FETCH_GROUP_STATISTICS_REQUEST,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  fetchGroupSuccess,
  fetchGroupFailure,
  createGroupSuccess,
  createGroupFailure,
  updateGroupSuccess,
  updateGroupFailure,
  deleteGroupSuccess,
  deleteGroupFailure,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchGroupMembersSuccess,
  fetchGroupMembersFailure,
  addGroupMemberSuccess,
  addGroupMemberFailure,
  removeGroupMemberSuccess,
  removeGroupMemberFailure,
  fetchGroupStatisticsSuccess,
  fetchGroupStatisticsFailure,
} from '../actions/groupActions';
import {
  GetGroupsResponse,
  GetGroupResponse,
  CreateGroupResponse,
  UpdateGroupResponse,
  DeleteGroupResponse,
  GetGroupCategoriesResponse,
  GetGroupMembersResponse,
  AddGroupMemberResponse,
  GetGroupStatisticsResponse,
  GroupFormData,
  GetGroupsParams,
} from '../../services/api';

// ============================================
// FETCH GROUPS SAGA
// ============================================
function* fetchGroupsSaga(action: {
  type: string;
  payload?: GetGroupsParams;
}): Generator<any, void, ApiResponse<GetGroupsResponse>> {
  try {
    const response = yield call(api.getGroups, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchGroupsSuccess(response.data.data, response.data.pagination));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch groups';
      yield put(fetchGroupsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchGroupsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH SINGLE GROUP SAGA
// ============================================
function* fetchGroupSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<GetGroupResponse>> {
  try {
    const response = yield call(api.getGroupById, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchGroupSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch group';
      yield put(fetchGroupFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchGroupFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// CREATE GROUP SAGA
// ============================================
function* createGroupSaga(action: {
  type: string;
  payload: GroupFormData;
}): Generator<any, void, ApiResponse<CreateGroupResponse>> {
  try {
    const response = yield call(api.createGroup, action.payload);

    if (response.ok && response.data?.success) {
      yield put(createGroupSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to create group';
      yield put(createGroupFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(createGroupFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// UPDATE GROUP SAGA
// ============================================
function* updateGroupSaga(action: {
  type: string;
  payload: { id: string; data: Partial<GroupFormData> };
}): Generator<any, void, ApiResponse<UpdateGroupResponse>> {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateGroup, id, data);

    if (response.ok && response.data?.success) {
      yield put(updateGroupSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to update group';
      yield put(updateGroupFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(updateGroupFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// DELETE GROUP SAGA
// ============================================
function* deleteGroupSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<DeleteGroupResponse>> {
  try {
    const response = yield call(api.deleteGroup, action.payload);

    if (response.ok && response.data?.success) {
      yield put(deleteGroupSuccess(action.payload));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to delete group';
      yield put(deleteGroupFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(deleteGroupFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH CATEGORIES SAGA
// ============================================
function* fetchCategoriesSaga(): Generator<any, void, ApiResponse<GetGroupCategoriesResponse>> {
  try {
    const response = yield call(api.getGroupCategories);

    if (response.ok && response.data?.success) {
      yield put(fetchCategoriesSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch categories';
      yield put(fetchCategoriesFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH GROUP MEMBERS SAGA
// ============================================
function* fetchGroupMembersSaga(action: {
  type: string;
  payload: { groupId: string; role?: string; status?: string };
}): Generator<any, void, ApiResponse<GetGroupMembersResponse>> {
  try {
    const { groupId, role, status } = action.payload;
    const response = yield call(api.getGroupMembers, groupId, { role, status });

    if (response.ok && response.data?.success) {
      yield put(fetchGroupMembersSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch group members';
      yield put(fetchGroupMembersFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchGroupMembersFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ADD GROUP MEMBER SAGA
// ============================================
function* addGroupMemberSaga(action: {
  type: string;
  payload: { groupId: string; memberId: string; role?: string };
}): Generator<any, void, ApiResponse<AddGroupMemberResponse>> {
  try {
    const { groupId, memberId, role } = action.payload;
    const response = yield call(api.addGroupMember, groupId, { memberId, role });

    if (response.ok && response.data?.success) {
      const memberData = response.data.data;
      yield put(addGroupMemberSuccess({
        id: memberData.memberId,
        name: memberData.member.name,
        email: memberData.member.email,
        phone: memberData.member.phone,
        role: memberData.role as any,
        status: 'active',
        joinedAt: memberData.joinedAt,
      }));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to add member';
      yield put(addGroupMemberFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(addGroupMemberFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// REMOVE GROUP MEMBER SAGA
// ============================================
function* removeGroupMemberSaga(action: {
  type: string;
  payload: { groupId: string; memberId: string };
}): Generator<any, void, ApiResponse<{ success: boolean; message: string }>> {
  try {
    const { groupId, memberId } = action.payload;
    const response = yield call(api.removeGroupMember, groupId, memberId);

    if (response.ok && response.data?.success) {
      yield put(removeGroupMemberSuccess(memberId));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to remove member';
      yield put(removeGroupMemberFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(removeGroupMemberFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH GROUP STATISTICS SAGA
// ============================================
function* fetchGroupStatisticsSaga(action: {
  type: string;
  payload: { groupId: string; period?: string };
}): Generator<any, void, ApiResponse<GetGroupStatisticsResponse>> {
  try {
    const { groupId, period } = action.payload;
    const response = yield call(api.getGroupStatistics, groupId, period);

    if (response.ok && response.data?.success) {
      yield put(fetchGroupStatisticsSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch statistics';
      yield put(fetchGroupStatisticsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchGroupStatisticsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ROOT GROUP SAGA
// ============================================
export default function* groupSaga() {
  yield all([
    takeLatest(FETCH_GROUPS_REQUEST, fetchGroupsSaga),
    takeLatest(FETCH_GROUP_REQUEST, fetchGroupSaga),
    takeLatest(CREATE_GROUP_REQUEST, createGroupSaga),
    takeLatest(UPDATE_GROUP_REQUEST, updateGroupSaga),
    takeLatest(DELETE_GROUP_REQUEST, deleteGroupSaga),
    takeLatest(FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga),
    takeLatest(FETCH_GROUP_MEMBERS_REQUEST, fetchGroupMembersSaga),
    takeLatest(ADD_GROUP_MEMBER_REQUEST, addGroupMemberSaga),
    takeLatest(REMOVE_GROUP_MEMBER_REQUEST, removeGroupMemberSaga),
    takeLatest(FETCH_GROUP_STATISTICS_REQUEST, fetchGroupStatisticsSaga),
  ]);
}