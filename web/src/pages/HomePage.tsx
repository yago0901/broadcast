import { Button, Typography } from "@mui/material";
import { logoutUser } from "../features/auth/api";
import { useAuth } from "../features/auth/context/authContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <Typography variant="h5">Olá, {user?.displayName ?? user?.email}</Typography>
      <Typography variant="body2">uid: {user?.uid}</Typography>
      <Button variant="outlined" onClick={() => logoutUser()}>Sair</Button>
    </div>
  );
}