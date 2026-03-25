// src/redux/sagas/attendanceSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  FETCH_EVENTS_REQUEST,
  CREATE_EVENT_REQUEST,
  FETCH_EVENT_ATTENDANCE_REQUEST,
  CHECK_IN_REQUEST,
  CHECK_OUT_REQUEST,
  BULK_CHECK_IN_REQUEST,
  RECORD_ATTENDANCE_REQUEST,
  DELETE_ATTENDANCE_REQUEST,
  GENERATE_QR_CODE_REQUEST,
  fetchEventsSuccess,
  fetchEventsFailure,
  createEventSuccess,
  createEventFailure,
  fetchEventAttendanceSuccess,
  fetchEventAttendanceFailure,
  checkInSuccess,
  checkInFailure,
  checkOutSuccess,
  checkOutFailure,
  bulkCheckInSuccess,
  bulkCheckInFailure,
  recordAttendanceSuccess,
  recordAttendanceFailure,
  deleteAttendanceSuccess,
  deleteAttendanceFailure,
  generateQRCodeSuccess,
  generateQRCodeFailure,
} from '../actions/attendanceActions';
import {
  GetEventsResponse,
  CreateEventResponse,
  GetEventAttendanceResponse,
  CheckInResponse,
  CheckOutResponse,
  BulkCheckInResponse,
  QRCodeResponse,
  EventFormData,
  CheckInData,
  BulkCheckInData,
  RecordAttendanceData,
  GetEventsParams,
} from '../../services/api';

// ============================================
// FETCH EVENTS SAGA
// ============================================
function* fetchEventsSaga(action: {
  type: string;
  payload?: GetEventsParams;
}): Generator<any, void, ApiResponse<GetEventsResponse>> {
  try {
    const response = yield call(api.getEvents, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchEventsSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch events';
      yield put(fetchEventsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchEventsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// CREATE EVENT SAGA
// ============================================
function* createEventSaga(action: {
  type: string;
  payload: EventFormData;
}): Generator<any, void, ApiResponse<CreateEventResponse>> {
  try {
    const response = yield call(api.createEvent, action.payload);

    if (response.ok && response.data?.success) {
      yield put(createEventSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to create event';
      yield put(createEventFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(createEventFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH EVENT ATTENDANCE SAGA
// ============================================
function* fetchEventAttendanceSaga(action: {
  type: string;
  payload: { eventId: string; status?: string; attendeeType?: string };
}): Generator<any, void, ApiResponse<GetEventAttendanceResponse>> {
  try {
    const { eventId, status, attendeeType } = action.payload;
    const response = yield call(api.getEventAttendance, eventId, { status, attendeeType });

    if (response.ok && response.data?.success) {
      yield put(fetchEventAttendanceSuccess(response.data.data, response.data.stats));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch attendance';
      yield put(fetchEventAttendanceFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchEventAttendanceFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// CHECK-IN SAGA
// ============================================
function* checkInSaga(action: {
  type: string;
  payload: CheckInData;
}): Generator<any, void, ApiResponse<CheckInResponse>> {
  try {
    const response = yield call(api.checkIn, action.payload);

    if (response.ok && response.data?.success) {
      yield put(checkInSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to check in';
      yield put(checkInFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(checkInFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// CHECK-OUT SAGA
// ============================================
function* checkOutSaga(action: {
  type: string;
  payload: { eventId: string; memberId?: string; guestId?: string };
}): Generator<any, void, ApiResponse<CheckOutResponse>> {
  try {
    const response = yield call(api.checkOut, action.payload);

    if (response.ok && response.data?.success) {
      yield put(
        checkOutSuccess(
          action.payload.memberId,
          action.payload.guestId,
          response.data.data.checkOutTime
        )
      );
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to check out';
      yield put(checkOutFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(checkOutFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// BULK CHECK-IN SAGA
// ============================================
function* bulkCheckInSaga(action: {
  type: string;
  payload: BulkCheckInData;
}): Generator<any, void, ApiResponse<BulkCheckInResponse>> {
  try {
    const response = yield call(api.bulkCheckIn, action.payload);

    if (response.ok && response.data?.success) {
      yield put(
        bulkCheckInSuccess(
          response.data.data.checkedIn,
          response.data.data.duplicates,
          response.data.data.failed
        )
      );
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to bulk check in';
      yield put(bulkCheckInFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(bulkCheckInFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// RECORD ATTENDANCE SAGA
// ============================================
function* recordAttendanceSaga(action: {
  type: string;
  payload: { eventId: string; memberId: string; data: RecordAttendanceData };
}): Generator<any, void, ApiResponse<CheckInResponse>> {
  try {
    const { eventId, memberId, data } = action.payload;
    const response = yield call(api.recordAttendance, eventId, memberId, data);

    if (response.ok && response.data?.success) {
      yield put(recordAttendanceSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to record attendance';
      yield put(recordAttendanceFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(recordAttendanceFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// DELETE ATTENDANCE SAGA
// ============================================
function* deleteAttendanceSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<{ success: boolean; message: string }>> {
  try {
    const response = yield call(api.deleteAttendance, action.payload);

    if (response.ok && response.data?.success) {
      yield put(deleteAttendanceSuccess(action.payload));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to delete attendance';
      yield put(deleteAttendanceFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(deleteAttendanceFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// GENERATE QR CODE SAGA
// ============================================
function* generateQRCodeSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<QRCodeResponse>> {
  try {
    const response = yield call(api.generateQRCode, action.payload);

    if (response.ok && response.data?.success) {
      yield put(generateQRCodeSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to generate QR code';
      yield put(generateQRCodeFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(generateQRCodeFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ROOT ATTENDANCE SAGA
// ============================================
export default function* attendanceSaga() {
  yield all([
    takeLatest(FETCH_EVENTS_REQUEST, fetchEventsSaga),
    takeLatest(CREATE_EVENT_REQUEST, createEventSaga),
    takeLatest(FETCH_EVENT_ATTENDANCE_REQUEST, fetchEventAttendanceSaga),
    takeLatest(CHECK_IN_REQUEST, checkInSaga),
    takeLatest(CHECK_OUT_REQUEST, checkOutSaga),
    takeLatest(BULK_CHECK_IN_REQUEST, bulkCheckInSaga),
    takeLatest(RECORD_ATTENDANCE_REQUEST, recordAttendanceSaga),
    takeLatest(DELETE_ATTENDANCE_REQUEST, deleteAttendanceSaga),
    takeLatest(GENERATE_QR_CODE_REQUEST, generateQRCodeSaga),
  ]);
}