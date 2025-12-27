import apisauce, { ApisauceInstance, ApiResponse } from 'apisauce';

// ============================================
// TYPE DEFINITIONS
// ============================================

// Generic API response
export interface ApiSuccessResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// User & Organization Types
export interface UserData {
  id: string;
  auth0Id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  permissions?: string[];
  preferences?: any;
  lastLogin?: string;
  createdAt?: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  email: string;
  type: string;
  logo?: string;
  phone?: string;
  website?: string;
  address?: any;
  subscription?: any;
  settings?: any;
  hasActiveSubscription?: boolean;
}

export interface GetCurrentUserResponse {
  success: boolean;
  message?: string;
  data?: {
    user: UserData;
    organization: OrganizationData;
  };
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: UserData;
    organization: OrganizationData;
  };
}

export interface RegisterChurchResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      auth0Id: string;
      name: string;
      email: string;
      role: string;
    };
    organization: {
      id: string;
      name: string;
      email: string;
      type: string;
      subscription: {
        plan: string;
        status: string;
        maxMembers: number;
      };
    };
  };
}

// ============================================
// MEMBER TYPES
// ============================================

export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  photo?: string;
  membershipStatus: 'active' | 'inactive' | 'pending' | 'deceased';
  membershipDate?: string;
  group?: string;
  familyId?: string;
  notes?: string;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  membershipStatus?: 'active' | 'inactive' | 'pending' | 'deceased';
  membershipDate?: string;
  group?: string;
  notes?: string;
}

export interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  group?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetMembersResponse {
  success: boolean;
  message?: string;
  data: Member[];
  pagination: PaginationInfo;
}

export interface GetMemberResponse {
  success: boolean;
  message?: string;
  data: Member;
}

export interface CreateMemberResponse {
  success: boolean;
  message?: string;
  data: Member;
}

export interface UpdateMemberResponse {
  success: boolean;
  message?: string;
  data: Member;
}

export interface DeleteMemberResponse {
  success: boolean;
  message?: string;
}

export interface SearchMembersResponse {
  success: boolean;
  message?: string;
  data: Member[];
}

export interface BirthdayMember {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  email?: string;
  phone?: string;
  photo?: string;
}

export interface GetBirthdaysResponse {
  success: boolean;
  message?: string;
  data: BirthdayMember[];
}

export interface AnniversaryMember {
  id: string;
  name: string;
  membershipDate: string;
  yearsOfMembership: number;
  email?: string;
  phone?: string;
}

export interface GetAnniversariesResponse {
  success: boolean;
  message?: string;
  data: AnniversaryMember[];
}

export interface MemberStatistics {
  memberInfo: {
    name: string;
    status: string;
    group?: string;
  };
  memberSince: string;
  yearsOfMembership: number;
  attendance: {
    totalEvents: number;
    attendedEvents: number;
    attendanceRate: number;
    lastAttendance: string | null;
  };
}

export interface GetMemberStatisticsResponse {
  success: boolean;
  message?: string;
  data: MemberStatistics;
}

// ============================================
// API INSTANCE
// ============================================

const createApi: ApisauceInstance = apisauce.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Debug monitors
createApi.addRequestTransform(request => {
  console.log('🚀 API Request:', {
    url: request.url,
    method: request.method,
  });
});

createApi.addResponseTransform(response => {
  console.log('📥 API Response:', {
    url: response.config?.url,
    status: response.status,
    ok: response.ok,
  });
});

// ============================================
// TOKEN MANAGEMENT
// ============================================

const setAuthToken = (token: string): void => {
  if (token) {
    console.log('✅ Auth token set');
    createApi.setHeader("Authorization", `Bearer ${token}`);
  }
};

const removeAuthToken = (): void => {
  console.log('🗑️ Auth token removed');
  createApi.deleteHeader("Authorization");
};

// ============================================
// AUTH ENDPOINTS
// ============================================

const getCurrentUser = (): Promise<ApiResponse<GetCurrentUserResponse>> =>
  createApi.get("/api/auth/me");

const registerChurch = (data: {
  auth0Id: string;
  email: string;
  name: string;
  churchName: string;
  churchType?: string;
  churchPhone?: string;
  churchWebsite?: string;
  address?: object;
}): Promise<ApiResponse<RegisterChurchResponse>> =>
  createApi.post("/api/auth/register-church", data);

const loginChurch = (data: {
  auth0Id: string;
  email: string;
}): Promise<ApiResponse<LoginResponse>> =>
  createApi.post("/api/auth/login", data);

// ============================================
// MEMBER ENDPOINTS
// ============================================

// Get all members with pagination, search, and filters
const getMembers = (params?: GetMembersParams): Promise<ApiResponse<GetMembersResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.group) queryParams.append('group', params.group);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  return createApi.get(`/api/members${queryString ? `?${queryString}` : ''}`);
};

// Get single member by ID
const getMemberById = (id: string): Promise<ApiResponse<GetMemberResponse>> =>
  createApi.get(`/api/members/${id}`);

// Create new member
const createMember = (data: MemberFormData): Promise<ApiResponse<CreateMemberResponse>> =>
  createApi.post("/api/members", data);

// Update member
const updateMember = (id: string, data: Partial<MemberFormData>): Promise<ApiResponse<UpdateMemberResponse>> =>
  createApi.put(`/api/members/${id}`, data);

// Delete member
const deleteMember = (id: string): Promise<ApiResponse<DeleteMemberResponse>> =>
  createApi.delete(`/api/members/${id}`);

// Search members
const searchMembers = (query: string): Promise<ApiResponse<SearchMembersResponse>> =>
  createApi.get(`/api/members/search?q=${encodeURIComponent(query)}`);

// Filter members
const filterMembers = (filters: {
  group?: string;
  status?: string;
  gender?: string;
  maritalStatus?: string;
  minAge?: number;
  maxAge?: number;
}): Promise<ApiResponse<SearchMembersResponse>> => {
  const queryParams = new URLSearchParams();

  if (filters.group) queryParams.append('group', filters.group);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.gender) queryParams.append('gender', filters.gender);
  if (filters.maritalStatus) queryParams.append('maritalStatus', filters.maritalStatus);
  if (filters.minAge) queryParams.append('minAge', filters.minAge.toString());
  if (filters.maxAge) queryParams.append('maxAge', filters.maxAge.toString());

  return createApi.get(`/api/members/filter?${queryParams.toString()}`);
};

// Get birthdays
const getBirthdays = (month?: number): Promise<ApiResponse<GetBirthdaysResponse>> =>
  createApi.get(`/api/members/birthdays${month ? `?month=${month}` : ''}`);

// Get anniversaries
const getAnniversaries = (month?: number): Promise<ApiResponse<GetAnniversariesResponse>> =>
  createApi.get(`/api/members/anniversaries${month ? `?month=${month}` : ''}`);

// Get member statistics
const getMemberStatistics = (id: string): Promise<ApiResponse<GetMemberStatisticsResponse>> =>
  createApi.get(`/api/members/${id}/statistics`);

// Get member attendance history
const getMemberAttendance = (id: string): Promise<ApiResponse<any>> =>
  createApi.get(`/api/members/${id}/attendance`);

// ============================================
// EXPORTS
// ============================================

export {
  createApi,
  setAuthToken,
  removeAuthToken,
  // Auth
  getCurrentUser,
  registerChurch,
  loginChurch,
  // Members
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  filterMembers,
  getBirthdays,
  getAnniversaries,
  getMemberStatistics,
  getMemberAttendance,
};