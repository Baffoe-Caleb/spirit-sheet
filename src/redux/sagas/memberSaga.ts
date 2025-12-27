// src/redux/sagas/memberSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
    FETCH_MEMBERS_REQUEST,
    FETCH_MEMBER_REQUEST,
    CREATE_MEMBER_REQUEST,
    UPDATE_MEMBER_REQUEST,
    DELETE_MEMBER_REQUEST,
    SEARCH_MEMBERS_REQUEST,
    fetchMembersSuccess,
    fetchMembersFailure,
    fetchMemberSuccess,
    fetchMemberFailure,
    createMemberSuccess,
    createMemberFailure,
    updateMemberSuccess,
    updateMemberFailure,
    deleteMemberSuccess,
    deleteMemberFailure,
    searchMembersSuccess,
    searchMembersFailure,
} from '../actions/memberActions';
import {
    GetMembersResponse,
    GetMemberResponse,
    CreateMemberResponse,
    UpdateMemberResponse,
    DeleteMemberResponse,
    SearchMembersResponse,
    GetMembersParams,
    MemberFormData,
} from '../../services/api';

// ============================================
// FETCH MEMBERS SAGA
// ============================================
function* fetchMembersSaga(action: {
    type: string;
    payload?: GetMembersParams;
}): Generator<any, void, ApiResponse<GetMembersResponse>> {
    try {
        const response = yield call(api.getMembers, action.payload);

        if (response.ok && response.data?.success) {
            yield put(
                fetchMembersSuccess(
                    response.data.data,
                    response.data.pagination
                )
            );
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to fetch members';
            yield put(fetchMembersFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(fetchMembersFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// FETCH SINGLE MEMBER SAGA
// ============================================
function* fetchMemberSaga(action: {
    type: string;
    payload: string;
}): Generator<any, void, ApiResponse<GetMemberResponse>> {
    try {
        const response = yield call(api.getMemberById, action.payload);

        if (response.ok && response.data?.success) {
            yield put(fetchMemberSuccess(response.data.data));
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to fetch member';
            yield put(fetchMemberFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(fetchMemberFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// CREATE MEMBER SAGA
// ============================================
function* createMemberSaga(action: {
    type: string;
    payload: MemberFormData;
}): Generator<any, void, ApiResponse<CreateMemberResponse>> {
    try {
        const response = yield call(api.createMember, action.payload);

        if (response.ok && response.data?.success) {
            yield put(createMemberSuccess(response.data.data));
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to create member';
            yield put(createMemberFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(createMemberFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// UPDATE MEMBER SAGA
// ============================================
function* updateMemberSaga(action: {
    type: string;
    payload: { id: string; data: Partial<MemberFormData> };
}): Generator<any, void, ApiResponse<UpdateMemberResponse>> {
    try {
        const { id, data } = action.payload;
        const response = yield call(api.updateMember, id, data);

        if (response.ok && response.data?.success) {
            yield put(updateMemberSuccess(response.data.data));
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to update member';
            yield put(updateMemberFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(updateMemberFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// DELETE MEMBER SAGA
// ============================================
function* deleteMemberSaga(action: {
    type: string;
    payload: string;
}): Generator<any, void, ApiResponse<DeleteMemberResponse>> {
    try {
        const response = yield call(api.deleteMember, action.payload);

        if (response.ok && response.data?.success) {
            yield put(deleteMemberSuccess(action.payload));
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to delete member';
            yield put(deleteMemberFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(deleteMemberFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// SEARCH MEMBERS SAGA
// ============================================
function* searchMembersSaga(action: {
    type: string;
    payload: string;
}): Generator<any, void, ApiResponse<SearchMembersResponse>> {
    try {
        const response = yield call(api.searchMembers, action.payload);

        if (response.ok && response.data?.success) {
            yield put(searchMembersSuccess(response.data.data));
        } else {
            const errorMessage =
                (response.data as any)?.message || 'Failed to search members';
            yield put(searchMembersFailure(errorMessage));
        }
    } catch (error: any) {
        yield put(searchMembersFailure(error.message || 'An unexpected error occurred'));
    }
}

// ============================================
// ROOT MEMBER SAGA
// ============================================
export default function* memberSaga() {
    yield all([
        takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga),
        takeLatest(FETCH_MEMBER_REQUEST, fetchMemberSaga),
        takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga),
        takeLatest(UPDATE_MEMBER_REQUEST, updateMemberSaga),
        takeLatest(DELETE_MEMBER_REQUEST, deleteMemberSaga),
        takeLatest(SEARCH_MEMBERS_REQUEST, searchMembersSaga),
    ]);
}