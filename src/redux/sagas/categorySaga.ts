import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  FETCH_CATEGORIES_REQUEST,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from '../actions/categoryActions';


function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.getCategories);

    if (response.ok && response.data) {
      yield put(fetchCategoriesSuccess(response.data));
    } else {
      yield put(fetchCategoriesFailure('Failed to fetch categories'));
    }
  } catch (error: any) {
    yield put(fetchCategoriesFailure(error.message || 'Unknown error'));
  }
}

export default function* categorySaga() {
  yield takeLatest(FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga);
}
