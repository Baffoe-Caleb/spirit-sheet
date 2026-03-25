// src/redux/sagas/cellZoneSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  FETCH_CELL_ZONES_REQUEST,
  FETCH_CELL_ZONE_REQUEST,
  CREATE_CELL_ZONE_REQUEST,
  UPDATE_CELL_ZONE_REQUEST,
  DELETE_CELL_ZONE_REQUEST,
  FETCH_CELL_ZONE_MEMBERS_REQUEST,
  fetchCellZonesSuccess,
  fetchCellZonesFailure,
  fetchCellZoneSuccess,
  fetchCellZoneFailure,
  createCellZoneSuccess,
  createCellZoneFailure,
  updateCellZoneSuccess,
  updateCellZoneFailure,
  deleteCellZoneSuccess,
  deleteCellZoneFailure,
  fetchCellZoneMembersSuccess,
  fetchCellZoneMembersFailure,
} from '../actions/cellZoneActions';
import {
  GetCellZonesResponse,
  GetCellZoneResponse,
  CreateCellZoneResponse,
  UpdateCellZoneResponse,
  DeleteCellZoneResponse,
  GetCellZoneMembersResponse,
  CellZoneFormData,
  GetCellZonesParams,
} from '../../services/api';

// ============================================
// FETCH CELL ZONES SAGA
// ============================================
function* fetchCellZonesSaga(action: {
  type: string;
  payload?: GetCellZonesParams;
}): Generator<any, void, ApiResponse<GetCellZonesResponse>> {
  try {
    const response = yield call(api.getCellZones, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchCellZonesSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch cell zones';
      yield put(fetchCellZonesFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchCellZonesFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH SINGLE CELL ZONE SAGA
// ============================================
function* fetchCellZoneSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<GetCellZoneResponse>> {
  try {
    const response = yield call(api.getCellZoneById, action.payload);

    if (response.ok && response.data?.success) {
      yield put(fetchCellZoneSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch cell zone';
      yield put(fetchCellZoneFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(fetchCellZoneFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// CREATE CELL ZONE SAGA
// ============================================
function* createCellZoneSaga(action: {
  type: string;
  payload: CellZoneFormData;
}): Generator<any, void, ApiResponse<CreateCellZoneResponse>> {
  try {
    const response = yield call(api.createCellZone, action.payload);

    if (response.ok && response.data?.success) {
      yield put(createCellZoneSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to create cell zone';
      yield put(createCellZoneFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(createCellZoneFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// UPDATE CELL ZONE SAGA
// ============================================
function* updateCellZoneSaga(action: {
  type: string;
  payload: { id: string; data: Partial<CellZoneFormData> };
}): Generator<any, void, ApiResponse<UpdateCellZoneResponse>> {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateCellZone, id, data);

    if (response.ok && response.data?.success) {
      yield put(updateCellZoneSuccess(response.data.data));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to update cell zone';
      yield put(updateCellZoneFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(updateCellZoneFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// DELETE CELL ZONE SAGA
// ============================================
function* deleteCellZoneSaga(action: {
  type: string;
  payload: string;
}): Generator<any, void, ApiResponse<DeleteCellZoneResponse>> {
  try {
    const response = yield call(api.deleteCellZone, action.payload);

    if (response.ok && response.data?.success) {
      yield put(deleteCellZoneSuccess(action.payload));
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to delete cell zone';
      yield put(deleteCellZoneFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(deleteCellZoneFailure(error.message || 'An unexpected error occurred'));
  }
}

// ============================================
// FETCH CELL ZONE MEMBERS SAGA
// ============================================
function* fetchCellZoneMembersSaga(action: {
  type: string;
  payload: { id: string; page?: number; limit?: number };
}): Generator<any, void, ApiResponse<GetCellZoneMembersResponse>> {
  try {
    const { id, page, limit } = action.payload;
    const response = yield call(api.getCellZoneMembers, id, { page, limit });

    if (response.ok && response.data?.success) {
      yield put(
        fetchCellZoneMembersSuccess(
          response.data.data,
          response.data.pagination
        )
      );
    } else {
      const errorMessage =
        (response.data as any)?.message || 'Failed to fetch cell zone members';
      yield put(fetchCellZoneMembersFailure(errorMessage));
    }
  } catch (error: any) {
    yield put(
      fetchCellZoneMembersFailure(error.message || 'An unexpected error occurred')
    );
  }
}

// ============================================
// ROOT CELL ZONE SAGA
// ============================================
export default function* cellZoneSaga() {
  yield all([
    takeLatest(FETCH_CELL_ZONES_REQUEST, fetchCellZonesSaga),
    takeLatest(FETCH_CELL_ZONE_REQUEST, fetchCellZoneSaga),
    takeLatest(CREATE_CELL_ZONE_REQUEST, createCellZoneSaga),
    takeLatest(UPDATE_CELL_ZONE_REQUEST, updateCellZoneSaga),
    takeLatest(DELETE_CELL_ZONE_REQUEST, deleteCellZoneSaga),
    takeLatest(FETCH_CELL_ZONE_MEMBERS_REQUEST, fetchCellZoneMembersSaga),
  ]);
}