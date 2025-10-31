import {
  AUTH0_LOGIN_SUCCESS,
  AUTH0_LOGOUT,
  AUTH0_USER_LOADED,
  Auth0User,
} from '../actions/authActions';

interface AuthState {
  user: Auth0User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case AUTH0_LOGIN_SUCCESS:
    case AUTH0_USER_LOADED:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case AUTH0_LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
