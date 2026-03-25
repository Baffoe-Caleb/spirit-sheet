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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Member, Event, EventFormData } from "@/services/api";

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
  // EFFECTS
  // ============================================

  // Fetch events and members on mount
  useEffect(() => {
    dispatch(fetchEventsRequest({ limit: 50 }));
    dispatch(fetchMembersRequest({ limit: 500, status: 'active' }));
  }, [dispatch]);

  // Fetch attendance when event is selected
  useEffect(() => {
    if (selectedEvent) {
      dispatch(fetchEventAttendanceRequest(selectedEvent._id));
    }
  }, [dispatch, selectedEvent]);

  // Handle create event success
  useEffect(() => {
    if (!isCreatingEventRef.current) return;
    if (isCreatingEvent) return;

    if (createEventError) {
      toast({
        title: "Error",
        description: createEventError,
        variant: "destructive",
      });
      isCreatingEventRef.current = false;
    } else if (createEventSuccess) {
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setIsCreateEventModalOpen(false);
      setEventFormData(INITIAL_EVENT_FORM);
      isCreatingEventRef.current = false;
      dispatch(resetAttendanceOperation());
    }
  }, [isCreatingEvent, createEventError, createEventSuccess, toast, dispatch]);

  // Handle check-in success
  useEffect(() => {
    if (!checkingInMemberRef.current) return;
    if (isCheckingIn) return;

    if (checkInError) {
      toast({
        title: "Check-in Failed",
        description: checkInError,
        variant: "destructive",
      });
    } else if (checkInSuccess) {
      toast({
        title: "Success",
        description: "Member checked in successfully",
      });
    }
    checkingInMemberRef.current = null;
    dispatch(resetAttendanceOperation());
  }, [isCheckingIn, checkInError, checkInSuccess, toast, dispatch]);

  // Handle bulk check-in success
  useEffect(() => {
    if (!isBulkCheckingInRef.current) return;
    if (isBulkCheckingIn) return;

    if (bulkCheckInError) {
      toast({
        title: "Bulk Check-in Failed",
        description: bulkCheckInError,
        variant: "destructive",
      });
    } else if (bulkCheckInSuccess && bulkCheckInResult) {
      toast({
        title: "Bulk Check-in Complete",
        description: `${bulkCheckInResult.checkedIn} checked in, ${bulkCheckInResult.duplicates} already present`,
      });
      setSelectedMembers(new Set());
      // Refresh attendance
      if (selectedEvent) {
        dispatch(fetchEventAttendanceRequest(selectedEvent._id));
      }
    }
    isBulkCheckingInRef.current = false;
    dispatch(resetAttendanceOperation());
  }, [isBulkCheckingIn, bulkCheckInError, bulkCheckInSuccess, bulkCheckInResult, toast, dispatch, selectedEvent]);

  // ============================================
  // MEMOIZED VALUES
  // ============================================

  // Get set of checked-in member IDs
  const checkedInMemberIds = useMemo(() => {
    return new Set(
      attendance
        .filter((a) => a.attendeeType === 'member' && a.memberId)
        .map((a) => typeof a.memberId === 'string' ? a.memberId : (a.memberId as Member)?._id)
    );
  }, [attendance]);

  // Filter members
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
      toast({
        title: "Error",
        description: "Event name is required",
        variant: "destructive",
      });
      return;
    }

    if (!eventFormData.time) {
      toast({
        title: "Error",
        description: "Event time is required",
        variant: "destructive",
      });
      return;
    }

    isCreatingEventRef.current = true;
    dispatch(createEventRequest(eventFormData));
  };

  const handleToggleMember = (memberId: string) => {
    if (!selectedEvent) {
      toast({
        title: "Select an Event",
        description: "Please select or create an event first",
        variant: "destructive",
      });
      return;
    }

    // If already checked in, don't allow toggle
    if (checkedInMemberIds.has(memberId)) {
      return;
    }

    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleQuickCheckIn = (memberId: string) => {
    if (!selectedEvent) {
      toast({
        title: "Select an Event",
        description: "Please select or create an event first",
        variant: "destructive",
      });
      return;
    }

    if (checkedInMemberIds.has(memberId)) {
      toast({
        title: "Already Checked In",
        description: "This member is already checked in",
      });
      return;
    }

    checkingInMemberRef.current = memberId;
    dispatch(
      checkInRequest({
        eventId: selectedEvent._id,
        memberId,
        checkInMethod: 'manual',
      })
    );
  };

  const handleBulkCheckIn = () => {
    if (!selectedEvent) {
      toast({
        title: "Select an Event",
        description: "Please select or create an event first",
        variant: "destructive",
      });
      return;
    }

    if (selectedMembers.size === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select members to check in",
        variant: "destructive",
      });
      return;
    }

    isBulkCheckingInRef.current = true;
    dispatch(
      bulkCheckInRequest({
        eventId: selectedEvent._id,
        memberIds: Array.from(selectedMembers),
        checkInMethod: 'bulk',
      })
    );
  };

  const handleRefreshAttendance = () => {
    if (selectedEvent) {
      dispatch(fetchEventAttendanceRequest(selectedEvent._id));
    }
  };

  const handleCloseCreateEventModal = () => {
    if (isCreatingEvent) return;
    setIsCreateEventModalOpen(false);
    setEventFormData(INITIAL_EVENT_FORM);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGroupLabel = (value?: string) => {
    if (!value) return 'N/A';
    return GROUP_OPTIONS.find((g) => g.value === value)?.label || value;
  };

  const getCategoryLabel = (value?: string) => {
    if (!value) return 'N/A';
    return EVENT_CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
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
              <Select
                value={selectedEvent?._id || ''}
                onValueChange={handleEventSelect}
                disabled={isLoadingEvents}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event._id} value={event._id}>
                      {event.name} - {formatDate(event.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsCreateEventModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>

          {/* Selected Event Info */}
          {selectedEvent && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedEvent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEvent.date)}
                    {selectedEvent.time && ` at ${selectedEvent.time}`}
                    {selectedEvent.location && ` • ${selectedEvent.location}`}
                  </p>
                </div>
                <Badge>{getCategoryLabel(selectedEvent.category)}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {selectedEvent && stats && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.present}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.late}</p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <UserX className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.members}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
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
            <Input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {GROUP_OPTIONS.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRefreshAttendance}
            disabled={isLoadingAttendance}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAttendance ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleBulkCheckIn}
            disabled={selectedMembers.size === 0 || isBulkCheckingIn}
          >
            {isBulkCheckingIn ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Check In ({selectedMembers.size})
          </Button>
        </div>
      )}

      {/* Members List */}
      {!selectedEvent ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No Event Selected</p>
            <p className="text-sm text-muted-foreground mb-4">
              Please select an event or create a new one to record attendance
            </p>
            <Button onClick={() => setIsCreateEventModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
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
            <TabsTrigger value="all">All Members ({filteredMembers.length})</TabsTrigger>
            <TabsTrigger value="checked-in">
              Checked In ({checkedInMemberIds.size})
            </TabsTrigger>
            <TabsTrigger value="not-checked-in">
              Not Checked In ({filteredMembers.length - checkedInMemberIds.size})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const isCheckedIn = checkedInMemberIds.has(member._id);
                const isSelected = selectedMembers.has(member._id);

                return (
                  <Card
                    key={member._id}
                    className={`cursor-pointer shadow-soft hover:shadow-medium transition-all ${isCheckedIn
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : isSelected
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                    onClick={() => handleToggleMember(member._id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="h-12 w-12">
                        {member.photo && <AvatarImage src={member.photo} />}
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                          {getInitials(member.firstName, member.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getGroupLabel(member.group)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isCheckedIn && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickCheckIn(member._id);
                            }}
                            disabled={isCheckingIn && checkingInMemberRef.current === member._id}
                          >
                            {isCheckingIn && checkingInMemberRef.current === member._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Check In'
                            )}
                          </Button>
                        )}
                        {isCheckedIn ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : isSelected ? (
                          <CheckCircle className="h-6 w-6 text-primary" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="checked-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers
                .filter((member) => checkedInMemberIds.has(member._id))
                .map((member) => (
                  <Card
                    key={member._id}
                    className="shadow-soft ring-2 ring-green-500 bg-green-50"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Avatar className="h-12 w-12">
                        {member.photo && <AvatarImage src={member.photo} />}
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                          {getInitials(member.firstName, member.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getGroupLabel(member.group)}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </CardContent>
                  </Card>
                ))}
            </div>
            {filteredMembers.filter((m) => checkedInMemberIds.has(m._id)).length === 0 && (
              <Card className="shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No one checked in yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start checking in members from the "All Members" tab
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="not-checked-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers
                .filter((member) => !checkedInMemberIds.has(member._id))
                .map((member) => {
                  const isSelected = selectedMembers.has(member._id);

                  return (
                    <Card
                      key={member._id}
                      className={`cursor-pointer shadow-soft hover:shadow-medium transition-all ${isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => handleToggleMember(member._id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Avatar className="h-12 w-12">
                          {member.photo && <AvatarImage src={member.photo} />}
                          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                            {getInitials(member.firstName, member.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getGroupLabel(member.group)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickCheckIn(member._id);
                            }}
                            disabled={isCheckingIn && checkingInMemberRef.current === member._id}
                          >
                            {isCheckingIn && checkingInMemberRef.current === member._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Check In'
                            )}
                          </Button>
                          {isSelected ? (
                            <CheckCircle className="h-6 w-6 text-primary" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            {filteredMembers.filter((m) => !checkedInMemberIds.has(m._id)).length === 0 && (
              <Card className="shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                  <p className="text-lg font-medium">Everyone is checked in!</p>
                  <p className="text-sm text-muted-foreground">
                    All members have been marked as present
                  </p>
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
            <DialogDescription>
              Create an event to record attendance for
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name *</Label>
              <Input
                id="eventName"
                value={eventFormData.name}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, name: e.target.value })
                }
                placeholder="e.g., Sunday Morning Service"
                required
                disabled={isCreatingEvent}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventCategory">Category</Label>
              <Select
                value={eventFormData.category}
                onValueChange={(value: any) =>
                  setEventFormData({ ...eventFormData, category: value })
                }
                disabled={isCreatingEvent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventFormData.date}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, date: e.target.value })
                }
                required
                disabled={isCreatingEvent}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventFormData.time}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, time: e.target.value })
                  }
                  required
                  disabled={isCreatingEvent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={eventFormData.duration}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, duration: parseInt(e.target.value) || 60 })
                  }
                  placeholder="120"
                  disabled={isCreatingEvent}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventFormData.location}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, location: e.target.value })
                }
                placeholder="e.g., Main Sanctuary"
                disabled={isCreatingEvent}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCreateEventModal}
                disabled={isCreatingEvent}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingEvent}>
                {isCreatingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;