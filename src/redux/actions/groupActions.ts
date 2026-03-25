// src/redux/actions/groupActions.ts

import {
  Group,
  GroupFormData,
  GroupMember,
  GroupCategory,
  GroupStatistics,
  PaginationInfo,
  GetGroupsParams,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Fetch Groups
export const FETCH_GROUPS_REQUEST = 'groups/FETCH_REQUEST';
export const FETCH_GROUPS_SUCCESS = 'groups/FETCH_SUCCESS';
export const FETCH_GROUPS_FAILURE = 'groups/FETCH_FAILURE';

// Fetch Single Group
export const FETCH_GROUP_REQUEST = 'groups/FETCH_ONE_REQUEST';
export const FETCH_GROUP_SUCCESS = 'groups/FETCH_ONE_SUCCESS';
export const FETCH_GROUP_FAILURE = 'groups/FETCH_ONE_FAILURE';

// Create Group
export const CREATE_GROUP_REQUEST = 'groups/CREATE_REQUEST';
export const CREATE_GROUP_SUCCESS = 'groups/CREATE_SUCCESS';
export const CREATE_GROUP_FAILURE = 'groups/CREATE_FAILURE';

// Update Group
export const UPDATE_GROUP_REQUEST = 'groups/UPDATE_REQUEST';
export const UPDATE_GROUP_SUCCESS = 'groups/UPDATE_SUCCESS';
export const UPDATE_GROUP_FAILURE = 'groups/UPDATE_FAILURE';

// Delete Group
export const DELETE_GROUP_REQUEST = 'groups/DELETE_REQUEST';
export const DELETE_GROUP_SUCCESS = 'groups/DELETE_SUCCESS';
export const DELETE_GROUP_FAILURE = 'groups/DELETE_FAILURE';

// Fetch Categories
export const FETCH_CATEGORIES_REQUEST = 'groups/FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'groups/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'groups/FETCH_CATEGORIES_FAILURE';

// Group Members
export const FETCH_GROUP_MEMBERS_REQUEST = 'groups/FETCH_MEMBERS_REQUEST';
export const FETCH_GROUP_MEMBERS_SUCCESS = 'groups/FETCH_MEMBERS_SUCCESS';
export const FETCH_GROUP_MEMBERS_FAILURE = 'groups/FETCH_MEMBERS_FAILURE';

export const ADD_GROUP_MEMBER_REQUEST = 'groups/ADD_MEMBER_REQUEST';
export const ADD_GROUP_MEMBER_SUCCESS = 'groups/ADD_MEMBER_SUCCESS';
export const ADD_GROUP_MEMBER_FAILURE = 'groups/ADD_MEMBER_FAILURE';

export const REMOVE_GROUP_MEMBER_REQUEST = 'groups/REMOVE_MEMBER_REQUEST';
export const REMOVE_GROUP_MEMBER_SUCCESS = 'groups/REMOVE_MEMBER_SUCCESS';
export const REMOVE_GROUP_MEMBER_FAILURE = 'groups/REMOVE_MEMBER_FAILURE';

// Group Statistics
export const FETCH_GROUP_STATISTICS_REQUEST = 'groups/FETCH_STATISTICS_REQUEST';
export const FETCH_GROUP_STATISTICS_SUCCESS = 'groups/FETCH_STATISTICS_SUCCESS';
export const FETCH_GROUP_STATISTICS_FAILURE = 'groups/FETCH_STATISTICS_FAILURE';

// Clear States
export const SET_SELECTED_GROUP = 'groups/SET_SELECTED';
export const CLEAR_GROUP_ERROR = 'groups/CLEAR_ERROR';
export const RESET_GROUP_OPERATION = 'groups/RESET_OPERATION';
export const RESET_GROUP_STATE = 'groups/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Fetch Groups
interface FetchGroupsRequestAction {
  type: typeof FETCH_GROUPS_REQUEST;
  payload?: GetGroupsParams;
}

interface FetchGroupsSuccessAction {
  type: typeof FETCH_GROUPS_SUCCESS;
  payload: { groups: Group[]; pagination: PaginationInfo };
}

interface FetchGroupsFailureAction {
  type: typeof FETCH_GROUPS_FAILURE;
  payload: string;
}

// Fetch Single Group
interface FetchGroupRequestAction {
  type: typeof FETCH_GROUP_REQUEST;
  payload: string;
}

interface FetchGroupSuccessAction {
  type: typeof FETCH_GROUP_SUCCESS;
  payload: Group;
}

interface FetchGroupFailureAction {
  type: typeof FETCH_GROUP_FAILURE;
  payload: string;
}

// Create Group
interface CreateGroupRequestAction {
  type: typeof CREATE_GROUP_REQUEST;
  payload: GroupFormData;
}

interface CreateGroupSuccessAction {
  type: typeof CREATE_GROUP_SUCCESS;
  payload: Group;
}

interface CreateGroupFailureAction {
  type: typeof CREATE_GROUP_FAILURE;
  payload: string;
}

// Update Group
interface UpdateGroupRequestAction {
  type: typeof UPDATE_GROUP_REQUEST;
  payload: { id: string; data: Partial<GroupFormData> };
}

interface UpdateGroupSuccessAction {
  type: typeof UPDATE_GROUP_SUCCESS;
  payload: Group;
}

interface UpdateGroupFailureAction {
  type: typeof UPDATE_GROUP_FAILURE;
  payload: string;
}

// Delete Group
interface DeleteGroupRequestAction {
  type: typeof DELETE_GROUP_REQUEST;
  payload: string;
}

interface DeleteGroupSuccessAction {
  type: typeof DELETE_GROUP_SUCCESS;
  payload: string;
}

interface DeleteGroupFailureAction {
  type: typeof DELETE_GROUP_FAILURE;
  payload: string;
}

// Fetch Categories
interface FetchCategoriesRequestAction {
  type: typeof FETCH_CATEGORIES_REQUEST;
}

interface FetchCategoriesSuccessAction {
  type: typeof FETCH_CATEGORIES_SUCCESS;
  payload: GroupCategory[];
}

interface FetchCategoriesFailureAction {
  type: typeof FETCH_CATEGORIES_FAILURE;
  payload: string;
}

// Fetch Group Members
interface FetchGroupMembersRequestAction {
  type: typeof FETCH_GROUP_MEMBERS_REQUEST;
  payload: { groupId: string; role?: string; status?: string };
}

interface FetchGroupMembersSuccessAction {
  type: typeof FETCH_GROUP_MEMBERS_SUCCESS;
  payload: GroupMember[];
}

interface FetchGroupMembersFailureAction {
  type: typeof FETCH_GROUP_MEMBERS_FAILURE;
  payload: string;
}

// Add Group Member
interface AddGroupMemberRequestAction {
  type: typeof ADD_GROUP_MEMBER_REQUEST;
  payload: { groupId: string; memberId: string; role?: string };
}

interface AddGroupMemberSuccessAction {
  type: typeof ADD_GROUP_MEMBER_SUCCESS;
  payload: GroupMember;
}

interface AddGroupMemberFailureAction {
  type: typeof ADD_GROUP_MEMBER_FAILURE;
  payload: string;
}

// Remove Group Member
interface RemoveGroupMemberRequestAction {
  type: typeof REMOVE_GROUP_MEMBER_REQUEST;
  payload: { groupId: string; memberId: string };
}

interface RemoveGroupMemberSuccessAction {
  type: typeof REMOVE_GROUP_MEMBER_SUCCESS;
  payload: string;
}

interface RemoveGroupMemberFailureAction {
  type: typeof REMOVE_GROUP_MEMBER_FAILURE;
  payload: string;
}

// Fetch Group Statistics
interface FetchGroupStatisticsRequestAction {
  type: typeof FETCH_GROUP_STATISTICS_REQUEST;
  payload: { groupId: string; period?: string };
}

interface FetchGroupStatisticsSuccessAction {
  type: typeof FETCH_GROUP_STATISTICS_SUCCESS;
  payload: GroupStatistics;
}

interface FetchGroupStatisticsFailureAction {
  type: typeof FETCH_GROUP_STATISTICS_FAILURE;
  payload: string;
}

// Clear States
interface SetSelectedGroupAction {
  type: typeof SET_SELECTED_GROUP;
  payload: Group | null;
}

interface ClearGroupErrorAction {
  type: typeof CLEAR_GROUP_ERROR;
}

interface ResetGroupOperationAction {
  type: typeof RESET_GROUP_OPERATION;
}

interface ResetGroupStateAction {
  type: typeof RESET_GROUP_STATE;
}

// Union type
export type GroupActionTypes =
  | FetchGroupsRequestAction
  | FetchGroupsSuccessAction
  | FetchGroupsFailureAction
  | FetchGroupRequestAction
  | FetchGroupSuccessAction
  | FetchGroupFailureAction
  | CreateGroupRequestAction
  | CreateGroupSuccessAction
  | CreateGroupFailureAction
  | UpdateGroupRequestAction
  | UpdateGroupSuccessAction
  | UpdateGroupFailureAction
  | DeleteGroupRequestAction
  | DeleteGroupSuccessAction
  | DeleteGroupFailureAction
  | FetchCategoriesRequestAction
  | FetchCategoriesSuccessAction
  | FetchCategoriesFailureAction
  | FetchGroupMembersRequestAction
  | FetchGroupMembersSuccessAction
  | FetchGroupMembersFailureAction
  | AddGroupMemberRequestAction
  | AddGroupMemberSuccessAction
  | AddGroupMemberFailureAction
  | RemoveGroupMemberRequestAction
  | RemoveGroupMemberSuccessAction
  | RemoveGroupMemberFailureAction
  | FetchGroupStatisticsRequestAction
  | FetchGroupStatisticsSuccessAction
  | FetchGroupStatisticsFailureAction
  | SetSelectedGroupAction
  | ClearGroupErrorAction
  | ResetGroupOperationAction
  | ResetGroupStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Fetch Groups
export const fetchGroupsRequest = (params?: GetGroupsParams): FetchGroupsRequestAction => ({
  type: FETCH_GROUPS_REQUEST,
  payload: params,
});

export const fetchGroupsSuccess = (
  groups: Group[],
  pagination: PaginationInfo
): FetchGroupsSuccessAction => ({
  type: FETCH_GROUPS_SUCCESS,
  payload: { groups, pagination },
});

export const fetchGroupsFailure = (error: string): FetchGroupsFailureAction => ({
  type: FETCH_GROUPS_FAILURE,
  payload: error,
});

// Fetch Single Group
export const fetchGroupRequest = (id: string): FetchGroupRequestAction => ({
  type: FETCH_GROUP_REQUEST,
  payload: id,
});

export const fetchGroupSuccess = (group: Group): FetchGroupSuccessAction => ({
  type: FETCH_GROUP_SUCCESS,
  payload: group,
});

export const fetchGroupFailure = (error: string): FetchGroupFailureAction => ({
  type: FETCH_GROUP_FAILURE,
  payload: error,
});

// Create Group
export const createGroupRequest = (data: GroupFormData): CreateGroupRequestAction => ({
  type: CREATE_GROUP_REQUEST,
  payload: data,
});

export const createGroupSuccess = (group: Group): CreateGroupSuccessAction => ({
  type: CREATE_GROUP_SUCCESS,
  payload: group,
});

export const createGroupFailure = (error: string): CreateGroupFailureAction => ({
  type: CREATE_GROUP_FAILURE,
  payload: error,
});

// Update Group
export const updateGroupRequest = (
  id: string,
  data: Partial<GroupFormData>
): UpdateGroupRequestAction => ({
  type: UPDATE_GROUP_REQUEST,
  payload: { id, data },
});

export const updateGroupSuccess = (group: Group): UpdateGroupSuccessAction => ({
  type: UPDATE_GROUP_SUCCESS,
  payload: group,
});

export const updateGroupFailure = (error: string): UpdateGroupFailureAction => ({
  type: UPDATE_GROUP_FAILURE,
  payload: error,
});

// Delete Group
export const deleteGroupRequest = (id: string): DeleteGroupRequestAction => ({
  type: DELETE_GROUP_REQUEST,
  payload: id,
});

export const deleteGroupSuccess = (id: string): DeleteGroupSuccessAction => ({
  type: DELETE_GROUP_SUCCESS,
  payload: id,
});

export const deleteGroupFailure = (error: string): DeleteGroupFailureAction => ({
  type: DELETE_GROUP_FAILURE,
  payload: error,
});

// Fetch Categories
export const fetchCategoriesRequest = (): FetchCategoriesRequestAction => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = (categories: GroupCategory[]): FetchCategoriesSuccessAction => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = (error: string): FetchCategoriesFailureAction => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

// Fetch Group Members
export const fetchGroupMembersRequest = (
  groupId: string,
  role?: string,
  status?: string
): FetchGroupMembersRequestAction => ({
  type: FETCH_GROUP_MEMBERS_REQUEST,
  payload: { groupId, role, status },
});

export const fetchGroupMembersSuccess = (members: GroupMember[]): FetchGroupMembersSuccessAction => ({
  type: FETCH_GROUP_MEMBERS_SUCCESS,
  payload: members,
});

export const fetchGroupMembersFailure = (error: string): FetchGroupMembersFailureAction => ({
  type: FETCH_GROUP_MEMBERS_FAILURE,
  payload: error,
});

// Add Group Member
export const addGroupMemberRequest = (
  groupId: string,
  memberId: string,
  role?: string
): AddGroupMemberRequestAction => ({
  type: ADD_GROUP_MEMBER_REQUEST,
  payload: { groupId, memberId, role },
});

export const addGroupMemberSuccess = (member: GroupMember): AddGroupMemberSuccessAction => ({
  type: ADD_GROUP_MEMBER_SUCCESS,
  payload: member,
});

export const addGroupMemberFailure = (error: string): AddGroupMemberFailureAction => ({
  type: ADD_GROUP_MEMBER_FAILURE,
  payload: error,
});

// Remove Group Member
export const removeGroupMemberRequest = (
  groupId: string,
  memberId: string
): RemoveGroupMemberRequestAction => ({
  type: REMOVE_GROUP_MEMBER_REQUEST,
  payload: { groupId, memberId },
});

export const removeGroupMemberSuccess = (memberId: string): RemoveGroupMemberSuccessAction => ({
  type: REMOVE_GROUP_MEMBER_SUCCESS,
  payload: memberId,
});

export const removeGroupMemberFailure = (error: string): RemoveGroupMemberFailureAction => ({
  type: REMOVE_GROUP_MEMBER_FAILURE,
  payload: error,
});

// Fetch Group Statistics
export const fetchGroupStatisticsRequest = (
  groupId: string,
  period?: string
): FetchGroupStatisticsRequestAction => ({
  type: FETCH_GROUP_STATISTICS_REQUEST,
  payload: { groupId, period },
});

export const fetchGroupStatisticsSuccess = (
  statistics: GroupStatistics
): FetchGroupStatisticsSuccessAction => ({
  type: FETCH_GROUP_STATISTICS_SUCCESS,
  payload: statistics,
});

export const fetchGroupStatisticsFailure = (error: string): FetchGroupStatisticsFailureAction => ({
  type: FETCH_GROUP_STATISTICS_FAILURE,
  payload: error,
});

// Clear States
export const setSelectedGroup = (group: Group | null): SetSelectedGroupAction => ({
  type: SET_SELECTED_GROUP,
  payload: group,
});

export const clearGroupError = (): ClearGroupErrorAction => ({
  type: CLEAR_GROUP_ERROR,
});

export const resetGroupOperation = (): ResetGroupOperationAction => ({
  type: RESET_GROUP_OPERATION,
});

export const resetGroupState = (): ResetGroupStateAction => ({
  type: RESET_GROUP_STATE,
});