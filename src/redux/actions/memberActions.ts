// src/redux/actions/memberActions.ts

import { Member, PaginationInfo, MemberFormData, GetMembersParams } from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Fetch Members
export const FETCH_MEMBERS_REQUEST = 'members/FETCH_REQUEST';
export const FETCH_MEMBERS_SUCCESS = 'members/FETCH_SUCCESS';
export const FETCH_MEMBERS_FAILURE = 'members/FETCH_FAILURE';

// Fetch Single Member
export const FETCH_MEMBER_REQUEST = 'members/FETCH_ONE_REQUEST';
export const FETCH_MEMBER_SUCCESS = 'members/FETCH_ONE_SUCCESS';
export const FETCH_MEMBER_FAILURE = 'members/FETCH_ONE_FAILURE';

// Create Member
export const CREATE_MEMBER_REQUEST = 'members/CREATE_REQUEST';
export const CREATE_MEMBER_SUCCESS = 'members/CREATE_SUCCESS';
export const CREATE_MEMBER_FAILURE = 'members/CREATE_FAILURE';

// Update Member
export const UPDATE_MEMBER_REQUEST = 'members/UPDATE_REQUEST';
export const UPDATE_MEMBER_SUCCESS = 'members/UPDATE_SUCCESS';
export const UPDATE_MEMBER_FAILURE = 'members/UPDATE_FAILURE';

// Delete Member
export const DELETE_MEMBER_REQUEST = 'members/DELETE_REQUEST';
export const DELETE_MEMBER_SUCCESS = 'members/DELETE_SUCCESS';
export const DELETE_MEMBER_FAILURE = 'members/DELETE_FAILURE';

// Search Members
export const SEARCH_MEMBERS_REQUEST = 'members/SEARCH_REQUEST';
export const SEARCH_MEMBERS_SUCCESS = 'members/SEARCH_SUCCESS';
export const SEARCH_MEMBERS_FAILURE = 'members/SEARCH_FAILURE';

// Clear States
export const CLEAR_MEMBER_ERROR = 'members/CLEAR_ERROR';
export const CLEAR_SELECTED_MEMBER = 'members/CLEAR_SELECTED';
export const RESET_MEMBER_STATE = 'members/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Fetch Members
interface FetchMembersRequestAction {
  type: typeof FETCH_MEMBERS_REQUEST;
  payload?: GetMembersParams;
}

interface FetchMembersSuccessAction {
  type: typeof FETCH_MEMBERS_SUCCESS;
  payload: {
    members: Member[];
    pagination: PaginationInfo;
  };
}

interface FetchMembersFailureAction {
  type: typeof FETCH_MEMBERS_FAILURE;
  payload: string;
}

// Fetch Single Member
interface FetchMemberRequestAction {
  type: typeof FETCH_MEMBER_REQUEST;
  payload: string;
}

interface FetchMemberSuccessAction {
  type: typeof FETCH_MEMBER_SUCCESS;
  payload: Member;
}

interface FetchMemberFailureAction {
  type: typeof FETCH_MEMBER_FAILURE;
  payload: string;
}

// Create Member
interface CreateMemberRequestAction {
  type: typeof CREATE_MEMBER_REQUEST;
  payload: MemberFormData;
}

interface CreateMemberSuccessAction {
  type: typeof CREATE_MEMBER_SUCCESS;
  payload: Member;
}

interface CreateMemberFailureAction {
  type: typeof CREATE_MEMBER_FAILURE;
  payload: string;
}

// Update Member
interface UpdateMemberRequestAction {
  type: typeof UPDATE_MEMBER_REQUEST;
  payload: {
    id: string;
    data: Partial<MemberFormData>;
  };
}

interface UpdateMemberSuccessAction {
  type: typeof UPDATE_MEMBER_SUCCESS;
  payload: Member;
}

interface UpdateMemberFailureAction {
  type: typeof UPDATE_MEMBER_FAILURE;
  payload: string;
}

// Delete Member
interface DeleteMemberRequestAction {
  type: typeof DELETE_MEMBER_REQUEST;
  payload: string;
}

interface DeleteMemberSuccessAction {
  type: typeof DELETE_MEMBER_SUCCESS;
  payload: string;
}

interface DeleteMemberFailureAction {
  type: typeof DELETE_MEMBER_FAILURE;
  payload: string;
}

// Search Members
interface SearchMembersRequestAction {
  type: typeof SEARCH_MEMBERS_REQUEST;
  payload: string;
}

interface SearchMembersSuccessAction {
  type: typeof SEARCH_MEMBERS_SUCCESS;
  payload: Member[];
}

interface SearchMembersFailureAction {
  type: typeof SEARCH_MEMBERS_FAILURE;
  payload: string;
}

