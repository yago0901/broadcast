import type { RegisterFormValues } from "./types";

export const getAuthErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    default:
      return "Não foi possível concluir. Tente novamente.";
  }
};

export const validateRegisterForm = ({ name, password, confirm }: RegisterFormValues): string | null => {
  if (name.trim().length < 2) return "Informe seu nome.";
  if (password.length < 6) return "A senha precisa ter pelo menos 6 caracteres.";
  if (password !== confirm) return "As senhas não conferem.";
  return null;
};