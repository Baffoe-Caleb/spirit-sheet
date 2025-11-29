import { combineReducers } from 'redux';
import categoryReducer from './categoryReducer';
import authReducer from './authReducer';
import memberReducer from './memberReducers';

const rootReducer = combineReducers({
  categories: categoryReducer,
  members: memberReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
