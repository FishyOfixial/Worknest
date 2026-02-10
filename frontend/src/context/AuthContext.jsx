import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Se ejecuta al abrir la app (refresh incluido)
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const loginUser = (tokens) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginUser, logoutUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
