export const KEYCLOAK_INIT_REQUEST = 'KEYCLOAK_INIT_REQUEST';
export const KEYCLOAK_INIT_SUCCESS = 'KEYCLOAK_INIT_SUCCESS';
export const KEYCLOAK_INIT_FAILURE = 'KEYCLOAK_INIT_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const keycloakInitRequest = () => ({
  type: KEYCLOAK_INIT_REQUEST,
});

export const keycloakInitSuccess = (user: KeycloakUser, token: string) => ({
  type: KEYCLOAK_INIT_SUCCESS,
  payload: { user, token },
});

export const keycloakInitFailure = (error: string) => ({
  type: KEYCLOAK_INIT_FAILURE,
  payload: error,
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});
