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
  group?: 'children' | 'youth' | 'young_adult' | 'adult' | 'senior';
  churchRole?: ChurchRole;
  cellZoneId?: string;
  familyId?: string;
  notes?: string;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ChurchRole = 'preacher' | 'committee_leader' | 'elder' | 'deacon' | 'general_member' | 'guest_visitor';

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
  group?: 'children' | 'youth' | 'young_adult' | 'adult' | 'senior';
  churchRole?: ChurchRole;
  cellZoneId?: string;
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

export interface BulkUploadMembersResponse {
  success: boolean;
  message?: string;
  data?: {
    imported: number;
    skipped: number;
    failed: number;
    errors?: { row: number; message: string }[];
  };
}

export interface MemberPhotoResponse {
  success: boolean;
  message?: string;
  data?: {
    photoId: string;
    photoUrl: string;
    memberId: string;
  };
}

// Helper to build full photo URL from photo field value.
// The photo field can be:
//   - A MongoDB ObjectId like "69c444c0e438048d81209b13" (from member GET responses)
//   - A relative path like "/api/uploads/69c444c0e438048d81209b13" (from photo POST response)
//   - A full URL (already usable)
//   - A data: URI (already usable)
export const getFullPhotoUrl = (photo?: string): string | undefined => {
  if (!photo) return undefined;

  // Already a full URL or data URI
  if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:')) {
    return photo;
  }

  const baseUrl = "http://localhost:5000";

  // Relative path like "/api/uploads/..."
  if (photo.startsWith('/')) {
    return `${baseUrl}${photo}`;
  }

  // MongoDB ObjectId (24-char hex string) — build the uploads URL
  if (/^[a-f0-9]{24}$/i.test(photo)) {
    return `${baseUrl}/api/uploads/${photo}`;
  }

  // Fallback — treat as relative path
  return `${baseUrl}/${photo}`;
};

