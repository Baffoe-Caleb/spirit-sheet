import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer';
import authReducer from './authReducer';
import memberReducer from './memberReducer';
import groupReducer from './groupReducer';
import attendanceReducer from './attendanceReducer';
import reportReducer from './reportReducer';

const rootReducer = combineReducers({
  categories: categoryReducer,
  auth: authReducer,
  members: memberReducer,
  groups: groupReducer,
  attendance: attendanceReducer,
  reports: reportReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
