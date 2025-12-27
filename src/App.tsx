import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import store from "./redux/store";
import { auth0UserLoaded } from "./redux/actions/authActions";
import {
  setAuthToken,
  getCurrentUser,
  GetCurrentUserResponse,
} from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import RegisterChurch from "./pages/RegisterChurch";
import { Loader2 } from "lucide-react";
import auth0Config from "./auth0Config";

const queryClient = new QueryClient();

type AuthState = 'loading' | 'ready' | 'needs-registration' | 'error';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, user, getAccessTokenSilently, error } = useAuth0();
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const setupAuth = async () => {
      if (isLoading) return;

      if (error) {
        console.error('Auth0 Error:', error);
        setAuthState('error');
        return;
      }

      if (!isAuthenticated) {
        console.log('User not authenticated');
        setAuthState('ready');
        return;
      }

      if (isAuthenticated && user) {
        try {
          console.log('🔐 Getting access token...');

          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: auth0Config.audience,
              scope: auth0Config.scope,
            }
          });

          if (!token) {
            throw new Error('No token received');
          }

          console.log('✅ Token received');
          setAuthToken(token);

          // Dispatch basic Auth0 user info to Redux
          dispatch(auth0UserLoaded({
            id: user.sub || '',
            username: user.nickname || user.name || '',
            email: user.email || '',
            firstName: user.given_name || user.name?.split(' ')[0] || '',
            lastName: user.family_name || user.name?.split(' ').slice(1).join(' ') || '',
            picture: user.picture,
          }));

          // Check if user exists in our database by calling /api/auth/me
          console.log('🔍 Checking if user is registered...');
          const userResponse = await getCurrentUser();

          console.log('📋 Get current user response:', {
            ok: userResponse.ok,
            status: userResponse.status,
            problem: userResponse.problem,
            data: userResponse.data,
          });

          if (userResponse.ok && userResponse.data) {
            const userData = userResponse.data as GetCurrentUserResponse;

            if (userData.success && userData.data?.user) {
              // User exists and is registered
              console.log('✅ User is registered:', userData.data.user.email);
              console.log('🏢 Organization:', userData.data.organization?.name);
              setAuthState('ready');
            } else {
              // Unexpected response structure
              console.warn('⚠️ Unexpected response structure:', userData);
              setAuthState('needs-registration');
            }
          } else {
            // Handle error responses
            console.log('📋 User check failed:', {
              status: userResponse.status,
              problem: userResponse.problem,
            });

            if (userResponse.status === 404) {
              // User not found - needs to register
              console.log('📝 User not found in database, needs registration');
              setAuthState('needs-registration');
            } else if (userResponse.status === 401) {
              // Token issue
              console.error('🔒 Authentication failed');
              setAuthState('error');
            } else if (userResponse.status === 500) {
              // Server error - check the message
              const errorData = userResponse.data as any;
              if (errorData?.message?.includes('not found') ||
                errorData?.message?.includes('User not found')) {
                console.log('📝 User not found (500), needs registration');
                setAuthState('needs-registration');
              } else {
                console.error('❌ Server error:', errorData?.message);
                setAuthState('error');
              }
            } else {
              // Other error
              console.error('❌ Unexpected error');
              setAuthState('error');
            }
          }

        } catch (err) {
          console.error('❌ Error in auth setup:', err);
          setAuthState('error');
        }
      }
    };

    setupAuth();
  }, [isAuthenticated, isLoading, user, error, dispatch, getAccessTokenSilently]);

  // Loading state
  if (isLoading || authState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {isLoading ? 'Initializing...' : 'Setting up your account...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (authState === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-semibold">Authentication Error</p>
          <p className="text-muted-foreground">Please try refreshing or logging in again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Helper component to wrap protected routes
  const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
    if (authState === 'needs-registration') {
      return <Navigate to="/register-church" replace />;
    }
    return <ProtectedRoute>{children}</ProtectedRoute>;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Registration route */}
        <Route
          path="/register-church"
          element={
            isAuthenticated ? (
              authState === 'ready' ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterChurch onRegistrationComplete={() => setAuthState('ready')} />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRouteWrapper>
              <Layout><Dashboard /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRouteWrapper>
              <Layout><Members /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRouteWrapper>
              <Layout><Attendance /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRouteWrapper>
              <Layout><Groups /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRouteWrapper>
              <Layout><GroupDetail /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRouteWrapper>
              <Layout><Profile /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRouteWrapper>
              <Layout><Settings /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRouteWrapper>
              <Layout><Reports /></Layout>
            </ProtectedRouteWrapper>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    authorizationParams={{
      redirect_uri: auth0Config.redirectUri,
      audience: auth0Config.audience,
      scope: auth0Config.scope
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </Auth0Provider>
);

export default App;