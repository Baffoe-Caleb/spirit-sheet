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
  BULK_UPLOAD_MEMBERS_REQUEST,
  BULK_UPLOAD_MEMBERS_SUCCESS,
  BULK_UPLOAD_MEMBERS_FAILURE,
  UPLOAD_MEMBER_PHOTO_REQUEST,
  UPLOAD_MEMBER_PHOTO_SUCCESS,
  UPLOAD_MEMBER_PHOTO_FAILURE,
  DELETE_MEMBER_PHOTO_REQUEST,
  DELETE_MEMBER_PHOTO_SUCCESS,
  DELETE_MEMBER_PHOTO_FAILURE,
  CHECK_INACTIVITY_REQUEST,
  CHECK_INACTIVITY_SUCCESS,
  CHECK_INACTIVITY_FAILURE,
  CLEAR_MEMBER_ERROR,
  CLEAR_SELECTED_MEMBER,
  RESET_MEMBER_STATE,
  RESET_MEMBER_OPERATION,
  MemberActionTypes,
  BulkUploadResult,
  InactivityResult,
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

  // Bulk upload result
  bulkUploadResult: BulkUploadResult | null;

  // Inactivity check result
  inactivityResult: InactivityResult | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isSearching: boolean;
  isBulkUploading: boolean;
  isUploadingPhoto: boolean;
  isDeletingPhoto: boolean;
  isCheckingInactivity: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  bulkUploadError: string | null;
  photoError: string | null;
  inactivityError: string | null;

  // Success flags
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  bulkUploadSuccess: boolean;
  photoUploadSuccess: boolean;
  photoDeleteSuccess: boolean;
  inactivityCheckSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: MemberState = {
  members: [],
  pagination: null,
  selectedMember: null,
  searchResults: [],
  bulkUploadResult: null,
  inactivityResult: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isSearching: false,
  isBulkUploading: false,
  isUploadingPhoto: false,
  isDeletingPhoto: false,
  isCheckingInactivity: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  bulkUploadError: null,
  photoError: null,
  inactivityError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  bulkUploadSuccess: false,
  photoUploadSuccess: false,
  photoDeleteSuccess: false,
  inactivityCheckSuccess: false,
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
    // BULK UPLOAD MEMBERS
    // ============================================
    case BULK_UPLOAD_MEMBERS_REQUEST:
      return {
        ...state,
        isBulkUploading: true,
        bulkUploadError: null,
        bulkUploadSuccess: false,
        bulkUploadResult: null,
      };

    case BULK_UPLOAD_MEMBERS_SUCCESS:
      return {
        ...state,
        isBulkUploading: false,
        bulkUploadResult: action.payload,
        bulkUploadSuccess: true,
        bulkUploadError: null,
      };

    case BULK_UPLOAD_MEMBERS_FAILURE:
      return {
        ...state,
        isBulkUploading: false,
        bulkUploadError: action.payload,
        bulkUploadSuccess: false,
      };

    // ============================================
    // UPLOAD MEMBER PHOTO
    // ============================================
    case UPLOAD_MEMBER_PHOTO_REQUEST:
      return {
        ...state,
        isUploadingPhoto: true,
        photoError: null,
        photoUploadSuccess: false,
      };

    case UPLOAD_MEMBER_PHOTO_SUCCESS: {
      const { memberId, photo } = action.payload;
      return {
        ...state,
        isUploadingPhoto: false,
        photoUploadSuccess: true,
        photoError: null,
        members: state.members.map((m) =>
          m._id === memberId ? { ...m, photo } : m
        ),
        selectedMember:
          state.selectedMember?._id === memberId
            ? { ...state.selectedMember, photo }
            : state.selectedMember,
      };
    }

    case UPLOAD_MEMBER_PHOTO_FAILURE:
      return {
        ...state,
        isUploadingPhoto: false,
        photoError: action.payload,
        photoUploadSuccess: false,
      };

    // ============================================
    // DELETE MEMBER PHOTO
    // ============================================
    case DELETE_MEMBER_PHOTO_REQUEST:
      return {
        ...state,
        isDeletingPhoto: true,
        photoError: null,
        photoDeleteSuccess: false,
      };

    case DELETE_MEMBER_PHOTO_SUCCESS: {
      const deletedPhotoMemberId = action.payload;
      return {
        ...state,
        isDeletingPhoto: false,
        photoDeleteSuccess: true,
        photoError: null,
        members: state.members.map((m) =>
          m._id === deletedPhotoMemberId ? { ...m, photo: undefined } : m
        ),
        selectedMember:
          state.selectedMember?._id === deletedPhotoMemberId
            ? { ...state.selectedMember, photo: undefined }
            : state.selectedMember,
      };
    }

    case DELETE_MEMBER_PHOTO_FAILURE:
      return {
        ...state,
        isDeletingPhoto: false,
        photoError: action.payload,
        photoDeleteSuccess: false,
      };

    // ============================================
    // CHECK INACTIVITY
    // ============================================
    case CHECK_INACTIVITY_REQUEST:
      return {
        ...state,
        isCheckingInactivity: true,
        inactivityError: null,
        inactivityCheckSuccess: false,
        inactivityResult: null,
      };

    case CHECK_INACTIVITY_SUCCESS:
      return {
        ...state,
        isCheckingInactivity: false,
        inactivityResult: action.payload,
        inactivityCheckSuccess: true,
        inactivityError: null,
      };

    case CHECK_INACTIVITY_FAILURE:
      return {
        ...state,
        isCheckingInactivity: false,
        inactivityError: action.payload,
        inactivityCheckSuccess: false,
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
        bulkUploadError: null,
        photoError: null,
        inactivityError: null,
      };

    case CLEAR_SELECTED_MEMBER:
      return {
        ...state,
        selectedMember: null,
      };

    case RESET_MEMBER_STATE:
      return initialState;

    case RESET_MEMBER_OPERATION:
      return {
        ...state,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isBulkUploading: false,
        isUploadingPhoto: false,
        isDeletingPhoto: false,
        isCheckingInactivity: false,
        createSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
        bulkUploadSuccess: false,
        photoUploadSuccess: false,
        photoDeleteSuccess: false,
        inactivityCheckSuccess: false,
        createError: null,
        updateError: null,
        deleteError: null,
        bulkUploadError: null,
        photoError: null,
        inactivityError: null,
        bulkUploadResult: null,
        inactivityResult: null,
      };

    default:
      return state;
  }
};

export default memberReducer;