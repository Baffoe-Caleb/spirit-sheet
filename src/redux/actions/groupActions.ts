export const FETCH_GROUPS_REQUEST = 'FETCH_GROUPS_REQUEST';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
export const FETCH_GROUPS_FAILURE = 'FETCH_GROUPS_FAILURE';

export const CREATE_GROUP_REQUEST = 'CREATE_GROUP_REQUEST';
export const CREATE_GROUP_SUCCESS = 'CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAILURE = 'CREATE_GROUP_FAILURE';

export const UPDATE_GROUP_REQUEST = 'UPDATE_GROUP_REQUEST';
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS';
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE';

export const DELETE_GROUP_REQUEST = 'DELETE_GROUP_REQUEST';
export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS';
export const DELETE_GROUP_FAILURE = 'DELETE_GROUP_FAILURE';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  leader?: string;
  meetingTime?: string;
  members: string[];
  memberCount?: number;
}

export const fetchGroupsRequest = (params?: { page?: number; limit?: number; search?: string }) => ({
  type: FETCH_GROUPS_REQUEST,
  payload: params,
});

export const fetchGroupsSuccess = (data: { groups: Group[]; pagination: any }) => ({
  type: FETCH_GROUPS_SUCCESS,
  payload: data,
});

export const fetchGroupsFailure = (error: string) => ({
  type: FETCH_GROUPS_FAILURE,
  payload: error,
});

export const createGroupRequest = (group: Omit<Group, '_id' | 'members'>) => ({
  type: CREATE_GROUP_REQUEST,
  payload: group,
});

export const createGroupSuccess = (group: Group) => ({
  type: CREATE_GROUP_SUCCESS,
  payload: group,
});

export const createGroupFailure = (error: string) => ({
  type: CREATE_GROUP_FAILURE,
  payload: error,
});

export const updateGroupRequest = (id: string, group: Partial<Group>) => ({
  type: UPDATE_GROUP_REQUEST,
  payload: { id, group },
});

export const updateGroupSuccess = (group: Group) => ({
  type: UPDATE_GROUP_SUCCESS,
  payload: group,
});

export const updateGroupFailure = (error: string) => ({
  type: UPDATE_GROUP_FAILURE,
  payload: error,
});

export const deleteGroupRequest = (id: string) => ({
  type: DELETE_GROUP_REQUEST,
  payload: id,
});

export const deleteGroupSuccess = (id: string) => ({
  type: DELETE_GROUP_SUCCESS,
  payload: id,
});

export const deleteGroupFailure = (error: string) => ({
  type: DELETE_GROUP_FAILURE,
  payload: error,
});
