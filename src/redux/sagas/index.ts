import { all, fork } from 'redux-saga/effects';
import categorySaga from './categorySaga';
import authSaga from './authSaga';
import memberSaga from './memberSaga';
import groupSaga from './groupSaga';
import attendanceSaga from './attendanceSaga';
import reportSaga from './reportSaga';

export default function* rootSaga() {
  yield all([
    fork(categorySaga),
    fork(authSaga),
    fork(memberSaga),
    fork(groupSaga),
    fork(attendanceSaga),
    fork(reportSaga),
  ]);
}
