// src/redux/actions/reportActions.ts

import {
  Report,
  ReportFormData,
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
  GetReportsParams,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Dashboard Analytics
export const FETCH_DASHBOARD_ANALYTICS_REQUEST = 'reports/FETCH_DASHBOARD_REQUEST';
export const FETCH_DASHBOARD_ANALYTICS_SUCCESS = 'reports/FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_ANALYTICS_FAILURE = 'reports/FETCH_DASHBOARD_FAILURE';

// Attendance Reports
export const FETCH_ATTENDANCE_SUMMARY_REQUEST = 'reports/FETCH_ATTENDANCE_SUMMARY_REQUEST';
export const FETCH_ATTENDANCE_SUMMARY_SUCCESS = 'reports/FETCH_ATTENDANCE_SUMMARY_SUCCESS';
export const FETCH_ATTENDANCE_SUMMARY_FAILURE = 'reports/FETCH_ATTENDANCE_SUMMARY_FAILURE';

export const FETCH_ATTENDANCE_BY_EVENT_REQUEST = 'reports/FETCH_ATTENDANCE_BY_EVENT_REQUEST';
export const FETCH_ATTENDANCE_BY_EVENT_SUCCESS = 'reports/FETCH_ATTENDANCE_BY_EVENT_SUCCESS';
export const FETCH_ATTENDANCE_BY_EVENT_FAILURE = 'reports/FETCH_ATTENDANCE_BY_EVENT_FAILURE';

export const FETCH_ATTENDANCE_BY_MEMBER_REQUEST = 'reports/FETCH_ATTENDANCE_BY_MEMBER_REQUEST';
export const FETCH_ATTENDANCE_BY_MEMBER_SUCCESS = 'reports/FETCH_ATTENDANCE_BY_MEMBER_SUCCESS';
export const FETCH_ATTENDANCE_BY_MEMBER_FAILURE = 'reports/FETCH_ATTENDANCE_BY_MEMBER_FAILURE';

export const FETCH_ATTENDANCE_TRENDS_REQUEST = 'reports/FETCH_ATTENDANCE_TRENDS_REQUEST';
export const FETCH_ATTENDANCE_TRENDS_SUCCESS = 'reports/FETCH_ATTENDANCE_TRENDS_SUCCESS';
export const FETCH_ATTENDANCE_TRENDS_FAILURE = 'reports/FETCH_ATTENDANCE_TRENDS_FAILURE';

// Member Reports
export const FETCH_MEMBER_DEMOGRAPHICS_REQUEST = 'reports/FETCH_MEMBER_DEMOGRAPHICS_REQUEST';
export const FETCH_MEMBER_DEMOGRAPHICS_SUCCESS = 'reports/FETCH_MEMBER_DEMOGRAPHICS_SUCCESS';
export const FETCH_MEMBER_DEMOGRAPHICS_FAILURE = 'reports/FETCH_MEMBER_DEMOGRAPHICS_FAILURE';

export const FETCH_MEMBER_GROWTH_REQUEST = 'reports/FETCH_MEMBER_GROWTH_REQUEST';
export const FETCH_MEMBER_GROWTH_SUCCESS = 'reports/FETCH_MEMBER_GROWTH_SUCCESS';
export const FETCH_MEMBER_GROWTH_FAILURE = 'reports/FETCH_MEMBER_GROWTH_FAILURE';

export const FETCH_MEMBER_ENGAGEMENT_REQUEST = 'reports/FETCH_MEMBER_ENGAGEMENT_REQUEST';
export const FETCH_MEMBER_ENGAGEMENT_SUCCESS = 'reports/FETCH_MEMBER_ENGAGEMENT_SUCCESS';
export const FETCH_MEMBER_ENGAGEMENT_FAILURE = 'reports/FETCH_MEMBER_ENGAGEMENT_FAILURE';

// Events Summary
export const FETCH_EVENTS_SUMMARY_REQUEST = 'reports/FETCH_EVENTS_SUMMARY_REQUEST';
export const FETCH_EVENTS_SUMMARY_SUCCESS = 'reports/FETCH_EVENTS_SUMMARY_SUCCESS';
export const FETCH_EVENTS_SUMMARY_FAILURE = 'reports/FETCH_EVENTS_SUMMARY_FAILURE';

// Saved Reports CRUD
export const FETCH_REPORTS_REQUEST = 'reports/FETCH_REPORTS_REQUEST';
export const FETCH_REPORTS_SUCCESS = 'reports/FETCH_REPORTS_SUCCESS';
export const FETCH_REPORTS_FAILURE = 'reports/FETCH_REPORTS_FAILURE';

export const CREATE_REPORT_REQUEST = 'reports/CREATE_REPORT_REQUEST';
export const CREATE_REPORT_SUCCESS = 'reports/CREATE_REPORT_SUCCESS';
export const CREATE_REPORT_FAILURE = 'reports/CREATE_REPORT_FAILURE';

export const UPDATE_REPORT_REQUEST = 'reports/UPDATE_REPORT_REQUEST';
export const UPDATE_REPORT_SUCCESS = 'reports/UPDATE_REPORT_SUCCESS';
export const UPDATE_REPORT_FAILURE = 'reports/UPDATE_REPORT_FAILURE';

export const DELETE_REPORT_REQUEST = 'reports/DELETE_REPORT_REQUEST';
export const DELETE_REPORT_SUCCESS = 'reports/DELETE_REPORT_SUCCESS';
export const DELETE_REPORT_FAILURE = 'reports/DELETE_REPORT_FAILURE';

// Generate Report
export const GENERATE_REPORT_REQUEST = 'reports/GENERATE_REPORT_REQUEST';
export const GENERATE_REPORT_SUCCESS = 'reports/GENERATE_REPORT_SUCCESS';
export const GENERATE_REPORT_FAILURE = 'reports/GENERATE_REPORT_FAILURE';

// Export Report
export const EXPORT_REPORT_REQUEST = 'reports/EXPORT_REPORT_REQUEST';
export const EXPORT_REPORT_SUCCESS = 'reports/EXPORT_REPORT_SUCCESS';
export const EXPORT_REPORT_FAILURE = 'reports/EXPORT_REPORT_FAILURE';

// Report History
export const FETCH_REPORT_HISTORY_REQUEST = 'reports/FETCH_HISTORY_REQUEST';
export const FETCH_REPORT_HISTORY_SUCCESS = 'reports/FETCH_HISTORY_SUCCESS';
export const FETCH_REPORT_HISTORY_FAILURE = 'reports/FETCH_HISTORY_FAILURE';

// Clear States
export const SET_ACTIVE_REPORT_TAB = 'reports/SET_ACTIVE_TAB';
export const SET_DATE_RANGE = 'reports/SET_DATE_RANGE';
export const CLEAR_REPORT_ERROR = 'reports/CLEAR_ERROR';
export const RESET_REPORT_OPERATION = 'reports/RESET_OPERATION';
export const RESET_REPORT_STATE = 'reports/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Dashboard Analytics
interface FetchDashboardAnalyticsRequestAction {
  type: typeof FETCH_DASHBOARD_ANALYTICS_REQUEST;
}

interface FetchDashboardAnalyticsSuccessAction {
  type: typeof FETCH_DASHBOARD_ANALYTICS_SUCCESS;
  payload: DashboardAnalytics;
}

interface FetchDashboardAnalyticsFailureAction {
  type: typeof FETCH_DASHBOARD_ANALYTICS_FAILURE;
  payload: string;
}

// Attendance Summary
interface FetchAttendanceSummaryRequestAction {
  type: typeof FETCH_ATTENDANCE_SUMMARY_REQUEST;
  payload: { startDate: string; endDate: string; eventId?: string };
}

interface FetchAttendanceSummarySuccessAction {
  type: typeof FETCH_ATTENDANCE_SUMMARY_SUCCESS;
  payload: AttendanceSummary;
}

interface FetchAttendanceSummaryFailureAction {
  type: typeof FETCH_ATTENDANCE_SUMMARY_FAILURE;
  payload: string;
}

// Attendance By Event
interface FetchAttendanceByEventRequestAction {
  type: typeof FETCH_ATTENDANCE_BY_EVENT_REQUEST;
  payload: { startDate: string; endDate: string };
}

interface FetchAttendanceByEventSuccessAction {
  type: typeof FETCH_ATTENDANCE_BY_EVENT_SUCCESS;
  payload: AttendanceByEvent;
}

interface FetchAttendanceByEventFailureAction {
  type: typeof FETCH_ATTENDANCE_BY_EVENT_FAILURE;
  payload: string;
}

// Attendance By Member
interface FetchAttendanceByMemberRequestAction {
  type: typeof FETCH_ATTENDANCE_BY_MEMBER_REQUEST;
  payload: { startDate: string; endDate: string; memberId?: string; minAttendance?: number };
}

interface FetchAttendanceByMemberSuccessAction {
  type: typeof FETCH_ATTENDANCE_BY_MEMBER_SUCCESS;
  payload: AttendanceByMember;
}

interface FetchAttendanceByMemberFailureAction {
  type: typeof FETCH_ATTENDANCE_BY_MEMBER_FAILURE;
  payload: string;
}

// Attendance Trends
interface FetchAttendanceTrendsRequestAction {
  type: typeof FETCH_ATTENDANCE_TRENDS_REQUEST;
  payload?: { period?: string; startDate?: string; endDate?: string };
}

interface FetchAttendanceTrendsSuccessAction {
  type: typeof FETCH_ATTENDANCE_TRENDS_SUCCESS;
  payload: AttendanceTrends;
}

interface FetchAttendanceTrendsFailureAction {
  type: typeof FETCH_ATTENDANCE_TRENDS_FAILURE;
  payload: string;
}

// Member Demographics
interface FetchMemberDemographicsRequestAction {
  type: typeof FETCH_MEMBER_DEMOGRAPHICS_REQUEST;
}

interface FetchMemberDemographicsSuccessAction {
  type: typeof FETCH_MEMBER_DEMOGRAPHICS_SUCCESS;
  payload: MemberDemographics;
}

interface FetchMemberDemographicsFailureAction {
  type: typeof FETCH_MEMBER_DEMOGRAPHICS_FAILURE;
  payload: string;
}

// Member Growth
interface FetchMemberGrowthRequestAction {
  type: typeof FETCH_MEMBER_GROWTH_REQUEST;
  payload?: { startDate?: string; endDate?: string };
}

interface FetchMemberGrowthSuccessAction {
  type: typeof FETCH_MEMBER_GROWTH_SUCCESS;
  payload: MemberGrowth;
}

interface FetchMemberGrowthFailureAction {
  type: typeof FETCH_MEMBER_GROWTH_FAILURE;
  payload: string;
}

// Member Engagement
interface FetchMemberEngagementRequestAction {
  type: typeof FETCH_MEMBER_ENGAGEMENT_REQUEST;
  payload?: { startDate?: string; endDate?: string };
}

interface FetchMemberEngagementSuccessAction {
  type: typeof FETCH_MEMBER_ENGAGEMENT_SUCCESS;
  payload: MemberEngagement;
}

interface FetchMemberEngagementFailureAction {
  type: typeof FETCH_MEMBER_ENGAGEMENT_FAILURE;
  payload: string;
}

// Events Summary
interface FetchEventsSummaryRequestAction {
  type: typeof FETCH_EVENTS_SUMMARY_REQUEST;
  payload: { startDate: string; endDate: string };
}

interface FetchEventsSummarySuccessAction {
  type: typeof FETCH_EVENTS_SUMMARY_SUCCESS;
  payload: EventsSummary;
}

interface FetchEventsSummaryFailureAction {
  type: typeof FETCH_EVENTS_SUMMARY_FAILURE;
  payload: string;
}

// Saved Reports
interface FetchReportsRequestAction {
  type: typeof FETCH_REPORTS_REQUEST;
  payload?: GetReportsParams;
}

interface FetchReportsSuccessAction {
  type: typeof FETCH_REPORTS_SUCCESS;
  payload: { reports: Report[]; pagination: PaginationInfo };
}

interface FetchReportsFailureAction {
  type: typeof FETCH_REPORTS_FAILURE;
  payload: string;
}

interface CreateReportRequestAction {
  type: typeof CREATE_REPORT_REQUEST;
  payload: ReportFormData;
}

interface CreateReportSuccessAction {
  type: typeof CREATE_REPORT_SUCCESS;
  payload: Report;
}

interface CreateReportFailureAction {
  type: typeof CREATE_REPORT_FAILURE;
  payload: string;
}

interface UpdateReportRequestAction {
  type: typeof UPDATE_REPORT_REQUEST;
  payload: { id: string; data: Partial<ReportFormData> };
}

interface UpdateReportSuccessAction {
  type: typeof UPDATE_REPORT_SUCCESS;
  payload: Report;
}

interface UpdateReportFailureAction {
  type: typeof UPDATE_REPORT_FAILURE;
  payload: string;
}

interface DeleteReportRequestAction {
  type: typeof DELETE_REPORT_REQUEST;
  payload: string;
}

interface DeleteReportSuccessAction {
  type: typeof DELETE_REPORT_SUCCESS;
  payload: string;
}

interface DeleteReportFailureAction {
  type: typeof DELETE_REPORT_FAILURE;
  payload: string;
}

// Generate Report
interface GenerateReportRequestAction {
  type: typeof GENERATE_REPORT_REQUEST;
  payload: { id: string; format?: string; parameters?: Record<string, any> };
}

interface GenerateReportSuccessAction {
  type: typeof GENERATE_REPORT_SUCCESS;
  payload: { report: any; historyId: string; downloadUrl?: string };
}

interface GenerateReportFailureAction {
  type: typeof GENERATE_REPORT_FAILURE;
  payload: string;
}

// Export Report
interface ExportReportRequestAction {
  type: typeof EXPORT_REPORT_REQUEST;
  payload: { reportType: string; format: string; parameters?: Record<string, any> };
}

interface ExportReportSuccessAction {
  type: typeof EXPORT_REPORT_SUCCESS;
  payload: any;
}

interface ExportReportFailureAction {
  type: typeof EXPORT_REPORT_FAILURE;
  payload: string;
}

// Report History
interface FetchReportHistoryRequestAction {
  type: typeof FETCH_REPORT_HISTORY_REQUEST;
  payload: { id: string; page?: number; limit?: number };
}

interface FetchReportHistorySuccessAction {
  type: typeof FETCH_REPORT_HISTORY_SUCCESS;
  payload: ReportHistory[];
}

interface FetchReportHistoryFailureAction {
  type: typeof FETCH_REPORT_HISTORY_FAILURE;
  payload: string;
}

// Clear States
interface SetActiveReportTabAction {
  type: typeof SET_ACTIVE_REPORT_TAB;
  payload: string;
}

interface SetDateRangeAction {
  type: typeof SET_DATE_RANGE;
  payload: { startDate: string; endDate: string };
}

interface ClearReportErrorAction {
  type: typeof CLEAR_REPORT_ERROR;
}

interface ResetReportOperationAction {
  type: typeof RESET_REPORT_OPERATION;
}

interface ResetReportStateAction {
  type: typeof RESET_REPORT_STATE;
}

// Union type
export type ReportActionTypes =
  | FetchDashboardAnalyticsRequestAction
  | FetchDashboardAnalyticsSuccessAction
  | FetchDashboardAnalyticsFailureAction
  | FetchAttendanceSummaryRequestAction
  | FetchAttendanceSummarySuccessAction
  | FetchAttendanceSummaryFailureAction
  | FetchAttendanceByEventRequestAction
  | FetchAttendanceByEventSuccessAction
  | FetchAttendanceByEventFailureAction
  | FetchAttendanceByMemberRequestAction
  | FetchAttendanceByMemberSuccessAction
  | FetchAttendanceByMemberFailureAction
  | FetchAttendanceTrendsRequestAction
  | FetchAttendanceTrendsSuccessAction
  | FetchAttendanceTrendsFailureAction
  | FetchMemberDemographicsRequestAction
  | FetchMemberDemographicsSuccessAction
  | FetchMemberDemographicsFailureAction
  | FetchMemberGrowthRequestAction
  | FetchMemberGrowthSuccessAction
  | FetchMemberGrowthFailureAction
  | FetchMemberEngagementRequestAction
  | FetchMemberEngagementSuccessAction
  | FetchMemberEngagementFailureAction
  | FetchEventsSummaryRequestAction
  | FetchEventsSummarySuccessAction
  | FetchEventsSummaryFailureAction
  | FetchReportsRequestAction
  | FetchReportsSuccessAction
  | FetchReportsFailureAction
  | CreateReportRequestAction
  | CreateReportSuccessAction
  | CreateReportFailureAction
  | UpdateReportRequestAction
  | UpdateReportSuccessAction
  | UpdateReportFailureAction
  | DeleteReportRequestAction
  | DeleteReportSuccessAction
  | DeleteReportFailureAction
  | GenerateReportRequestAction
  | GenerateReportSuccessAction
  | GenerateReportFailureAction
  | ExportReportRequestAction
  | ExportReportSuccessAction
  | ExportReportFailureAction
  | FetchReportHistoryRequestAction
  | FetchReportHistorySuccessAction
  | FetchReportHistoryFailureAction
  | SetActiveReportTabAction
  | SetDateRangeAction
  | ClearReportErrorAction
  | ResetReportOperationAction
  | ResetReportStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Dashboard Analytics
export const fetchDashboardAnalyticsRequest = (): FetchDashboardAnalyticsRequestAction => ({
  type: FETCH_DASHBOARD_ANALYTICS_REQUEST,
});

export const fetchDashboardAnalyticsSuccess = (
  data: DashboardAnalytics
): FetchDashboardAnalyticsSuccessAction => ({
  type: FETCH_DASHBOARD_ANALYTICS_SUCCESS,
  payload: data,
});

export const fetchDashboardAnalyticsFailure = (
  error: string
): FetchDashboardAnalyticsFailureAction => ({
  type: FETCH_DASHBOARD_ANALYTICS_FAILURE,
  payload: error,
});

// Attendance Summary
export const fetchAttendanceSummaryRequest = (
  startDate: string,
  endDate: string,
  eventId?: string
): FetchAttendanceSummaryRequestAction => ({
  type: FETCH_ATTENDANCE_SUMMARY_REQUEST,
  payload: { startDate, endDate, eventId },
});

export const fetchAttendanceSummarySuccess = (
  data: AttendanceSummary
): FetchAttendanceSummarySuccessAction => ({
  type: FETCH_ATTENDANCE_SUMMARY_SUCCESS,
  payload: data,
});

export const fetchAttendanceSummaryFailure = (
  error: string
): FetchAttendanceSummaryFailureAction => ({
  type: FETCH_ATTENDANCE_SUMMARY_FAILURE,
  payload: error,
});

// Attendance By Event
export const fetchAttendanceByEventRequest = (
  startDate: string,
  endDate: string
): FetchAttendanceByEventRequestAction => ({
  type: FETCH_ATTENDANCE_BY_EVENT_REQUEST,
  payload: { startDate, endDate },
});

export const fetchAttendanceByEventSuccess = (
  data: AttendanceByEvent
): FetchAttendanceByEventSuccessAction => ({
  type: FETCH_ATTENDANCE_BY_EVENT_SUCCESS,
  payload: data,
});

export const fetchAttendanceByEventFailure = (
  error: string
): FetchAttendanceByEventFailureAction => ({
  type: FETCH_ATTENDANCE_BY_EVENT_FAILURE,
  payload: error,
});

// Attendance By Member
export const fetchAttendanceByMemberRequest = (
  startDate: string,
  endDate: string,
  memberId?: string,
  minAttendance?: number
): FetchAttendanceByMemberRequestAction => ({
  type: FETCH_ATTENDANCE_BY_MEMBER_REQUEST,
  payload: { startDate, endDate, memberId, minAttendance },
});

export const fetchAttendanceByMemberSuccess = (
  data: AttendanceByMember
): FetchAttendanceByMemberSuccessAction => ({
  type: FETCH_ATTENDANCE_BY_MEMBER_SUCCESS,
  payload: data,
});

export const fetchAttendanceByMemberFailure = (
  error: string
): FetchAttendanceByMemberFailureAction => ({
  type: FETCH_ATTENDANCE_BY_MEMBER_FAILURE,
  payload: error,
});

// Attendance Trends
export const fetchAttendanceTrendsRequest = (
  period?: string,
  startDate?: string,
  endDate?: string
): FetchAttendanceTrendsRequestAction => ({
  type: FETCH_ATTENDANCE_TRENDS_REQUEST,
  payload: { period, startDate, endDate },
});

export const fetchAttendanceTrendsSuccess = (
  data: AttendanceTrends
): FetchAttendanceTrendsSuccessAction => ({
  type: FETCH_ATTENDANCE_TRENDS_SUCCESS,
  payload: data,
});

export const fetchAttendanceTrendsFailure = (
  error: string
): FetchAttendanceTrendsFailureAction => ({
  type: FETCH_ATTENDANCE_TRENDS_FAILURE,
  payload: error,
});

// Member Demographics
export const fetchMemberDemographicsRequest = (): FetchMemberDemographicsRequestAction => ({
  type: FETCH_MEMBER_DEMOGRAPHICS_REQUEST,
});

export const fetchMemberDemographicsSuccess = (
  data: MemberDemographics
): FetchMemberDemographicsSuccessAction => ({
  type: FETCH_MEMBER_DEMOGRAPHICS_SUCCESS,
  payload: data,
});

export const fetchMemberDemographicsFailure = (
  error: string
): FetchMemberDemographicsFailureAction => ({
  type: FETCH_MEMBER_DEMOGRAPHICS_FAILURE,
  payload: error,
});

// Member Growth
export const fetchMemberGrowthRequest = (
  startDate?: string,
  endDate?: string
): FetchMemberGrowthRequestAction => ({
  type: FETCH_MEMBER_GROWTH_REQUEST,
  payload: { startDate, endDate },
});

export const fetchMemberGrowthSuccess = (
  data: MemberGrowth
): FetchMemberGrowthSuccessAction => ({
  type: FETCH_MEMBER_GROWTH_SUCCESS,
  payload: data,
});

export const fetchMemberGrowthFailure = (
  error: string
): FetchMemberGrowthFailureAction => ({
  type: FETCH_MEMBER_GROWTH_FAILURE,
  payload: error,
});

// Member Engagement
export const fetchMemberEngagementRequest = (
  startDate?: string,
  endDate?: string
): FetchMemberEngagementRequestAction => ({
  type: FETCH_MEMBER_ENGAGEMENT_REQUEST,
  payload: { startDate, endDate },
});

export const fetchMemberEngagementSuccess = (
  data: MemberEngagement
): FetchMemberEngagementSuccessAction => ({
  type: FETCH_MEMBER_ENGAGEMENT_SUCCESS,
  payload: data,
});

export const fetchMemberEngagementFailure = (
  error: string
): FetchMemberEngagementFailureAction => ({
  type: FETCH_MEMBER_ENGAGEMENT_FAILURE,
  payload: error,
});

// Events Summary
export const fetchEventsSummaryRequest = (
  startDate: string,
  endDate: string
): FetchEventsSummaryRequestAction => ({
  type: FETCH_EVENTS_SUMMARY_REQUEST,
  payload: { startDate, endDate },
});

export const fetchEventsSummarySuccess = (
  data: EventsSummary
): FetchEventsSummarySuccessAction => ({
  type: FETCH_EVENTS_SUMMARY_SUCCESS,
  payload: data,
});

export const fetchEventsSummaryFailure = (
  error: string
): FetchEventsSummaryFailureAction => ({
  type: FETCH_EVENTS_SUMMARY_FAILURE,
  payload: error,
});

// Saved Reports
export const fetchReportsRequest = (params?: GetReportsParams): FetchReportsRequestAction => ({
  type: FETCH_REPORTS_REQUEST,
  payload: params,
});

export const fetchReportsSuccess = (
  reports: Report[],
  pagination: PaginationInfo
): FetchReportsSuccessAction => ({
  type: FETCH_REPORTS_SUCCESS,
  payload: { reports, pagination },
});

export const fetchReportsFailure = (error: string): FetchReportsFailureAction => ({
  type: FETCH_REPORTS_FAILURE,
  payload: error,
});

export const createReportRequest = (data: ReportFormData): CreateReportRequestAction => ({
  type: CREATE_REPORT_REQUEST,
  payload: data,
});

export const createReportSuccess = (report: Report): CreateReportSuccessAction => ({
  type: CREATE_REPORT_SUCCESS,
  payload: report,
});

export const createReportFailure = (error: string): CreateReportFailureAction => ({
  type: CREATE_REPORT_FAILURE,
  payload: error,
});

export const updateReportRequest = (
  id: string,
  data: Partial<ReportFormData>
): UpdateReportRequestAction => ({
  type: UPDATE_REPORT_REQUEST,
  payload: { id, data },
});

export const updateReportSuccess = (report: Report): UpdateReportSuccessAction => ({
  type: UPDATE_REPORT_SUCCESS,
  payload: report,
});

export const updateReportFailure = (error: string): UpdateReportFailureAction => ({
  type: UPDATE_REPORT_FAILURE,
  payload: error,
});

export const deleteReportRequest = (id: string): DeleteReportRequestAction => ({
  type: DELETE_REPORT_REQUEST,
  payload: id,
});

export const deleteReportSuccess = (id: string): DeleteReportSuccessAction => ({
  type: DELETE_REPORT_SUCCESS,
  payload: id,
});

export const deleteReportFailure = (error: string): DeleteReportFailureAction => ({
  type: DELETE_REPORT_FAILURE,
  payload: error,
});

// Generate Report
export const generateReportRequest = (
  id: string,
  format?: string,
  parameters?: Record<string, any>
): GenerateReportRequestAction => ({
  type: GENERATE_REPORT_REQUEST,
  payload: { id, format, parameters },
});

export const generateReportSuccess = (data: {
  report: any;
  historyId: string;
  downloadUrl?: string;
}): GenerateReportSuccessAction => ({
  type: GENERATE_REPORT_SUCCESS,
  payload: data,
});

export const generateReportFailure = (error: string): GenerateReportFailureAction => ({
  type: GENERATE_REPORT_FAILURE,
  payload: error,
});

// Export Report
export const exportReportRequest = (
  reportType: string,
  format: string,
  parameters?: Record<string, any>
): ExportReportRequestAction => ({
  type: EXPORT_REPORT_REQUEST,
  payload: { reportType, format, parameters },
});

export const exportReportSuccess = (data: any): ExportReportSuccessAction => ({
  type: EXPORT_REPORT_SUCCESS,
  payload: data,
});

export const exportReportFailure = (error: string): ExportReportFailureAction => ({
  type: EXPORT_REPORT_FAILURE,
  payload: error,
});

// Report History
export const fetchReportHistoryRequest = (
  id: string,
  page?: number,
  limit?: number
): FetchReportHistoryRequestAction => ({
  type: FETCH_REPORT_HISTORY_REQUEST,
  payload: { id, page, limit },
});

export const fetchReportHistorySuccess = (
  history: ReportHistory[]
): FetchReportHistorySuccessAction => ({
  type: FETCH_REPORT_HISTORY_SUCCESS,
  payload: history,
});

export const fetchReportHistoryFailure = (error: string): FetchReportHistoryFailureAction => ({
  type: FETCH_REPORT_HISTORY_FAILURE,
  payload: error,
});

// Clear States
export const setActiveReportTab = (tab: string): SetActiveReportTabAction => ({
  type: SET_ACTIVE_REPORT_TAB,
  payload: tab,
});

export const setDateRange = (
  startDate: string,
  endDate: string
): SetDateRangeAction => ({
  type: SET_DATE_RANGE,
  payload: { startDate, endDate },
});

export const clearReportError = (): ClearReportErrorAction => ({
  type: CLEAR_REPORT_ERROR,
});

export const resetReportOperation = (): ResetReportOperationAction => ({
  type: RESET_REPORT_OPERATION,
});

export const resetReportState = (): ResetReportStateAction => ({
  type: RESET_REPORT_STATE,
});