// src/pages/CellZones.tsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import { fetchMembersRequest } from "@/redux/actions/memberActions";
import {
  fetchCellZonesRequest,
  fetchCellZoneRequest,
  createCellZoneRequest,
  updateCellZoneRequest,
  deleteCellZoneRequest,
  fetchCellZoneMembersRequest,
  resetCellZoneOperation,
  clearSelectedCellZone,
} from "@/redux/actions/cellZoneActions";
import { CellZone, CellZoneFormData, Member } from "@/services/api";
import { useRoleAccess } from "@/hooks/useRoleAccess";

// ============================================
// CONSTANTS
// ============================================

const ZONE_TYPES = [
  { value: 'cell', label: 'Cell', color: 'bg-blue-100 text-blue-800', icon: '🏠' },
  { value: 'zone', label: 'Zone', color: 'bg-green-100 text-green-800', icon: '📍' },
  { value: 'district', label: 'District', color: 'bg-purple-100 text-purple-800', icon: '🗺️' },
  { value: 'region', label: 'Region', color: 'bg-orange-100 text-orange-800', icon: '🌍' },
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

const INITIAL_FORM_DATA: CellZoneFormData = {
  name: '',
  description: '',
  type: 'cell',
  leaderId: '',
  meetingDay: '',
  meetingTime: '',
  meetingLocation: '',
  isActive: true,
};

// ============================================
// COMPONENT
// ============================================

const CellZones = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { canUseFeature } = useRoleAccess();

  // Redux state
  const {
    cellZones,
    selectedCellZone,
    cellZoneMembers,
    membersPagination,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isLoadingMembers,
    error,
    createError,
    updateError,
    deleteError,
    createSuccess,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state: RootState) => state.cellZones);

  const { members } = useSelector((state: RootState) => state.members);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CellZoneFormData>(INITIAL_FORM_DATA);
  const [selectedZone, setSelectedZone] = useState<CellZone | null>(null);

  // Refs
  const isCreatingRef = useRef(false);
  const isUpdatingRef = useRef(false);
  const isDeletingRef = useRef(false);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    dispatch(fetchMembersRequest({ limit: 500, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    const params: any = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (searchQuery) params.search = searchQuery;
    dispatch(fetchCellZonesRequest(params));
  }, [dispatch, typeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params: any = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (searchQuery) params.search = searchQuery;
      dispatch(fetchCellZonesRequest(params));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch, typeFilter]);

  // Handle CREATE
  useEffect(() => {
    if (!isCreatingRef.current) return;
    if (isCreating) return;
    if (createError) {
      toast({ title: "Error", description: createError, variant: "destructive" });
      isCreatingRef.current = false;
    } else if (createSuccess) {
      toast({ title: "Success", description: "Cell/Zone created successfully" });
      setIsAddModalOpen(false);
      setFormData(INITIAL_FORM_DATA);
      isCreatingRef.current = false;
      dispatch(resetCellZoneOperation());
    }
  }, [isCreating, createError, createSuccess, toast, dispatch]);

  // Handle UPDATE
  useEffect(() => {
    if (!isUpdatingRef.current) return;
    if (isUpdating) return;
    if (updateError) {
      toast({ title: "Error", description: updateError, variant: "destructive" });
      isUpdatingRef.current = false;
    } else if (updateSuccess) {
      toast({ title: "Success", description: "Cell/Zone updated successfully" });
      setIsEditModalOpen(false);
      setSelectedZone(null);
      setFormData(INITIAL_FORM_DATA);
      isUpdatingRef.current = false;
      dispatch(resetCellZoneOperation());
    }
  }, [isUpdating, updateError, updateSuccess, toast, dispatch]);

  // Handle DELETE
  useEffect(() => {
    if (!isDeletingRef.current) return;
    if (isDeleting) return;
    if (deleteError) {
      toast({ title: "Error", description: deleteError, variant: "destructive" });
      isDeletingRef.current = false;
    } else if (deleteSuccess) {
      toast({ title: "Success", description: "Cell/Zone deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedZone(null);
      isDeletingRef.current = false;
      dispatch(resetCellZoneOperation());
    }
  }, [isDeleting, deleteError, deleteSuccess, toast, dispatch]);

  useEffect(() => {
    if (error) toast({ title: "Error", description: error, variant: "destructive" });
  }, [error, toast]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === '_none' ? '' : value }));
  };

  const handleAddZone = () => {
    setFormData(INITIAL_FORM_DATA);
    dispatch(resetCellZoneOperation());
    setIsAddModalOpen(true);
  };

  const handleEditZone = (zone: CellZone) => {
    setSelectedZone(zone);
    const leaderId = typeof zone.leaderId === 'string' ? zone.leaderId : (zone.leaderId as any)?._id || '';
    setFormData({
      name: zone.name,
      description: zone.description || '',
      type: zone.type,
      leaderId,
      meetingDay: zone.meetingDay || '',
      meetingTime: zone.meetingTime || '',
      meetingLocation: zone.meetingLocation || '',
      isActive: zone.isActive !== false,
    });
    dispatch(resetCellZoneOperation());
    setIsEditModalOpen(true);
  };

  const handleViewZone = (zone: CellZone) => {
    setSelectedZone(zone);
    dispatch(fetchCellZoneMembersRequest(zone._id, 1, 20));
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (zone: CellZone) => {
    setSelectedZone(zone);
    dispatch(resetCellZoneOperation());
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    isCreatingRef.current = true;
    dispatch(createCellZoneRequest(formData));
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedZone) {
      isUpdatingRef.current = true;
      dispatch(updateCellZoneRequest(selectedZone._id, formData));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedZone) {
      isDeletingRef.current = true;
      dispatch(deleteCellZoneRequest(selectedZone._id));
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
    setSelectedZone(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedZone(null);
    dispatch(clearSelectedCellZone());
  };

  // ============================================
  // HELPERS
  // ============================================

  const getTypeConfig = (type: string) =>
    ZONE_TYPES.find((t) => t.value === type) || { label: type, color: 'bg-gray-100 text-gray-800', icon: '📍' };

  const getDayLabel = (day?: string) =>
    day ? MEETING_DAYS.find((d) => d.value === day)?.label || day : null;

  const getLeaderName = (zone: CellZone) => {
    if (!zone.leaderId) return null;
    if (typeof zone.leaderId === 'object' && (zone.leaderId as any).firstName) {
      const l = zone.leaderId as any;
      return `${l.firstName} ${l.lastName}`;
    }
    const member = members.find((m) => m._id === zone.leaderId);
    return member ? `${member.firstName} ${member.lastName}` : null;
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  // Filtered zones
  const filteredZones = cellZones.filter((zone) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!zone.name.toLowerCase().includes(q) && !zone.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Stats
  const totalCells = cellZones.filter((z) => z.type === 'cell').length;
  const totalZones = cellZones.filter((z) => z.type === 'zone').length;
  const totalDistricts = cellZones.filter((z) => z.type === 'district').length;
  const totalRegions = cellZones.filter((z) => z.type === 'region').length;

  // ============================================
  // RENDER FORM
  // ============================================

  const renderForm = (isEdit: boolean = false) => (
    <form onSubmit={isEdit ? handleSubmitUpdate : handleSubmitCreate} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name" name="name" value={formData.name} onChange={handleInputChange}
            placeholder="e.g., Zone C - East" required disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {ZONE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description" name="description" value={formData.description} onChange={handleInputChange}
          placeholder="Brief description..." rows={2} disabled={isCreating || isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leaderId">Leader</Label>
        <Select value={formData.leaderId || '_none'} onValueChange={(v) => handleSelectChange('leaderId', v)} disabled={isCreating || isUpdating}>
          <SelectTrigger><SelectValue placeholder="Select a leader" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">No leader assigned</SelectItem>
            {members.map((m) => (
              <SelectItem key={m._id} value={m._id}>{m.firstName} {m.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Meeting Day</Label>
          <Select value={formData.meetingDay || '_none'} onValueChange={(v) => handleSelectChange('meetingDay', v)} disabled={isCreating || isUpdating}>
            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Not set</SelectItem>
              {MEETING_DAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meetingTime">Meeting Time</Label>
          <Input
            id="meetingTime" name="meetingTime" type="time"
            value={formData.meetingTime} onChange={handleInputChange} disabled={isCreating || isUpdating}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meetingLocation">Location</Label>
          <Input
            id="meetingLocation" name="meetingLocation"
            value={formData.meetingLocation} onChange={handleInputChange}
            placeholder="e.g., Community Hall" disabled={isCreating || isUpdating}
          />
        </div>
      </div>

      {isEdit && (
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.isActive ? 'active' : 'inactive'}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, isActive: v === 'active' }))}
            disabled={isCreating || isUpdating}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={isEdit ? handleCloseEditModal : handleCloseAddModal} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update' : 'Create'}
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
        <h1 className="text-3xl font-bold mb-2">Cells & Zones</h1>
        <p className="text-muted-foreground">
          Organize your congregation into cells, zones, districts, and regions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: 'Cells', count: totalCells, config: ZONE_TYPES[0] },
          { label: 'Zones', count: totalZones, config: ZONE_TYPES[1] },
          { label: 'Districts', count: totalDistricts, config: ZONE_TYPES[2] },
          { label: 'Regions', count: totalRegions, config: ZONE_TYPES[3] },
        ].map((item) => (
          <Card key={item.label} className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.config.icon}</div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text" placeholder="Search cells and zones..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ZONE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canUseFeature('cell_zones:create') && (
          <Button onClick={handleAddZone}>
            <Plus className="h-4 w-4 mr-2" />
            Create Cell/Zone
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredZones.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">No cells or zones found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || typeFilter !== 'all'
                ? "Try adjusting your search or filters"
                : "Get started by creating your first cell or zone"}
            </p>
            {!searchQuery && typeFilter === 'all' && canUseFeature('cell_zones:create') && (
              <Button onClick={handleAddZone}>
                <Plus className="h-4 w-4 mr-2" />Create First Cell/Zone
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      {!isLoading && filteredZones.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredZones.map((zone) => {
            const typeConfig = getTypeConfig(zone.type);
            const leaderName = getLeaderName(zone);

            return (
              <Card key={zone._id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{typeConfig.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <Badge className={`mt-1 ${typeConfig.color}`}>{typeConfig.label}</Badge>
                      </div>
                    </div>

                    {(canUseFeature('cell_zones:edit') || canUseFeature('cell_zones:delete')) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewZone(zone)}>
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>
                          {canUseFeature('cell_zones:edit') && (
                            <DropdownMenuItem onClick={() => handleEditZone(zone)}>
                              <Edit className="h-4 w-4 mr-2" />Edit
                            </DropdownMenuItem>
                          )}
                          {canUseFeature('cell_zones:delete') && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(zone)} className="text-red-600">
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
                  {zone.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{zone.description}</p>
                  )}

                  {leaderName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /><span>Leader: {leaderName}</span>
                    </div>
                  )}

                  {zone.meetingDay && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {getDayLabel(zone.meetingDay)}
                        {zone.meetingTime && ` at ${zone.meetingTime}`}
                      </span>
                    </div>
                  )}

                  {zone.meetingLocation && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /><span>{zone.meetingLocation}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={zone.isActive !== false ? "default" : "secondary"}>
                      {zone.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                    {zone.memberCount !== undefined && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{zone.memberCount}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Cell / Zone</DialogTitle>
            <DialogDescription>Add a new cell, zone, district, or region</DialogDescription>
          </DialogHeader>
          {renderForm(false)}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cell / Zone</DialogTitle>
            <DialogDescription>Update the details</DialogDescription>
          </DialogHeader>
          {renderForm(true)}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Cell / Zone Details</DialogTitle></DialogHeader>
          {selectedZone && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getTypeConfig(selectedZone.type).icon}</div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedZone.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getTypeConfig(selectedZone.type).color}>
                      {getTypeConfig(selectedZone.type).label}
                    </Badge>
                    <Badge variant={selectedZone.isActive !== false ? "default" : "secondary"}>
                      {selectedZone.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedZone.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedZone.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Leader</Label>
                  <p className="font-medium">{getLeaderName(selectedZone) || 'Not assigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Meeting Day</Label>
                  <p className="font-medium">{getDayLabel(selectedZone.meetingDay) || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Meeting Time</Label>
                  <p className="font-medium">{selectedZone.meetingTime || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium">{selectedZone.meetingLocation || 'N/A'}</p>
                </div>
              </div>

              {/* Members List */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members
                  {membersPagination && (
                    <Badge variant="outline">{membersPagination.total}</Badge>
                  )}
                </h4>
                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : cellZoneMembers.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cellZoneMembers.map((member) => (
                      <div key={member._id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          {member.photo && <AvatarImage src={member.photo} />}
                          <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                            {`${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                          <p className="text-xs text-muted-foreground">{member.phone || member.email || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No members assigned to this cell/zone yet</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseViewModal}>Close</Button>
                {canUseFeature('cell_zones:edit') && (
                  <Button onClick={() => { handleCloseViewModal(); handleEditZone(selectedZone); }}>
                    <Edit className="h-4 w-4 mr-2" />Edit
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete <span className="font-semibold">{selectedZone?.name}</span>.
              Members assigned to this cell/zone will be unassigned. This action cannot be undone.
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

export default CellZones;