// Clear States
interface ClearMemberErrorAction {
  type: typeof CLEAR_MEMBER_ERROR;
}

interface ClearSelectedMemberAction {
  type: typeof CLEAR_SELECTED_MEMBER;
}

interface ResetMemberStateAction {
  type: typeof RESET_MEMBER_STATE;
}

// Union type for all actions
export type MemberActionTypes =
  | FetchMembersRequestAction
  | FetchMembersSuccessAction
  | FetchMembersFailureAction
  | FetchMemberRequestAction
  | FetchMemberSuccessAction
  | FetchMemberFailureAction
  | CreateMemberRequestAction
  | CreateMemberSuccessAction
  | CreateMemberFailureAction
  | UpdateMemberRequestAction
  | UpdateMemberSuccessAction
  | UpdateMemberFailureAction
  | DeleteMemberRequestAction
  | DeleteMemberSuccessAction
  | DeleteMemberFailureAction
  | SearchMembersRequestAction
  | SearchMembersSuccessAction
  | SearchMembersFailureAction
  | ClearMemberErrorAction
  | ClearSelectedMemberAction
  | ResetMemberStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Fetch Members
export const fetchMembersRequest = (params?: GetMembersParams): FetchMembersRequestAction => ({
  type: FETCH_MEMBERS_REQUEST,
  payload: params,
});

export const fetchMembersSuccess = (
  members: Member[],
  pagination: PaginationInfo
): FetchMembersSuccessAction => ({
  type: FETCH_MEMBERS_SUCCESS,
  payload: { members, pagination },
});

export const fetchMembersFailure = (error: string): FetchMembersFailureAction => ({
  type: FETCH_MEMBERS_FAILURE,
  payload: error,
});

// Fetch Single Member
export const fetchMemberRequest = (id: string): FetchMemberRequestAction => ({
  type: FETCH_MEMBER_REQUEST,
  payload: id,
});

export const fetchMemberSuccess = (member: Member): FetchMemberSuccessAction => ({
  type: FETCH_MEMBER_SUCCESS,
  payload: member,
});

export const fetchMemberFailure = (error: string): FetchMemberFailureAction => ({
  type: FETCH_MEMBER_FAILURE,
  payload: error,
});

// Create Member
export const createMemberRequest = (data: MemberFormData): CreateMemberRequestAction => ({
  type: CREATE_MEMBER_REQUEST,
  payload: data,
});

export const createMemberSuccess = (member: Member): CreateMemberSuccessAction => ({
  type: CREATE_MEMBER_SUCCESS,
  payload: member,
});

export const createMemberFailure = (error: string): CreateMemberFailureAction => ({
  type: CREATE_MEMBER_FAILURE,
  payload: error,
});

// Update Member
export const updateMemberRequest = (
  id: string,
  data: Partial<MemberFormData>
): UpdateMemberRequestAction => ({
  type: UPDATE_MEMBER_REQUEST,
  payload: { id, data },
});

export const updateMemberSuccess = (member: Member): UpdateMemberSuccessAction => ({
  type: UPDATE_MEMBER_SUCCESS,
  payload: member,
});

export const updateMemberFailure = (error: string): UpdateMemberFailureAction => ({
  type: UPDATE_MEMBER_FAILURE,
  payload: error,
});

// Delete Member
export const deleteMemberRequest = (id: string): DeleteMemberRequestAction => ({
  type: DELETE_MEMBER_REQUEST,
  payload: id,
});

export const deleteMemberSuccess = (id: string): DeleteMemberSuccessAction => ({
  type: DELETE_MEMBER_SUCCESS,
  payload: id,
});

export const deleteMemberFailure = (error: string): DeleteMemberFailureAction => ({
  type: DELETE_MEMBER_FAILURE,
  payload: error,
});

// Search Members
export const searchMembersRequest = (query: string): SearchMembersRequestAction => ({
  type: SEARCH_MEMBERS_REQUEST,
  payload: query,
});

export const searchMembersSuccess = (members: Member[]): SearchMembersSuccessAction => ({
  type: SEARCH_MEMBERS_SUCCESS,
  payload: members,
});

export const searchMembersFailure = (error: string): SearchMembersFailureAction => ({
  type: SEARCH_MEMBERS_FAILURE,
  payload: error,
});

// Clear States
export const clearMemberError = (): ClearMemberErrorAction => ({
  type: CLEAR_MEMBER_ERROR,
});

export const clearSelectedMember = (): ClearSelectedMemberAction => ({
  type: CLEAR_SELECTED_MEMBER,
});

export const resetMemberState = (): ResetMemberStateAction => ({
  type: RESET_MEMBER_STATE,
});