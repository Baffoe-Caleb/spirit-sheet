import { all } from 'redux-saga/effects';

// Auth0 authentication is handled by the Auth0Provider
// No sagas needed for Auth0 authentication flow
export default function* authSaga() {
  yield all([]);
}
