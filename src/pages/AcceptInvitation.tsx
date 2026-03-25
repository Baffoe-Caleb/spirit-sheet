// src/pages/AcceptInvitation.tsx

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Loader2,
  Church,
  CheckCircle,
  AlertCircle,
  Shield,
  Mail,
  Clock,
  UserPlus,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { verifyInvitation, acceptInvitation, setAuthToken } from "@/services/api";
import auth0Config from "@/auth0Config";

interface InvitationDetails {
  email: string;
  role: string;
  organizationName: string;
  invitedBy?: string;
  expiresAt: string;
}

type PageState =
  | 'loading'
  | 'valid'
  | 'wrong-user'
  | 'authenticating'
  | 'accepting'
  | 'success'
  | 'expired'
  | 'invalid'
  | 'error';

const ROLE_INFO: Record<string, { label: string; description: string; color: string }> = {
  administrator: {
    label: 'Administrator',
    description: 'Full access to all features including settings and user management',
    color: 'bg-blue-100 text-blue-800',
  },
  secretary: {
    label: 'Secretary',
    description: 'Manage members, attendance, groups, and view reports',
    color: 'bg-green-100 text-green-800',
  },
  usher: {
    label: 'Usher',
    description: 'Record attendance for church services and events',
    color: 'bg-yellow-100 text-yellow-800',
  },
  member: {
    label: 'Member',
    description: 'View your profile and personal information',
    color: 'bg-gray-100 text-gray-800',
  },
};

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>('loading');
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userClickedAccept, setUserClickedAccept] = useState(false);

  // ============================================
  // VERIFY INVITATION
  // ============================================
  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      setErrorMessage('No invitation token provided');
      return;
    }
    if (isAuth0Loading) return;

    const verify = async () => {
      try {
        setPageState('loading');
        const response = await verifyInvitation(token);

        if (response.ok && response.data?.success) {
          const inv = response.data.data;
          setInvitation(inv);

          if (isAuthenticated && user) {
            const loggedInEmail = user.email?.toLowerCase();
            const invitedEmail = inv.email.toLowerCase();
            if (loggedInEmail && loggedInEmail !== invitedEmail) {
              setPageState('wrong-user');
              return;
            }
          }
          setPageState('valid');
        } else {
          const msg = (response.data as any)?.message || 'Invalid invitation';
          if (msg.toLowerCase().includes('expired')) {
            setPageState('expired');
          } else if (msg.toLowerCase().includes('already')) {
            setPageState('expired');
            setErrorMessage('This invitation has already been accepted');
          } else {
            setPageState('invalid');
          }
          setErrorMessage(msg);
        }
      } catch {
        setPageState('error');
        setErrorMessage('Failed to verify invitation. Please try again.');
      }
    };

    verify();
  }, [token, isAuth0Loading, isAuthenticated, user]);

  // ============================================
  // ACCEPT LOGIC
  // ============================================
  const doAccept = useCallback(async () => {
    if (!token || !user) return;

    try {
      setPageState('accepting');

      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: auth0Config.audience,
          scope: auth0Config.scope,
        },
      });
      setAuthToken(accessToken);

      const response = await acceptInvitation({
        token,
        auth0Id: user.sub || '',
        email: user.email || '',
        name: user.name || '',
      });

      if (response.ok && response.data?.success) {
        setPageState('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        const msg = (response.data as any)?.message || 'Failed to accept invitation';
        setPageState('error');
        setErrorMessage(msg);
      }
    } catch (err: any) {
      setPageState('error');
      setErrorMessage(err.message || 'An unexpected error occurred');
    }
  }, [token, user, getAccessTokenSilently]);

  // After Auth0 redirect back, only accept if user explicitly clicked
  useEffect(() => {
    if (isAuth0Loading) return;
    if (!isAuthenticated || !user) return;
    if (!userClickedAccept) return;
    if (pageState !== 'valid' && pageState !== 'authenticating') return;
    if (!token) return;

    doAccept();
  }, [isAuthenticated, isAuth0Loading, user, pageState, token, doAccept, userClickedAccept]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleAccept = () => {
    setUserClickedAccept(true);

    if (isAuthenticated && user) {
      doAccept();
    } else {
      setPageState('authenticating');
      loginWithRedirect({
        appState: { returnTo: `/accept-invitation?token=${token}` },
        authorizationParams: {
          screen_hint: 'signup',
          login_hint: invitation?.email,
        },
      });
    }
  };

  const handleSignOutAndContinue = () => {
    const returnUrl = `${window.location.origin}/accept-invitation?token=${token}`;
    logout({ logoutParams: { returnTo: returnUrl } });
  };

  const handleContinueAsCurrent = () => {
    setUserClickedAccept(true);
    setPageState('valid');
  };

  const roleInfo = invitation?.role
    ? ROLE_INFO[invitation.role] || ROLE_INFO.member
    : null;

  const formatExpiryDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {pageState === 'loading' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Verifying your invitation...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'wrong-user' && invitation && (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full w-fit">
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Different Account Detected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invitation for:</span>
                  <span className="font-medium">{invitation.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Logged in as:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                This invitation was sent to a different email address. Sign out and use the correct account, or continue with your current one.
              </p>
              <div className="space-y-3">
                <Button onClick={handleSignOutAndContinue} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out & Use Correct Account
                </Button>
                <Button onClick={handleContinueAsCurrent} className="w-full" variant="outline">
                  Continue as {user?.email}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'valid' && invitation && (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <Church className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">You're Invited!</CardTitle>
              <CardDescription className="text-base mt-2">
                You've been invited to join a church team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Church</p>
                <p className="text-xl font-bold">{invitation.organizationName}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Invited email</p>
                    <p className="font-medium text-sm">{invitation.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Your role</p>
                    {roleInfo && (
                      <>
                        <Badge className={`mt-0.5 ${roleInfo.color}`}>{roleInfo.label}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{roleInfo.description}</p>
                      </>
                    )}
                  </div>
                </div>

                {invitation.invitedBy && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <UserPlus className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Invited by</p>
                      <p className="font-medium text-sm">{invitation.invitedBy}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="font-medium text-sm">{formatExpiryDate(invitation.expiresAt)}</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleAccept} className="w-full" size="lg">
                <UserPlus className="h-5 w-5 mr-2" />
                {isAuthenticated ? 'Accept Invitation' : 'Sign Up & Accept'}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground text-center">
                  You'll be asked to create an account or sign in
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {pageState === 'authenticating' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="font-medium">Redirecting to sign up...</p>
                <p className="text-sm text-muted-foreground">You'll be redirected back after creating your account</p>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'accepting' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="font-medium">Joining the team...</p>
                <p className="text-sm text-muted-foreground">Setting up your account</p>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'success' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-bold">Welcome to the team!</h2>
                <p className="text-muted-foreground">
                  You've been added as{' '}
                  <span className="font-medium">
                    {ROLE_INFO[invitation?.role || 'member']?.label || invitation?.role}
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to dashboard...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'expired' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="mx-auto p-3 bg-yellow-100 rounded-full w-fit">
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold">Invitation Expired</h2>
                <p className="text-muted-foreground">
                  {errorMessage || 'This invitation has expired or has already been used.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please ask your church administrator to send a new invitation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'invalid' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Invalid Invitation</h2>
                <p className="text-muted-foreground">
                  {errorMessage || 'This invitation link is not valid.'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check the link or contact your church administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {pageState === 'error' && (
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold">Something Went Wrong</h2>
                <p className="text-muted-foreground">
                  {errorMessage || 'An unexpected error occurred.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                  <Button onClick={() => navigate('/')}>Go to Home</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;