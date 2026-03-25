// src/pages/Attendance.tsx

import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  CheckCircle,
  Circle,
  Calendar,
  Plus,
  Users,
  UserCheck,
  UserX,
  Clock,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  XCircle,
  Lock,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import { fetchMembersRequest } from "@/redux/actions/memberActions";
import {
  fetchEventsRequest,
  createEventRequest,
  setSelectedEvent,
  fetchEventAttendanceRequest,
  checkInRequest,
  bulkCheckInRequest,
  resetAttendanceOperation,
} from "@/redux/actions/attendanceActions";
import { Member, Event, EventFormData, Attendance as AttendanceType, getFullPhotoUrl } from "@/services/api";
import MemberAvatar from "@/components/MemberAvatar";

// ============================================
// CONSTANTS
// ============================================

const EVENT_CATEGORIES = [
  { value: 'service', label: 'Service' },
  { value: 'bible_study', label: 'Bible Study' },
  { value: 'prayer_meeting', label: 'Prayer Meeting' },
  { value: 'youth_event', label: 'Youth Event' },
  { value: 'special_event', label: 'Special Event' },
  { value: 'conference', label: 'Conference' },
  { value: 'retreat', label: 'Retreat' },
  { value: 'social', label: 'Social' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'other', label: 'Other' },
];

