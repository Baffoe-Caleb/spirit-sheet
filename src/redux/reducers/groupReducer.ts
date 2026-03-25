// src/redux/reducers/groupReducer.ts

import { Group, GroupMember, GroupCategory, GroupStatistics, PaginationInfo } from '../../services/api';
import {
  FETCH_GROUPS_REQUEST,
  FETCH_GROUPS_SUCCESS,
  FETCH_GROUPS_FAILURE,
  FETCH_GROUP_REQUEST,
  FETCH_GROUP_SUCCESS,
  FETCH_GROUP_FAILURE,
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_FAILURE,
  UPDATE_GROUP_REQUEST,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_FAILURE,
  DELETE_GROUP_REQUEST,
  DELETE_GROUP_SUCCESS,
  DELETE_GROUP_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_GROUP_MEMBERS_REQUEST,
  FETCH_GROUP_MEMBERS_SUCCESS,
  FETCH_GROUP_MEMBERS_FAILURE,
  ADD_GROUP_MEMBER_REQUEST,
  ADD_GROUP_MEMBER_SUCCESS,
  ADD_GROUP_MEMBER_FAILURE,
  REMOVE_GROUP_MEMBER_REQUEST,
  REMOVE_GROUP_MEMBER_SUCCESS,
  REMOVE_GROUP_MEMBER_FAILURE,
  FETCH_GROUP_STATISTICS_REQUEST,
  FETCH_GROUP_STATISTICS_SUCCESS,
  FETCH_GROUP_STATISTICS_FAILURE,
  SET_SELECTED_GROUP,
  CLEAR_GROUP_ERROR,
  RESET_GROUP_OPERATION,
  RESET_GROUP_STATE,
  GroupActionTypes,
} from '../actions/groupActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface GroupState {
  // Groups list
  groups: Group[];
  pagination: PaginationInfo | null;
  selectedGroup: Group | null;

  // Categories
  categories: GroupCategory[];

  // Group members (for selected group)
  groupMembers: GroupMember[];

  // Statistics
  statistics: GroupStatistics | null;

  // Loading states
  isLoading: boolean;
  isLoadingGroup: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingCategories: boolean;
  isLoadingMembers: boolean;
  isAddingMember: boolean;
  isRemovingMember: boolean;
  isLoadingStatistics: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  memberError: string | null;

  // Success flags
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  addMemberSuccess: boolean;
  removeMemberSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: GroupState = {
  groups: [],
  pagination: null,
  selectedGroup: null,
  categories: [],
  groupMembers: [],
  statistics: null,
  isLoading: false,
  isLoadingGroup: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingCategories: false,
  isLoadingMembers: false,
  isAddingMember: false,
  isRemovingMember: false,
  isLoadingStatistics: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  memberError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  addMemberSuccess: false,
  removeMemberSuccess: false,
};

// ============================================
// REDUCER
// ============================================

