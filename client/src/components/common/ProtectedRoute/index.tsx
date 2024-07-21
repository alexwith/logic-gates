import { Navigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}