import { call, put, takeLatest } from 'redux-saga/effects';
import keycloak from '../../services/keycloak';
import {
  KEYCLOAK_INIT_REQUEST,
  LOGOUT_REQUEST,
  keycloakInitSuccess,
  keycloakInitFailure,
  KeycloakUser,
} from '../actions/authActions';

function* initKeycloakSaga(): Generator<any, void, any> {
  try {
    const authenticated = yield call([keycloak, keycloak.init], {
      onLoad: 'login-required',
      checkLoginIframe: false,
    });

    if (authenticated) {
      yield call([keycloak, keycloak.loadUserProfile]);
      
      const profile = keycloak.profile;
      const token = keycloak.token;

      if (profile && token) {
        const user: KeycloakUser = {
          id: profile.id || '',
          username: profile.username || '',
          email: profile.email || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
        };

        yield put(keycloakInitSuccess(user, token));
      } else {
        yield put(keycloakInitFailure('Failed to load user profile'));
      }
    } else {
      yield put(keycloakInitFailure('Authentication failed'));
    }
  } catch (error: any) {
    yield put(keycloakInitFailure(error.message || 'Keycloak initialization failed'));
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call([keycloak, keycloak.logout]);
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

export default function* authSaga() {
  yield takeLatest(KEYCLOAK_INIT_REQUEST, initKeycloakSaga);
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
}
