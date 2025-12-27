// src/redux/reducers/memberReducer.ts

import { Member, PaginationInfo } from '../../services/api';
import {
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  FETCH_MEMBER_REQUEST,
  FETCH_MEMBER_SUCCESS,
  FETCH_MEMBER_FAILURE,
  CREATE_MEMBER_REQUEST,
  CREATE_MEMBER_SUCCESS,
  CREATE_MEMBER_FAILURE,
  UPDATE_MEMBER_REQUEST,
  UPDATE_MEMBER_SUCCESS,
  UPDATE_MEMBER_FAILURE,
  DELETE_MEMBER_REQUEST,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  SEARCH_MEMBERS_REQUEST,
  SEARCH_MEMBERS_SUCCESS,
  SEARCH_MEMBERS_FAILURE,
  CLEAR_MEMBER_ERROR,
  CLEAR_SELECTED_MEMBER,
  RESET_MEMBER_STATE,
  MemberActionTypes,
} from '../actions/memberActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface MemberState {
  // List of members
  members: Member[];
  pagination: PaginationInfo | null;
  
  // Selected member for viewing/editing
  selectedMember: Member | null;
  
  // Search results
  searchResults: Member[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isSearching: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // Success flags (for closing modals, showing toasts, etc.)
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: MemberState = {
  members: [],
  pagination: null,
  selectedMember: null,
  searchResults: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isSearching: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// ============================================
// REDUCER
// ============================================

const memberReducer = (
  state = initialState,
  action: MemberActionTypes
): MemberState => {
  switch (action.type) {
    // ============================================
    // FETCH MEMBERS
    // ============================================
    case FETCH_MEMBERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        members: action.payload.members,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_MEMBERS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // FETCH SINGLE MEMBER
    // ============================================
    case FETCH_MEMBER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        selectedMember: null,
      };

    case FETCH_MEMBER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedMember: action.payload,
        error: null,
      };

    case FETCH_MEMBER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // CREATE MEMBER
    // ============================================
    case CREATE_MEMBER_REQUEST:
      return {
        ...state,
        isCreating: true,
        createError: null,
        createSuccess: false,
      };

    case CREATE_MEMBER_SUCCESS:
      return {
        ...state,
        isCreating: false,
        members: [action.payload, ...state.members],
        createSuccess: true,
        createError: null,
        // Update pagination total
        pagination: state.pagination
          ? { ...state.pagination, total: state.pagination.total + 1 }
          : null,
      };

    case CREATE_MEMBER_FAILURE:
      return {
        ...state,
        isCreating: false,
        createError: action.payload,
        createSuccess: false,
      };

    // ============================================
    // UPDATE MEMBER
    // ============================================
    case UPDATE_MEMBER_REQUEST:
      return {
        ...state,
        isUpdating: true,
        updateError: null,
        updateSuccess: false,
      };

    case UPDATE_MEMBER_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        members: state.members.map((member) =>
          member._id === action.payload._id ? action.payload : member
        ),
        selectedMember:
          state.selectedMember?._id === action.payload._id
            ? action.payload
            : state.selectedMember,
        updateSuccess: true,
        updateError: null,
      };

    case UPDATE_MEMBER_FAILURE:
      return {
        ...state,
        isUpdating: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    // ============================================
    // DELETE MEMBER
    // ============================================
    case DELETE_MEMBER_REQUEST:
      return {
        ...state,
        isDeleting: true,
        deleteError: null,
        deleteSuccess: false,
      };

    case DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        members: state.members.filter((member) => member._id !== action.payload),
        selectedMember:
          state.selectedMember?._id === action.payload
            ? null
            : state.selectedMember,
        deleteSuccess: true,
        deleteError: null,
        // Update pagination total
        pagination: state.pagination
          ? { ...state.pagination, total: state.pagination.total - 1 }
          : null,
      };

    case DELETE_MEMBER_FAILURE:
      return {
        ...state,
        isDeleting: false,
        deleteError: action.payload,
        deleteSuccess: false,
      };

    // ============================================
    // SEARCH MEMBERS
    // ============================================
    case SEARCH_MEMBERS_REQUEST:
      return {
        ...state,
        isSearching: true,
        error: null,
      };

    case SEARCH_MEMBERS_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload,
        error: null,
      };

    case SEARCH_MEMBERS_FAILURE:
      return {
        ...state,
        isSearching: false,
        error: action.payload,
      };

    // ============================================
    // CLEAR STATES
    // ============================================
    case CLEAR_MEMBER_ERROR:
      return {
        ...state,
        error: null,
        createError: null,
        updateError: null,
        deleteError: null,
      };

    case CLEAR_SELECTED_MEMBER:
      return {
        ...state,
        selectedMember: null,
      };

    case RESET_MEMBER_STATE:
      return initialState;

    default:
      return state;
  }
};

export default memberReducer;