export interface CheckInactivityResponse {
  success: boolean;
  message?: string;
  data?: {
    markedInactive: number;
    members?: { id: string; name: string }[];
  };
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
// ROLES & PERMISSIONS TYPES
// ============================================

export type AppRole = 'administrator' | 'secretary' | 'usher' | 'member';

export interface RoleUser {
  _id: string;
  name: string;
  email: string;
  role: AppRole;
  lastLogin?: string;
  createdAt: string;
}

export interface RolePermissions {
  role: string;
  allowedPages: string[];
  allowedEndpoints: string[];
}

export interface RoleInvitation {
  _id: string;
  email: string;
  role: AppRole;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface InviteUserData {
  email: string;
  role: AppRole;
}

export interface GetRoleUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export interface GetRoleUsersResponse {
  success: boolean;
  message?: string;
  data: RoleUser[];
  pagination: PaginationInfo;
}

export interface InviteUserResponse {
  success: boolean;
  message?: string;
  data?: RoleInvitation;
}

export interface UpdateUserRoleResponse {
  success: boolean;
  message?: string;
  data?: RoleUser;
}

export interface GetRolePermissionsResponse {
  success: boolean;
  message?: string;
  data: RolePermissions;
}

export interface UpdateRolePermissionsResponse {
  success: boolean;
  message?: string;
  data: RolePermissions;
}

export interface GetInvitationsParams {
  status?: 'pending' | 'accepted' | 'expired' | 'cancelled';
}

export interface GetInvitationsResponse {
  success: boolean;
  message?: string;
  data: RoleInvitation[];
}

// ============================================
// CELL & ZONE TYPES
// ============================================

export type CellZoneType = 'cell' | 'zone' | 'district' | 'region';

export interface CellZone {
  _id: string;
  name: string;
  description?: string;
  type: CellZoneType;
  leaderId?: string | Member;
  meetingDay?: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  meetingTime?: string;
  meetingLocation?: string;
  isActive?: boolean;
  memberCount?: number;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CellZoneFormData {
  name: string;
  description?: string;
  type: CellZoneType;
  leaderId?: string;
  meetingDay?: string;
  meetingTime?: string;
  meetingLocation?: string;
  isActive?: boolean;
}

export interface GetCellZonesParams {
  type?: CellZoneType;
  isActive?: boolean;
  search?: string;
}

export interface GetCellZonesResponse {
  success: boolean;
  message?: string;
  data: CellZone[];
}

export interface GetCellZoneResponse {
  success: boolean;
  message?: string;
  data: CellZone;
}

export interface CreateCellZoneResponse {
  success: boolean;
  message?: string;
  data: CellZone;
}

export interface UpdateCellZoneResponse {
  success: boolean;
  message?: string;
  data: CellZone;
}

export interface DeleteCellZoneResponse {
  success: boolean;
  message?: string;
}

export interface GetCellZoneMembersResponse {
  success: boolean;
  message?: string;
  data: Member[];
  pagination?: PaginationInfo;
}

// ============================================
// CHURCH SETTINGS TYPES
// ============================================

export interface ChurchSettings {
  attendance?: {
    latenessThresholdTime?: string;
    inactivityThresholdDays?: number;
  };
  [key: string]: any;
}

export interface UpdateChurchSettingsData {
  settings: ChurchSettings;
  [key: string]: any;
}

export interface UpdateChurchResponse {
  success: boolean;
  message?: string;
  data?: OrganizationData;
}

// ============================================
// EVENT TYPES
// ============================================

export interface Event {
  _id: string;
  name: string;
  description?: string;
  category: 'service' | 'bible_study' | 'prayer_meeting' | 'youth_event' | 'special_event' | 'conference' | 'retreat' | 'social' | 'outreach' | 'other';
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  location?: string;
  capacity?: number;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  requiresRegistration?: boolean;
  allowGuestCheckIn?: boolean;
  tags?: string[];
  targetAudience?: string[];
  isPublic?: boolean;
  organizationId: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  isPast?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
  attendanceCount?: number;
}

export interface EventFormData {
  name: string;
  description?: string;
  category: 'service' | 'bible_study' | 'prayer_meeting' | 'youth_event' | 'special_event' | 'conference' | 'retreat' | 'social' | 'outreach' | 'other';
  date: string;
  time: string; // Required - format "HH:mm"
  duration?: number; // In minutes
  location?: string;
  capacity?: number;
  isRecurring?: boolean;
  requiresRegistration?: boolean;
  allowGuestCheckIn?: boolean;
  tags?: string[];
  targetAudience?: string[];
  isPublic?: boolean;
}
export interface GetEventsParams {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}



export interface GetEventsResponse {
  success: boolean;
  message?: string;
  data: Event[];
  pagination?: PaginationInfo;
}

export interface CreateEventResponse {
  success: boolean;
  message?: string;
  data: Event;
}

// ============================================
// ATTENDANCE TYPES
// ============================================

export interface Attendance {
  _id: string;
  organizationId: string;
  eventId: string | Event;
  memberId?: string | Member;
  guestId?: string;
  attendeeType: 'member' | 'guest';
  attendeeName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  checkInMethod?: 'manual' | 'qr_code' | 'bulk' | 'self';
  checkInBy?: string;
  notes?: string;
  reasonForAbsence?: string;
  lateMinutes?: number;
  duration?: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  members: number;
  guests: number;
}

export interface CheckInData {
  eventId: string;
  memberId?: string;
  guestInfo?: {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
    source?: string;
    ageGroup?: string;
  };
  checkInMethod?: 'manual' | 'qr_code' | 'bulk' | 'self';
}

export interface CheckOutData {
  eventId: string;
  memberId?: string;
  guestId?: string;
}

export interface BulkCheckInData {
  eventId: string;
  memberIds?: string[];
  guestIds?: string[];
  checkInMethod?: 'manual' | 'bulk';
}

export interface RecordAttendanceData {
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  reasonForAbsence?: string;
}

export interface MarkExcusedData {
  eventId: string;
  memberId?: string;
  guestId?: string;
  reason: string;
}

// Attendance API Responses
export interface CheckInResponse {
  success: boolean;
  message?: string;
  data: Attendance;
}

export interface CheckOutResponse {
  success: boolean;
  message?: string;
  data: {
    checkOutTime: string;
    duration: number;
  };
}

export interface BulkCheckInResponse {
  success: boolean;
  message?: string;
  data: {
    checkedIn: number;
    duplicates: number;
    failed: number;
    details: {
      success: Attendance[];
      duplicate: any[];
      failed: any[];
    };
  };
}

export interface GetEventAttendanceResponse {
  success: boolean;
  message?: string;
  data: Attendance[];
  stats: AttendanceStats;
}

export interface QRCodeResponse {
  success: boolean;
  message?: string;
  data: {
    qrCode: string;
    qrCodeId: string;
    url: string;
    eventId: string;
    eventName: string;
    expiresAt: string;
  };
}

export interface LateArrival {
  id: string;
  attendeeName: string;
  attendeeType: 'member' | 'guest';
  lateMinutes: number;
  checkInTime: string;
  member?: Member;
  guest?: any;
}

export interface GetLateArrivalsResponse {
  success: boolean;
  message?: string;
  data: LateArrival[];
}


export interface Group {
  _id: string;
  name: string;
  description?: string;
  category: 'bible_study' | 'fellowship' | 'service' | 'youth' | 'adult' | 'prayer' | 'worship' | 'outreach' | 'mens' | 'womens' | 'senior' | 'other';
  type?: 'small_group' | 'ministry' | 'team' | 'class' | 'other';
  status: 'active' | 'inactive' | 'paused' | 'archived';
  leaderId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    photo?: string;
  };
  coLeaders?: string[];
  meetingSchedule?: {
    day?: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    time?: string;
    frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'other';
    location?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    onlineLink?: string;
    isOnline?: boolean;
  };
  location?: string;
  room?: string;
  capacity?: number;
  currentSize?: number;
  targetAudience?: 'all' | 'men' | 'women' | 'youth' | 'children' | 'seniors' | 'young_adults' | 'couples';
  ageRange?: {
    min?: number;
    max?: number;
  };
  isOpen?: boolean;
  requiresApproval?: boolean;
  isPublic?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  hasFees?: boolean;
  feeAmount?: number;
  feeFrequency?: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  missionStatement?: string;
  tags?: string[];
  memberCount?: number;
  organizationId: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroupFormData {
  name: string;
  description?: string;
  category: 'bible_study' | 'fellowship' | 'service' | 'youth' | 'adult' | 'prayer' | 'worship' | 'outreach' | 'mens' | 'womens' | 'senior' | 'other';
  type?: 'small_group' | 'ministry' | 'team' | 'class' | 'other';
  status?: 'active' | 'inactive' | 'paused' | 'archived';
  leaderId: string;
  meetingSchedule?: {
    day?: string;
    time?: string;
    frequency?: string;
    location?: string;
    isOnline?: boolean;
    onlineLink?: string;
  };
  location?: string;
  capacity?: number;
  targetAudience?: string;
  isOpen?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  missionStatement?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  role: 'leader' | 'assistant_leader' | 'member' | 'volunteer';
  status: 'active' | 'inactive';
  joinedAt: string;
  leftAt?: string;
  membershipStatus?: string;
}

export interface GroupCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface GroupMeeting {
  _id: string;
  groupId: string;
  date: string;
  topic?: string;
  notes?: string;
  attendanceCount?: number;
  createdBy?: string;
  createdAt: string;
}

export interface GroupStatistics {
  totalMembers: number;
  activeMembers: number;
  averageAttendance: number;
  attendanceRate: number;
  meetingsHeld: number;
  growthRate: number;
  newMembers: number;
  lastMeeting: string | null;
}

export interface GetGroupsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetGroupsResponse {
  success: boolean;
  message?: string;
  data: Group[];
  pagination: PaginationInfo;
}

export interface GetGroupResponse {
  success: boolean;
  message?: string;
  data: Group & {
    memberCount: number;
    recentMeetings?: GroupMeeting[];
  };
}

export interface CreateGroupResponse {
  success: boolean;
  message?: string;
  data: Group;
}

export interface UpdateGroupResponse {
  success: boolean;
  message?: string;
  data: Group;
}

export interface DeleteGroupResponse {
  success: boolean;
  message?: string;
}

export interface GetGroupMembersResponse {
  success: boolean;
  message?: string;
  data: GroupMember[];
}

export interface AddGroupMemberResponse {
  success: boolean;
  message?: string;
  data: {
    groupId: string;
    memberId: string;
    role: string;
    joinedAt: string;
    member: {
      name: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface GetGroupCategoriesResponse {
  success: boolean;
  message?: string;
  data: GroupCategory[];
}

export interface GetGroupStatisticsResponse {
  success: boolean;
  message?: string;
  data: GroupStatistics;
}

export interface GetGroupMeetingsResponse {
  success: boolean;
  message?: string;
  data: GroupMeeting[];
  pagination?: PaginationInfo;
}


export interface Report {
  _id: string;
  name: string;
  description?: string;
  type: 'attendance_summary' | 'attendance_by_event' | 'attendance_by_member' | 'attendance_trends' | 'member_demographics' | 'member_growth' | 'member_engagement' | 'events_summary' | 'dashboard_analytics' | 'financial_summary' | 'giving_analysis' | 'custom';
  category: 'attendance' | 'members' | 'events' | 'financial' | 'dashboard' | 'custom';
  parameters?: Record<string, any>;
  filters?: {
    startDate?: string;
    endDate?: string;
    eventIds?: string[];
    memberIds?: string[];
    categories?: string[];
    groups?: string[];
    statuses?: string[];
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    nextRun?: string;
    lastRun?: string;
    recipients?: string[];
    formats?: ('pdf' | 'excel' | 'csv' | 'json')[];
  };
  columns?: {
    field: string;
    label: string;
    visible: boolean;
    sortOrder?: number;
  }[];
  isPublic?: boolean;
  isActive: boolean;
  sharedWith?: {
    userId: string;
    accessLevel: 'viewer' | 'editor';
    sharedAt: string;
  }[];
  lastGenerated?: string;
  generationCount: number;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFormData {
  name: string;
  description?: string;
  type: string;
  category: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    eventIds?: string[];
    memberIds?: string[];
  };
  schedule?: {
    enabled: boolean;
    frequency: string;
    recipients?: string[];
    formats?: string[];
  };
}

export interface ReportHistory {
  _id: string;
  reportId: string;
  reportName: string;
  reportType: string;
  parameters?: Record<string, any>;
  format: string;
  generatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  generationTime: number;
  recordCount: number;
  status: 'success' | 'failed' | 'pending';
  downloadUrl?: string;
  createdAt: string;
}

// Dashboard Analytics
export interface DashboardAnalytics {
  data: {
    overview: {
      totalMembers: number;
      activeMembers: number;
      newMembers: number;
      totalEvents: number;
      upcomingEvents: number;
      totalCheckIns: number;
      memberCheckIns: number;
      guestCheckIns: number;
      memberGrowth: string;
      lastUpdated: string;
      note?: string;
    };
    financialSummary: {
      income: number;
      expenses: number;
      net: number;
      transactionCount: number;
    };
    memberDistribution: {
      groups: Record<string, number>;
      statuses: Record<string, number>;
    };
    eventDistribution: {
      categories: Record<string, number>;
    };
    charts: {
      attendanceTrend: {
        date: string;
        attendance: number;
      }[];
      memberGrowthTrend: {
        month: string;
        newMembers: number;
      }[];
      eventAttendance: {
        eventName: string;
        eventDate: string;
        eventCategory: string;
        attendanceCount: number;
      }[];
    };
    error?: {
      message: string;
    };
  };
  recordCount: number;
  generationTime: number;
}

// Attendance Summary
export interface AttendanceSummary {
  period: {
    startDate: string;
    endDate: string;
  };
  totals: {
    totalEvents: number;
    totalAttendance: number;
    averageAttendance: number;
    attendanceRate: number;
  };
  byStatus: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  byType: {
    members: number;
    guests: number;
  };
  trends: {
    date: string;
    attendance: number;
    event?: string;
  }[];
}

// Attendance By Event
export interface AttendanceByEvent {
  events: {
    eventId: string;
    eventName: string;
    date: string;
    category: string;
    totalAttendance: number;
    members: number;
    guests: number;
    attendanceRate: number;
  }[];
  summary: {
    totalEvents: number;
    averageAttendance: number;
    highestAttendance: number;
    lowestAttendance: number;
  };
}

// Attendance By Member
export interface AttendanceByMember {
  members: {
    memberId: string;
    memberName: string;
    group?: string;
    totalEvents: number;
    attended: number;
    absent: number;
    late: number;
    attendanceRate: number;
    lastAttended?: string;
  }[];
  summary: {
    totalMembers: number;
    averageAttendanceRate: number;
    perfectAttendance: number;
    belowAverage: number;
  };
}

// Attendance Trends
export interface AttendanceTrends {
  period: string;
  data: {
    label: string;
    attendance: number;
    events: number;
    averagePerEvent: number;
  }[];
  comparison: {
    currentPeriod: number;
    previousPeriod: number;
    changePercent: number;
  };
}

// Member Demographics
export interface MemberDemographics {
  total: number;
  byGender: {
    male: number;
    female: number;
    other: number;
  };
  byAgeGroup: {
    children: number;
    youth: number;
    youngAdult: number;
    adult: number;
    senior: number;
  };
  byMaritalStatus: {
    single: number;
    married: number;
    divorced: number;
    widowed: number;
  };
  byMembershipStatus: {
    active: number;
    inactive: number;
    pending: number;
  };
  byGroup: {
    group: string;
    count: number;
  }[];
}

// Member Growth
export interface MemberGrowth {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    startingMembers: number;
    endingMembers: number;
    newMembers: number;
    lostMembers: number;
    netGrowth: number;
    growthRate: number;
  };
  monthly: {
    month: string;
    newMembers: number;
    lostMembers: number;
    netGrowth: number;
    totalMembers: number;
  }[];
}

// Member Engagement
export interface MemberEngagement {
  summary: {
    highlyEngaged: number;
    moderatelyEngaged: number;
    lowEngagement: number;
    inactive: number;
  };
  members: {
    memberId: string;
    memberName: string;
    engagementScore: number;
    attendanceRate: number;
    groupParticipation: number;
    lastActivity?: string;
    category: 'high' | 'moderate' | 'low' | 'inactive';
  }[];
}

// Events Summary
export interface EventsSummary {
  period: {
    startDate: string;
    endDate: string;
  };
  totals: {
    totalEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    totalAttendance: number;
  };
  byCategory: {
    category: string;
    count: number;
    attendance: number;
  }[];
  topEvents: {
    eventId: string;
    eventName: string;
    date: string;
    attendance: number;
  }[];
}

// Get Reports Params
export interface GetReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface GetReportsResponse {
  success: boolean;
  message?: string;
  data: Report[];
  pagination: PaginationInfo;
}

export interface GetReportResponse {
  success: boolean;
  message?: string;
  data: Report;
}

export interface CreateReportResponse {
  success: boolean;
  message?: string;
  data: Report;
}

export interface GenerateReportResponse {
  success: boolean;
  message?: string;
  data: {
    report: any;
    historyId: string;
    downloadUrl?: string;
    generationTime: number;
    format: string;
  };
}

export interface GetDashboardAnalyticsResponse {
  success: boolean;
  message?: string;
  data: DashboardAnalytics;
}

export interface GetAttendanceSummaryResponse {
  success: boolean;
  message?: string;
  data: AttendanceSummary;
}

export interface GetAttendanceByEventResponse {
  success: boolean;
  message?: string;
  data: AttendanceByEvent;
}

export interface GetAttendanceByMemberResponse {
  success: boolean;
  message?: string;
  data: AttendanceByMember;
}

export interface GetAttendanceTrendsResponse {
  success: boolean;
  message?: string;
  data: AttendanceTrends;
}

export interface GetMemberDemographicsResponse {
  success: boolean;
  message?: string;
  data: MemberDemographics;
}

export interface GetMemberGrowthResponse {
  success: boolean;
  message?: string;
  data: MemberGrowth;
}

export interface GetMemberEngagementResponse {
  success: boolean;
  message?: string;
  data: MemberEngagement;
}

export interface GetEventsSummaryResponse {
  success: boolean;
  message?: string;
  data: EventsSummary;
}

export interface GetReportHistoryResponse {
  success: boolean;
  message?: string;
  data: ReportHistory[];
  pagination?: PaginationInfo;
}

export interface ExportReportResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// ============================================
// FINANCE TYPES
// ============================================

export interface FinanceTransaction {
  _id: string;
  organizationId: string;
  transactionType: 'income' | 'expense';
  date: string;
  amount: number;
  category: string;
  subcategory?: string;
  incomeSource?: 'tithes' | 'offerings' | 'donations' | 'fundraising' | 'grants' | 'rental' | 'other';
  donorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  donorName?: string;
  isAnonymous?: boolean;
  isTaxDeductible?: boolean;
  vendor?: string;
  payee?: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'online' | 'mobile_payment' | 'other';
  reference?: string;
  checkNumber?: string;
  accountId?: string;
  budgetCategoryId?: string;
  fundId?: string;
  description?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  reconciled?: boolean;
  reconciledDate?: string;
  tags?: string[];
  fiscalYear?: number;
  fiscalQuarter?: number;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IncomeFormData {
  date: string;
  amount: number;
  category: string;
  incomeSource?: string;
  donorId?: string;
  donorName?: string;
  isAnonymous?: boolean;
  isTaxDeductible?: boolean;
  paymentMethod: string;
  checkNumber?: string;
  fundId?: string;
  description?: string;
  notes?: string;
}

export interface ExpenseFormData {
  date: string;
  amount: number;
  category: string;
  vendor?: string;
  payee?: string;
  paymentMethod: string;
  checkNumber?: string;
  budgetCategoryId?: string;
  fundId?: string;
  description?: string;
  notes?: string;
}

export interface FinancialCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Donor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalGiving: number;
  giftCount: number;
  averageGiving: number;
  lastGift: string;
  firstGift: string;
  frequency: string;
}

export interface BudgetCategory {
  _id: string;
  name: string;
  category: string;
  type: 'income' | 'expense';
  budgetedAmount: number;
  spentAmount: number;
  remaining: number;
  utilizationRate: number;
  year: number;
}

export interface BudgetSummary {
  year: number;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationRate: number;
  categories: BudgetCategory[];
}

export interface FinancialSummary {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  previousPeriod: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
  };
  growth: {
    income: number;
    expenses: number;
    net: number;
  };
}

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
  balance: number;
}

export interface GivingAnalysis {
  totalGiving: number;
  averageGiving: number;
  donorCount: number;
  regularGivers: number;
  givingTrends: {
    monthly: {
      month: string;
      amount: number;
      donors: number;
    }[];
  };
  topCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  method?: string;
  vendor?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response Types
export interface GetTransactionsResponse {
  success: boolean;
  message?: string;
  data: FinanceTransaction[];
  pagination: PaginationInfo;
  summary: {
    totalAmount: number;
    recordCount: number;
  };
}

export interface GetFinancialCategoriesResponse {
  success: boolean;
  data: {
    income?: FinancialCategory[];
    expense?: FinancialCategory[];
  };
}

export interface GetDonorsResponse {
  success: boolean;
  data: Donor[];
}

export interface GetBudgetResponse {
  success: boolean;
  data: BudgetSummary;
}

export interface GetFinancialSummaryResponse {
  success: boolean;
  data: FinancialSummary;
}

export interface GetCashFlowResponse {
  success: boolean;
  data: CashFlowData[];
}

export interface GetGivingAnalysisResponse {
  success: boolean;
  data: GivingAnalysis;
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

// Update church settings (lateness threshold, inactivity threshold, etc.)
const updateChurch = (data: UpdateChurchSettingsData): Promise<ApiResponse<UpdateChurchResponse>> =>
  createApi.put("/api/auth/church", data);

// ============================================
// MEMBER ENDPOINTS
// ============================================

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

const getMemberById = (id: string): Promise<ApiResponse<GetMemberResponse>> =>
  createApi.get(`/api/members/${id}`);

const createMember = (data: MemberFormData): Promise<ApiResponse<CreateMemberResponse>> =>
  createApi.post("/api/members", data);

const updateMember = (id: string, data: Partial<MemberFormData>): Promise<ApiResponse<UpdateMemberResponse>> =>
  createApi.put(`/api/members/${id}`, data);

const deleteMember = (id: string): Promise<ApiResponse<DeleteMemberResponse>> =>
  createApi.delete(`/api/members/${id}`);

const searchMembers = (query: string): Promise<ApiResponse<SearchMembersResponse>> =>
  createApi.get(`/api/members/search?q=${encodeURIComponent(query)}`);

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

const getBirthdays = (month?: number): Promise<ApiResponse<GetBirthdaysResponse>> =>
  createApi.get(`/api/members/birthdays${month ? `?month=${month}` : ''}`);

const getAnniversaries = (month?: number): Promise<ApiResponse<GetAnniversariesResponse>> =>
  createApi.get(`/api/members/anniversaries${month ? `?month=${month}` : ''}`);

const getMemberStatistics = (id: string): Promise<ApiResponse<GetMemberStatisticsResponse>> =>
  createApi.get(`/api/members/${id}/statistics`);

const getMemberAttendance = (id: string): Promise<ApiResponse<any>> =>
  createApi.get(`/api/members/${id}/attendance`);

// Bulk CSV upload for members (multipart/form-data)
const bulkUploadMembers = (file: File): Promise<ApiResponse<BulkUploadMembersResponse>> => {
  const formData = new FormData();
  formData.append('file', file);

  return createApi.post('/api/members/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Upload member photo (multipart/form-data)
const uploadMemberPhoto = (memberId: string, photo: File): Promise<ApiResponse<MemberPhotoResponse>> => {
  const formData = new FormData();
  formData.append('photo', photo);

  return createApi.post(`/api/members/${memberId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete member photo
const deleteMemberPhoto = (memberId: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/members/${memberId}/photo`);

// Manually trigger inactivity check
const checkMemberInactivity = (): Promise<ApiResponse<CheckInactivityResponse>> =>
  createApi.post('/api/members/check-inactivity');

// ============================================
// ROLES & PERMISSIONS ENDPOINTS
// ============================================

// Invite a user with a specific role
const inviteUser = (data: InviteUserData): Promise<ApiResponse<InviteUserResponse>> =>
  createApi.post('/api/roles/invite', data);

// Get all users with roles
const getRoleUsers = (params?: GetRoleUsersParams): Promise<ApiResponse<GetRoleUsersResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.role) queryParams.append('role', params.role);
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  return createApi.get(`/api/roles/users${queryString ? `?${queryString}` : ''}`);
};

// Update a user's role
const updateUserRole = (
  userId: string,
  data: { role: AppRole }
): Promise<ApiResponse<UpdateUserRoleResponse>> =>
  createApi.put(`/api/roles/users/${userId}/role`, data);

// Get permissions for a specific role
const getRolePermissions = (role: string): Promise<ApiResponse<GetRolePermissionsResponse>> =>
  createApi.get(`/api/roles/permissions/${role}`);

// Update permissions for a specific role
const updateRolePermissions = (
  role: string,
  data: { allowedPages: string[]; allowedEndpoints: string[] }
): Promise<ApiResponse<UpdateRolePermissionsResponse>> =>
  createApi.put(`/api/roles/permissions/${role}`, data);

// Get role invitations
const getRoleInvitations = (params?: GetInvitationsParams): Promise<ApiResponse<GetInvitationsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);

