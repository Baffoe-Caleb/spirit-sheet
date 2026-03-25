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
  Upload,
  Camera,
  X,
  Shield,
  MapPin,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  bulkUploadMembersRequest,
  uploadMemberPhotoRequest,
  deleteMemberPhotoRequest,
} from "@/redux/actions/memberActions";
import { fetchCellZonesRequest } from "@/redux/actions/cellZoneActions";
import { Member, MemberFormData, getFullPhotoUrl } from "@/services/api";
import { useRoleAccess } from "@/hooks/useRoleAccess";

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

const GROUP_OPTIONS = [
  { value: 'children', label: 'Children' },
  { value: 'youth', label: 'Youth' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
];

const CHURCH_ROLE_OPTIONS = [
  { value: 'preacher', label: 'Preacher' },
  { value: 'committee_leader', label: 'Committee Leader' },
  { value: 'elder', label: 'Elder' },
  { value: 'deacon', label: 'Deacon' },
  { value: 'general_member', label: 'General Member' },
  { value: 'guest_visitor', label: 'Guest / Visitor' },
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
  churchRole: 'general_member',
  cellZoneId: '',
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
  const { canUseFeature } = useRoleAccess();

  // Redux state
  const {
    members,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
    isUploadingPhoto,
    error,
    createError,
    updateError,
    deleteError,
    bulkUploadError,
    photoError,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    bulkUploadSuccess,
    bulkUploadResult,
    photoUploadSuccess,
  } = useSelector((state: RootState) => state.members);

  const { cellZones } = useSelector((state: RootState) => state.cellZones);

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
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<MemberFormData>(INITIAL_FORM_DATA);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  // Refs
  const isSubmittingRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const isDeletingRef = useRef(false);
  const isBulkUploadingRef = useRef(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch members and cell zones on mount
  useEffect(() => {
    dispatch(fetchCellZonesRequest());
  }, [dispatch]);

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
    if (isCreating) return;
    if (createError) {
      toast({ title: "Error", description: createError, variant: "destructive" });
      isSubmittingRef.current = false;
    } else if (createSuccess) {
      toast({ title: "Success", description: "Member created successfully" });
      // If photo was selected, upload it for the newly created member
      if (photoFile && members.length > 0) {
        const newMember = members[0]; // newest member is prepended
        dispatch(uploadMemberPhotoRequest(newMember._id, photoFile));
      }
      setIsAddModalOpen(false);
      setFormData(INITIAL_FORM_DATA);
      setPhotoFile(null);
      setPhotoPreview(null);
      isSubmittingRef.current = false;
      dispatch(resetMemberOperation());
    }
  }, [isCreating, createError, createSuccess, toast, dispatch, photoFile, members]);

  // Handle UPDATE success/error
  useEffect(() => {
    if (!isUpdatingRef.current) return;
    if (isUpdating) return;
    if (updateError) {
      toast({ title: "Error", description: updateError, variant: "destructive" });
      isUpdatingRef.current = false;
    } else if (updateSuccess) {
      toast({ title: "Success", description: "Member updated successfully" });
      // If photo was selected, upload it
      if (photoFile && selectedMember) {
        dispatch(uploadMemberPhotoRequest(selectedMember._id, photoFile));
      }
      setIsEditModalOpen(false);
      setSelectedMember(null);
      setFormData(INITIAL_FORM_DATA);
      setPhotoFile(null);
      setPhotoPreview(null);
      isUpdatingRef.current = false;
      dispatch(resetMemberOperation());
    }
  }, [isUpdating, updateError, updateSuccess, toast, dispatch, photoFile, selectedMember]);

  // Handle DELETE success/error
  useEffect(() => {
    if (!isDeletingRef.current) return;
    if (isDeleting) return;
    if (deleteError) {
      toast({ title: "Error", description: deleteError, variant: "destructive" });
      isDeletingRef.current = false;
    } else if (deleteSuccess) {
      toast({ title: "Success", description: "Member deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      isDeletingRef.current = false;
      dispatch(resetMemberOperation());
    }
  }, [isDeleting, deleteError, deleteSuccess, toast, dispatch]);

  // Handle BULK UPLOAD success/error
  useEffect(() => {
    if (!isBulkUploadingRef.current) return;
    if (isBulkUploading) return;
    if (bulkUploadError) {
      toast({ title: "Bulk Upload Failed", description: bulkUploadError, variant: "destructive" });
      isBulkUploadingRef.current = false;
    } else if (bulkUploadSuccess && bulkUploadResult) {
      toast({
        title: "Bulk Upload Complete",
        description: `${bulkUploadResult.inserted} imported, ${bulkUploadResult.skipped} skipped, ${bulkUploadResult.errorCount} failed`,
      });
      setIsBulkUploadModalOpen(false);
      setBulkFile(null);
      isBulkUploadingRef.current = false;
      dispatch(resetMemberOperation());
      // Refresh member list
      dispatch(fetchMembersRequest({ page: 1, limit: itemsPerPage }));
      setCurrentPage(1);
    }
  }, [isBulkUploading, bulkUploadError, bulkUploadSuccess, bulkUploadResult, toast, dispatch, itemsPerPage]);

  // Handle photo errors
  useEffect(() => {
    if (photoError) {
      toast({ title: "Photo Error", description: photoError, variant: "destructive" });
    }
    if (photoUploadSuccess) {
      toast({ title: "Success", description: "Photo uploaded successfully" });
    }
  }, [photoError, photoUploadSuccess, toast]);

  // Handle fetch error
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === '_none' ? '' : value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid File", description: "Please select a JPG, PNG, GIF, or WEBP image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Photo must be under 5MB", variant: "destructive" });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleDeleteExistingPhoto = (memberId: string) => {
    dispatch(deleteMemberPhotoRequest(memberId));
  };

  const handleAddMember = () => {
    setFormData(INITIAL_FORM_DATA);
    setPhotoFile(null);
    setPhotoPreview(null);
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
      churchRole: member.churchRole || 'general_member',
      cellZoneId: member.cellZoneId || '',
      address: member.address || {},
      notes: member.notes || '',
    });
    setPhotoFile(null);
    setPhotoPreview(getFullPhotoUrl(member.photo) || null);
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

  const handleBulkUpload = () => {
    if (!bulkFile) {
      toast({ title: "No File", description: "Please select a CSV file", variant: "destructive" });
      return;
    }
    isBulkUploadingRef.current = true;
    dispatch(bulkUploadMembersRequest(bulkFile));
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCloseAddModal = () => {
    if (isCreating) return;
    setIsAddModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleCloseEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setSelectedMember(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // ============================================
  // HELPERS
  // ============================================

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  const getStatusBadge = (status: string) =>
    MEMBERSHIP_STATUSES.find((s) => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };

  const getChurchRoleLabel = (role?: string) =>
    CHURCH_ROLE_OPTIONS.find((r) => r.value === role)?.label || role || 'N/A';

  const getCellZoneName = (id?: string) => {
    if (!id) return null;
    const cz = cellZones.find((z) => z._id === id);
    return cz?.name || null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // ============================================
  // RENDER PHOTO PICKER
  // ============================================

  const renderPhotoPicker = (existingPhoto?: string) => (
    <div className="space-y-2">
      <Label>Passport Photo</Label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-dashed border-muted-foreground/30">
            {(photoPreview || existingPhoto) ? (
              <AvatarImage src={photoPreview || existingPhoto} />
            ) : null}
            <AvatarFallback className="bg-muted">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          {(photoPreview || photoFile) && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => photoInputRef.current?.click()}
            disabled={isCreating || isUpdating}
          >
            <Upload className="h-4 w-4 mr-2" />
            {photoPreview ? 'Change Photo' : 'Upload Photo'}
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP. Max 5MB</p>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>
    </div>
  );

  // ============================================
  // RENDER MEMBER FORM
  // ============================================

  const renderMemberForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleSubmitUpdate : handleSubmitCreate} className="space-y-4">
      {/* Photo */}
      {canUseFeature('members:photo') && renderPhotoPicker(isEdit ? getFullPhotoUrl(selectedMember?.photo) : undefined)}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" required disabled={isCreating || isUpdating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" required disabled={isCreating || isUpdating} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" disabled={isCreating || isUpdating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" disabled={isCreating || isUpdating} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={isCreating || isUpdating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender || ''} onValueChange={(v) => handleSelectChange('gender', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select value={formData.maritalStatus || ''} onValueChange={(v) => handleSelectChange('maritalStatus', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {MARITAL_STATUS_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="membershipStatus">Membership Status</Label>
          <Select value={formData.membershipStatus || 'active'} onValueChange={(v) => handleSelectChange('membershipStatus', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {MEMBERSHIP_STATUSES.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membershipDate">Membership Date</Label>
          <Input id="membershipDate" name="membershipDate" type="date" value={formData.membershipDate} onChange={handleInputChange} disabled={isCreating || isUpdating} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Age Group</Label>
          <Select value={formData.group || 'adult'} onValueChange={(v) => handleSelectChange('group', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
            <SelectContent>
              {GROUP_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Church Role & Cell/Zone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="churchRole">Church Role</Label>
          <Select value={formData.churchRole || 'general_member'} onValueChange={(v) => handleSelectChange('churchRole', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select church role" /></SelectTrigger>
            <SelectContent>
              {CHURCH_ROLE_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cellZoneId">Cell / Zone</Label>
          <Select value={formData.cellZoneId || '_none'} onValueChange={(v) => handleSelectChange('cellZoneId', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select cell/zone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">None</SelectItem>
              {cellZones.map((cz) => (
                <SelectItem key={cz._id} value={cz._id}>
                  {cz.name} ({cz.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Additional notes..." rows={3} disabled={isCreating || isUpdating} />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={isEdit ? handleCloseEditModal : handleCloseAddModal} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            {MEMBERSHIP_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canUseFeature('members:bulk_upload') && (
          <Button variant="outline" onClick={() => setIsBulkUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        )}

        {canUseFeature('members:create') && (
          <Button onClick={handleAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
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
              {searchQuery || statusFilter !== 'all' ? "Try adjusting your search or filters" : "Get started by adding your first member"}
            </p>
            {!searchQuery && statusFilter === 'all' && canUseFeature('members:create') && (
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
        <TooltipProvider>
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => {
                const statusBadge = getStatusBadge(member.membershipStatus);
                const zoneName = getCellZoneName(member.cellZoneId);

                return (
                  <Card key={member._id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            {member.photo && <AvatarImage src={getFullPhotoUrl(member.photo)} />}
                            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                              {getInitials(member.firstName, member.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {member.firstName} {member.lastName}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                              {member.churchRole && member.churchRole !== 'general_member' && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="text-xs">
                                      <Shield className="h-3 w-3 mr-1" />
                                      {getChurchRoleLabel(member.churchRole)}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>Church Role</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>

                        {(canUseFeature('members:edit') || canUseFeature('members:delete')) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewMember(member)}>
                                <Eye className="h-4 w-4 mr-2" />View Details
                              </DropdownMenuItem>
                              {canUseFeature('members:edit') && (
                                <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                  <Edit className="h-4 w-4 mr-2" />Edit
                                </DropdownMenuItem>
                              )}
                              {canUseFeature('members:delete') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteClick(member)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" /><span>{member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" /><span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {zoneName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" /><span>{zoneName}</span>
                        </div>
                      )}
                      {member.group && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" /><span className="capitalize">{member.group.replace('_', ' ')}</span>
                        </div>
                      )}
                      {member.membershipDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" /><span>Member since {formatDate(member.membershipDate)}</span>
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} members
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="icon" onClick={() => handlePageChange(pageNum)}>
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.pages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        </TooltipProvider>
      )}

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Fill in the details to add a new member to your congregation.</DialogDescription>
          </DialogHeader>
          {renderMemberForm(false)}
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update the member's information.</DialogDescription>
          </DialogHeader>
          {renderMemberForm(true)}
        </DialogContent>
      </Dialog>

      {/* View Member Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Member Details</DialogTitle></DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {selectedMember.photo && <AvatarImage src={getFullPhotoUrl(selectedMember.photo)} />}
                  <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                    {getInitials(selectedMember.firstName, selectedMember.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedMember.firstName} {selectedMember.lastName}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge className={getStatusBadge(selectedMember.membershipStatus).color}>
                      {getStatusBadge(selectedMember.membershipStatus).label}
                    </Badge>
                    {selectedMember.churchRole && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        {getChurchRoleLabel(selectedMember.churchRole)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Email</Label><p className="font-medium">{selectedMember.email || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{selectedMember.phone || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Date of Birth</Label><p className="font-medium">{formatDate(selectedMember.dateOfBirth)}</p></div>
                <div><Label className="text-muted-foreground">Gender</Label><p className="font-medium capitalize">{selectedMember.gender || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Marital Status</Label><p className="font-medium capitalize">{selectedMember.maritalStatus || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Age Group</Label><p className="font-medium capitalize">{selectedMember.group?.replace('_', ' ') || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Church Role</Label><p className="font-medium">{getChurchRoleLabel(selectedMember.churchRole)}</p></div>
                <div><Label className="text-muted-foreground">Cell / Zone</Label><p className="font-medium">{getCellZoneName(selectedMember.cellZoneId) || 'N/A'}</p></div>
                <div><Label className="text-muted-foreground">Member Since</Label><p className="font-medium">{formatDate(selectedMember.membershipDate)}</p></div>
                <div><Label className="text-muted-foreground">Created</Label><p className="font-medium">{formatDate(selectedMember.createdAt)}</p></div>
              </div>

              {selectedMember.notes && (
                <div><Label className="text-muted-foreground">Notes</Label><p className="font-medium">{selectedMember.notes}</p></div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                {canUseFeature('members:edit') && (
                  <Button onClick={() => { setIsViewModalOpen(false); handleEditMember(selectedMember); }}>
                    <Edit className="h-4 w-4 mr-2" />Edit Member
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={isBulkUploadModalOpen} onOpenChange={(open) => { if (!isBulkUploading) setIsBulkUploadModalOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Members</DialogTitle>
            <DialogDescription>Upload a CSV file to import multiple members at once.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              {bulkFile ? (
                <div className="space-y-2">
                  <p className="font-medium">{bulkFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(bulkFile.size / 1024).toFixed(1)} KB</p>
                  <Button variant="ghost" size="sm" onClick={() => { setBulkFile(null); if (bulkInputRef.current) bulkInputRef.current.value = ''; }}>
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Click to select a CSV file</p>
                  <Button variant="outline" size="sm" onClick={() => bulkInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={bulkInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => { if (e.target.files?.[0]) setBulkFile(e.target.files[0]); }}
                className="hidden"
              />
            </div>
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">CSV Format:</p>
              <p>firstName, lastName, email, phone, gender, dateOfBirth, group, churchRole, membershipStatus</p>
            </div>

            {bulkUploadResult && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <p className="font-medium text-green-800">Upload Results:</p>
                <p className="text-green-700">{bulkUploadResult.inserted} imported, {bulkUploadResult.skipped} skipped, {bulkUploadResult.errorCount} failed</p>
                {bulkUploadResult.errors && bulkUploadResult.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {bulkUploadResult.errors.map((err, i) => (
                      <p key={i} className="text-red-600 text-xs">Row {err.row}: {err.error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadModalOpen(false)} disabled={isBulkUploading}>Cancel</Button>
            <Button onClick={handleBulkUpload} disabled={!bulkFile || isBulkUploading}>
              {isBulkUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{selectedMember?.firstName} {selectedMember?.lastName}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
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