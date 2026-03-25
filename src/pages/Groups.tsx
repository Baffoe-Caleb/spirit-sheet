// src/pages/Groups.tsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  User,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import { fetchMembersRequest } from "@/redux/actions/memberActions";
import {
  fetchGroupsRequest,
  fetchCategoriesRequest,
  createGroupRequest,
  updateGroupRequest,
  deleteGroupRequest,
  resetGroupOperation,
} from "@/redux/actions/groupActions";
import { Group, GroupFormData, Member } from "@/services/api";

// ============================================
// CONSTANTS
// ============================================

const GROUP_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-800' },
];

const GROUP_TYPES = [
  { value: 'small_group', label: 'Small Group' },
  { value: 'ministry', label: 'Ministry' },
  { value: 'team', label: 'Team' },
  { value: 'class', label: 'Class' },
  { value: 'other', label: 'Other' },
];

const MEETING_DAYS = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

const MEETING_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'other', label: 'Other' },
];

const INITIAL_FORM_DATA: GroupFormData = {
  name: '',
  description: '',
  category: 'bible_study',
  type: 'small_group',
  status: 'active',
  leaderId: '',
  meetingSchedule: {
    day: '',
    time: '',
    frequency: 'weekly',
    location: '',
    isOnline: false,
  },
  location: '',
  capacity: 20,
  isOpen: true,
  missionStatement: '',
};

// ============================================
// COMPONENT
// ============================================

