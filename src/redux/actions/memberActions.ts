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

// Bulk Upload Members
export const BULK_UPLOAD_MEMBERS_REQUEST = 'members/BULK_UPLOAD_REQUEST';
export const BULK_UPLOAD_MEMBERS_SUCCESS = 'members/BULK_UPLOAD_SUCCESS';
export const BULK_UPLOAD_MEMBERS_FAILURE = 'members/BULK_UPLOAD_FAILURE';

// Upload Member Photo
export const UPLOAD_MEMBER_PHOTO_REQUEST = 'members/UPLOAD_PHOTO_REQUEST';
export const UPLOAD_MEMBER_PHOTO_SUCCESS = 'members/UPLOAD_PHOTO_SUCCESS';
export const UPLOAD_MEMBER_PHOTO_FAILURE = 'members/UPLOAD_PHOTO_FAILURE';

// Delete Member Photo
export const DELETE_MEMBER_PHOTO_REQUEST = 'members/DELETE_PHOTO_REQUEST';
export const DELETE_MEMBER_PHOTO_SUCCESS = 'members/DELETE_PHOTO_SUCCESS';
export const DELETE_MEMBER_PHOTO_FAILURE = 'members/DELETE_PHOTO_FAILURE';

// Check Inactivity
export const CHECK_INACTIVITY_REQUEST = 'members/CHECK_INACTIVITY_REQUEST';
export const CHECK_INACTIVITY_SUCCESS = 'members/CHECK_INACTIVITY_SUCCESS';
export const CHECK_INACTIVITY_FAILURE = 'members/CHECK_INACTIVITY_FAILURE';

// Clear States
export const CLEAR_MEMBER_ERROR = 'members/CLEAR_ERROR';
export const CLEAR_SELECTED_MEMBER = 'members/CLEAR_SELECTED';
export const RESET_MEMBER_STATE = 'members/RESET_STATE';
export const RESET_MEMBER_OPERATION = 'members/RESET_OPERATION';

// ============================================
// BULK UPLOAD RESULT TYPE
// ============================================

export interface BulkUploadResult {
  total: number;
  inserted: number;
  skipped: number;
  errorCount: number;
  errors?: { row: number; error: string; data?: any }[];
}

export interface InactivityResult {
  totalProcessed: number;
  totalMarkedInactive: number;
}

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
  payload: { members: Member[]; pagination: PaginationInfo };
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
  payload: { id: string; data: Partial<MemberFormData> };
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

// Bulk Upload Members
interface BulkUploadMembersRequestAction {
  type: typeof BULK_UPLOAD_MEMBERS_REQUEST;
  payload: File;
}
interface BulkUploadMembersSuccessAction {
  type: typeof BULK_UPLOAD_MEMBERS_SUCCESS;
  payload: BulkUploadResult;
}
interface BulkUploadMembersFailureAction {
  type: typeof BULK_UPLOAD_MEMBERS_FAILURE;
  payload: string;
}

// Upload Member Photo
interface UploadMemberPhotoRequestAction {
  type: typeof UPLOAD_MEMBER_PHOTO_REQUEST;
  payload: { memberId: string; photo: File };
}
interface UploadMemberPhotoSuccessAction {
  type: typeof UPLOAD_MEMBER_PHOTO_SUCCESS;
  payload: { memberId: string; photo: string };
}
interface UploadMemberPhotoFailureAction {
  type: typeof UPLOAD_MEMBER_PHOTO_FAILURE;
  payload: string;
}

// Delete Member Photo
interface DeleteMemberPhotoRequestAction {
  type: typeof DELETE_MEMBER_PHOTO_REQUEST;
  payload: string; // memberId
}
interface DeleteMemberPhotoSuccessAction {
  type: typeof DELETE_MEMBER_PHOTO_SUCCESS;
  payload: string; // memberId
}
interface DeleteMemberPhotoFailureAction {
  type: typeof DELETE_MEMBER_PHOTO_FAILURE;
  payload: string;
}