const GROUP_OPTIONS = [
  { value: 'children', label: 'Children' },
  { value: 'youth', label: 'Youth' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];

const INITIAL_EVENT_FORM: EventFormData = {
  name: '',
  category: 'service',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  duration: 120,
  location: '',
};

// ============================================
// HELPERS
// ============================================

/**
 * Determine if an event has expired (date + time + duration has passed).
 * Returns true if the event window has closed.
 */
const isEventExpired = (event: Event): boolean => {
  if (!event.date) return false;

  const eventDate = new Date(event.date);
  const [hours, minutes] = (event.time || '00:00').split(':').map(Number);
  eventDate.setHours(hours || 0, minutes || 0, 0, 0);

  // Add duration (default 120 min) to get the event end time
  const durationMs = (event.duration || 120) * 60 * 1000;
  const eventEnd = new Date(eventDate.getTime() + durationMs);

  return new Date() > eventEnd;
};

/**
 * Check if event is currently live (started but not ended).
 */
const isEventLive = (event: Event): boolean => {
  if (!event.date) return false;

  const now = new Date();
  const eventDate = new Date(event.date);
  const [hours, minutes] = (event.time || '00:00').split(':').map(Number);
  eventDate.setHours(hours || 0, minutes || 0, 0, 0);

  const durationMs = (event.duration || 120) * 60 * 1000;
  const eventEnd = new Date(eventDate.getTime() + durationMs);

  return now >= eventDate && now <= eventEnd;
};

// ============================================
// COMPONENT
// ============================================

const Attendance = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state - Members
  const { members, isLoading: isLoadingMembers } = useSelector(
    (state: RootState) => state.members
  );

  // Redux state - Attendance
  const {
    events,
    selectedEvent,
    isLoadingEvents,
    isCreatingEvent,
    createEventSuccess,
    createEventError,
    attendance,
    stats,
    isLoadingAttendance,
    isCheckingIn,
    checkInSuccess,
    checkInError,
    isBulkCheckingIn,
    bulkCheckInSuccess,
    bulkCheckInResult,
    bulkCheckInError,
  } = useSelector((state: RootState) => state.attendance);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>(INITIAL_EVENT_FORM);

  // Refs
  const isCreatingEventRef = useRef(false);
  const isBulkCheckingInRef = useRef(false);
  const checkingInMemberRef = useRef<string | null>(null);

  // ============================================
  // DERIVED STATE
  // ============================================

  const eventExpired = useMemo(() => {
    if (!selectedEvent) return false;
    return isEventExpired(selectedEvent);
  }, [selectedEvent]);

  const eventLive = useMemo(() => {
    if (!selectedEvent) return false;
    return isEventLive(selectedEvent);
  }, [selectedEvent]);

  // Check-in is only allowed when event is live (not expired, has started)
  const canCheckIn = useMemo(() => {
    if (!selectedEvent) return false;
    // Allow check-in if event is live OR if it's today and hasn't fully expired
    // Being slightly generous — allow check-in up until the event end time
    return !eventExpired;
  }, [selectedEvent, eventExpired]);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    dispatch(fetchEventsRequest({ limit: 50 }));
    dispatch(fetchMembersRequest({ limit: 500, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedEvent) {
      dispatch(fetchEventAttendanceRequest(selectedEvent._id));
    }
  }, [dispatch, selectedEvent]);

  useEffect(() => {
    if (!isCreatingEventRef.current) return;
    if (isCreatingEvent) return;
    if (createEventError) {
      toast({ title: "Error", description: createEventError, variant: "destructive" });
      isCreatingEventRef.current = false;
    } else if (createEventSuccess) {
      toast({ title: "Success", description: "Event created successfully" });
      setIsCreateEventModalOpen(false);
      setEventFormData(INITIAL_EVENT_FORM);
      isCreatingEventRef.current = false;
      dispatch(resetAttendanceOperation());
    }
  }, [isCreatingEvent, createEventError, createEventSuccess, toast, dispatch]);

  useEffect(() => {
    if (!checkingInMemberRef.current) return;
    if (isCheckingIn) return;
    if (checkInError) {
      toast({ title: "Check-in Failed", description: checkInError, variant: "destructive" });
    } else if (checkInSuccess) {
      toast({ title: "Success", description: "Member checked in successfully" });
    }
    checkingInMemberRef.current = null;
    dispatch(resetAttendanceOperation());
  }, [isCheckingIn, checkInError, checkInSuccess, toast, dispatch]);

  useEffect(() => {
    if (!isBulkCheckingInRef.current) return;
    if (isBulkCheckingIn) return;
    if (bulkCheckInError) {
      toast({ title: "Bulk Check-in Failed", description: bulkCheckInError, variant: "destructive" });
    } else if (bulkCheckInSuccess && bulkCheckInResult) {
      toast({
        title: "Bulk Check-in Complete",
        description: `${bulkCheckInResult.checkedIn} checked in, ${bulkCheckInResult.duplicates} already present`,
      });
      setSelectedMembers(new Set());
      if (selectedEvent) dispatch(fetchEventAttendanceRequest(selectedEvent._id));
    }
    isBulkCheckingInRef.current = false;
    dispatch(resetAttendanceOperation());
  }, [isBulkCheckingIn, bulkCheckInError, bulkCheckInSuccess, bulkCheckInResult, toast, dispatch, selectedEvent]);

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  // Map memberId → attendance record
  const attendanceByMemberId = useMemo(() => {
    const map = new Map<string, AttendanceType>();
    attendance.forEach((a) => {
      if (a.attendeeType === 'member' && a.memberId) {
        const id = typeof a.memberId === 'string' ? a.memberId : (a.memberId as Member)?._id;
        if (id) map.set(id, a);
      }
    });
    return map;
  }, [attendance]);

  const checkedInMemberIds = useMemo(() => new Set(attendanceByMemberId.keys()), [attendanceByMemberId]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === '' ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.includes(searchQuery);
      const matchesGroup = groupFilter === 'all' || member.group === groupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [members, searchQuery, groupFilter]);

  // Accurate stats computed from actual data
  const computedStats = useMemo(() => {
    const totalMembers = filteredMembers.length;
    const presentCount = filteredMembers.filter(m => {
      const record = attendanceByMemberId.get(m._id);
      return record && record.status === 'present';
    }).length;
    const lateCount = filteredMembers.filter(m => {
      const record = attendanceByMemberId.get(m._id);
      return record && record.status === 'late';
    }).length;
    const excusedCount = filteredMembers.filter(m => {
      const record = attendanceByMemberId.get(m._id);
      return record && record.status === 'excused';
    }).length;
    const checkedInCount = presentCount + lateCount;
    const missedCount = eventExpired ? (totalMembers - checkedInCount - excusedCount) : 0;
    const notCheckedInCount = totalMembers - checkedInCount - excusedCount;
    const guestCount = attendance.filter(a => a.attendeeType === 'guest').length;

    return {
      totalMembers,
      present: presentCount,
      late: lateCount,
      excused: excusedCount,
      checkedIn: checkedInCount,
      missed: missedCount,
      notCheckedIn: notCheckedInCount,
      guests: guestCount,
      totalAttendance: checkedInCount + guestCount,
    };
  }, [filteredMembers, attendanceByMemberId, attendance, eventExpired]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleEventSelect = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      dispatch(setSelectedEvent(event));
      setSelectedMembers(new Set());
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.name.trim()) {
      toast({ title: "Error", description: "Event name is required", variant: "destructive" });
      return;
    }
    if (!eventFormData.time) {
      toast({ title: "Error", description: "Event time is required", variant: "destructive" });
      return;
    }
    isCreatingEventRef.current = true;
    dispatch(createEventRequest(eventFormData));
  };

  const handleToggleMember = (memberId: string) => {
    if (!selectedEvent || !canCheckIn) return;
    if (checkedInMemberIds.has(memberId)) return;

    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) newSelected.delete(memberId);
    else newSelected.add(memberId);
    setSelectedMembers(newSelected);
  };

  const handleQuickCheckIn = (memberId: string) => {
    if (!selectedEvent) {
      toast({ title: "Select an Event", description: "Please select or create an event first", variant: "destructive" });
      return;
    }
    if (!canCheckIn) {
      toast({ title: "Event Ended", description: "This event has ended. Check-in is no longer available.", variant: "destructive" });
      return;
    }
    if (checkedInMemberIds.has(memberId)) {
      toast({ title: "Already Checked In", description: "This member is already checked in" });
      return;
    }
    checkingInMemberRef.current = memberId;
    dispatch(checkInRequest({ eventId: selectedEvent._id, memberId, checkInMethod: 'manual' }));
  };

  const handleBulkCheckIn = () => {
    if (!selectedEvent) {
      toast({ title: "Select an Event", description: "Please select or create an event first", variant: "destructive" });
      return;
    }
    if (!canCheckIn) {
      toast({ title: "Event Ended", description: "This event has ended. Check-in is no longer available.", variant: "destructive" });
      return;
    }
    if (selectedMembers.size === 0) {
      toast({ title: "No Members Selected", description: "Please select members to check in", variant: "destructive" });
      return;
    }
    isBulkCheckingInRef.current = true;
    dispatch(bulkCheckInRequest({ eventId: selectedEvent._id, memberIds: Array.from(selectedMembers), checkInMethod: 'bulk' }));
  };

  const handleRefreshAttendance = () => {
    if (selectedEvent) dispatch(fetchEventAttendanceRequest(selectedEvent._id));
  };

  const handleCloseCreateEventModal = () => {
    if (isCreatingEvent) return;
    setIsCreateEventModalOpen(false);
    setEventFormData(INITIAL_EVENT_FORM);
  };

  // ============================================
  // FORMAT HELPERS
  // ============================================

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getGroupLabel = (value?: string) =>
    value ? (GROUP_OPTIONS.find((g) => g.value === value)?.label || value) : 'N/A';

  const getCategoryLabel = (value?: string) =>
    value ? (EVENT_CATEGORIES.find((c) => c.value === value)?.label || value) : 'N/A';

  const getEventStatusBadge = () => {
    if (!selectedEvent) return null;
    if (eventExpired) return <Badge variant="destructive" className="gap-1"><Lock className="h-3 w-3" /> Ended</Badge>;
    if (eventLive) return <Badge className="bg-green-100 text-green-800 gap-1"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Live</Badge>;
    return <Badge variant="outline">Upcoming</Badge>;
  };

  // ============================================
  // MEMBER QUICK INFO POPOVER
  // ============================================

  const renderMemberPopover = (member: Member, children: React.ReactNode) => (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="text-left flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MemberAvatar
              src={getFullPhotoUrl(member.photo)}
              firstName={member.firstName}
              lastName={member.lastName}
              size="lg"
            />
            <div>
              <p className="font-semibold">{member.firstName} {member.lastName}</p>
              <p className="text-sm text-muted-foreground capitalize">{getGroupLabel(member.group)}</p>
              {member.churchRole && member.churchRole !== 'general_member' && (
                <Badge variant="outline" className="text-xs mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {member.churchRole.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            {member.phone && (
              <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{member.phone}</span>
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {!member.phone && !member.email && (
              <p className="text-sm text-muted-foreground italic">No contact info available</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  // ============================================
  // RENDER MEMBER CARD
  // ============================================

  const renderMemberCard = (member: Member, showActions: boolean = true) => {
    const isCheckedIn = checkedInMemberIds.has(member._id);
    const isSelected = selectedMembers.has(member._id);
    const attendanceRecord = attendanceByMemberId.get(member._id);
    const isLate = attendanceRecord?.status === 'late';
    const lateMinutes = attendanceRecord?.lateMinutes;
    const checkInTime = attendanceRecord?.checkInTime;
    const isMissed = eventExpired && !isCheckedIn && attendanceRecord?.status !== 'excused';

    return (
      <Card
        key={member._id}
        className={`shadow-soft hover:shadow-medium transition-all ${isCheckedIn
          ? isLate
            ? 'ring-2 ring-yellow-500 bg-yellow-50'
            : 'ring-2 ring-green-500 bg-green-50'
          : isMissed
            ? 'ring-2 ring-red-200 bg-red-50/50'
            : isSelected
              ? 'ring-2 ring-primary cursor-pointer'
              : canCheckIn ? 'cursor-pointer' : 'opacity-80'
          }`}
        onClick={() => canCheckIn && handleToggleMember(member._id)}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <MemberAvatar
            src={getFullPhotoUrl(member.photo)}
            firstName={member.firstName}
            lastName={member.lastName}
            size="md"
          />

          {/* Clickable name area — opens popover */}
          {renderMemberPopover(member, (
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{getGroupLabel(member.group)}</p>

              {/* Check-in time and late indicator */}
              {isCheckedIn && checkInTime && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    In at {formatTime(checkInTime)}
                  </span>
                  {isLate && (
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300 px-1.5 py-0">
                      <AlertTriangle className="h-3 w-3 mr-0.5" />
                      {lateMinutes ? `${lateMinutes}m late` : 'Late'}
                    </Badge>
                  )}
                </div>
              )}

              {/* Missed indicator for past events */}
              {isMissed && (
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300 mt-1 px-1.5 py-0">
                  <XCircle className="h-3 w-3 mr-0.5" />
                  Missed
                </Badge>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 shrink-0">
            {/* Check-in button — only for active events and non-checked-in members */}
            {showActions && !isCheckedIn && canCheckIn && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handleQuickCheckIn(member._id); }}
                disabled={isCheckingIn && checkingInMemberRef.current === member._id}
              >
                {isCheckingIn && checkingInMemberRef.current === member._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Check In'
                )}
              </Button>
            )}

            {/* Status icon */}
            <Tooltip>
              <TooltipTrigger>
                {isCheckedIn ? (
                  isLate ? (
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )
                ) : isMissed ? (
                  <XCircle className="h-6 w-6 text-red-400" />
                ) : isSelected ? (
                  <CheckCircle className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isCheckedIn && isLate
                  ? `Late by ${lateMinutes || '?'} min — checked in at ${checkInTime ? formatTime(checkInTime) : 'N/A'}`
                  : isCheckedIn
                    ? `Present — checked in at ${checkInTime ? formatTime(checkInTime) : 'N/A'}`
                    : isMissed
                      ? 'Missed this event'
                      : isSelected
                        ? 'Selected for bulk check-in'
                        : canCheckIn
                          ? 'Not checked in — click to select'
                          : 'Event has ended'}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <TooltipProvider>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Record Attendance</h1>
          <p className="text-muted-foreground">Mark who attended today's service or event</p>
        </div>

        {/* Event Selection */}
        <Card className="shadow-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Select Event
            </CardTitle>
            <CardDescription>Choose an existing event or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedEvent?._id || ''} onValueChange={handleEventSelect} disabled={isLoadingEvents}>
                  <SelectTrigger><SelectValue placeholder="Select an event..." /></SelectTrigger>
                  <SelectContent>
                    {events.map((event) => {
                      const expired = isEventExpired(event);
                      return (
                        <SelectItem key={event._id} value={event._id}>
                          <span className={expired ? 'text-muted-foreground' : ''}>
                            {event.name} - {formatDate(event.date)}
                            {expired ? ' (Ended)' : ''}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsCreateEventModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />New Event
              </Button>
            </div>

            {/* Selected Event Info */}
            {selectedEvent && (
              <div className={`mt-4 p-4 rounded-lg ${eventExpired ? 'bg-red-50 border border-red-200' : 'bg-muted'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedEvent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedEvent.date)}
                      {selectedEvent.time && ` at ${selectedEvent.time}`}
                      {selectedEvent.duration && ` (${selectedEvent.duration} min)`}
                      {selectedEvent.location && ` • ${selectedEvent.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEventStatusBadge()}
                    <Badge variant="outline">{getCategoryLabel(selectedEvent.category)}</Badge>
                  </div>
                </div>
                {eventExpired && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                    <Lock className="h-4 w-4" />
                    <span>This event has ended. Check-in is closed. Members who didn't attend are marked as missed.</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {selectedEvent && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card className="shadow-soft">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div>
                  <div><p className="text-xl font-bold">{computedStats.totalMembers}</p><p className="text-xs text-muted-foreground">Total Members</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-full"><UserCheck className="h-5 w-5 text-green-600" /></div>
                  <div><p className="text-xl font-bold">{computedStats.present}</p><p className="text-xs text-muted-foreground">Present</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-100 rounded-full"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div>
                  <div><p className="text-xl font-bold">{computedStats.late}</p><p className="text-xs text-muted-foreground">Late</p></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-100 rounded-full"><Clock className="h-5 w-5 text-orange-600" /></div>
                  <div><p className="text-xl font-bold">{computedStats.excused}</p><p className="text-xs text-muted-foreground">Excused</p></div>
                </div>
              </CardContent>
            </Card>
            {eventExpired && (
              <Card className="shadow-soft">
                <CardContent className="pt-5 pb-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-full"><XCircle className="h-5 w-5 text-red-600" /></div>
                    <div><p className="text-xl font-bold">{computedStats.missed}</p><p className="text-xs text-muted-foreground">Missed</p></div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="shadow-soft">
              <CardContent className="pt-5 pb-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 rounded-full"><UserX className="h-5 w-5 text-purple-600" /></div>
                  <div><p className="text-xl font-bold">{computedStats.guests}</p><p className="text-xs text-muted-foreground">Guests</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Bar */}
        {selectedEvent && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by group" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {GROUP_OPTIONS.map((g) => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefreshAttendance} disabled={isLoadingAttendance}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAttendance ? 'animate-spin' : ''}`} />Refresh
            </Button>
            {canCheckIn && (
              <Button onClick={handleBulkCheckIn} disabled={selectedMembers.size === 0 || isBulkCheckingIn}>
                {isBulkCheckingIn ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Check In ({selectedMembers.size})
              </Button>
            )}
            {eventExpired && (
              <Badge variant="destructive" className="h-10 px-4 flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" /> Check-in Closed
              </Badge>
            )}
          </div>
        )}

        {/* Members List */}
        {!selectedEvent ? (
          <Card className="shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-1">No Event Selected</p>
              <p className="text-sm text-muted-foreground mb-4">Please select an event or create a new one to record attendance</p>
              <Button onClick={() => setIsCreateEventModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />Create Event
              </Button>
            </CardContent>
          </Card>
        ) : isLoadingMembers || isLoadingAttendance ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({filteredMembers.length})</TabsTrigger>
              <TabsTrigger value="checked-in">Present ({computedStats.checkedIn})</TabsTrigger>
              <TabsTrigger value="late">Late ({computedStats.late})</TabsTrigger>
              {eventExpired && (
                <TabsTrigger value="missed">Missed ({computedStats.missed})</TabsTrigger>
              )}
              <TabsTrigger value="not-checked-in">
                {eventExpired ? `Not Present (${computedStats.notCheckedIn})` : `Not Checked In (${computedStats.notCheckedIn})`}
              </TabsTrigger>
            </TabsList>

            {/* ALL */}
            <TabsContent value="all">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => renderMemberCard(member))}
              </div>
            </TabsContent>

            {/* CHECKED IN (present + late) */}
            <TabsContent value="checked-in">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers
                  .filter((m) => checkedInMemberIds.has(m._id))
                  .map((member) => renderMemberCard(member, false))}
              </div>
              {computedStats.checkedIn === 0 && (
                <Card className="shadow-soft">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No one checked in yet</p>
                    <p className="text-sm text-muted-foreground">Start checking in members from the "All" tab</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* LATE */}
            <TabsContent value="late">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers
                  .filter((m) => attendanceByMemberId.get(m._id)?.status === 'late')
                  .map((member) => renderMemberCard(member, false))}
              </div>
              {computedStats.late === 0 && (
                <Card className="shadow-soft">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">No late arrivals</p>
                    <p className="text-sm text-muted-foreground">All checked-in members arrived on time</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* MISSED (only for expired events) */}
            {eventExpired && (
              <TabsContent value="missed">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMembers
                    .filter((m) => !checkedInMemberIds.has(m._id) && attendanceByMemberId.get(m._id)?.status !== 'excused')
                    .map((member) => renderMemberCard(member, false))}
                </div>
                {computedStats.missed === 0 && (
                  <Card className="shadow-soft">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                      <p className="text-lg font-medium">No one missed!</p>
                      <p className="text-sm text-muted-foreground">Everyone attended this event</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            {/* NOT CHECKED IN */}
            <TabsContent value="not-checked-in">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers
                  .filter((m) => !checkedInMemberIds.has(m._id))
                  .map((member) => renderMemberCard(member))}
              </div>
              {computedStats.notCheckedIn === 0 && (
                <Card className="shadow-soft">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                    <p className="text-lg font-medium">Everyone is checked in!</p>
                    <p className="text-sm text-muted-foreground">All members have been marked as present</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Create Event Modal */}
        <Dialog open={isCreateEventModalOpen} onOpenChange={handleCloseCreateEventModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Create an event to record attendance for</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input id="eventName" value={eventFormData.name} onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })} placeholder="e.g., Sunday Morning Service" required disabled={isCreatingEvent} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventCategory">Category</Label>
                <Select value={eventFormData.category} onValueChange={(value: any) => setEventFormData({ ...eventFormData, category: value })} disabled={isCreatingEvent}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date *</Label>
                <Input id="eventDate" type="date" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} required disabled={isCreatingEvent} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time *</Label>
                  <Input id="eventTime" type="time" value={eventFormData.time} onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })} required disabled={isCreatingEvent} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" min="15" step="15" value={eventFormData.duration} onChange={(e) => setEventFormData({ ...eventFormData, duration: parseInt(e.target.value) || 60 })} disabled={isCreatingEvent} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={eventFormData.location} onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })} placeholder="e.g., Main Sanctuary" disabled={isCreatingEvent} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseCreateEventModal} disabled={isCreatingEvent}>Cancel</Button>
                <Button type="submit" disabled={isCreatingEvent}>
                  {isCreatingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Event
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Attendance;