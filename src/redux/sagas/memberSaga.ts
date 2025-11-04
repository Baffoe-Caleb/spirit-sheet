import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  FETCH_MEMBERS_REQUEST,
  CREATE_MEMBER_REQUEST,
  UPDATE_MEMBER_REQUEST,
  DELETE_MEMBER_REQUEST,
  fetchMembersSuccess,
  fetchMembersFailure,
  createMemberSuccess,
  createMemberFailure,
  updateMemberSuccess,
  updateMemberFailure,
  deleteMemberSuccess,
  deleteMemberFailure,
} from '../actions/memberActions';

function* fetchMembersSaga(action: any): Generator<any, void, any> {
  try {
    const params = action.payload || {};
    const response = yield call(api.get, '/members', params);

    if (response.ok && response.data?.success) {
      yield put(
        fetchMembersSuccess({
          members: response.data.data,
          pagination: response.data.pagination,
        })
      );
    } else {
      yield put(fetchMembersFailure(response.data?.error || 'Failed to fetch members'));
    }
  } catch (error: any) {
    yield put(fetchMembersFailure(error.message || 'Unknown error'));
  }
}

function* createMemberSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.post, '/members', action.payload);

    if (response.ok && response.data?.success) {
      yield put(createMemberSuccess(response.data.data));
    } else {
      yield put(createMemberFailure(response.data?.error || 'Failed to create member'));
    }
  } catch (error: any) {
    yield put(createMemberFailure(error.message || 'Unknown error'));
  }
}

function* updateMemberSaga(action: any): Generator<any, void, any> {
  try {
    const { id, member } = action.payload;
    const response = yield call(api.put, `/members/${id}`, member);

    if (response.ok && response.data?.success) {
      yield put(updateMemberSuccess(response.data.data));
    } else {
      yield put(updateMemberFailure(response.data?.error || 'Failed to update member'));
    }
  } catch (error: any) {
    yield put(updateMemberFailure(error.message || 'Unknown error'));
  }
}

function* deleteMemberSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.delete, `/members/${action.payload}`);

    if (response.ok && response.data?.success) {
      yield put(deleteMemberSuccess(action.payload));
    } else {
      yield put(deleteMemberFailure(response.data?.error || 'Failed to delete member'));
    }
  } catch (error: any) {
    yield put(deleteMemberFailure(error.message || 'Unknown error'));
  }
}

export default function* memberSaga() {
  yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
  yield takeLatest(CREATE_MEMBER_REQUEST, createMemberSaga);
  yield takeLatest(UPDATE_MEMBER_REQUEST, updateMemberSaga);
  yield takeLatest(DELETE_MEMBER_REQUEST, deleteMemberSaga);
}
