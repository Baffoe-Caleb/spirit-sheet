import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import store from "./redux/store";
import { auth0UserLoaded } from "./redux/actions/authActions";
import { setAuthToken } from "./services/api";
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
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const AppContent = () => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const setupAuth = async () => {
      if (isAuthenticated && user) {
        const auth0User = {
          id: user.sub || '',
          username: user.nickname || user.name || '',
          email: user.email || '',
          firstName: user.given_name || user.name?.split(' ')[0] || '',
          lastName: user.family_name || user.name?.split(' ').slice(1).join(' ') || '',
          picture: user.picture,
        };
        dispatch(auth0UserLoaded(auth0User));

        // Get access token and set it for API calls
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    setupAuth();
  }, [isAuthenticated, user, dispatch, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><Layout><Members /></Layout></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Layout><Groups /></Layout></ProtectedRoute>} />
        <Route path="/groups/:id" element={<ProtectedRoute><Layout><GroupDetail /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }}
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
