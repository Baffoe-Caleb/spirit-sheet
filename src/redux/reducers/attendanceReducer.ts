// src/redux/reducers/attendanceReducer.ts

import { Attendance, AttendanceStats, Event } from '../../services/api';
import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  CREATE_EVENT_FAILURE,
  SET_SELECTED_EVENT,
  FETCH_EVENT_ATTENDANCE_REQUEST,
  FETCH_EVENT_ATTENDANCE_SUCCESS,
  FETCH_EVENT_ATTENDANCE_FAILURE,
  CHECK_IN_REQUEST,
  CHECK_IN_SUCCESS,
  CHECK_IN_FAILURE,
  CHECK_OUT_REQUEST,
  CHECK_OUT_SUCCESS,
  CHECK_OUT_FAILURE,
  BULK_CHECK_IN_REQUEST,
  BULK_CHECK_IN_SUCCESS,
  BULK_CHECK_IN_FAILURE,
  RECORD_ATTENDANCE_REQUEST,
  RECORD_ATTENDANCE_SUCCESS,
  RECORD_ATTENDANCE_FAILURE,
  DELETE_ATTENDANCE_REQUEST,
  DELETE_ATTENDANCE_SUCCESS,
  DELETE_ATTENDANCE_FAILURE,
  GENERATE_QR_CODE_REQUEST,
  GENERATE_QR_CODE_SUCCESS,
  GENERATE_QR_CODE_FAILURE,
  CLEAR_ATTENDANCE_ERROR,
  RESET_ATTENDANCE_OPERATION,
  RESET_ATTENDANCE_STATE,
  AttendanceActionTypes,
} from '../actions/attendanceActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface AttendanceState {
  // Events
  events: Event[];
  selectedEvent: Event | null;
  isLoadingEvents: boolean;
  isCreatingEvent: boolean;
  createEventSuccess: boolean;
  createEventError: string | null;

  // Attendance
  attendance: Attendance[];
  stats: AttendanceStats | null;
  isLoadingAttendance: boolean;

  // Check-in/out
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  isBulkCheckingIn: boolean;
  checkInSuccess: boolean;
  checkOutSuccess: boolean;
  bulkCheckInSuccess: boolean;
  bulkCheckInResult: { checkedIn: number; duplicates: number; failed: number } | null;

  // Record/Delete
  isRecording: boolean;
  isDeleting: boolean;
  recordSuccess: boolean;
  deleteSuccess: boolean;

  // QR Code
  qrCode: { qrCode: string; qrCodeId: string; url: string; expiresAt: string } | null;
  isGeneratingQR: boolean;

  // Errors
  error: string | null;
  checkInError: string | null;
  checkOutError: string | null;
  bulkCheckInError: string | null;
  recordError: string | null;
  deleteError: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AttendanceState = {
  events: [],
  selectedEvent: null,
  isLoadingEvents: false,
  isCreatingEvent: false,
  createEventSuccess: false,
  createEventError: null,

  attendance: [],
  stats: null,
  isLoadingAttendance: false,

  isCheckingIn: false,
  isCheckingOut: false,
  isBulkCheckingIn: false,
  checkInSuccess: false,
  checkOutSuccess: false,
  bulkCheckInSuccess: false,
  bulkCheckInResult: null,

  isRecording: false,
  isDeleting: false,
  recordSuccess: false,
  deleteSuccess: false,

  qrCode: null,
  isGeneratingQR: false,

  error: null,
  checkInError: null,
  checkOutError: null,
  bulkCheckInError: null,
  recordError: null,
  deleteError: null,
};

// ============================================
// REDUCER
// ============================================

