// src/pages/RegisterChurch.tsx

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerChurch, loginChurch, RegisterChurchResponse, LoginResponse } from "@/services/api";
import { Loader2, Church, CheckCircle, Mail } from "lucide-react";

interface RegisterChurchProps {
  onRegistrationComplete: () => void;
}

const RegisterChurch = ({ onRegistrationComplete }: RegisterChurchProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Detect if arriving from an invitation link
  const inviteToken = searchParams.get("invite");
  const defaultTab = inviteToken ? "join" : "create";

  const [formData, setFormData] = useState({
    churchName: "",
    churchType: "church",
    churchPhone: "",
    churchWebsite: "",
  });

  // Auto-try login for invited users
  useEffect(() => {
    if (inviteToken && user) {
      handleJoinViaInvite();
    }
  }, [inviteToken, user]);

  const handleJoinViaInvite = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const loginResponse = await loginChurch({
        auth0Id: user.sub || "",
        email: user.email || "",
      });

      const loginData = loginResponse.data as LoginResponse | undefined;

      if (loginResponse.ok && loginData?.success) {
        setSuccess(true);
        onRegistrationComplete();
        setTimeout(() => navigate("/", { replace: true }), 500);
      } else {
        // Not yet registered on backend — they need to complete registration
        // The backend invite flow will associate them on first login
        setError("Please complete your registration to join the church.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to join. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.churchName.trim()) {
      setError("Church name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerChurch({
        auth0Id: user?.sub || "",
        email: user?.email || "",
        name: user?.name || "",
        churchName: formData.churchName,
        churchType: formData.churchType,
        churchPhone: formData.churchPhone,
        churchWebsite: formData.churchWebsite,
      });

      const responseData = response.data as RegisterChurchResponse | undefined;

      if (response.ok && responseData?.success) {
        setSuccess(true);

        const loginResponse = await loginChurch({
          auth0Id: user?.sub || "",
          email: user?.email || "",
        });

        const loginData = loginResponse.data as LoginResponse | undefined;

        if (loginResponse.ok && loginData?.success) {
          onRegistrationComplete();
          setTimeout(() => navigate("/", { replace: true }), 500);
        } else {
          onRegistrationComplete();
          setTimeout(() => navigate("/", { replace: true }), 500);
        }
      } else {
        const errorMessage = responseData?.message || "Registration failed. Please try again.";
        setError(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during registration";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSubmitJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleJoinViaInvite();
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">
                {inviteToken ? "Joined Successfully!" : "Registration Successful!"}
              </h2>
              <p className="text-muted-foreground">Redirecting to dashboard...</p>
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Church className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to FaithTrack</CardTitle>
          <CardDescription>
            {inviteToken
              ? "You've been invited to join a church"
              : "Create a new church or join an existing one"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Info */}
          <div className="p-3 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">Signed in as:</p>
            <p className="font-medium">{user?.name || user?.email}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {inviteToken ? (
            /* Invite flow — simplified */
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-800">You have an invitation</p>
                <p className="text-sm text-blue-600">Click below to join the church</p>
              </div>
              <Button onClick={handleSubmitJoin} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Accept Invitation & Join"
                )}
              </Button>
            </div>
          ) : (
            /* Normal flow — tabs for Create vs Join */
            <Tabs defaultValue={defaultTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="create" className="flex-1">Create New Church</TabsTrigger>
                <TabsTrigger value="join" className="flex-1">Join via Invite</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <form onSubmit={handleSubmitCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="churchName">Church Name *</Label>
                    <Input
                      id="churchName"
                      value={formData.churchName}
                      onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                      placeholder="Enter your church name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="churchType">Organization Type</Label>
                    <Select
                      value={formData.churchType}
                      onValueChange={(value) => setFormData({ ...formData, churchType: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="church">Church</SelectItem>
                        <SelectItem value="ministry">Ministry</SelectItem>
                        <SelectItem value="fellowship">Fellowship</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="churchPhone">Phone Number</Label>
                    <Input
                      id="churchPhone"
                      type="tel"
                      value={formData.churchPhone}
                      onChange={(e) => setFormData({ ...formData, churchPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="churchWebsite">Website</Label>
                    <Input
                      id="churchWebsite"
                      type="url"
                      value={formData.churchWebsite}
                      onChange={(e) => setFormData({ ...formData, churchWebsite: e.target.value })}
                      placeholder="https://yourchurch.com"
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="join">
                <div className="space-y-4 text-center py-6">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Have an invitation?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ask your church administrator to send you an invite. You'll receive an email with a link to join.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                    <p>When you receive the invitation email, click the link and you'll be automatically added to the church with the assigned role.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterChurch;