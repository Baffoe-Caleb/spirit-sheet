// src/pages/Profile.tsx

import { useState, useEffect, useRef } from "react";
import { User, Mail, Shield, Clock, UserX, Settings, Loader2, Save, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { RootState } from "@/redux/reducers";
import { auth0Logout, updateChurchRequest, resetChurchOperation } from "@/redux/actions/authActions";
import {
  inviteUserRequest,
  fetchRoleUsersRequest,
  fetchInvitationsRequest,
  resetRoleOperation,
} from "@/redux/actions/roleActions";
import { checkInactivityRequest, resetMemberOperation } from "@/redux/actions/memberActions";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useToast } from "@/hooks/use-toast";

// ============================================
// CONSTANTS
// ============================================

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  owner: { label: 'Owner', color: 'bg-purple-100 text-purple-800' },
  administrator: { label: 'Administrator', color: 'bg-blue-100 text-blue-800' },
  secretary: { label: 'Secretary', color: 'bg-green-100 text-green-800' },
  usher: { label: 'Usher', color: 'bg-yellow-100 text-yellow-800' },
  member: { label: 'Member', color: 'bg-gray-100 text-gray-800' },
};

const INVITABLE_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'usher', label: 'Usher' },
  { value: 'member', label: 'Member' },
];

// ============================================
// COMPONENT
// ============================================

const Profile = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { toast } = useToast();
  const { userRole, isOwnerOrAdmin, canUseFeature } = useRoleAccess();

  // Redux state
  const { user, syncedUser, organization, isUpdatingChurch, updateChurchSuccess, updateChurchError } = useSelector(
    (state: RootState) => state.auth
  );
  const { users: roleUsers, invitations, isInviting, inviteSuccess, inviteError, isLoading: isLoadingUsers } = useSelector(
    (state: RootState) => state.roles
  );
  const { isCheckingInactivity, inactivityCheckSuccess, inactivityResult, inactivityError } = useSelector(
    (state: RootState) => state.members
  );

  // Local state
  const [latenessTime, setLatenessTime] = useState("08:30");
  const [inactivityDays, setInactivityDays] = useState(30);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("usher");

  // Refs
  const isUpdatingChurchRef = useRef(false);
  const isInvitingRef = useRef(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Load settings from organization
  useEffect(() => {
    if (organization?.settings?.attendance) {
      if (organization.settings.attendance.latenessThresholdTime) {
        setLatenessTime(organization.settings.attendance.latenessThresholdTime);
      }
      if (organization.settings.attendance.inactivityThresholdDays) {
        setInactivityDays(organization.settings.attendance.inactivityThresholdDays);
      }
    }
  }, [organization]);

  // Fetch role users and invitations for admin
  useEffect(() => {
    if (isOwnerOrAdmin) {
      dispatch(fetchRoleUsersRequest({ limit: 50 }));
      dispatch(fetchInvitationsRequest({ status: 'pending' }));
    }
  }, [dispatch, isOwnerOrAdmin]);

  // Handle church update
  useEffect(() => {
    if (!isUpdatingChurchRef.current) return;
    if (isUpdatingChurch) return;
    if (updateChurchError) {
      toast({ title: "Error", description: updateChurchError, variant: "destructive" });
    } else if (updateChurchSuccess) {
      toast({ title: "Settings Saved", description: "Church settings updated successfully" });
    }
    isUpdatingChurchRef.current = false;
    dispatch(resetChurchOperation());
  }, [isUpdatingChurch, updateChurchError, updateChurchSuccess, toast, dispatch]);

  // Handle invite
  useEffect(() => {
    if (!isInvitingRef.current) return;
    if (isInviting) return;
    if (inviteError) {
      toast({ title: "Invite Failed", description: inviteError, variant: "destructive" });
    } else if (inviteSuccess) {
      toast({ title: "Invitation Sent", description: `Invite sent to ${inviteEmail}` });
      setIsInviteModalOpen(false);
      setInviteEmail("");
      setInviteRole("usher");
      dispatch(fetchInvitationsRequest({ status: 'pending' }));
    }
    isInvitingRef.current = false;
    dispatch(resetRoleOperation());
  }, [isInviting, inviteError, inviteSuccess, toast, dispatch, inviteEmail]);

  // Handle inactivity check
  useEffect(() => {
    if (inactivityError) {
      toast({ title: "Error", description: inactivityError, variant: "destructive" });
    }
    if (inactivityCheckSuccess && inactivityResult) {
      toast({
        title: "Inactivity Check Complete",
        description: `${inactivityResult.markedInactive} members marked inactive`,
      });
      dispatch(resetMemberOperation());
    }
  }, [inactivityError, inactivityCheckSuccess, inactivityResult, toast, dispatch]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleLogout = () => {
    dispatch(auth0Logout());
    logout({ logoutParams: { returnTo: window.location.origin } });
    toast({ title: "Logged out", description: "Logged out successfully" });
  };

  const handleSaveSettings = () => {
    isUpdatingChurchRef.current = true;
    dispatch(
      updateChurchRequest({
        settings: {
          attendance: {
            latenessThresholdTime: latenessTime,
            inactivityThresholdDays: inactivityDays,
          },
        },
      })
    );
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return;
    }
    isInvitingRef.current = true;
    dispatch(inviteUserRequest({ email: inviteEmail, role: inviteRole as any }));
  };

  const handleCheckInactivity = () => {
    dispatch(checkInactivityRequest());
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const roleInfo = ROLE_LABELS[userRole] || ROLE_LABELS.member;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account and church settings</p>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details and role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                {user?.picture && <AvatarImage src={user.picture} alt={user.username} />}
                <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-2xl">
                  {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
                  </div>
                </div>
                {organization && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-medium">{organization.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Church Settings — Admin/Owner only */}
        {isOwnerOrAdmin && (
          <>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Church Settings
                </CardTitle>
                <CardDescription>Configure attendance thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lateness Threshold */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="latenessTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Lateness Threshold Time
                    </Label>
                    <Input
                      id="latenessTime"
                      type="time"
                      value={latenessTime}
                      onChange={(e) => setLatenessTime(e.target.value)}
                      disabled={isUpdatingChurch}
                    />
                    <p className="text-xs text-muted-foreground">
                      Members checking in after this time will be marked as late
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inactivityDays" className="flex items-center gap-2">
                      <UserX className="h-4 w-4" />
                      Inactivity Threshold (days)
                    </Label>
                    <Input
                      id="inactivityDays"
                      type="number"
                      min={7}
                      max={365}
                      value={inactivityDays}
                      onChange={(e) => setInactivityDays(parseInt(e.target.value) || 30)}
                      disabled={isUpdatingChurch}
                    />
                    <p className="text-xs text-muted-foreground">
                      Members inactive for this many days will be marked inactive automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveSettings} disabled={isUpdatingChurch}>
                    {isUpdatingChurch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={handleCheckInactivity} disabled={isCheckingInactivity}>
                    {isCheckingInactivity ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                    Run Inactivity Check
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team & Invitations */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage users and send invitations</CardDescription>
                  </div>
                  <Button onClick={() => setIsInviteModalOpen(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : roleUsers.length > 0 ? (
                  <div className="space-y-3">
                    {roleUsers.map((u) => {
                      const rInfo = ROLE_LABELS[u.role] || ROLE_LABELS.member;
                      return (
                        <div key={u._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
                                {u.name ? getInitials(u.name) : '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <Badge className={rInfo.color}>{rInfo.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No team members yet</p>
                )}

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Pending Invitations</h4>
                    <div className="space-y-2">
                      {invitations.map((inv) => (
                        <div key={inv._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{inv.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Invited as {ROLE_LABELS[inv.role]?.label || inv.role}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50">Pending</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Sign Out */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
          </CardContent>
        </Card>
      </div>

      {/* Invite User Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={(open) => { if (!isInviting) setIsInviteModalOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to join your church team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address *</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={isInviting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole} disabled={isInviting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INVITABLE_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Administrator:</span> Full access to all features</p>
                <p><span className="font-medium">Secretary:</span> Members, attendance, groups, reports</p>
                <p><span className="font-medium">Usher:</span> Record attendance only</p>
                <p><span className="font-medium">Member:</span> Profile only</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)} disabled={isInviting}>Cancel</Button>
            <Button onClick={handleSendInvite} disabled={isInviting}>
              {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;