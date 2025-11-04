import {
  FETCH_ATTENDANCE_REQUEST,
  FETCH_ATTENDANCE_SUCCESS,
  FETCH_ATTENDANCE_FAILURE,
  RECORD_ATTENDANCE_SUCCESS,
  AttendanceRecord,
} from '../actions/attendanceActions';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
  pagination: null,
};

const attendanceReducer = (state = initialState, action: any): AttendanceState => {
  switch (action.type) {
    case FETCH_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        records: action.payload.attendance,
        pagination: action.payload.pagination,
      };
    case FETCH_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RECORD_ATTENDANCE_SUCCESS:
      return {
        ...state,
        records: [...action.payload, ...state.records],
      };
    default:
      return state;
  }
};

export default attendanceReducer;
