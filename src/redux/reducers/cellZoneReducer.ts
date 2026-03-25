// src/redux/reducers/cellZoneReducer.ts

import { CellZone, Member, PaginationInfo } from '../../services/api';
import {
  FETCH_CELL_ZONES_REQUEST,
  FETCH_CELL_ZONES_SUCCESS,
  FETCH_CELL_ZONES_FAILURE,
  FETCH_CELL_ZONE_REQUEST,
  FETCH_CELL_ZONE_SUCCESS,
  FETCH_CELL_ZONE_FAILURE,
  CREATE_CELL_ZONE_REQUEST,
  CREATE_CELL_ZONE_SUCCESS,
  CREATE_CELL_ZONE_FAILURE,
  UPDATE_CELL_ZONE_REQUEST,
  UPDATE_CELL_ZONE_SUCCESS,
  UPDATE_CELL_ZONE_FAILURE,
  DELETE_CELL_ZONE_REQUEST,
  DELETE_CELL_ZONE_SUCCESS,
  DELETE_CELL_ZONE_FAILURE,
  FETCH_CELL_ZONE_MEMBERS_REQUEST,
  FETCH_CELL_ZONE_MEMBERS_SUCCESS,
  FETCH_CELL_ZONE_MEMBERS_FAILURE,
  CLEAR_CELL_ZONE_ERROR,
  CLEAR_SELECTED_CELL_ZONE,
  RESET_CELL_ZONE_OPERATION,
  RESET_CELL_ZONE_STATE,
  CellZoneActionTypes,
} from '../actions/cellZoneActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface CellZoneState {
  // List
  cellZones: CellZone[];

  // Selected
  selectedCellZone: CellZone | null;

  // Members of selected cell/zone
  cellZoneMembers: Member[];
  membersPagination: PaginationInfo | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isLoadingMembers: boolean;

  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  membersError: string | null;

  // Success flags
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: CellZoneState = {
  cellZones: [],
  selectedCellZone: null,
  cellZoneMembers: [],
  membersPagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoadingMembers: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  membersError: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// ============================================
// REDUCER
// ============================================

const cellZoneReducer = (
  state = initialState,
  action: CellZoneActionTypes
): CellZoneState => {
  switch (action.type) {
    // ============================================
    // FETCH CELL ZONES
    // ============================================
    case FETCH_CELL_ZONES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_CELL_ZONES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cellZones: action.payload,
        error: null,
      };

    case FETCH_CELL_ZONES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // FETCH SINGLE CELL ZONE
    // ============================================
    case FETCH_CELL_ZONE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        selectedCellZone: null,
      };

    case FETCH_CELL_ZONE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedCellZone: action.payload,
        error: null,
      };

    case FETCH_CELL_ZONE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // ============================================
    // CREATE CELL ZONE
    // ============================================
    case CREATE_CELL_ZONE_REQUEST:
      return {
        ...state,
        isCreating: true,
        createError: null,
        createSuccess: false,
      };

    case CREATE_CELL_ZONE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        cellZones: [action.payload, ...state.cellZones],
        createSuccess: true,
        createError: null,
      };

    case CREATE_CELL_ZONE_FAILURE:
      return {
        ...state,
        isCreating: false,
        createError: action.payload,
        createSuccess: false,
      };

    // ============================================
    // UPDATE CELL ZONE
    // ============================================
    case UPDATE_CELL_ZONE_REQUEST:
      return {
        ...state,
        isUpdating: true,
        updateError: null,
        updateSuccess: false,
      };

    case UPDATE_CELL_ZONE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        cellZones: state.cellZones.map((cz) =>
          cz._id === action.payload._id ? action.payload : cz
        ),
        selectedCellZone:
          state.selectedCellZone?._id === action.payload._id
            ? action.payload
            : state.selectedCellZone,
        updateSuccess: true,
        updateError: null,
      };

    case UPDATE_CELL_ZONE_FAILURE:
      return {
        ...state,
        isUpdating: false,
        updateError: action.payload,
        updateSuccess: false,
      };

    // ============================================
    // DELETE CELL ZONE
    // ============================================
    case DELETE_CELL_ZONE_REQUEST:
      return {
        ...state,
        isDeleting: true,
        deleteError: null,
        deleteSuccess: false,
      };

    case DELETE_CELL_ZONE_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        cellZones: state.cellZones.filter((cz) => cz._id !== action.payload),
        selectedCellZone:
          state.selectedCellZone?._id === action.payload
            ? null
            : state.selectedCellZone,
        deleteSuccess: true,
        deleteError: null,
      };

    case DELETE_CELL_ZONE_FAILURE:
      return {
        ...state,
        isDeleting: false,
        deleteError: action.payload,
        deleteSuccess: false,
      };

    // ============================================
    // FETCH CELL ZONE MEMBERS
    // ============================================
    case FETCH_CELL_ZONE_MEMBERS_REQUEST:
      return {
        ...state,
        isLoadingMembers: true,
        membersError: null,
      };

    case FETCH_CELL_ZONE_MEMBERS_SUCCESS:
      return {
        ...state,
        isLoadingMembers: false,
        cellZoneMembers: action.payload.members,
        membersPagination: action.payload.pagination || null,
        membersError: null,
      };

    case FETCH_CELL_ZONE_MEMBERS_FAILURE:
      return {
        ...state,
        isLoadingMembers: false,
        membersError: action.payload,
      };

    // ============================================
    // CLEAR / RESET
    // ============================================
    case CLEAR_CELL_ZONE_ERROR:
      return {
        ...state,
        error: null,
        createError: null,
        updateError: null,
        deleteError: null,
        membersError: null,
      };

    case CLEAR_SELECTED_CELL_ZONE:
      return {
        ...state,
        selectedCellZone: null,
        cellZoneMembers: [],
        membersPagination: null,
      };

    case RESET_CELL_ZONE_OPERATION:
      return {
        ...state,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        createSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
        createError: null,
        updateError: null,
        deleteError: null,
      };

    case RESET_CELL_ZONE_STATE:
      return initialState;

    default:
      return state;
  }
};

export default cellZoneReducer;