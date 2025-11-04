import {
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  CREATE_MEMBER_SUCCESS,
  UPDATE_MEMBER_SUCCESS,
  DELETE_MEMBER_SUCCESS,
  Member,
} from '../actions/memberActions';

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
  pagination: null,
};

const memberReducer = (state = initialState, action: any): MemberState => {
  switch (action.type) {
    case FETCH_MEMBERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        members: action.payload.members,
        pagination: action.payload.pagination,
      };
    case FETCH_MEMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_MEMBER_SUCCESS:
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    case UPDATE_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.map((member) =>
          member._id === action.payload._id ? action.payload : member
        ),
      };
    case DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.filter((member) => member._id !== action.payload),
      };
    default:
      return state;
  }
};

export default memberReducer;
