import { all, fork } from 'redux-saga/effects';
import categorySaga from './categorySaga';
import authSaga from './authSaga';

export default function* rootSaga() {
  yield all([
    fork(categorySaga),
    fork(authSaga),
  ]);
}