  const queryString = queryParams.toString();
  return createApi.get(`/api/roles/invitations${queryString ? `?${queryString}` : ''}`);
};

// Verify invitation token (public — no auth required)
const verifyInvitation = (token: string): Promise<ApiResponse<{
  success: boolean;
  message?: string;
  data: {
    email: string;
    role: string;
    organizationName: string;
    invitedBy?: string;
    expiresAt: string;
  };
}>> => createApi.get(`/api/roles/invitations/verify?token=${encodeURIComponent(token)}`);

// Accept invitation (requires auth)
const acceptInvitation = (data: {
  token: string;
  auth0Id: string;
  email: string;
  name: string;
}): Promise<ApiResponse<{
  success: boolean;
  message?: string;
  data?: {
    user: UserData;
    organization: OrganizationData;
  };
}>> => createApi.post('/api/roles/invitations/accept', data);

// ============================================
// CELL & ZONE ENDPOINTS
// ============================================

// Create a cell/zone
const createCellZone = (data: CellZoneFormData): Promise<ApiResponse<CreateCellZoneResponse>> =>
  createApi.post('/api/cell-zones', data);

// Get all cell/zones with filters
const getCellZones = (params?: GetCellZonesParams): Promise<ApiResponse<GetCellZonesResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.type) queryParams.append('type', params.type);
  if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  return createApi.get(`/api/cell-zones${queryString ? `?${queryString}` : ''}`);
};

// Get single cell/zone by ID
const getCellZoneById = (id: string): Promise<ApiResponse<GetCellZoneResponse>> =>
  createApi.get(`/api/cell-zones/${id}`);

// Update cell/zone
const updateCellZone = (id: string, data: Partial<CellZoneFormData>): Promise<ApiResponse<UpdateCellZoneResponse>> =>
  createApi.put(`/api/cell-zones/${id}`, data);

// Delete cell/zone
const deleteCellZone = (id: string): Promise<ApiResponse<DeleteCellZoneResponse>> =>
  createApi.delete(`/api/cell-zones/${id}`);

// Get members of a cell/zone
const getCellZoneMembers = (
  id: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<GetCellZoneMembersResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  return createApi.get(`/api/cell-zones/${id}/members${queryString ? `?${queryString}` : ''}`);
};

// ============================================
// EVENT ENDPOINTS
// ============================================

const getEvents = (params?: GetEventsParams): Promise<ApiResponse<GetEventsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/events${queryString ? `?${queryString}` : ''}`);
};

const getEventById = (id: string): Promise<ApiResponse<{ success: boolean; data: Event }>> =>
  createApi.get(`/api/events/${id}`);

const createEvent = (data: EventFormData): Promise<ApiResponse<CreateEventResponse>> =>
  createApi.post("/api/events", data);

const updateEvent = (id: string, data: Partial<EventFormData>): Promise<ApiResponse<{ success: boolean; data: Event }>> =>
  createApi.put(`/api/events/${id}`, data);

const deleteEvent = (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/events/${id}`);

// ============================================
// ATTENDANCE ENDPOINTS
// ============================================

// Check-in member or guest
const checkIn = (data: CheckInData): Promise<ApiResponse<CheckInResponse>> =>
  createApi.post("/api/attendance/checkin", data);

// Check-out member or guest
const checkOut = (data: CheckOutData): Promise<ApiResponse<CheckOutResponse>> =>
  createApi.post("/api/attendance/checkout", data);

// Bulk check-in
const bulkCheckIn = (data: BulkCheckInData): Promise<ApiResponse<BulkCheckInResponse>> =>
  createApi.post("/api/attendance/bulk-checkin", data);

// Get event attendance
const getEventAttendance = (
  eventId: string,
  params?: { status?: string; attendeeType?: string }
): Promise<ApiResponse<GetEventAttendanceResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.attendeeType) queryParams.append('attendeeType', params.attendeeType);

  const queryString = queryParams.toString();
  return createApi.get(`/api/attendance/event/${eventId}${queryString ? `?${queryString}` : ''}`);
};

