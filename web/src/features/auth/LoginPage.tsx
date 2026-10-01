import { Link as RouterLink } from "react-router-dom";
import { Alert, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useLoginForm } from "./hooks/useLoginForm";

export function LoginPage() {
  const { email, setEmail, password, setPassword, error, submitting, handleSubmit } = useLoginForm();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Paper className="w-full max-w-sm p-6" elevation={3}>
        <Typography variant="h5" className="mb-4 font-bold">Entrar</Typography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="E-mail" type="email" value={email} required fullWidth
            onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" value={password} required fullWidth
            onChange={(e) => setPassword(e.target.value)} />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <Typography variant="body2" className="mt-4">
          Não tem conta? <Link component={RouterLink} to="/register">Cadastre-se</Link>
        </Typography>
      </Paper>
    </div>
  );
}