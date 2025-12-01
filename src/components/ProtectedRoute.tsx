// src/components/ProtectedRoute.tsx
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Loader2 } from 'lucide-react';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return children;
};
export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  ),
});