// Record attendance for member at event
const recordAttendance = (
  eventId: string,
  memberId: string,
  data: RecordAttendanceData
): Promise<ApiResponse<CheckInResponse>> =>
  createApi.post(`/api/attendance/event/${eventId}/member/${memberId}`, data);

// Get attendance status for member at event
const getAttendanceStatus = (
  eventId: string,
  memberId: string
): Promise<ApiResponse<{ success: boolean; data: any }>> =>
  createApi.get(`/api/attendance/status/${eventId}/${memberId}`);

// Update attendance record
const updateAttendance = (
  id: string,
  data: Partial<RecordAttendanceData>
): Promise<ApiResponse<CheckInResponse>> =>
  createApi.put(`/api/attendance/${id}`, data);

// Delete attendance record
const deleteAttendance = (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/attendance/${id}`);

// Mark attendance as excused
const markExcused = (data: MarkExcusedData): Promise<ApiResponse<CheckInResponse>> =>
  createApi.post("/api/attendance/mark-excused", data);

// Get late arrivals for event
const getLateArrivals = (eventId: string): Promise<ApiResponse<GetLateArrivalsResponse>> =>
  createApi.get(`/api/attendance/event/${eventId}/late-arrivals`);

// Generate QR code for event
const generateQRCode = (eventId: string): Promise<ApiResponse<QRCodeResponse>> =>
  createApi.get(`/api/attendance/qr-code/${eventId}`);

// Scan QR code for check-in
const scanQRCode = (data: { qrData: string; memberId?: string; guestInfo?: any }): Promise<ApiResponse<CheckInResponse>> =>
  createApi.post("/api/attendance/scan-qr", data);


// Get all groups with pagination, search, and filters
const getGroups = (params?: GetGroupsParams): Promise<ApiResponse<GetGroupsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  return createApi.get(`/api/groups${queryString ? `?${queryString}` : ''}`);
};

// Get single group by ID
const getGroupById = (id: string): Promise<ApiResponse<GetGroupResponse>> =>
  createApi.get(`/api/groups/${id}`);

// Create new group
const createGroup = (data: GroupFormData): Promise<ApiResponse<CreateGroupResponse>> =>
  createApi.post("/api/groups", data);

// Update group
const updateGroup = (id: string, data: Partial<GroupFormData>): Promise<ApiResponse<UpdateGroupResponse>> =>
  createApi.put(`/api/groups/${id}`, data);

// Delete group
const deleteGroup = (id: string): Promise<ApiResponse<DeleteGroupResponse>> =>
  createApi.delete(`/api/groups/${id}`);

// Search groups
const searchGroups = (query: string): Promise<ApiResponse<{ success: boolean; data: Group[] }>> =>
  createApi.get(`/api/groups/search?q=${encodeURIComponent(query)}`);

// Get group categories
const getGroupCategories = (): Promise<ApiResponse<GetGroupCategoriesResponse>> =>
  createApi.get("/api/groups/categories");

// Get group members
const getGroupMembers = (
  groupId: string,
  params?: { role?: string; status?: string }
): Promise<ApiResponse<GetGroupMembersResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append('role', params.role);
  if (params?.status) queryParams.append('status', params.status);

  const queryString = queryParams.toString();
  return createApi.get(`/api/groups/${groupId}/members${queryString ? `?${queryString}` : ''}`);
};

// Add member to group
const addGroupMember = (
  groupId: string,
  data: { memberId: string; role?: string }
): Promise<ApiResponse<AddGroupMemberResponse>> =>
  createApi.post(`/api/groups/${groupId}/members`, data);

// Remove member from group
const removeGroupMember = (groupId: string, memberId: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/groups/${groupId}/members/${memberId}`);

