import { all, fork } from 'redux-saga/effects';
import categorySaga from './categorySaga';
import authSaga from './authSaga';
import memberSaga from './memberSaga';

export default function* rootSaga() {
  yield all([
    fork(categorySaga),
    fork(memberSaga),
    fork(authSaga),
  ]);
}
