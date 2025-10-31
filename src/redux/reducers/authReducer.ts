import {
  KEYCLOAK_INIT_REQUEST,
  KEYCLOAK_INIT_SUCCESS,
  KEYCLOAK_INIT_FAILURE,
  LOGOUT_REQUEST,
  KeycloakUser,
} from '../actions/authActions';

interface AuthState {
  user: KeycloakUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case KEYCLOAK_INIT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case KEYCLOAK_INIT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case KEYCLOAK_INIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case LOGOUT_REQUEST:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
