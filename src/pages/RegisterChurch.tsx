import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerChurch, loginChurch, RegisterChurchResponse, LoginResponse } from "@/services/api";
import { Loader2, Church, CheckCircle } from "lucide-react";

interface RegisterChurchProps {
    onRegistrationComplete: () => void;
}

const RegisterChurch = ({ onRegistrationComplete }: RegisterChurchProps) => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        churchName: "",
        churchType: "church",
        churchPhone: "",
        churchWebsite: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.churchName.trim()) {
            setError("Church name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log('📝 Submitting registration...');

            const response = await registerChurch({
                auth0Id: user?.sub || "",
                email: user?.email || "",
                name: user?.name || "",
                churchName: formData.churchName,
                churchType: formData.churchType,
                churchPhone: formData.churchPhone,
                churchWebsite: formData.churchWebsite,
            });

            console.log('Registration response:', response);

            const responseData = response.data as RegisterChurchResponse | undefined;

            if (response.ok && responseData?.success) {
                console.log('✅ Registration successful');
                setSuccess(true);

                // Now login to get full user session
                console.log('🔐 Logging in after registration...');
                const loginResponse = await loginChurch({
                    auth0Id: user?.sub || "",
                    email: user?.email || "",
                });

                console.log('Login response:', loginResponse);

                const loginData = loginResponse.data as LoginResponse | undefined;

                if (loginResponse.ok && loginData?.success) {
                    console.log('✅ Login successful, navigating to dashboard...');

                    // Call the completion callback
                    onRegistrationComplete();

                    // Small delay to ensure state is updated, then navigate
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 500);
                } else {
                    // Registration worked but login failed - still redirect
                    console.warn('⚠️ Login after registration failed, but registration was successful');
                    onRegistrationComplete();
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 500);
                }
            } else {
                const errorMessage = responseData?.message || "Registration failed. Please try again.";
                setError(errorMessage);
                setLoading(false);
            }
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred during registration";
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Success state - show briefly before redirect
    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold">Registration Successful!</h2>
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
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                        <Church className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Register Your Church</CardTitle>
                    <CardDescription>
                        Complete your registration to start managing your church
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User Info (from Auth0) */}
                        <div className="p-3 bg-muted rounded-lg mb-4">
                            <p className="text-sm text-muted-foreground">Registering as:</p>
                            <p className="font-medium">{user?.name || user?.email}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>

                        {/* Church Name */}
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

                        {/* Church Type */}
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

                        {/* Phone */}
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

                        {/* Website */}
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

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
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
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterChurch;