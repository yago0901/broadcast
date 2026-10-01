import { Link as RouterLink, Outlet } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../features/auth/hooks/useAuth";
import { logoutUser } from "../features/auth/api";

export function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <AppBar position="static" elevation={1}>
        <Toolbar className="gap-4">
          <Typography variant="h6" component={RouterLink} to="/" color="inherit" className="flex-1 no-underline">
            Broadcast
          </Typography>
          <Typography variant="body2" className="hidden sm:block">
            {user?.displayName ?? user?.email}
          </Typography>
          <Button color="inherit" onClick={() => logoutUser()}>Sair</Button>
        </Toolbar>
      </AppBar>

      <main className="mx-auto max-w-3xl p-4">
        <Outlet />
      </main>
    </div>
  );
}