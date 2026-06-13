import { Navigate } from "react-router-dom";
import { authStore } from "../store/auth";

export function ProtectedRoute({ children }) {
  const token = authStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

