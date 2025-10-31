import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import keycloak from "@/services/keycloak";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    keycloak.login();
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
