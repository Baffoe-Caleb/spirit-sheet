// src/redux/actions/cellZoneActions.ts

import {
  CellZone,
  CellZoneFormData,
  CellZoneType,
  Member,
  PaginationInfo,
  GetCellZonesParams,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Fetch Cell Zones
export const FETCH_CELL_ZONES_REQUEST = 'cellZones/FETCH_REQUEST';
export const FETCH_CELL_ZONES_SUCCESS = 'cellZones/FETCH_SUCCESS';
export const FETCH_CELL_ZONES_FAILURE = 'cellZones/FETCH_FAILURE';

// Fetch Single Cell Zone
export const FETCH_CELL_ZONE_REQUEST = 'cellZones/FETCH_ONE_REQUEST';
export const FETCH_CELL_ZONE_SUCCESS = 'cellZones/FETCH_ONE_SUCCESS';
export const FETCH_CELL_ZONE_FAILURE = 'cellZones/FETCH_ONE_FAILURE';

// Create Cell Zone
export const CREATE_CELL_ZONE_REQUEST = 'cellZones/CREATE_REQUEST';
export const CREATE_CELL_ZONE_SUCCESS = 'cellZones/CREATE_SUCCESS';
export const CREATE_CELL_ZONE_FAILURE = 'cellZones/CREATE_FAILURE';

// Update Cell Zone
export const UPDATE_CELL_ZONE_REQUEST = 'cellZones/UPDATE_REQUEST';
export const UPDATE_CELL_ZONE_SUCCESS = 'cellZones/UPDATE_SUCCESS';
export const UPDATE_CELL_ZONE_FAILURE = 'cellZones/UPDATE_FAILURE';

// Delete Cell Zone
export const DELETE_CELL_ZONE_REQUEST = 'cellZones/DELETE_REQUEST';
export const DELETE_CELL_ZONE_SUCCESS = 'cellZones/DELETE_SUCCESS';
export const DELETE_CELL_ZONE_FAILURE = 'cellZones/DELETE_FAILURE';

// Fetch Cell Zone Members
export const FETCH_CELL_ZONE_MEMBERS_REQUEST = 'cellZones/FETCH_MEMBERS_REQUEST';
export const FETCH_CELL_ZONE_MEMBERS_SUCCESS = 'cellZones/FETCH_MEMBERS_SUCCESS';
export const FETCH_CELL_ZONE_MEMBERS_FAILURE = 'cellZones/FETCH_MEMBERS_FAILURE';

// Clear / Reset
export const CLEAR_CELL_ZONE_ERROR = 'cellZones/CLEAR_ERROR';
export const CLEAR_SELECTED_CELL_ZONE = 'cellZones/CLEAR_SELECTED';
export const RESET_CELL_ZONE_OPERATION = 'cellZones/RESET_OPERATION';
export const RESET_CELL_ZONE_STATE = 'cellZones/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Fetch Cell Zones
interface FetchCellZonesRequestAction {
  type: typeof FETCH_CELL_ZONES_REQUEST;
  payload?: GetCellZonesParams;
}
interface FetchCellZonesSuccessAction {
  type: typeof FETCH_CELL_ZONES_SUCCESS;
  payload: CellZone[];
}
interface FetchCellZonesFailureAction {
  type: typeof FETCH_CELL_ZONES_FAILURE;
  payload: string;
}

// Fetch Single Cell Zone
interface FetchCellZoneRequestAction {
  type: typeof FETCH_CELL_ZONE_REQUEST;
  payload: string;
}
interface FetchCellZoneSuccessAction {
  type: typeof FETCH_CELL_ZONE_SUCCESS;
  payload: CellZone;
}
interface FetchCellZoneFailureAction {
  type: typeof FETCH_CELL_ZONE_FAILURE;
  payload: string;
}

// Create Cell Zone
interface CreateCellZoneRequestAction {
  type: typeof CREATE_CELL_ZONE_REQUEST;
  payload: CellZoneFormData;
}
interface CreateCellZoneSuccessAction {
  type: typeof CREATE_CELL_ZONE_SUCCESS;
  payload: CellZone;
}
interface CreateCellZoneFailureAction {
  type: typeof CREATE_CELL_ZONE_FAILURE;
  payload: string;
}

// Update Cell Zone
interface UpdateCellZoneRequestAction {
  type: typeof UPDATE_CELL_ZONE_REQUEST;
  payload: { id: string; data: Partial<CellZoneFormData> };
}
interface UpdateCellZoneSuccessAction {
  type: typeof UPDATE_CELL_ZONE_SUCCESS;
  payload: CellZone;
}
interface UpdateCellZoneFailureAction {
  type: typeof UPDATE_CELL_ZONE_FAILURE;
  payload: string;
}

// Delete Cell Zone
interface DeleteCellZoneRequestAction {
  type: typeof DELETE_CELL_ZONE_REQUEST;
  payload: string;
}
interface DeleteCellZoneSuccessAction {
  type: typeof DELETE_CELL_ZONE_SUCCESS;
  payload: string;
}
interface DeleteCellZoneFailureAction {
  type: typeof DELETE_CELL_ZONE_FAILURE;
  payload: string;
}

// Fetch Cell Zone Members
interface FetchCellZoneMembersRequestAction {
  type: typeof FETCH_CELL_ZONE_MEMBERS_REQUEST;
  payload: { id: string; page?: number; limit?: number };
}
interface FetchCellZoneMembersSuccessAction {
  type: typeof FETCH_CELL_ZONE_MEMBERS_SUCCESS;
  payload: { members: Member[]; pagination?: PaginationInfo };
}
interface FetchCellZoneMembersFailureAction {
  type: typeof FETCH_CELL_ZONE_MEMBERS_FAILURE;
  payload: string;
}

// Clear / Reset
interface ClearCellZoneErrorAction {
  type: typeof CLEAR_CELL_ZONE_ERROR;
}
interface ClearSelectedCellZoneAction {
  type: typeof CLEAR_SELECTED_CELL_ZONE;
}
interface ResetCellZoneOperationAction {
  type: typeof RESET_CELL_ZONE_OPERATION;
}
interface ResetCellZoneStateAction {
  type: typeof RESET_CELL_ZONE_STATE;
}

// Union type
export type CellZoneActionTypes =
  | FetchCellZonesRequestAction
  | FetchCellZonesSuccessAction
  | FetchCellZonesFailureAction
  | FetchCellZoneRequestAction
  | FetchCellZoneSuccessAction
  | FetchCellZoneFailureAction
  | CreateCellZoneRequestAction
  | CreateCellZoneSuccessAction
  | CreateCellZoneFailureAction
  | UpdateCellZoneRequestAction
  | UpdateCellZoneSuccessAction
  | UpdateCellZoneFailureAction
  | DeleteCellZoneRequestAction
  | DeleteCellZoneSuccessAction
  | DeleteCellZoneFailureAction
  | FetchCellZoneMembersRequestAction
  | FetchCellZoneMembersSuccessAction
  | FetchCellZoneMembersFailureAction
  | ClearCellZoneErrorAction
  | ClearSelectedCellZoneAction
  | ResetCellZoneOperationAction
  | ResetCellZoneStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Fetch Cell Zones
export const fetchCellZonesRequest = (
  params?: GetCellZonesParams
): FetchCellZonesRequestAction => ({
  type: FETCH_CELL_ZONES_REQUEST,
  payload: params,
});

export const fetchCellZonesSuccess = (cellZones: CellZone[]): FetchCellZonesSuccessAction => ({
  type: FETCH_CELL_ZONES_SUCCESS,
  payload: cellZones,
});

export const fetchCellZonesFailure = (error: string): FetchCellZonesFailureAction => ({
  type: FETCH_CELL_ZONES_FAILURE,
  payload: error,
});

// Fetch Single Cell Zone
export const fetchCellZoneRequest = (id: string): FetchCellZoneRequestAction => ({
  type: FETCH_CELL_ZONE_REQUEST,
  payload: id,
});

export const fetchCellZoneSuccess = (cellZone: CellZone): FetchCellZoneSuccessAction => ({
  type: FETCH_CELL_ZONE_SUCCESS,
  payload: cellZone,
});

export const fetchCellZoneFailure = (error: string): FetchCellZoneFailureAction => ({
  type: FETCH_CELL_ZONE_FAILURE,
  payload: error,
});

// Create Cell Zone
export const createCellZoneRequest = (
  data: CellZoneFormData
): CreateCellZoneRequestAction => ({
  type: CREATE_CELL_ZONE_REQUEST,
  payload: data,
});

export const createCellZoneSuccess = (cellZone: CellZone): CreateCellZoneSuccessAction => ({
  type: CREATE_CELL_ZONE_SUCCESS,
  payload: cellZone,
});

export const createCellZoneFailure = (error: string): CreateCellZoneFailureAction => ({
  type: CREATE_CELL_ZONE_FAILURE,
  payload: error,
});

// Update Cell Zone
export const updateCellZoneRequest = (
  id: string,
  data: Partial<CellZoneFormData>
): UpdateCellZoneRequestAction => ({
  type: UPDATE_CELL_ZONE_REQUEST,
  payload: { id, data },
});

export const updateCellZoneSuccess = (cellZone: CellZone): UpdateCellZoneSuccessAction => ({
  type: UPDATE_CELL_ZONE_SUCCESS,
  payload: cellZone,
});

export const updateCellZoneFailure = (error: string): UpdateCellZoneFailureAction => ({
  type: UPDATE_CELL_ZONE_FAILURE,
  payload: error,
});

// Delete Cell Zone
export const deleteCellZoneRequest = (id: string): DeleteCellZoneRequestAction => ({
  type: DELETE_CELL_ZONE_REQUEST,
  payload: id,
});

export const deleteCellZoneSuccess = (id: string): DeleteCellZoneSuccessAction => ({
  type: DELETE_CELL_ZONE_SUCCESS,
  payload: id,
});

export const deleteCellZoneFailure = (error: string): DeleteCellZoneFailureAction => ({
  type: DELETE_CELL_ZONE_FAILURE,
  payload: error,
});

// Fetch Cell Zone Members
export const fetchCellZoneMembersRequest = (
  id: string,
  page?: number,
  limit?: number
): FetchCellZoneMembersRequestAction => ({
  type: FETCH_CELL_ZONE_MEMBERS_REQUEST,
  payload: { id, page, limit },
});

export const fetchCellZoneMembersSuccess = (
  members: Member[],
  pagination?: PaginationInfo
): FetchCellZoneMembersSuccessAction => ({
  type: FETCH_CELL_ZONE_MEMBERS_SUCCESS,
  payload: { members, pagination },
});

export const fetchCellZoneMembersFailure = (
  error: string
): FetchCellZoneMembersFailureAction => ({
  type: FETCH_CELL_ZONE_MEMBERS_FAILURE,
  payload: error,
});

// Clear / Reset
export const clearCellZoneError = (): ClearCellZoneErrorAction => ({
  type: CLEAR_CELL_ZONE_ERROR,
});

export const clearSelectedCellZone = (): ClearSelectedCellZoneAction => ({
  type: CLEAR_SELECTED_CELL_ZONE,
});

export const resetCellZoneOperation = (): ResetCellZoneOperationAction => ({
  type: RESET_CELL_ZONE_OPERATION,
});

export const resetCellZoneState = (): ResetCellZoneStateAction => ({
  type: RESET_CELL_ZONE_STATE,
});