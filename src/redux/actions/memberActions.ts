export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE';

export const CREATE_MEMBER_REQUEST = 'CREATE_MEMBER_REQUEST';
export const CREATE_MEMBER_SUCCESS = 'CREATE_MEMBER_SUCCESS';
export const CREATE_MEMBER_FAILURE = 'CREATE_MEMBER_FAILURE';

export const UPDATE_MEMBER_REQUEST = 'UPDATE_MEMBER_REQUEST';
export const UPDATE_MEMBER_SUCCESS = 'UPDATE_MEMBER_SUCCESS';
export const UPDATE_MEMBER_FAILURE = 'UPDATE_MEMBER_FAILURE';

export const DELETE_MEMBER_REQUEST = 'DELETE_MEMBER_REQUEST';
export const DELETE_MEMBER_SUCCESS = 'DELETE_MEMBER_SUCCESS';
export const DELETE_MEMBER_FAILURE = 'DELETE_MEMBER_FAILURE';

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address?: string;
  groupId?: string;
}

export const fetchMembersRequest = (params?: { page?: number; limit?: number; search?: string }) => ({
  type: FETCH_MEMBERS_REQUEST,
  payload: params,
});

export const fetchMembersSuccess = (data: { members: Member[]; pagination: any }) => ({
  type: FETCH_MEMBERS_SUCCESS,
  payload: data,
});

export const fetchMembersFailure = (error: string) => ({
  type: FETCH_MEMBERS_FAILURE,
  payload: error,
});

export const createMemberRequest = (member: Omit<Member, '_id'>) => ({
  type: CREATE_MEMBER_REQUEST,
  payload: member,
});

export const createMemberSuccess = (member: Member) => ({
  type: CREATE_MEMBER_SUCCESS,
  payload: member,
});

export const createMemberFailure = (error: string) => ({
  type: CREATE_MEMBER_FAILURE,
  payload: error,
});

export const updateMemberRequest = (id: string, member: Partial<Member>) => ({
  type: UPDATE_MEMBER_REQUEST,
  payload: { id, member },
});

export const updateMemberSuccess = (member: Member) => ({
  type: UPDATE_MEMBER_SUCCESS,
  payload: member,
});

export const updateMemberFailure = (error: string) => ({
  type: UPDATE_MEMBER_FAILURE,
  payload: error,
});

export const deleteMemberRequest = (id: string) => ({
  type: DELETE_MEMBER_REQUEST,
  payload: id,
});

export const deleteMemberSuccess = (id: string) => ({
  type: DELETE_MEMBER_SUCCESS,
  payload: id,
});

export const deleteMemberFailure = (error: string) => ({
  type: DELETE_MEMBER_FAILURE,
  payload: error,
});
