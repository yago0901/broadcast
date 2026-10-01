import { createContext, useContext } from "react";
import type { AuthState } from "./../types";


export const AuthContext = createContext<AuthState>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);