const groupReducer = (
  state = initialState,
  action: GroupActionTypes
): GroupState => {
  switch (action.type) {
    // ============================================
    // FETCH GROUPS
    // ============================================
    case FETCH_GROUPS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        groups: action.payload.groups,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_GROUPS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // FETCH SINGLE GROUP
    // ============================================
    case FETCH_GROUP_REQUEST:
      return {
        ...state,
        isLoadingGroup: true,
        error: null,
      };

    case FETCH_GROUP_SUCCESS:
      return {
        ...state,
        isLoadingGroup: false,
        selectedGroup: action.payload,
        error: null,
      };

    case FETCH_GROUP_FAILURE:
      return {
        ...state,
        isLoadingGroup: false,
        error: action.payload,
      };

    // ============================================
    // CREATE GROUP
    // ============================================
    case CREATE_GROUP_REQUEST:
      return {
        ...state,
        isCreating: true,
        createError: null,
        createSuccess: false,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        isCreating: false,
        groups: [action.payload, ...state.groups],
        createSuccess: true,
        createError: null,
        pagination: state.pagination
          ? { ...state.pagination, total: state.pagination.total + 1 }
          : null,
      };

    case CREATE_GROUP_FAILURE:
      return {
        ...state,
        isCreating: false,
        createError: action.payload,
        createSuccess: false,
      };

    // ============================================
    // UPDATE GROUP
    // ============================================
    case UPDATE_GROUP_REQUEST:
      return {
        ...state,
        isUpdating: true,
        updateError: null,
        updateSuccess: false,
      };

    case UPDATE_GROUP_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        groups: state.groups.map((group) =>
          group._id === action.payload._id ? action.payload : group
        ),
        selectedGroup:
          state.selectedGroup?._id === action.payload._id
            ? action.payload
            : state.selectedGroup,
        updateSuccess: true,
        updateError: null,
      };

    case UPDATE_GROUP_FAILURE:
      return {
        ...state,
        isUpdating: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    // ============================================
    // DELETE GROUP
    // ============================================
    case DELETE_GROUP_REQUEST:
      return {
        ...state,
        isDeleting: true,
        deleteError: null,
        deleteSuccess: false,
      };

    case DELETE_GROUP_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        groups: state.groups.filter((group) => group._id !== action.payload),
        selectedGroup:
          state.selectedGroup?._id === action.payload
            ? null
            : state.selectedGroup,
        deleteSuccess: true,
        deleteError: null,
        pagination: state.pagination
          ? { ...state.pagination, total: state.pagination.total - 1 }
          : null,
      };

    case DELETE_GROUP_FAILURE:
      return {
        ...state,
        isDeleting: false,
        deleteError: action.payload,
        deleteSuccess: false,
      };

    // ============================================
    // FETCH CATEGORIES
    // ============================================
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        isLoadingCategories: true,
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoadingCategories: false,
        categories: action.payload,
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        isLoadingCategories: false,
        error: action.payload,
      };

    // ============================================
    // FETCH GROUP MEMBERS
    // ============================================
    case FETCH_GROUP_MEMBERS_REQUEST:
      return {
        ...state,
        isLoadingMembers: true,
        memberError: null,
      };

    case FETCH_GROUP_MEMBERS_SUCCESS:
      return {
        ...state,
        isLoadingMembers: false,
        groupMembers: action.payload,
        memberError: null,
      };

    case FETCH_GROUP_MEMBERS_FAILURE:
      return {
        ...state,
        isLoadingMembers: false,
        memberError: action.payload,
      };

    // ============================================
    // ADD GROUP MEMBER
    // ============================================
    case ADD_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        isAddingMember: true,
        memberError: null,
        addMemberSuccess: false,
      };

    case ADD_GROUP_MEMBER_SUCCESS:
      return {
        ...state,
        isAddingMember: false,
        groupMembers: [...state.groupMembers, action.payload],
        addMemberSuccess: true,
        memberError: null,
      };

    case ADD_GROUP_MEMBER_FAILURE:
      return {
        ...state,
        isAddingMember: false,
        memberError: action.payload,
        addMemberSuccess: false,
      };

    // ============================================
    // REMOVE GROUP MEMBER
    // ============================================
    case REMOVE_GROUP_MEMBER_REQUEST:
      return {
        ...state,
        isRemovingMember: true,
        memberError: null,
        removeMemberSuccess: false,
      };

    case REMOVE_GROUP_MEMBER_SUCCESS:
      return {
        ...state,
        isRemovingMember: false,
        groupMembers: state.groupMembers.filter((m) => m.id !== action.payload),
        removeMemberSuccess: true,
        memberError: null,
      };

    case REMOVE_GROUP_MEMBER_FAILURE:
      return {
        ...state,
        isRemovingMember: false,
        memberError: action.payload,
        removeMemberSuccess: false,
      };

    // ============================================
    // FETCH GROUP STATISTICS
    // ============================================
    case FETCH_GROUP_STATISTICS_REQUEST:
      return {
        ...state,
        isLoadingStatistics: true,
      };

    case FETCH_GROUP_STATISTICS_SUCCESS:
      return {
        ...state,
        isLoadingStatistics: false,
        statistics: action.payload,
      };

    case FETCH_GROUP_STATISTICS_FAILURE:
      return {
        ...state,
        isLoadingStatistics: false,
        error: action.payload,
      };

    // ============================================
    // CLEAR STATES
    // ============================================
    case SET_SELECTED_GROUP:
      return {
        ...state,
        selectedGroup: action.payload,
        groupMembers: [],
        statistics: null,
      };

    case CLEAR_GROUP_ERROR:
      return {
        ...state,
        error: null,
        createError: null,
        updateError: null,
        deleteError: null,
        memberError: null,
      };

    case RESET_GROUP_OPERATION:
      return {
        ...state,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isAddingMember: false,
        isRemovingMember: false,
        createSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
        addMemberSuccess: false,
        removeMemberSuccess: false,
        createError: null,
        updateError: null,
        deleteError: null,
        memberError: null,
      };

    case RESET_GROUP_STATE:
      return initialState;

    default:
      return state;
  }
};

export default groupReducer;