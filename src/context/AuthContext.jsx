import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getSavedAuth,
  isAdminUser,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar sesión guardada (si existe)
  useEffect(() => {
    const saved = getSavedAuth();
    if (saved?.user) {
      setUser(saved.user);
    }
  }, []);

  const isLogged = !!user;
  const isAdmin = isAdminUser(user);

  // LOGIN
  async function login({ email, password }) {
    const u = await apiLogin({ email, password });
    setUser(u);
    return u;
  }

  // REGISTER (signup) 
  async function register({ name, email, password, phone }) {
    const u = await apiSignup({ name, email, password, phone });
    setUser(u);
    return u;
  }

  // alias por si en algún lado se usa "signup"
  const signup = register;

  // LOGOUT
  async function logout() {
    await apiLogout();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLogged,
      isAdmin,
      login,
      register, 
      signup,   
      logout,
    }),
    [user, isLogged, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
