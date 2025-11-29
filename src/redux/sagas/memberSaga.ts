import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
    FETCH_MEMBERS_REQUEST,
    fetchMembersSuccess,
    fetchMembersFailure,
} from '../actions/memberActions';

function* fetchMembersSaga(): Generator<any, void, any> {
    try {
        const response = yield call(api.getMembers);

        if (response.ok && response.data) {
            yield put(fetchMembersSuccess(response.data));
        } else {
            yield put(fetchMembersFailure('Failed to fetch categories'));
        }
    } catch (error: any) {
        yield put(fetchMembersFailure(error.message || 'Unknown error'));
    }
}

export default function* memberSaga() {
    yield takeLatest(FETCH_MEMBERS_REQUEST, fetchMembersSaga);
}
