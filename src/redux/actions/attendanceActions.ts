export const FETCH_ATTENDANCE_REQUEST = 'FETCH_ATTENDANCE_REQUEST';
export const FETCH_ATTENDANCE_SUCCESS = 'FETCH_ATTENDANCE_SUCCESS';
export const FETCH_ATTENDANCE_FAILURE = 'FETCH_ATTENDANCE_FAILURE';

export const RECORD_ATTENDANCE_REQUEST = 'RECORD_ATTENDANCE_REQUEST';
export const RECORD_ATTENDANCE_SUCCESS = 'RECORD_ATTENDANCE_SUCCESS';
export const RECORD_ATTENDANCE_FAILURE = 'RECORD_ATTENDANCE_FAILURE';

export interface AttendanceRecord {
  _id?: string;
  memberId: string;
  groupId?: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
  notes?: string;
}

export const fetchAttendanceRequest = (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  groupId?: string;
}) => ({
  type: FETCH_ATTENDANCE_REQUEST,
  payload: params,
});

export const fetchAttendanceSuccess = (data: { attendance: AttendanceRecord[]; pagination: any }) => ({
  type: FETCH_ATTENDANCE_SUCCESS,
  payload: data,
});

export const fetchAttendanceFailure = (error: string) => ({
  type: FETCH_ATTENDANCE_FAILURE,
  payload: error,
});

export const recordAttendanceRequest = (records: Omit<AttendanceRecord, '_id'>[]) => ({
  type: RECORD_ATTENDANCE_REQUEST,
  payload: records,
});

export const recordAttendanceSuccess = (records: AttendanceRecord[]) => ({
  type: RECORD_ATTENDANCE_SUCCESS,
  payload: records,
});

export const recordAttendanceFailure = (error: string) => ({
  type: RECORD_ATTENDANCE_FAILURE,
  payload: error,
});
