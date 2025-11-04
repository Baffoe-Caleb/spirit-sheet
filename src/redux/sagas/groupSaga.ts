import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  FETCH_GROUPS_REQUEST,
  CREATE_GROUP_REQUEST,
  UPDATE_GROUP_REQUEST,
  DELETE_GROUP_REQUEST,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  createGroupSuccess,
  createGroupFailure,
  updateGroupSuccess,
  updateGroupFailure,
  deleteGroupSuccess,
  deleteGroupFailure,
} from '../actions/groupActions';

function* fetchGroupsSaga(action: any): Generator<any, void, any> {
  try {
    const params = action.payload || {};
    const response = yield call(api.get, '/groups', params);

    if (response.ok && response.data?.success) {
      yield put(
        fetchGroupsSuccess({
          groups: response.data.data,
          pagination: response.data.pagination,
        })
      );
    } else {
      yield put(fetchGroupsFailure(response.data?.error || 'Failed to fetch groups'));
    }
  } catch (error: any) {
    yield put(fetchGroupsFailure(error.message || 'Unknown error'));
  }
}

function* createGroupSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.post, '/groups', action.payload);

    if (response.ok && response.data?.success) {
      yield put(createGroupSuccess(response.data.data));
    } else {
      yield put(createGroupFailure(response.data?.error || 'Failed to create group'));
    }
  } catch (error: any) {
    yield put(createGroupFailure(error.message || 'Unknown error'));
  }
}

function* updateGroupSaga(action: any): Generator<any, void, any> {
  try {
    const { id, group } = action.payload;
    const response = yield call(api.put, `/groups/${id}`, group);

    if (response.ok && response.data?.success) {
      yield put(updateGroupSuccess(response.data.data));
    } else {
      yield put(updateGroupFailure(response.data?.error || 'Failed to update group'));
    }
  } catch (error: any) {
    yield put(updateGroupFailure(error.message || 'Unknown error'));
  }
}

function* deleteGroupSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.delete, `/groups/${action.payload}`);

    if (response.ok && response.data?.success) {
      yield put(deleteGroupSuccess(action.payload));
    } else {
      yield put(deleteGroupFailure(response.data?.error || 'Failed to delete group'));
    }
  } catch (error: any) {
    yield put(deleteGroupFailure(error.message || 'Unknown error'));
  }
}

export default function* groupSaga() {
  yield takeLatest(FETCH_GROUPS_REQUEST, fetchGroupsSaga);
  yield takeLatest(CREATE_GROUP_REQUEST, createGroupSaga);
  yield takeLatest(UPDATE_GROUP_REQUEST, updateGroupSaga);
  yield takeLatest(DELETE_GROUP_REQUEST, deleteGroupSaga);
}
