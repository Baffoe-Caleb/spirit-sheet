export const FETCH_REPORTS_REQUEST = 'FETCH_REPORTS_REQUEST';
export const FETCH_REPORTS_SUCCESS = 'FETCH_REPORTS_SUCCESS';
export const FETCH_REPORTS_FAILURE = 'FETCH_REPORTS_FAILURE';

export const GENERATE_REPORT_REQUEST = 'GENERATE_REPORT_REQUEST';
export const GENERATE_REPORT_SUCCESS = 'GENERATE_REPORT_SUCCESS';
export const GENERATE_REPORT_FAILURE = 'GENERATE_REPORT_FAILURE';

export interface Report {
  _id: string;
  title: string;
  reportType: string;
  startDate: string;
  endDate: string;
  summary: {
    totalMembers: number;
    averageAttendance: number;
    totalServices: number;
    attendanceRate: number;
  };
  data: any;
  createdAt: string;
}

export const fetchReportsRequest = (params?: { page?: number; limit?: number }) => ({
  type: FETCH_REPORTS_REQUEST,
  payload: params,
});

export const fetchReportsSuccess = (data: { reports: Report[]; pagination: any }) => ({
  type: FETCH_REPORTS_SUCCESS,
  payload: data,
});

export const fetchReportsFailure = (error: string) => ({
  type: FETCH_REPORTS_FAILURE,
  payload: error,
});

export const generateReportRequest = (startDate: string, endDate: string) => ({
  type: GENERATE_REPORT_REQUEST,
  payload: { startDate, endDate },
});

export const generateReportSuccess = (report: Report) => ({
  type: GENERATE_REPORT_SUCCESS,
  payload: report,
});

export const generateReportFailure = (error: string) => ({
  type: GENERATE_REPORT_FAILURE,
  payload: error,
});