// Update member role in group
const updateGroupMemberRole = (
  groupId: string,
  memberId: string,
  role: string
): Promise<ApiResponse<{ success: boolean; message: string; data: any }>> =>
  createApi.put(`/api/groups/${groupId}/members/${memberId}/role`, { role });

// Get group meetings
const getGroupMeetings = (
  groupId: string,
  params?: { page?: number; limit?: number; startDate?: string; endDate?: string }
): Promise<ApiResponse<GetGroupMeetingsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/groups/${groupId}/meetings${queryString ? `?${queryString}` : ''}`);
};

// Create group meeting
const createGroupMeeting = (
  groupId: string,
  data: { date: string; topic?: string; notes?: string }
): Promise<ApiResponse<{ success: boolean; message: string; data: GroupMeeting }>> =>
  createApi.post(`/api/groups/${groupId}/meetings`, data);

// Get group statistics
const getGroupStatistics = (
  groupId: string,
  period?: string
): Promise<ApiResponse<GetGroupStatisticsResponse>> =>
  createApi.get(`/api/groups/${groupId}/statistics${period ? `?period=${period}` : ''}`);



// ============================================
// REPORT ENDPOINTS
// ============================================

// Get all saved reports
const getReports = (params?: GetReportsParams): Promise<ApiResponse<GetReportsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  return createApi.get(`/api/reports${queryString ? `?${queryString}` : ''}`);
};

// Get single report by ID
const getReportById = (id: string): Promise<ApiResponse<GetReportResponse>> =>
  createApi.get(`/api/reports/${id}`);

// Create new report configuration
const createReport = (data: ReportFormData): Promise<ApiResponse<CreateReportResponse>> =>
  createApi.post("/api/reports", data);

// Update report
const updateReport = (id: string, data: Partial<ReportFormData>): Promise<ApiResponse<CreateReportResponse>> =>
  createApi.put(`/api/reports/${id}`, data);

// Delete report
const deleteReport = (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/reports/${id}`);