const Groups = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state - Groups
  const {
    groups,
    pagination,
    categories,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    createSuccess,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state: RootState) => state.groups);

  // Redux state - Members (for leader selection)
  const { members } = useSelector((state: RootState) => state.members);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<GroupFormData>(INITIAL_FORM_DATA);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Refs
  const isCreatingRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const isDeletingRef = useRef(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch groups, categories, and members on mount
  useEffect(() => {
    dispatch(fetchCategoriesRequest());
    dispatch(fetchMembersRequest({ limit: 500, status: 'active' }));
  }, [dispatch]);

  // Fetch groups when filters change
  useEffect(() => {
    dispatch(
      fetchGroupsRequest({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, categoryFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      dispatch(
        fetchGroupsRequest({
          page: 1,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch, itemsPerPage, categoryFilter, statusFilter]);

  // Handle CREATE success/error
  useEffect(() => {
    if (!isCreatingRef.current) return;
    if (isCreating) return;

    if (createError) {
      toast({
        title: "Error",
        description: createError,
        variant: "destructive",
      });
      isCreatingRef.current = false;
    } else if (createSuccess) {
      toast({
        title: "Success",
        description: "Group created successfully",
      });
      setIsAddModalOpen(false);
      setFormData(INITIAL_FORM_DATA);
      isCreatingRef.current = false;
      dispatch(resetGroupOperation());
    }
  }, [isCreating, createError, createSuccess, toast, dispatch]);

  // Handle UPDATE success/error
  useEffect(() => {
    if (!isUpdatingRef.current) return;
    if (isUpdating) return;

    if (updateError) {
      toast({
        title: "Error",
        description: updateError,
        variant: "destructive",
      });
      isUpdatingRef.current = false;
    } else if (updateSuccess) {
      toast({
        title: "Success",
        description: "Group updated successfully",
      });
      setIsEditModalOpen(false);
      setSelectedGroup(null);
      setFormData(INITIAL_FORM_DATA);
      isUpdatingRef.current = false;
      dispatch(resetGroupOperation());
    }
  }, [isUpdating, updateError, updateSuccess, toast, dispatch]);

  // Handle DELETE success/error
  useEffect(() => {
    if (!isDeletingRef.current) return;
    if (isDeleting) return;

    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError,
        variant: "destructive",
      });
      isDeletingRef.current = false;
    } else if (deleteSuccess) {
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      isDeletingRef.current = false;
      dispatch(resetGroupOperation());
    }
  }, [isDeleting, deleteError, deleteSuccess, toast, dispatch]);

  // Handle fetch error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('meetingSchedule.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        meetingSchedule: {
          ...prev.meetingSchedule,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'capacity' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.startsWith('meetingSchedule.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        meetingSchedule: {
          ...prev.meetingSchedule,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddGroup = () => {
    setFormData(INITIAL_FORM_DATA);
    dispatch(resetGroupOperation());
    setIsAddModalOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      category: group.category,
      type: group.type || 'small_group',
      status: group.status,
      leaderId: group.leaderId?._id || '',
      meetingSchedule: {
        day: group.meetingSchedule?.day || '',
        time: group.meetingSchedule?.time || '',
        frequency: group.meetingSchedule?.frequency || 'weekly',
        location: group.meetingSchedule?.location || '',
        isOnline: group.meetingSchedule?.isOnline || false,
      },
      location: group.location || '',
      capacity: group.capacity || 20,
      isOpen: group.isOpen !== false,
      missionStatement: group.missionStatement || '',
    });
    dispatch(resetGroupOperation());
    setIsEditModalOpen(true);
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    dispatch(resetGroupOperation());
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.leaderId) {
      toast({
        title: "Error",
        description: "Please select a group leader",
        variant: "destructive",
      });
      return;
    }
    isCreatingRef.current = true;
    dispatch(createGroupRequest(formData));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup) {
      isUpdatingRef.current = true;
      dispatch(updateGroupRequest(selectedGroup._id, formData));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      isDeletingRef.current = true;
      dispatch(deleteGroupRequest(selectedGroup._id));
    }
  };

  const handleCloseAddModal = () => {
    if (isCreating) return;
    setIsAddModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleCloseEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setSelectedGroup(null);
  };

  // ============================================
  // HELPERS
  // ============================================

  const getStatusBadge = (status: string) => {
    const config = GROUP_STATUSES.find((s) => s.value === status);
    return config || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getMeetingDayLabel = (day?: string) => {
    if (!day) return null;
    return MEETING_DAYS.find((d) => d.value === day)?.label || day;
  };

  // ============================================
  // RENDER FORM
  // ============================================

  const renderGroupForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleSubmitUpdate : handleSubmitCreate} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Youth Ministry"
            required
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief description of the group..."
          rows={2}
          disabled={isCreating || isUpdating}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leaderId">Group Leader *</Label>
          <Select
            value={formData.leaderId}
            onValueChange={(value) => handleSelectChange('leaderId', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select leader" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.firstName} {member.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Group Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {GROUP_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Meeting Day</Label>
          <Select
            value={formData.meetingSchedule?.day || ''}
            onValueChange={(value) => handleSelectChange('meetingSchedule.day', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {MEETING_DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meetingTime">Meeting Time</Label>
          <Input
            id="meetingTime"
            name="meetingSchedule.time"
            type="time"
            value={formData.meetingSchedule?.time || ''}
            onChange={handleInputChange}
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select
            value={formData.meetingSchedule?.frequency || 'weekly'}
            onValueChange={(value) => handleSelectChange('meetingSchedule.frequency', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {MEETING_FREQUENCIES.map((freq) => (
                <SelectItem key={freq.value} value={freq.value}>
                  {freq.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Room 101, Main Building"
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleInputChange}
            disabled={isCreating || isUpdating}
          />
        </div>
      </div>

      {isEdit && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {GROUP_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={isEdit ? handleCloseEditModal : handleCloseAddModal}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {(isCreating || isUpdating) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isEdit ? 'Update Group' : 'Create Group'}
        </Button>
      </DialogFooter>
    </form>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Groups</h1>
        <p className="text-muted-foreground">
          Organize members into ministry groups
          {pagination && ` • ${pagination.total} total groups`}
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {GROUP_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAddGroup}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading groups...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && groups.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No groups found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? "Try adjusting your filters"
                : "Get started by creating your first group"}
            </p>
            {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={handleAddGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Group
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Groups Grid */}
      {!isLoading && groups.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const statusBadge = getStatusBadge(group.status);

              return (
                <Card
                  key={group._id}
                  className="shadow-soft hover:shadow-medium transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${getCategoryColor(group.category)}20` }}
                        >
                          <Users
                            className="h-6 w-6"
                            style={{ color: getCategoryColor(group.category) }}
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>{getCategoryLabel(group.category)}</CardDescription>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewGroup(group)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(group)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      {group.leaderId && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>
                            {group.leaderId.firstName} {group.leaderId.lastName}
                          </span>
                        </div>
                      )}
                      {group.meetingSchedule?.day && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {getMeetingDayLabel(group.meetingSchedule.day)}
                            {group.meetingSchedule.time && ` at ${group.meetingSchedule.time}`}
                          </span>
                        </div>
                      )}
                      {group.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{group.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{group.memberCount || 0}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                    </div>

                    {/* <Link to={`/groups/${group._id}`}>
                      <Button variant="outline" className="w-full mt-2">
                        View Group
                      </Button>
                    </Link> */}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, pagination.total)} of{' '}
                {pagination.total} groups
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Group Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Add a new ministry group to organize your congregation
            </DialogDescription>
          </DialogHeader>
          {renderGroupForm(false)}
        </DialogContent>
      </Dialog>

      {/* Edit Group Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update the group's information</DialogDescription>
          </DialogHeader>
          {renderGroupForm(true)}
        </DialogContent>
      </Dialog>

      {/* View Group Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Group Details</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${getCategoryColor(selectedGroup.category)}20` }}
                >
                  <Users
                    className="h-8 w-8"
                    style={{ color: getCategoryColor(selectedGroup.category) }}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedGroup.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusBadge(selectedGroup.status).color}>
                      {getStatusBadge(selectedGroup.status).label}
                    </Badge>
                    <span className="text-muted-foreground">
                      {getCategoryLabel(selectedGroup.category)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedGroup.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedGroup.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Leader</Label>
                  <p className="font-medium">
                    {selectedGroup.leaderId
                      ? `${selectedGroup.leaderId.firstName} ${selectedGroup.leaderId.lastName}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Members</Label>
                  <p className="font-medium">{selectedGroup.memberCount || 0}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Meeting Day</Label>
                  <p className="font-medium">
                    {getMeetingDayLabel(selectedGroup.meetingSchedule?.day) || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Meeting Time</Label>
                  <p className="font-medium">
                    {selectedGroup.meetingSchedule?.time || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedGroup.location || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacity</Label>
                  <p className="font-medium">{selectedGroup.capacity || 'N/A'}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                {/* <Link to={`/groups/${selectedGroup._id}`}>
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </Link> */}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the group{' '}
              <span className="font-semibold">{selectedGroup?.name}</span>.
              All group memberships will be deactivated. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Groups;