// src/redux/sagas/authSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  UPDATE_CHURCH_REQUEST,
  updateChurchSuccess,
  updateChurchFailure,
} from '../actions/authActions';
import { UpdateChurchResponse, UpdateChurchSettingsData } from '../../services/api';

// ============================================
// UPDATE CHURCH SETTINGS SAGA
// ============================================
function* updateChurchSaga(action: {
  type: string;
  payload: UpdateChurchSettingsData;
}): Generator<any, void, ApiResponse<UpdateChurchResponse>> {
  try {
    const response = yield call(api.updateChurch, action.payload);

    if (response.ok && response.data?.success) {
      yield put(updateChurchSuccess(response.data.data!));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to update church settings';
      yield put(updateChurchFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(updateChurchFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ROOT AUTH SAGA
// ============================================
export default function* authSaga() {
  yield all([
    takeLatest(UPDATE_CHURCH_REQUEST, updateChurchSaga),
  ]);
}