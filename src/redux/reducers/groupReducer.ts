import {
  FETCH_GROUPS_REQUEST,
  FETCH_GROUPS_SUCCESS,
  FETCH_GROUPS_FAILURE,
  CREATE_GROUP_SUCCESS,
  UPDATE_GROUP_SUCCESS,
  DELETE_GROUP_SUCCESS,
  Group,
} from '../actions/groupActions';

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
  pagination: null,
};

const groupReducer = (state = initialState, action: any): GroupState => {
  switch (action.type) {
    case FETCH_GROUPS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: action.payload.groups,
        pagination: action.payload.pagination,
      };
    case FETCH_GROUPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };
    case UPDATE_GROUP_SUCCESS:
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload._id ? action.payload : group
        ),
      };
    case DELETE_GROUP_SUCCESS:
      return {
        ...state,
        groups: state.groups.filter((group) => group._id !== action.payload),
      };
    default:
      return state;
  }
};

export default groupReducer;
