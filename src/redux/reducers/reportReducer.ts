import {
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  GENERATE_REPORT_SUCCESS,
  Report,
} from '../actions/reportActions';

interface ReportState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: ReportState = {
  reports: [],
  loading: false,
  error: null,
  pagination: null,
};

const reportReducer = (state = initialState, action: any): ReportState => {
  switch (action.type) {
    case FETCH_REPORTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: action.payload.reports,
        pagination: action.payload.pagination,
      };
    case FETCH_REPORTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GENERATE_REPORT_SUCCESS:
      return {
        ...state,
        reports: [action.payload, ...state.reports],
      };
    default:
      return state;
  }
};

export default reportReducer;
