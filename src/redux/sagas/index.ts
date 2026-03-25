import { all, fork } from 'redux-saga/effects';
import categorySaga from './categorySaga';
import authSaga from './authSaga';
import memberSaga from './memberSaga';
import attendanceSaga from './attendanceSaga';
import groupSaga from './groupSaga';
import reportSaga from './reportSaga';
import financeSaga from './financeSaga';
import roleSaga from './roleSaga';
import cellZoneSaga from './cellZoneSaga';

export default function* rootSaga() {
  yield all([
    fork(categorySaga),
    fork(memberSaga),
    fork(authSaga),
    fork(attendanceSaga),
    fork(groupSaga),
    fork(reportSaga),
    fork(financeSaga),
    fork(roleSaga),
    fork(cellZoneSaga),
  ]);
}