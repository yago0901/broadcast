import { Link as RouterLink } from "react-router-dom";
import { Alert, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useRegisterForm } from "./hooks/useRegisterForm";

export function RegisterPage() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    error, submitting, handleSubmit,
  } = useRegisterForm();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Paper className="w-full max-w-sm p-6" elevation={3}>
        <Typography variant="h5" className="mb-4 font-bold">
          Criar conta
        </Typography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Nome" value={name} required fullWidth
            onChange={(e) => setName(e.target.value)} />
          <TextField label="E-mail" type="email" value={email} required fullWidth
            onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" value={password} required fullWidth
            onChange={(e) => setPassword(e.target.value)} />
          <TextField label="Confirmar senha" type="password" value={confirm} required fullWidth
            onChange={(e) => setConfirm(e.target.value)} />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Criando..." : "Cadastrar"}
          </Button>
        </form>

        <Typography variant="body2" className="mt-4">
          Já tem conta?{" "}
          <Link component={RouterLink} to="/login">Entrar</Link>
        </Typography>
      </Paper>
    </div>
  );
}