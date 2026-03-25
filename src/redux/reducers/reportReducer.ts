// src/redux/reducers/reportReducer.ts

import {
  Report,
  ReportHistory,
  DashboardAnalytics,
  AttendanceSummary,
  AttendanceByEvent,
  AttendanceByMember,
  AttendanceTrends,
  MemberDemographics,
  MemberGrowth,
  MemberEngagement,
  EventsSummary,
  PaginationInfo,
} from '../../services/api';
import {
  FETCH_DASHBOARD_ANALYTICS_REQUEST,
  FETCH_DASHBOARD_ANALYTICS_SUCCESS,
  FETCH_DASHBOARD_ANALYTICS_FAILURE,
  FETCH_ATTENDANCE_SUMMARY_REQUEST,
  FETCH_ATTENDANCE_SUMMARY_SUCCESS,
  FETCH_ATTENDANCE_SUMMARY_FAILURE,
  FETCH_ATTENDANCE_BY_EVENT_REQUEST,
  FETCH_ATTENDANCE_BY_EVENT_SUCCESS,
  FETCH_ATTENDANCE_BY_EVENT_FAILURE,
  FETCH_ATTENDANCE_BY_MEMBER_REQUEST,
  FETCH_ATTENDANCE_BY_MEMBER_SUCCESS,
  FETCH_ATTENDANCE_BY_MEMBER_FAILURE,
  FETCH_ATTENDANCE_TRENDS_REQUEST,
  FETCH_ATTENDANCE_TRENDS_SUCCESS,
  FETCH_ATTENDANCE_TRENDS_FAILURE,
  FETCH_MEMBER_DEMOGRAPHICS_REQUEST,
  FETCH_MEMBER_DEMOGRAPHICS_SUCCESS,
  FETCH_MEMBER_DEMOGRAPHICS_FAILURE,
  FETCH_MEMBER_GROWTH_REQUEST,
  FETCH_MEMBER_GROWTH_SUCCESS,
  FETCH_MEMBER_GROWTH_FAILURE,
  FETCH_MEMBER_ENGAGEMENT_REQUEST,
  FETCH_MEMBER_ENGAGEMENT_SUCCESS,
  FETCH_MEMBER_ENGAGEMENT_FAILURE,
  FETCH_EVENTS_SUMMARY_REQUEST,
  FETCH_EVENTS_SUMMARY_SUCCESS,
  FETCH_EVENTS_SUMMARY_FAILURE,
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_FAILURE,
  UPDATE_REPORT_REQUEST,
  UPDATE_REPORT_SUCCESS,
  UPDATE_REPORT_FAILURE,
  DELETE_REPORT_REQUEST,
  DELETE_REPORT_SUCCESS,
  DELETE_REPORT_FAILURE,
  GENERATE_REPORT_REQUEST,
  GENERATE_REPORT_SUCCESS,
  GENERATE_REPORT_FAILURE,
  EXPORT_REPORT_REQUEST,
  EXPORT_REPORT_SUCCESS,
  EXPORT_REPORT_FAILURE,
  FETCH_REPORT_HISTORY_REQUEST,
  FETCH_REPORT_HISTORY_SUCCESS,
  FETCH_REPORT_HISTORY_FAILURE,
  SET_ACTIVE_REPORT_TAB,
  SET_DATE_RANGE,
  CLEAR_REPORT_ERROR,
  RESET_REPORT_OPERATION,
  RESET_REPORT_STATE,
  ReportActionTypes,
} from '../actions/reportActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface ReportState {
  // Dashboard Analytics - stores the full response
  dashboardAnalytics: DashboardAnalytics | null;
  isLoadingDashboard: boolean;

  // Attendance Reports
  attendanceSummary: AttendanceSummary | null;
  attendanceByEvent: AttendanceByEvent | null;
  attendanceByMember: AttendanceByMember | null;
  attendanceTrends: AttendanceTrends | null;
  isLoadingAttendance: boolean;

  // Member Reports
  memberDemographics: MemberDemographics | null;
  memberGrowth: MemberGrowth | null;
  memberEngagement: MemberEngagement | null;
  isLoadingMemberReports: boolean;

  // Events Summary
  eventsSummary: EventsSummary | null;
  isLoadingEvents: boolean;

  // Saved Reports
  savedReports: Report[];
  pagination: PaginationInfo | null;
  isLoadingReports: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;

  // Generate Report
  generatedReport: any | null;
  isGenerating: boolean;
  generateSuccess: boolean;

  // Export
  isExporting: boolean;
  exportSuccess: boolean;

  // Report History
  reportHistory: ReportHistory[];
  isLoadingHistory: boolean;

  // UI State
  activeTab: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };

  // Errors
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  generateError: string | null;
  exportError: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

