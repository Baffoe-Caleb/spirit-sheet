export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE';

export const fetchMembersRequest = () => ({
    type: FETCH_MEMBERS_REQUEST,
});

export const fetchMembersSuccess = (categories: string[]) => ({
    type: FETCH_MEMBERS_SUCCESS,
    payload: categories,
});

export const fetchMembersFailure = (error: string) => ({
    type: FETCH_MEMBERS_FAILURE,
    payload: error,
});
