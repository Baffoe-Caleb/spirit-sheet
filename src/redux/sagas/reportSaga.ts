// src/redux/sagas/reportSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  FETCH_DASHBOARD_ANALYTICS_REQUEST,
  FETCH_ATTENDANCE_SUMMARY_REQUEST,
  FETCH_ATTENDANCE_BY_EVENT_REQUEST,
  FETCH_ATTENDANCE_BY_MEMBER_REQUEST,
  FETCH_ATTENDANCE_TRENDS_REQUEST,
  FETCH_MEMBER_DEMOGRAPHICS_REQUEST,
  FETCH_MEMBER_GROWTH_REQUEST,
  FETCH_MEMBER_ENGAGEMENT_REQUEST,
  FETCH_EVENTS_SUMMARY_REQUEST,
  FETCH_REPORTS_REQUEST,
  CREATE_REPORT_REQUEST,
  UPDATE_REPORT_REQUEST,
  DELETE_REPORT_REQUEST,
  GENERATE_REPORT_REQUEST,
  EXPORT_REPORT_REQUEST,
  FETCH_REPORT_HISTORY_REQUEST,
  fetchDashboardAnalyticsSuccess,
  fetchDashboardAnalyticsFailure,
  fetchAttendanceSummarySuccess,
  fetchAttendanceSummaryFailure,
  fetchAttendanceByEventSuccess,
  fetchAttendanceByEventFailure,
  fetchAttendanceByMemberSuccess,
  fetchAttendanceByMemberFailure,
  fetchAttendanceTrendsSuccess,
  fetchAttendanceTrendsFailure,
  fetchMemberDemographicsSuccess,
  fetchMemberDemographicsFailure,
  fetchMemberGrowthSuccess,
  fetchMemberGrowthFailure,
  fetchMemberEngagementSuccess,
  fetchMemberEngagementFailure,
  fetchEventsSummarySuccess,
  fetchEventsSummaryFailure,
  fetchReportsSuccess,
  fetchReportsFailure,
  createReportSuccess,
  createReportFailure,
  updateReportSuccess,
  updateReportFailure,
  deleteReportSuccess,
  deleteReportFailure,
  generateReportSuccess,
  generateReportFailure,
  exportReportSuccess,
  exportReportFailure,
  fetchReportHistorySuccess,
  fetchReportHistoryFailure,
} from '../actions/reportActions';
import {
  GetDashboardAnalyticsResponse,
  GetAttendanceSummaryResponse,
  GetAttendanceByEventResponse,
  GetAttendanceByMemberResponse,
  GetAttendanceTrendsResponse,
  GetMemberDemographicsResponse,
  GetMemberGrowthResponse,
  GetMemberEngagementResponse,
  GetEventsSummaryResponse,
  GetReportsResponse,
  CreateReportResponse,
  GenerateReportResponse,
  GetReportHistoryResponse,
  ExportReportResponse,
  ReportFormData,
  GetReportsParams,
} from '../../services/api';

