export const AUTH0_LOGIN_SUCCESS = 'AUTH0_LOGIN_SUCCESS';
export const AUTH0_LOGOUT = 'AUTH0_LOGOUT';
export const AUTH0_USER_LOADED = 'AUTH0_USER_LOADED';

export interface Auth0User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export const auth0LoginSuccess = (user: Auth0User) => ({
  type: AUTH0_LOGIN_SUCCESS,
  payload: user,
});

export const auth0Logout = () => ({
  type: AUTH0_LOGOUT,
});

export const auth0UserLoaded = (user: Auth0User) => ({
  type: AUTH0_USER_LOADED,
  payload: user,
});