const attendanceReducer = (
  state = initialState,
  action: AttendanceActionTypes
): AttendanceState => {
  switch (action.type) {
    // ============================================
    // EVENTS
    // ============================================
    case FETCH_EVENTS_REQUEST:
      return {
        ...state,
        isLoadingEvents: true,
        error: null,
      };

    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        isLoadingEvents: false,
        events: action.payload,
        error: null,
      };

    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        isLoadingEvents: false,
        error: action.payload,
      };

    case CREATE_EVENT_REQUEST:
      return {
        ...state,
        isCreatingEvent: true,
        createEventSuccess: false,
        createEventError: null,
      };

    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        isCreatingEvent: false,
        events: [action.payload, ...state.events],
        selectedEvent: action.payload,
        createEventSuccess: true,
        createEventError: null,
      };

    case CREATE_EVENT_FAILURE:
      return {
        ...state,
        isCreatingEvent: false,
        createEventSuccess: false,
        createEventError: action.payload,
      };

    case SET_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: action.payload,
        attendance: [],
        stats: null,
      };

    // ============================================
    // FETCH EVENT ATTENDANCE
    // ============================================
    case FETCH_EVENT_ATTENDANCE_REQUEST:
      return {
        ...state,
        isLoadingAttendance: true,
        error: null,
      };

    case FETCH_EVENT_ATTENDANCE_SUCCESS:
      return {
        ...state,
        isLoadingAttendance: false,
        attendance: action.payload.attendance,
        stats: action.payload.stats,
        error: null,
      };

    case FETCH_EVENT_ATTENDANCE_FAILURE:
      return {
        ...state,
        isLoadingAttendance: false,
        error: action.payload,
      };

    // ============================================
    // CHECK-IN
    // ============================================
    case CHECK_IN_REQUEST:
      return {
        ...state,
        isCheckingIn: true,
        checkInSuccess: false,
        checkInError: null,
      };

    case CHECK_IN_SUCCESS:
      return {
        ...state,
        isCheckingIn: false,
        attendance: [...state.attendance, action.payload],
        checkInSuccess: true,
        checkInError: null,
        stats: state.stats
          ? {
            ...state.stats,
            total: state.stats.total + 1,
            present: state.stats.present + 1,
            [action.payload.attendeeType === 'member' ? 'members' : 'guests']:
              state.stats[action.payload.attendeeType === 'member' ? 'members' : 'guests'] + 1,
          }
          : null,
      };

    case CHECK_IN_FAILURE:
      return {
        ...state,
        isCheckingIn: false,
        checkInSuccess: false,
        checkInError: action.payload,
      };

    // ============================================
    // CHECK-OUT
    // ============================================
    case CHECK_OUT_REQUEST:
      return {
        ...state,
        isCheckingOut: true,
        checkOutSuccess: false,
        checkOutError: null,
      };

    case CHECK_OUT_SUCCESS:
      return {
        ...state,
        isCheckingOut: false,
        attendance: state.attendance.map((a) => {
          const matchesMember = action.payload.memberId && a.memberId === action.payload.memberId;
          const matchesGuest = action.payload.guestId && a.guestId === action.payload.guestId;
          if (matchesMember || matchesGuest) {
            return { ...a, checkOutTime: action.payload.checkOutTime };
          }
          return a;
        }),
        checkOutSuccess: true,
        checkOutError: null,
      };

    case CHECK_OUT_FAILURE:
      return {
        ...state,
        isCheckingOut: false,
        checkOutSuccess: false,
        checkOutError: action.payload,
      };

    // ============================================
    // BULK CHECK-IN
    // ============================================
    case BULK_CHECK_IN_REQUEST:
      return {
        ...state,
        isBulkCheckingIn: true,
        bulkCheckInSuccess: false,
        bulkCheckInResult: null,
        bulkCheckInError: null,
      };

    case BULK_CHECK_IN_SUCCESS:
      return {
        ...state,
        isBulkCheckingIn: false,
        bulkCheckInSuccess: true,
        bulkCheckInResult: action.payload,
        bulkCheckInError: null,
      };

    case BULK_CHECK_IN_FAILURE:
      return {
        ...state,
        isBulkCheckingIn: false,
        bulkCheckInSuccess: false,
        bulkCheckInError: action.payload,
      };

    // ============================================
    // RECORD ATTENDANCE
    // ============================================
    case RECORD_ATTENDANCE_REQUEST:
      return {
        ...state,
        isRecording: true,
        recordSuccess: false,
        recordError: null,
      };

    case RECORD_ATTENDANCE_SUCCESS: {
      const existingIndex = state.attendance.findIndex(
        (a) => a._id === action.payload._id
      );
      let newAttendance;
      if (existingIndex >= 0) {
        newAttendance = [...state.attendance];
        newAttendance[existingIndex] = action.payload;
      } else {
        newAttendance = [...state.attendance, action.payload];
      }
      return {
        ...state,
        isRecording: false,
        attendance: newAttendance,
        recordSuccess: true,
        recordError: null,
      };
    }

    case RECORD_ATTENDANCE_FAILURE:
      return {
        ...state,
        isRecording: false,
        recordSuccess: false,
        recordError: action.payload,
      };

    // ============================================
    // DELETE ATTENDANCE
    // ============================================
    case DELETE_ATTENDANCE_REQUEST:
      return {
        ...state,
        isDeleting: true,
        deleteSuccess: false,
        deleteError: null,
      };

    case DELETE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        attendance: state.attendance.filter((a) => a._id !== action.payload),
        deleteSuccess: true,
        deleteError: null,
      };

    case DELETE_ATTENDANCE_FAILURE:
      return {
        ...state,
        isDeleting: false,
        deleteSuccess: false,
        deleteError: action.payload,
      };

    // ============================================
    // QR CODE
    // ============================================
    case GENERATE_QR_CODE_REQUEST:
      return {
        ...state,
        isGeneratingQR: true,
        qrCode: null,
      };

    case GENERATE_QR_CODE_SUCCESS:
      return {
        ...state,
        isGeneratingQR: false,
        qrCode: action.payload,
      };

    case GENERATE_QR_CODE_FAILURE:
      return {
        ...state,
        isGeneratingQR: false,
        error: action.payload,
      };

    // ============================================
    // CLEAR STATES
    // ============================================
    case CLEAR_ATTENDANCE_ERROR:
      return {
        ...state,
        error: null,
        checkInError: null,
        checkOutError: null,
        bulkCheckInError: null,
        recordError: null,
        deleteError: null,
        createEventError: null,
      };

    case RESET_ATTENDANCE_OPERATION:
      return {
        ...state,
        isCheckingIn: false,
        isCheckingOut: false,
        isBulkCheckingIn: false,
        isRecording: false,
        isDeleting: false,
        isCreatingEvent: false,
        checkInSuccess: false,
        checkOutSuccess: false,
        bulkCheckInSuccess: false,
        recordSuccess: false,
        deleteSuccess: false,
        createEventSuccess: false,
        bulkCheckInResult: null,
        checkInError: null,
        checkOutError: null,
        bulkCheckInError: null,
        recordError: null,
        deleteError: null,
        createEventError: null,
      };

    case RESET_ATTENDANCE_STATE:
      return initialState;

    default:
      return state;
  }
};

export default attendanceReducer;