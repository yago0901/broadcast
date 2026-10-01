import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../features/auth/context/authContext";

type Props = { onlyGuests?: boolean };

export function ProtectedRoute({ onlyGuests = false }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (onlyGuests) return user ? <Navigate to="/" replace /> : <Outlet />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}