// Duplicate report
const duplicateReport = (id: string): Promise<ApiResponse<CreateReportResponse>> =>
  createApi.post(`/api/reports/${id}/duplicate`);

// Generate report
const generateReport = (
  id: string,
  data: { format?: string; parameters?: Record<string, any> }
): Promise<ApiResponse<GenerateReportResponse>> =>
  createApi.post(`/api/reports/${id}/generate`, data);

// Get report history
const getReportHistory = (
  id: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<GetReportHistoryResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  return createApi.get(`/api/reports/${id}/history${queryString ? `?${queryString}` : ''}`);
};

// Dashboard Analytics
const getDashboardAnalytics = (): Promise<ApiResponse<GetDashboardAnalyticsResponse>> =>
  createApi.get("/api/reports/dashboard/analytics");

// Attendance Reports
const getAttendanceSummary = (
  params: { startDate: string; endDate: string; eventId?: string }
): Promise<ApiResponse<GetAttendanceSummaryResponse>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);
  if (params.eventId) queryParams.append('eventId', params.eventId);

  return createApi.get(`/api/reports/attendance/summary?${queryParams.toString()}`);
};

const getAttendanceByEvent = (
  params: { startDate: string; endDate: string }
): Promise<ApiResponse<GetAttendanceByEventResponse>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);

  return createApi.get(`/api/reports/attendance/by-event?${queryParams.toString()}`);
};

