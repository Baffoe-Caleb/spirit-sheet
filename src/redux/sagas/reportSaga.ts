import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  FETCH_REPORTS_REQUEST,
  GENERATE_REPORT_REQUEST,
  fetchReportsSuccess,
  fetchReportsFailure,
  generateReportSuccess,
  generateReportFailure,
} from '../actions/reportActions';

function* fetchReportsSaga(action: any): Generator<any, void, any> {
  try {
    const params = action.payload || {};
    const response = yield call(api.get, '/reports', params);

    if (response.ok && response.data?.success) {
      yield put(
        fetchReportsSuccess({
          reports: response.data.data,
          pagination: response.data.pagination,
        })
      );
    } else {
      yield put(fetchReportsFailure(response.data?.error || 'Failed to fetch reports'));
    }
  } catch (error: any) {
    yield put(fetchReportsFailure(error.message || 'Unknown error'));
  }
}

function* generateReportSaga(action: any): Generator<any, void, any> {
  try {
    const { startDate, endDate } = action.payload;
    const response = yield call(api.get, '/reports/generate', { startDate, endDate });

    if (response.ok && response.data?.success) {
      yield put(generateReportSuccess(response.data.data));
    } else {
      yield put(generateReportFailure(response.data?.error || 'Failed to generate report'));
    }
  } catch (error: any) {
    yield put(generateReportFailure(error.message || 'Unknown error'));
  }
}

export default function* reportSaga() {
  yield takeLatest(FETCH_REPORTS_REQUEST, fetchReportsSaga);
  yield takeLatest(GENERATE_REPORT_REQUEST, generateReportSaga);
}
