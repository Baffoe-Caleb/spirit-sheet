// src/components/RoleGuard.tsx

import { Navigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  page: string;
  children: React.ReactNode;
}

const RoleGuard = ({ page, children }: RoleGuardProps) => {
  const { canAccessPage, isUsher, isRoleLoading } = useRoleAccess();

  // ✅ Wait for role to be loaded before making access decisions
  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canAccessPage(page)) {
    const fallback = isUsher ? "/attendance" : "/profile";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;