const getAttendanceByMember = (
  params: { startDate: string; endDate: string; memberId?: string; minAttendance?: number }
): Promise<ApiResponse<GetAttendanceByMemberResponse>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);
  if (params.memberId) queryParams.append('memberId', params.memberId);
  if (params.minAttendance) queryParams.append('minAttendance', params.minAttendance.toString());

  return createApi.get(`/api/reports/attendance/by-member?${queryParams.toString()}`);
};

const getAttendanceTrends = (
  params?: { period?: string; startDate?: string; endDate?: string }
): Promise<ApiResponse<GetAttendanceTrendsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.period) queryParams.append('period', params.period);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/reports/attendance/trends${queryString ? `?${queryString}` : ''}`);
};

// Member Reports
const getMemberDemographics = (): Promise<ApiResponse<GetMemberDemographicsResponse>> =>
  createApi.get("/api/reports/members/demographics");

const getMemberGrowth = (
  params?: { startDate?: string; endDate?: string }
): Promise<ApiResponse<GetMemberGrowthResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/reports/members/growth${queryString ? `?${queryString}` : ''}`);
};

const getMemberEngagement = (
  params?: { startDate?: string; endDate?: string }
): Promise<ApiResponse<GetMemberEngagementResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/reports/members/engagement${queryString ? `?${queryString}` : ''}`);
};

// Events Summary
const getEventsSummary = (
  params: { startDate: string; endDate: string }
): Promise<ApiResponse<GetEventsSummaryResponse>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);

  return createApi.get(`/api/reports/events/summary?${queryParams.toString()}`);
};

// Export Report
const exportReport = (
  data: { reportType: string; format: string; parameters?: Record<string, any> }
): Promise<ApiResponse<ExportReportResponse>> =>
  createApi.post("/api/reports/export", data);

// Share Report
const shareReport = (
  id: string,
  data: { users: string[]; accessLevel?: string }
): Promise<ApiResponse<{ success: boolean; message: string; data: any }>> =>
  createApi.post(`/api/reports/${id}/share`, data);

// Get Shared Reports
const getSharedReports = (): Promise<ApiResponse<GetReportsResponse>> =>
  createApi.get("/api/reports/shared/with-me");


// ============================================
// FINANCE ENDPOINTS
// ============================================

// Income
const getIncome = (params?: GetTransactionsParams): Promise<ApiResponse<GetTransactionsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.method) queryParams.append('method', params.method);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/income${queryString ? `?${queryString}` : ''}`);
};

