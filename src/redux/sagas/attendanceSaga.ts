import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  FETCH_ATTENDANCE_REQUEST,
  RECORD_ATTENDANCE_REQUEST,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  recordAttendanceSuccess,
  recordAttendanceFailure,
} from '../actions/attendanceActions';

function* fetchAttendanceSaga(action: any): Generator<any, void, any> {
  try {
    const params = action.payload || {};
    const response = yield call(api.get, '/attendance', params);

    if (response.ok && response.data?.success) {
      yield put(
        fetchAttendanceSuccess({
          attendance: response.data.data,
          pagination: response.data.pagination,
        })
      );
    } else {
      yield put(fetchAttendanceFailure(response.data?.error || 'Failed to fetch attendance'));
    }
  } catch (error: any) {
    yield put(fetchAttendanceFailure(error.message || 'Unknown error'));
  }
}

function* recordAttendanceSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.post, '/attendance', { records: action.payload });

    if (response.ok && response.data?.success) {
      yield put(recordAttendanceSuccess(response.data.data));
    } else {
      yield put(recordAttendanceFailure(response.data?.error || 'Failed to record attendance'));
    }
  } catch (error: any) {
    yield put(recordAttendanceFailure(error.message || 'Unknown error'));
  }
}

export default function* attendanceSaga() {
  yield takeLatest(FETCH_ATTENDANCE_REQUEST, fetchAttendanceSaga);
  yield takeLatest(RECORD_ATTENDANCE_REQUEST, recordAttendanceSaga);
}
