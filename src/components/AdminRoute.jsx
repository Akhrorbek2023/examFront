import { Navigate } from "react-router-dom";
import { authStore } from "../store/auth";

// Faqat admin foydalanuvchilarga ruxsat beruvchi route
export function AdminRoute({ children }) {
  const token = authStore((s) => s.token);
  const user = authStore((s) => s.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/movies" replace />;

  return <>{children}</>;
}
