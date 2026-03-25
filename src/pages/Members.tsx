// src/pages/Members.tsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  fetchMembersRequest,
  createMemberRequest,
  updateMemberRequest,
  deleteMemberRequest,
  resetMemberOperation,
} from "@/redux/actions/memberActions";
import { Member, MemberFormData } from "@/services/api";

// ============================================
// CONSTANTS
// ============================================

const MEMBERSHIP_STATUSES = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'deceased', label: 'Deceased', color: 'bg-red-100 text-red-800' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

// NEW - Group options
const GROUP_OPTIONS = [
  { value: 'children', label: 'Children' },
  { value: 'youth', label: 'Youth' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];

const INITIAL_FORM_DATA: MemberFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: undefined,
  maritalStatus: undefined,
  membershipStatus: 'active',
  membershipDate: '',
  group: 'adult',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  notes: '',
};

// ============================================
// COMPONENT
// ============================================

const Members = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state
  const {
    members,
    pagination,
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
  } = useSelector((state: RootState) => state.members);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<MemberFormData>(INITIAL_FORM_DATA);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Refs to track if we initiated an operation
  const isSubmittingRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const isDeletingRef = useRef(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch members on mount and when filters change
  useEffect(() => {
    dispatch(
      fetchMembersRequest({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      dispatch(
        fetchMembersRequest({
          page: 1,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch, itemsPerPage, statusFilter]);

  // Handle CREATE success/error
  useEffect(() => {
    if (!isSubmittingRef.current) return;

    if (isCreating) return; // Still loading

    if (createError) {
      toast({
        title: "Error",
        description: createError,
        variant: "destructive",
      });
      isSubmittingRef.current = false;
    } else if (createSuccess) {
      toast({
        title: "Success",
        description: "Member created successfully",
      });
      setIsAddModalOpen(false);
      setFormData(INITIAL_FORM_DATA);
      isSubmittingRef.current = false;
      dispatch(resetMemberOperation());
    }
  }, [isCreating, createError, createSuccess, toast, dispatch]);

  // Handle UPDATE success/error
  useEffect(() => {
    if (!isUpdatingRef.current) return;

    if (isUpdating) return; // Still loading

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
        description: "Member updated successfully",
      });
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setFormData(INITIAL_FORM_DATA);
      isUpdatingRef.current = false;
      dispatch(resetMemberOperation());
    }
  }, [isUpdating, updateError, updateSuccess, toast, dispatch]);

  // Handle DELETE success/error
  useEffect(() => {
    if (!isDeletingRef.current) return;

    if (isDeleting) return; // Still loading

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
        description: "Member deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      isDeletingRef.current = false;
      dispatch(resetMemberOperation());
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

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = () => {
    setFormData(INITIAL_FORM_DATA);
    dispatch(resetMemberOperation());
    setIsAddModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || '',
      phone: member.phone || '',
      dateOfBirth: member.dateOfBirth?.split('T')[0] || '',
      gender: member.gender,
      maritalStatus: member.maritalStatus,
      membershipStatus: member.membershipStatus,
      membershipDate: member.membershipDate?.split('T')[0] || '',
      group: member.group || '',
      address: member.address || {},
      notes: member.notes || '',
    });
    dispatch(resetMemberOperation());
    setIsEditModalOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    dispatch(resetMemberOperation());
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    isSubmittingRef.current = true;
    dispatch(createMemberRequest(formData));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMember) {
      isUpdatingRef.current = true;
      dispatch(updateMemberRequest(selectedMember._id, formData));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedMember) {
      isDeletingRef.current = true;
      dispatch(deleteMemberRequest(selectedMember._id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseAddModal = () => {
    if (isCreating) return; // Prevent closing while submitting
    setIsAddModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleCloseEditModal = () => {
    if (isUpdating) return; // Prevent closing while submitting
    setIsEditModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setSelectedMember(null);
  };

  // ============================================
  // HELPERS
  // ============================================

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = MEMBERSHIP_STATUSES.find((s) => s.value === status);
    return statusConfig || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderMemberForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleSubmitUpdate : handleSubmitCreate} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            required
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            required
            disabled={isCreating || isUpdating}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
            disabled={isCreating || isUpdating}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender || ''}
            onValueChange={(value) => handleSelectChange('gender', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            value={formData.maritalStatus || ''}
            onValueChange={(value) => handleSelectChange('maritalStatus', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="membershipStatus">Membership Status</Label>
          <Select
            value={formData.membershipStatus || 'active'}
            onValueChange={(value) => handleSelectChange('membershipStatus', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MEMBERSHIP_STATUSES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membershipDate">Membership Date</Label>
          <Input
            id="membershipDate"
            name="membershipDate"
            type="date"
            value={formData.membershipDate}
            onChange={handleInputChange}
            disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <Select
            value={formData.group || 'adult'}
            onValueChange={(value) => handleSelectChange('group', value)}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {GROUP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Additional notes..."
          rows={3}
          disabled={isCreating || isUpdating}
        />
      </div>

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
          {isEdit ? 'Update Member' : 'Add Member'}
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
        <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
        <p className="text-muted-foreground">
          Manage your congregation members
          {pagination && ` • ${pagination.total} total members`}
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search members by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {MEMBERSHIP_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAddMember}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading members...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && members.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No members found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "Get started by adding your first member"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={handleAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Members Grid */}
      {!isLoading && members.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const statusBadge = getStatusBadge(member.membershipStatus);

              return (
                <Card
                  key={member._id}
                  className="shadow-soft hover:shadow-medium transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          {member.photo && <AvatarImage src={member.photo} />}
                          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                            {getInitials(member.firstName, member.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {member.firstName} {member.lastName}
                          </CardTitle>
                          <Badge className={`mt-1 ${statusBadge.color}`}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMember(member)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMember(member)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(member)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.group && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{member.group}</span>
                      </div>
                    )}
                    {member.membershipDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {formatDate(member.membershipDate)}</span>
                      </div>
                    )}
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
                {pagination.total} members
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new member to your congregation.
            </DialogDescription>
          </DialogHeader>
          {renderMemberForm(false)}
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member's information.
            </DialogDescription>
          </DialogHeader>
          {renderMemberForm(true)}
        </DialogContent>
      </Dialog>

      {/* View Member Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {selectedMember.photo && <AvatarImage src={selectedMember.photo} />}
                  <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                    {getInitials(selectedMember.firstName, selectedMember.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <Badge className={getStatusBadge(selectedMember.membershipStatus).color}>
                    {getStatusBadge(selectedMember.membershipStatus).label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedMember.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedMember.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium">{formatDate(selectedMember.dateOfBirth)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="font-medium capitalize">{selectedMember.gender || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Marital Status</Label>
                  <p className="font-medium capitalize">{selectedMember.maritalStatus || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Group</Label>
                  <p className="font-medium">{selectedMember.group || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-medium">{formatDate(selectedMember.membershipDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="font-medium">{formatDate(selectedMember.createdAt)}</p>
                </div>
              </div>

              {selectedMember.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="font-medium">{selectedMember.notes}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditMember(selectedMember);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Member
                </Button>
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
              This will permanently delete{' '}
              <span className="font-semibold">
                {selectedMember?.firstName} {selectedMember?.lastName}
              </span>
              . This action cannot be undone.
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

export default Members;