// Check Inactivity
interface CheckInactivityRequestAction {
  type: typeof CHECK_INACTIVITY_REQUEST;
}
interface CheckInactivitySuccessAction {
  type: typeof CHECK_INACTIVITY_SUCCESS;
  payload: InactivityResult;
}
interface CheckInactivityFailureAction {
  type: typeof CHECK_INACTIVITY_FAILURE;
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
interface ResetMemberOperationAction {
  type: typeof RESET_MEMBER_OPERATION;
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
  | BulkUploadMembersRequestAction
  | BulkUploadMembersSuccessAction
  | BulkUploadMembersFailureAction
  | UploadMemberPhotoRequestAction
  | UploadMemberPhotoSuccessAction
  | UploadMemberPhotoFailureAction
  | DeleteMemberPhotoRequestAction
  | DeleteMemberPhotoSuccessAction
  | DeleteMemberPhotoFailureAction
  | CheckInactivityRequestAction
  | CheckInactivitySuccessAction
  | CheckInactivityFailureAction
  | ClearMemberErrorAction
  | ClearSelectedMemberAction
  | ResetMemberStateAction
  | ResetMemberOperationAction;

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

// Bulk Upload Members
export const bulkUploadMembersRequest = (file: File): BulkUploadMembersRequestAction => ({
  type: BULK_UPLOAD_MEMBERS_REQUEST,
  payload: file,
});

export const bulkUploadMembersSuccess = (
  result: BulkUploadResult
): BulkUploadMembersSuccessAction => ({
  type: BULK_UPLOAD_MEMBERS_SUCCESS,
  payload: result,
});

export const bulkUploadMembersFailure = (error: string): BulkUploadMembersFailureAction => ({
  type: BULK_UPLOAD_MEMBERS_FAILURE,
  payload: error,
});

// Upload Member Photo
export const uploadMemberPhotoRequest = (
  memberId: string,
  photo: File
): UploadMemberPhotoRequestAction => ({
  type: UPLOAD_MEMBER_PHOTO_REQUEST,
  payload: { memberId, photo },
});

export const uploadMemberPhotoSuccess = (
  memberId: string,
  photo: string
): UploadMemberPhotoSuccessAction => ({
  type: UPLOAD_MEMBER_PHOTO_SUCCESS,
  payload: { memberId, photo },
});

export const uploadMemberPhotoFailure = (error: string): UploadMemberPhotoFailureAction => ({
  type: UPLOAD_MEMBER_PHOTO_FAILURE,
  payload: error,
});

// Delete Member Photo
export const deleteMemberPhotoRequest = (memberId: string): DeleteMemberPhotoRequestAction => ({
  type: DELETE_MEMBER_PHOTO_REQUEST,
  payload: memberId,
});

export const deleteMemberPhotoSuccess = (memberId: string): DeleteMemberPhotoSuccessAction => ({
  type: DELETE_MEMBER_PHOTO_SUCCESS,
  payload: memberId,
});

export const deleteMemberPhotoFailure = (error: string): DeleteMemberPhotoFailureAction => ({
  type: DELETE_MEMBER_PHOTO_FAILURE,
  payload: error,
});

// Check Inactivity
export const checkInactivityRequest = (): CheckInactivityRequestAction => ({
  type: CHECK_INACTIVITY_REQUEST,
});

export const checkInactivitySuccess = (
  result: InactivityResult
): CheckInactivitySuccessAction => ({
  type: CHECK_INACTIVITY_SUCCESS,
  payload: result,
});

export const checkInactivityFailure = (error: string): CheckInactivityFailureAction => ({
  type: CHECK_INACTIVITY_FAILURE,
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

export const resetMemberOperation = (): ResetMemberOperationAction => ({
  type: RESET_MEMBER_OPERATION,
});