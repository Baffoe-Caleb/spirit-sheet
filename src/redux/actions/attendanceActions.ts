// src/redux/actions/attendanceActions.ts

import {
  Attendance,
  AttendanceStats,
  Event,
  EventFormData,
  CheckInData,
  BulkCheckInData,
  RecordAttendanceData,
  GetEventsParams,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Events
export const FETCH_EVENTS_REQUEST = 'attendance/FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_SUCCESS = 'attendance/FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'attendance/FETCH_EVENTS_FAILURE';

export const CREATE_EVENT_REQUEST = 'attendance/CREATE_EVENT_REQUEST';
export const CREATE_EVENT_SUCCESS = 'attendance/CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'attendance/CREATE_EVENT_FAILURE';

export const SET_SELECTED_EVENT = 'attendance/SET_SELECTED_EVENT';

// Fetch Event Attendance
export const FETCH_EVENT_ATTENDANCE_REQUEST = 'attendance/FETCH_EVENT_ATTENDANCE_REQUEST';
export const FETCH_EVENT_ATTENDANCE_SUCCESS = 'attendance/FETCH_EVENT_ATTENDANCE_SUCCESS';
export const FETCH_EVENT_ATTENDANCE_FAILURE = 'attendance/FETCH_EVENT_ATTENDANCE_FAILURE';

// Check-in
export const CHECK_IN_REQUEST = 'attendance/CHECK_IN_REQUEST';
export const CHECK_IN_SUCCESS = 'attendance/CHECK_IN_SUCCESS';
export const CHECK_IN_FAILURE = 'attendance/CHECK_IN_FAILURE';

// Check-out
export const CHECK_OUT_REQUEST = 'attendance/CHECK_OUT_REQUEST';
export const CHECK_OUT_SUCCESS = 'attendance/CHECK_OUT_SUCCESS';
export const CHECK_OUT_FAILURE = 'attendance/CHECK_OUT_FAILURE';

// Bulk Check-in
export const BULK_CHECK_IN_REQUEST = 'attendance/BULK_CHECK_IN_REQUEST';
export const BULK_CHECK_IN_SUCCESS = 'attendance/BULK_CHECK_IN_SUCCESS';
export const BULK_CHECK_IN_FAILURE = 'attendance/BULK_CHECK_IN_FAILURE';

// Record Attendance
export const RECORD_ATTENDANCE_REQUEST = 'attendance/RECORD_ATTENDANCE_REQUEST';
export const RECORD_ATTENDANCE_SUCCESS = 'attendance/RECORD_ATTENDANCE_SUCCESS';
export const RECORD_ATTENDANCE_FAILURE = 'attendance/RECORD_ATTENDANCE_FAILURE';

// Delete Attendance
export const DELETE_ATTENDANCE_REQUEST = 'attendance/DELETE_ATTENDANCE_REQUEST';
export const DELETE_ATTENDANCE_SUCCESS = 'attendance/DELETE_ATTENDANCE_SUCCESS';
export const DELETE_ATTENDANCE_FAILURE = 'attendance/DELETE_ATTENDANCE_FAILURE';

// QR Code
export const GENERATE_QR_CODE_REQUEST = 'attendance/GENERATE_QR_CODE_REQUEST';
export const GENERATE_QR_CODE_SUCCESS = 'attendance/GENERATE_QR_CODE_SUCCESS';
export const GENERATE_QR_CODE_FAILURE = 'attendance/GENERATE_QR_CODE_FAILURE';

// Clear States
export const CLEAR_ATTENDANCE_ERROR = 'attendance/CLEAR_ERROR';
export const RESET_ATTENDANCE_OPERATION = 'attendance/RESET_OPERATION';
export const RESET_ATTENDANCE_STATE = 'attendance/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Events
interface FetchEventsRequestAction {
  type: typeof FETCH_EVENTS_REQUEST;
  payload?: GetEventsParams;
}

interface FetchEventsSuccessAction {
  type: typeof FETCH_EVENTS_SUCCESS;
  payload: Event[];
}

interface FetchEventsFailureAction {
  type: typeof FETCH_EVENTS_FAILURE;
  payload: string;
}

interface CreateEventRequestAction {
  type: typeof CREATE_EVENT_REQUEST;
  payload: EventFormData;
}

interface CreateEventSuccessAction {
  type: typeof CREATE_EVENT_SUCCESS;
  payload: Event;
}

interface CreateEventFailureAction {
  type: typeof CREATE_EVENT_FAILURE;
  payload: string;
}

interface SetSelectedEventAction {
  type: typeof SET_SELECTED_EVENT;
  payload: Event | null;
}

// Fetch Event Attendance
interface FetchEventAttendanceRequestAction {
  type: typeof FETCH_EVENT_ATTENDANCE_REQUEST;
  payload: { eventId: string; status?: string; attendeeType?: string };
}

interface FetchEventAttendanceSuccessAction {
  type: typeof FETCH_EVENT_ATTENDANCE_SUCCESS;
  payload: { attendance: Attendance[]; stats: AttendanceStats };
}

interface FetchEventAttendanceFailureAction {
  type: typeof FETCH_EVENT_ATTENDANCE_FAILURE;
  payload: string;
}

// Check-in
interface CheckInRequestAction {
  type: typeof CHECK_IN_REQUEST;
  payload: CheckInData;
}

interface CheckInSuccessAction {
  type: typeof CHECK_IN_SUCCESS;
  payload: Attendance;
}

interface CheckInFailureAction {
  type: typeof CHECK_IN_FAILURE;
  payload: string;
}

// Check-out
interface CheckOutRequestAction {
  type: typeof CHECK_OUT_REQUEST;
  payload: { eventId: string; memberId?: string; guestId?: string };
}

interface CheckOutSuccessAction {
  type: typeof CHECK_OUT_SUCCESS;
  payload: { memberId?: string; guestId?: string; checkOutTime: string };
}

interface CheckOutFailureAction {
  type: typeof CHECK_OUT_FAILURE;
  payload: string;
}

// Bulk Check-in
interface BulkCheckInRequestAction {
  type: typeof BULK_CHECK_IN_REQUEST;
  payload: BulkCheckInData;
}

interface BulkCheckInSuccessAction {
  type: typeof BULK_CHECK_IN_SUCCESS;
  payload: { checkedIn: number; duplicates: number; failed: number };
}

interface BulkCheckInFailureAction {
  type: typeof BULK_CHECK_IN_FAILURE;
  payload: string;
}

// Record Attendance
interface RecordAttendanceRequestAction {
  type: typeof RECORD_ATTENDANCE_REQUEST;
  payload: { eventId: string; memberId: string; data: RecordAttendanceData };
}

interface RecordAttendanceSuccessAction {
  type: typeof RECORD_ATTENDANCE_SUCCESS;
  payload: Attendance;
}

interface RecordAttendanceFailureAction {
  type: typeof RECORD_ATTENDANCE_FAILURE;
  payload: string;
}

// Delete Attendance
interface DeleteAttendanceRequestAction {
  type: typeof DELETE_ATTENDANCE_REQUEST;
  payload: string;
}

interface DeleteAttendanceSuccessAction {
  type: typeof DELETE_ATTENDANCE_SUCCESS;
  payload: string;
}

interface DeleteAttendanceFailureAction {
  type: typeof DELETE_ATTENDANCE_FAILURE;
  payload: string;
}

// QR Code
interface GenerateQRCodeRequestAction {
  type: typeof GENERATE_QR_CODE_REQUEST;
  payload: string;
}

interface GenerateQRCodeSuccessAction {
  type: typeof GENERATE_QR_CODE_SUCCESS;
  payload: { qrCode: string; qrCodeId: string; url: string; expiresAt: string };
}

interface GenerateQRCodeFailureAction {
  type: typeof GENERATE_QR_CODE_FAILURE;
  payload: string;
}

// Clear States
interface ClearAttendanceErrorAction {
  type: typeof CLEAR_ATTENDANCE_ERROR;
}

interface ResetAttendanceOperationAction {
  type: typeof RESET_ATTENDANCE_OPERATION;
}

interface ResetAttendanceStateAction {
  type: typeof RESET_ATTENDANCE_STATE;
}

// Union type
export type AttendanceActionTypes =
  | FetchEventsRequestAction
  | FetchEventsSuccessAction
  | FetchEventsFailureAction
  | CreateEventRequestAction
  | CreateEventSuccessAction
  | CreateEventFailureAction
  | SetSelectedEventAction
  | FetchEventAttendanceRequestAction
  | FetchEventAttendanceSuccessAction
  | FetchEventAttendanceFailureAction
  | CheckInRequestAction
  | CheckInSuccessAction
  | CheckInFailureAction
  | CheckOutRequestAction
  | CheckOutSuccessAction
  | CheckOutFailureAction
  | BulkCheckInRequestAction
  | BulkCheckInSuccessAction
  | BulkCheckInFailureAction
  | RecordAttendanceRequestAction
  | RecordAttendanceSuccessAction
  | RecordAttendanceFailureAction
  | DeleteAttendanceRequestAction
  | DeleteAttendanceSuccessAction
  | DeleteAttendanceFailureAction
  | GenerateQRCodeRequestAction
  | GenerateQRCodeSuccessAction
  | GenerateQRCodeFailureAction
  | ClearAttendanceErrorAction
  | ResetAttendanceOperationAction
  | ResetAttendanceStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Events
export const fetchEventsRequest = (params?: GetEventsParams): FetchEventsRequestAction => ({
  type: FETCH_EVENTS_REQUEST,
  payload: params,
});

export const fetchEventsSuccess = (events: Event[]): FetchEventsSuccessAction => ({
  type: FETCH_EVENTS_SUCCESS,
  payload: events,
});

export const fetchEventsFailure = (error: string): FetchEventsFailureAction => ({
  type: FETCH_EVENTS_FAILURE,
  payload: error,
});

export const createEventRequest = (data: EventFormData): CreateEventRequestAction => ({
  type: CREATE_EVENT_REQUEST,
  payload: data,
});

export const createEventSuccess = (event: Event): CreateEventSuccessAction => ({
  type: CREATE_EVENT_SUCCESS,
  payload: event,
});

export const createEventFailure = (error: string): CreateEventFailureAction => ({
  type: CREATE_EVENT_FAILURE,
  payload: error,
});

export const setSelectedEvent = (event: Event | null): SetSelectedEventAction => ({
  type: SET_SELECTED_EVENT,
  payload: event,
});

// Fetch Event Attendance
export const fetchEventAttendanceRequest = (
  eventId: string,
  status?: string,
  attendeeType?: string
): FetchEventAttendanceRequestAction => ({
  type: FETCH_EVENT_ATTENDANCE_REQUEST,
  payload: { eventId, status, attendeeType },
});

export const fetchEventAttendanceSuccess = (
  attendance: Attendance[],
  stats: AttendanceStats
): FetchEventAttendanceSuccessAction => ({
  type: FETCH_EVENT_ATTENDANCE_SUCCESS,
  payload: { attendance, stats },
});

export const fetchEventAttendanceFailure = (error: string): FetchEventAttendanceFailureAction => ({
  type: FETCH_EVENT_ATTENDANCE_FAILURE,
  payload: error,
});

// Check-in
export const checkInRequest = (data: CheckInData): CheckInRequestAction => ({
  type: CHECK_IN_REQUEST,
  payload: data,
});

export const checkInSuccess = (attendance: Attendance): CheckInSuccessAction => ({
  type: CHECK_IN_SUCCESS,
  payload: attendance,
});

export const checkInFailure = (error: string): CheckInFailureAction => ({
  type: CHECK_IN_FAILURE,
  payload: error,
});

// Check-out
export const checkOutRequest = (
  eventId: string,
  memberId?: string,
  guestId?: string
): CheckOutRequestAction => ({
  type: CHECK_OUT_REQUEST,
  payload: { eventId, memberId, guestId },
});

export const checkOutSuccess = (
  memberId: string | undefined,
  guestId: string | undefined,
  checkOutTime: string
): CheckOutSuccessAction => ({
  type: CHECK_OUT_SUCCESS,
  payload: { memberId, guestId, checkOutTime },
});

export const checkOutFailure = (error: string): CheckOutFailureAction => ({
  type: CHECK_OUT_FAILURE,
  payload: error,
});

// Bulk Check-in
export const bulkCheckInRequest = (data: BulkCheckInData): BulkCheckInRequestAction => ({
  type: BULK_CHECK_IN_REQUEST,
  payload: data,
});

export const bulkCheckInSuccess = (
  checkedIn: number,
  duplicates: number,
  failed: number
): BulkCheckInSuccessAction => ({
  type: BULK_CHECK_IN_SUCCESS,
  payload: { checkedIn, duplicates, failed },
});

export const bulkCheckInFailure = (error: string): BulkCheckInFailureAction => ({
  type: BULK_CHECK_IN_FAILURE,
  payload: error,
});

// Record Attendance
export const recordAttendanceRequest = (
  eventId: string,
  memberId: string,
  data: RecordAttendanceData
): RecordAttendanceRequestAction => ({
  type: RECORD_ATTENDANCE_REQUEST,
  payload: { eventId, memberId, data },
});

export const recordAttendanceSuccess = (attendance: Attendance): RecordAttendanceSuccessAction => ({
  type: RECORD_ATTENDANCE_SUCCESS,
  payload: attendance,
});

export const recordAttendanceFailure = (error: string): RecordAttendanceFailureAction => ({
  type: RECORD_ATTENDANCE_FAILURE,
  payload: error,
});

// Delete Attendance
export const deleteAttendanceRequest = (id: string): DeleteAttendanceRequestAction => ({
  type: DELETE_ATTENDANCE_REQUEST,
  payload: id,
});

export const deleteAttendanceSuccess = (id: string): DeleteAttendanceSuccessAction => ({
  type: DELETE_ATTENDANCE_SUCCESS,
  payload: id,
});

export const deleteAttendanceFailure = (error: string): DeleteAttendanceFailureAction => ({
  type: DELETE_ATTENDANCE_FAILURE,
  payload: error,
});

// QR Code
export const generateQRCodeRequest = (eventId: string): GenerateQRCodeRequestAction => ({
  type: GENERATE_QR_CODE_REQUEST,
  payload: eventId,
});

export const generateQRCodeSuccess = (data: {
  qrCode: string;
  qrCodeId: string;
  url: string;
  expiresAt: string;
}): GenerateQRCodeSuccessAction => ({
  type: GENERATE_QR_CODE_SUCCESS,
  payload: data,
});

export const generateQRCodeFailure = (error: string): GenerateQRCodeFailureAction => ({
  type: GENERATE_QR_CODE_FAILURE,
  payload: error,
});

// Clear States
export const clearAttendanceError = (): ClearAttendanceErrorAction => ({
  type: CLEAR_ATTENDANCE_ERROR,
});

export const resetAttendanceOperation = (): ResetAttendanceOperationAction => ({
  type: RESET_ATTENDANCE_OPERATION,
});

export const resetAttendanceState = (): ResetAttendanceStateAction => ({
  type: RESET_ATTENDANCE_STATE,
});