const createIncome = (data: IncomeFormData): Promise<ApiResponse<{ success: boolean; message: string; data: FinanceTransaction }>> =>
  createApi.post('/api/finance/income', data);

const updateIncome = (id: string, data: Partial<IncomeFormData>): Promise<ApiResponse<{ success: boolean; message: string; data: FinanceTransaction }>> =>
  createApi.put(`/api/finance/income/${id}`, data);

const deleteIncome = (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/finance/income/${id}`);

// Expenses
const getExpenses = (params?: GetTransactionsParams): Promise<ApiResponse<GetTransactionsResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.vendor) queryParams.append('vendor', params.vendor);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/expenses${queryString ? `?${queryString}` : ''}`);
};

const createExpense = (data: ExpenseFormData): Promise<ApiResponse<{ success: boolean; message: string; data: FinanceTransaction }>> =>
  createApi.post('/api/finance/expenses', data);

const updateExpense = (id: string, data: Partial<ExpenseFormData>): Promise<ApiResponse<{ success: boolean; message: string; data: FinanceTransaction }>> =>
  createApi.put(`/api/finance/expenses/${id}`, data);

const deleteExpense = (id: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
  createApi.delete(`/api/finance/expenses/${id}`);

// Categories
const getFinancialCategories = (type?: string): Promise<ApiResponse<GetFinancialCategoriesResponse>> => {
  const queryString = type ? `?type=${type}` : '';
  return createApi.get(`/api/finance/categories${queryString}`);
};

// Donors
const getDonors = (params?: { year?: number }): Promise<ApiResponse<GetDonorsResponse>> => {
  const queryString = params?.year ? `?year=${params.year}` : '';
  return createApi.get(`/api/finance/donors${queryString}`);
};

const getDonorGivingHistory = (id: string, params?: { year?: number; startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/donors/${id}/giving-history${queryString ? `?${queryString}` : ''}`);
};

// Budget
const getBudget = (params?: { year?: number; category?: string }): Promise<ApiResponse<GetBudgetResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.category) queryParams.append('category', params.category);

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/budget${queryString ? `?${queryString}` : ''}`);
};

// Reports
const getFinancialSummary = (params?: { period?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<GetFinancialSummaryResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.period) queryParams.append('period', params.period);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/reports/summary${queryString ? `?${queryString}` : ''}`);
};

const getCashFlowReport = (params?: { year?: number; months?: number }): Promise<ApiResponse<GetCashFlowResponse>> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.months) queryParams.append('months', params.months.toString());

  const queryString = queryParams.toString();
  return createApi.get(`/api/finance/reports/cash-flow${queryString ? `?${queryString}` : ''}`);
};

const getGivingAnalysisReport = (params?: { year?: number }): Promise<ApiResponse<GetGivingAnalysisResponse>> => {
  const queryString = params?.year ? `?year=${params.year}` : '';
  return createApi.get(`/api/finance/reports/giving-analysis${queryString}`);
};


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
  updateChurch,
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
  bulkUploadMembers,
  uploadMemberPhoto,
  deleteMemberPhoto,
  checkMemberInactivity,
  // Roles & Permissions
  inviteUser,
  getRoleUsers,
  updateUserRole,
  getRolePermissions,
  updateRolePermissions,
  getRoleInvitations,
  verifyInvitation,
  acceptInvitation,
  // Cell & Zones
  createCellZone,
  getCellZones,
  getCellZoneById,
  updateCellZone,
  deleteCellZone,
  getCellZoneMembers,
  // Events
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  // Attendance
  checkIn,
  checkOut,
  bulkCheckIn,
  getEventAttendance,
  recordAttendance,
  getAttendanceStatus,
  updateAttendance,
  deleteAttendance,
  markExcused,
  getLateArrivals,
  generateQRCode,
  scanQRCode,
  // Groups
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  searchGroups,
  getGroupCategories,
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  updateGroupMemberRole,
  getGroupMeetings,
  createGroupMeeting,
  getGroupStatistics,
  // Reports
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  duplicateReport,
  generateReport,
  getReportHistory,
  getDashboardAnalytics,
  getAttendanceSummary,
  getAttendanceByEvent,
  getAttendanceByMember,
  getAttendanceTrends,
  getMemberDemographics,
  getMemberGrowth,
  getMemberEngagement,
  getEventsSummary,
  exportReport,
  shareReport,
  getSharedReports,
  // Finance
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getFinancialCategories,
  getDonors,
  getDonorGivingHistory,
  getBudget,
  getFinancialSummary,
  getCashFlowReport,
  getGivingAnalysisReport,
};