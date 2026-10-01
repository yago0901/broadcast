import type { User } from "firebase/auth";

export type AuthState = {
  user: User | null;
  loading: boolean;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};