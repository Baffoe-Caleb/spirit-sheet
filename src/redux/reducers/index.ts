import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer';
import authReducer from './authReducer';
import memberReducer from './memberReducers';
import attendanceReducer from './attendanceReducer';
import groupReducer from './groupReducer';
import reportReducer from './reportReducer';
import financeReducer from './financeReducer';
import roleReducer from './roleReducer';
import cellZoneReducer from './cellZoneReducer';

const rootReducer = combineReducers({
  categories: categoryReducer,
  members: memberReducer,
  auth: authReducer,
  attendance: attendanceReducer,
  groups: groupReducer,
  reports: reportReducer,
  financeReducer: financeReducer,
  roles: roleReducer,
  cellZones: cellZoneReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