// ============================================
// DASHBOARD ANALYTICS SAGA
// ============================================
function* fetchDashboardAnalyticsSaga(): Generator<any, void, ApiResponse<GetDashboardAnalyticsResponse>> {
  try {
    const response = yield call(api.getDashboardAnalytics);

    if (response.ok && response.data?.success) {
      yield put(fetchDashboardAnalyticsSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch dashboard analytics';
      yield put(fetchDashboardAnalyticsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchDashboardAnalyticsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ATTENDANCE SUMMARY SAGA
// ============================================
function* fetchAttendanceSummarySaga(action: {
  type: string;
  payload: { startDate: string; endDate: string; eventId?: string };
}): Generator<any, void, ApiResponse<GetAttendanceSummaryResponse>> {
  try {
    const response = yield call(api.getAttendanceSummary, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchAttendanceSummarySuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch attendance summary';
      yield put(fetchAttendanceSummaryFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchAttendanceSummaryFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ATTENDANCE BY EVENT SAGA
// ============================================
function* fetchAttendanceByEventSaga(action: {
  type: string;
  payload: { startDate: string; endDate: string };
}): Generator<any, void, ApiResponse<GetAttendanceByEventResponse>> {
  try {
    const response = yield call(api.getAttendanceByEvent, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchAttendanceByEventSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch attendance by event';
      yield put(fetchAttendanceByEventFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchAttendanceByEventFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ATTENDANCE BY MEMBER SAGA
// ============================================
function* fetchAttendanceByMemberSaga(action: {
  type: string;
  payload: { startDate: string; endDate: string; memberId?: string; minAttendance?: number };
}): Generator<any, void, ApiResponse<GetAttendanceByMemberResponse>> {
  try {
    const response = yield call(api.getAttendanceByMember, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchAttendanceByMemberSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch attendance by member';
      yield put(fetchAttendanceByMemberFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchAttendanceByMemberFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ATTENDANCE TRENDS SAGA
// ============================================
function* fetchAttendanceTrendsSaga(action: {
  type: string;
  payload?: { period?: string; startDate?: string; endDate?: string };
}): Generator<any, void, ApiResponse<GetAttendanceTrendsResponse>> {
  try {
    const response = yield call(api.getAttendanceTrends, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchAttendanceTrendsSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch attendance trends';
      yield put(fetchAttendanceTrendsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchAttendanceTrendsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// MEMBER DEMOGRAPHICS SAGA
// ============================================
function* fetchMemberDemographicsSaga(): Generator<any, void, ApiResponse<GetMemberDemographicsResponse>> {
  try {
    const response = yield call(api.getMemberDemographics);

    if (response.ok && response.data?.success) {
      yield put(fetchMemberDemographicsSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch member demographics';
      yield put(fetchMemberDemographicsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchMemberDemographicsFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// MEMBER GROWTH SAGA
// ============================================
function* fetchMemberGrowthSaga(action: {
  type: string;
  payload?: { startDate?: string; endDate?: string };
}): Generator<any, void, ApiResponse<GetMemberGrowthResponse>> {
  try {
    const response = yield call(api.getMemberGrowth, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchMemberGrowthSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch member growth';
      yield put(fetchMemberGrowthFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchMemberGrowthFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// MEMBER ENGAGEMENT SAGA
// ============================================
function* fetchMemberEngagementSaga(action: {
  type: string;
  payload?: { startDate?: string; endDate?: string };
}): Generator<any, void, ApiResponse<GetMemberEngagementResponse>> {
  try {
    const response = yield call(api.getMemberEngagement, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchMemberEngagementSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch member engagement';
      yield put(fetchMemberEngagementFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchMemberEngagementFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// EVENTS SUMMARY SAGA
// ============================================
function* fetchEventsSummarySaga(action: {
  type: string;
  payload: { startDate: string; endDate: string };
}): Generator<any, void, ApiResponse<GetEventsSummaryResponse>> {
  try {
    const response = yield call(api.getEventsSummary, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchEventsSummarySuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch events summary';
      yield put(fetchEventsSummaryFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchEventsSummaryFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// SAVED REPORTS SAGAS
// ============================================
function* fetchReportsSaga(action: {
  type: string;
  payload?: GetReportsParams;
}): Generator<any, void, ApiResponse<GetReportsResponse>> {
  try {
    const response = yield call(api.getReports, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchReportsSuccess(response.data.data, response.data.pagination));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch reports';
      yield put(fetchReportsFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchReportsFailure(error.message || 'An unexpected error occurred'));
  }
}

function* createReportSaga(action: {
  type: string;
  payload: ReportFormData;
}): Generator<any, void, ApiResponse<CreateReportResponse>> {
  try {
    const response = yield call(api.createReport, action.payload);

    if (response.ok && response.data?.success) {
      yield put(createReportSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to create report';
      yield put(createReportFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(createReportFailure(error.message || 'An unexpected error occurred'));
  }
}

function* updateReportSaga(action: {
  type: string;
  payload: { id: string; data: Partial<ReportFormData> };
}): Generator<any, void, ApiResponse<CreateReportResponse>> {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateReport, id, data);

    if (response.ok && response.data?.success) {
      yield put(updateReportSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to update report';
      yield put(updateReportFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(updateReportFailure(error.message || 'An unexpected error occurred'));
  }
}

function* deleteReportSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<{ success: boolean; message: string }>> {
  try {
    const response = yield call(api.deleteReport, action.payload);

    if (response.ok && response.data?.success) {
      yield put(deleteReportSuccess(action.payload));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to delete report';
      yield put(deleteReportFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(deleteReportFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// GENERATE REPORT SAGA
// ============================================
function* generateReportSaga(action: {
  type: string;
  payload: { id: string; format?: string; parameters?: Record<string, any> };
}): Generator<any, void, ApiResponse<GenerateReportResponse>> {
  try {
    const { id, format, parameters } = action.payload;
    const response = yield call(api.generateReport, id, { format, parameters });

    if (response.ok && response.data?.success) {
      yield put(generateReportSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to generate report';
      yield put(generateReportFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(generateReportFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// EXPORT REPORT SAGA
// ============================================
function* exportReportSaga(action: {
  type: string;
  payload: { reportType: string; format: string; parameters?: Record<string, any> };
}): Generator<any, void, ApiResponse<ExportReportResponse>> {
  try {
    const response = yield call(api.exportReport, action.payload);

    if (response.ok && response.data?.success) {
      yield put(exportReportSuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to export report';
      yield put(exportReportFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(exportReportFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// REPORT HISTORY SAGA
// ============================================
function* fetchReportHistorySaga(action: {
  type: string;
  payload: { id: string; page?: number; limit?: number };
}): Generator<any, void, ApiResponse<GetReportHistoryResponse>> {
  try {
    const { id, page, limit } = action.payload;
    const response = yield call(api.getReportHistory, id, { page, limit });

    if (response.ok && response.data?.success) {
      yield put(fetchReportHistorySuccess(response.data.data));
    } else {
      const errorMessage = (response.data as any)?.message || 'Failed to fetch report history';
      yield put(fetchReportHistoryFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchReportHistoryFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// ROOT REPORT SAGA
// ============================================
export default function* reportSaga() {
  yield all([
    takeLatest(FETCH_DASHBOARD_ANALYTICS_REQUEST, fetchDashboardAnalyticsSaga),
    takeLatest(FETCH_ATTENDANCE_SUMMARY_REQUEST, fetchAttendanceSummarySaga),
    takeLatest(FETCH_ATTENDANCE_BY_EVENT_REQUEST, fetchAttendanceByEventSaga),
    takeLatest(FETCH_ATTENDANCE_BY_MEMBER_REQUEST, fetchAttendanceByMemberSaga),
    takeLatest(FETCH_ATTENDANCE_TRENDS_REQUEST, fetchAttendanceTrendsSaga),
    takeLatest(FETCH_MEMBER_DEMOGRAPHICS_REQUEST, fetchMemberDemographicsSaga),
    takeLatest(FETCH_MEMBER_GROWTH_REQUEST, fetchMemberGrowthSaga),
    takeLatest(FETCH_MEMBER_ENGAGEMENT_REQUEST, fetchMemberEngagementSaga),
    takeLatest(FETCH_EVENTS_SUMMARY_REQUEST, fetchEventsSummarySaga),
    takeLatest(FETCH_REPORTS_REQUEST, fetchReportsSaga),
    takeLatest(CREATE_REPORT_REQUEST, createReportSaga),
    takeLatest(UPDATE_REPORT_REQUEST, updateReportSaga),
    takeLatest(DELETE_REPORT_REQUEST, deleteReportSaga),
    takeLatest(GENERATE_REPORT_REQUEST, generateReportSaga),
    takeLatest(EXPORT_REPORT_REQUEST, exportReportSaga),
    takeLatest(FETCH_REPORT_HISTORY_REQUEST, fetchReportHistorySaga),
  ]);
}