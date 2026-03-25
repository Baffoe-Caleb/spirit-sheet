import { combineReducers } from 'redux';
import authReducer from './authReducer';
import memberReducer from './memberReducers';
import attendanceReducer from './attendanceReducer';
import groupReducer from './groupReducer';
import reportReducer from './reportReducer';
import financeReducer from './financeReducer';
import roleReducer from './roleReducer';
import cellZoneReducer from './cellZoneReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  members: memberReducer,
  attendance: attendanceReducer,
  groups: groupReducer,
  reports: reportReducer,
  finance: financeReducer, // ← fixed key name
  roles: roleReducer,
  cellZones: cellZoneReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;