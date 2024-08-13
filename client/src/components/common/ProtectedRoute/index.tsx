import { Navigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useUser();
  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