const initialState: ReportState = {
  dashboardAnalytics: null,
  isLoadingDashboard: false,

  attendanceSummary: null,
  attendanceByEvent: null,
  attendanceByMember: null,
  attendanceTrends: null,
  isLoadingAttendance: false,

  memberDemographics: null,
  memberGrowth: null,
  memberEngagement: null,
  isLoadingMemberReports: false,

  eventsSummary: null,
  isLoadingEvents: false,

  savedReports: [],
  pagination: null,
  isLoadingReports: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,

  generatedReport: null,
  isGenerating: false,
  generateSuccess: false,

  isExporting: false,
  exportSuccess: false,

  reportHistory: [],
  isLoadingHistory: false,

  activeTab: 'overview',
  dateRange: getDefaultDateRange(),

  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  generateError: null,
  exportError: null,
};

// ============================================
// REDUCER
// ============================================

const reportReducer = (
  state = initialState,
  action: ReportActionTypes
): ReportState => {
  switch (action.type) {
    // Dashboard Analytics
    case FETCH_DASHBOARD_ANALYTICS_REQUEST:
      return {
        ...state,
        isLoadingDashboard: true,
        error: null,
      };

    case FETCH_DASHBOARD_ANALYTICS_SUCCESS:
      return {
        ...state,
        isLoadingDashboard: false,
        dashboardAnalytics: action.payload,
        error: null,
      };

    case FETCH_DASHBOARD_ANALYTICS_FAILURE:
      return {
        ...state,
        isLoadingDashboard: false,
        error: action.payload,
      };

    // Attendance Summary
    case FETCH_ATTENDANCE_SUMMARY_REQUEST:
      return { ...state, isLoadingAttendance: true, error: null };

    case FETCH_ATTENDANCE_SUMMARY_SUCCESS:
      return { ...state, isLoadingAttendance: false, attendanceSummary: action.payload, error: null };

    case FETCH_ATTENDANCE_SUMMARY_FAILURE:
      return { ...state, isLoadingAttendance: false, error: action.payload };

    // Attendance By Event
    case FETCH_ATTENDANCE_BY_EVENT_REQUEST:
      return { ...state, isLoadingAttendance: true, error: null };

    case FETCH_ATTENDANCE_BY_EVENT_SUCCESS:
      return { ...state, isLoadingAttendance: false, attendanceByEvent: action.payload, error: null };

    case FETCH_ATTENDANCE_BY_EVENT_FAILURE:
      return { ...state, isLoadingAttendance: false, error: action.payload };

    // Attendance By Member
    case FETCH_ATTENDANCE_BY_MEMBER_REQUEST:
      return { ...state, isLoadingAttendance: true, error: null };

    case FETCH_ATTENDANCE_BY_MEMBER_SUCCESS:
      return { ...state, isLoadingAttendance: false, attendanceByMember: action.payload, error: null };

    case FETCH_ATTENDANCE_BY_MEMBER_FAILURE:
      return { ...state, isLoadingAttendance: false, error: action.payload };

    // Attendance Trends
    case FETCH_ATTENDANCE_TRENDS_REQUEST:
      return { ...state, isLoadingAttendance: true, error: null };

    case FETCH_ATTENDANCE_TRENDS_SUCCESS:
      return { ...state, isLoadingAttendance: false, attendanceTrends: action.payload, error: null };

    case FETCH_ATTENDANCE_TRENDS_FAILURE:
      return { ...state, isLoadingAttendance: false, error: action.payload };

    // Member Demographics
    case FETCH_MEMBER_DEMOGRAPHICS_REQUEST:
      return { ...state, isLoadingMemberReports: true, error: null };

    case FETCH_MEMBER_DEMOGRAPHICS_SUCCESS:
      return { ...state, isLoadingMemberReports: false, memberDemographics: action.payload, error: null };

    case FETCH_MEMBER_DEMOGRAPHICS_FAILURE:
      return { ...state, isLoadingMemberReports: false, error: action.payload };

    // Member Growth
    case FETCH_MEMBER_GROWTH_REQUEST:
      return { ...state, isLoadingMemberReports: true, error: null };

    case FETCH_MEMBER_GROWTH_SUCCESS:
      return { ...state, isLoadingMemberReports: false, memberGrowth: action.payload, error: null };

    case FETCH_MEMBER_GROWTH_FAILURE:
      return { ...state, isLoadingMemberReports: false, error: action.payload };

    // Member Engagement
    case FETCH_MEMBER_ENGAGEMENT_REQUEST:
      return { ...state, isLoadingMemberReports: true, error: null };

    case FETCH_MEMBER_ENGAGEMENT_SUCCESS:
      return { ...state, isLoadingMemberReports: false, memberEngagement: action.payload, error: null };

    case FETCH_MEMBER_ENGAGEMENT_FAILURE:
      return { ...state, isLoadingMemberReports: false, error: action.payload };

    // Events Summary
    case FETCH_EVENTS_SUMMARY_REQUEST:
      return { ...state, isLoadingEvents: true, error: null };

    case FETCH_EVENTS_SUMMARY_SUCCESS:
      return { ...state, isLoadingEvents: false, eventsSummary: action.payload, error: null };

    case FETCH_EVENTS_SUMMARY_FAILURE:
      return { ...state, isLoadingEvents: false, error: action.payload };

    // Saved Reports
    case FETCH_REPORTS_REQUEST:
      return { ...state, isLoadingReports: true, error: null };

    case FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        isLoadingReports: false,
        savedReports: action.payload.reports,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_REPORTS_FAILURE:
      return { ...state, isLoadingReports: false, error: action.payload };

    case CREATE_REPORT_REQUEST:
      return { ...state, isCreating: true, createSuccess: false, createError: null };

    case CREATE_REPORT_SUCCESS:
      return {
        ...state,
        isCreating: false,
        savedReports: [action.payload, ...state.savedReports],
        createSuccess: true,
        createError: null,
      };

    case CREATE_REPORT_FAILURE:
      return { ...state, isCreating: false, createSuccess: false, createError: action.payload };

    case UPDATE_REPORT_REQUEST:
      return { ...state, isUpdating: true, updateSuccess: false, updateError: null };

    case UPDATE_REPORT_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        savedReports: state.savedReports.map((report) =>
          report._id === action.payload._id ? action.payload : report
        ),
        updateSuccess: true,
        updateError: null,
      };

    case UPDATE_REPORT_FAILURE:
      return { ...state, isUpdating: false, updateSuccess: false, updateError: action.payload };

    case DELETE_REPORT_REQUEST:
      return { ...state, isDeleting: true, deleteSuccess: false, deleteError: null };

    case DELETE_REPORT_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        savedReports: state.savedReports.filter((report) => report._id !== action.payload),
        deleteSuccess: true,
        deleteError: null,
      };

    case DELETE_REPORT_FAILURE:
      return { ...state, isDeleting: false, deleteSuccess: false, deleteError: action.payload };

    // Generate Report
    case GENERATE_REPORT_REQUEST:
      return { ...state, isGenerating: true, generateSuccess: false, generateError: null, generatedReport: null };

    case GENERATE_REPORT_SUCCESS:
      return { ...state, isGenerating: false, generatedReport: action.payload, generateSuccess: true, generateError: null };

    case GENERATE_REPORT_FAILURE:
      return { ...state, isGenerating: false, generateSuccess: false, generateError: action.payload };

    // Export Report
    case EXPORT_REPORT_REQUEST:
      return { ...state, isExporting: true, exportSuccess: false, exportError: null };

    case EXPORT_REPORT_SUCCESS:
      return { ...state, isExporting: false, exportSuccess: true, exportError: null };

    case EXPORT_REPORT_FAILURE:
      return { ...state, isExporting: false, exportSuccess: false, exportError: action.payload };

    // Report History
    case FETCH_REPORT_HISTORY_REQUEST:
      return { ...state, isLoadingHistory: true };

    case FETCH_REPORT_HISTORY_SUCCESS:
      return { ...state, isLoadingHistory: false, reportHistory: action.payload };

    case FETCH_REPORT_HISTORY_FAILURE:
      return { ...state, isLoadingHistory: false, error: action.payload };

    // UI State
    case SET_ACTIVE_REPORT_TAB:
      return { ...state, activeTab: action.payload };

    case SET_DATE_RANGE:
      return { ...state, dateRange: action.payload };

    // Clear States
    case CLEAR_REPORT_ERROR:
      return {
        ...state,
        error: null,
        createError: null,
        updateError: null,
        deleteError: null,
        generateError: null,
        exportError: null,
      };

    case RESET_REPORT_OPERATION:
      return {
        ...state,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isGenerating: false,
        isExporting: false,
        createSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
        generateSuccess: false,
        exportSuccess: false,
        createError: null,
        updateError: null,
        deleteError: null,
        generateError: null,
        exportError: null,
      };

    case RESET_REPORT_STATE:
      return initialState;

    default:
      return state;
  }
};

export default reportReducer;