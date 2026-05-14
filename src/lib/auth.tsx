import { createContext, useContext, useState } from "react";

type AuthState = { isLoggedIn: boolean; user: { name: string; initials: string } | null };
const AuthContext = createContext<{
  auth: AuthState;
  login: (name: string) => void;
  logout: () => void;
}>({ auth: { isLoggedIn: false, user: null }, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: true, // demo: start logged in
    user: { name: "Nguyễn Minh Tuấn", initials: "NMT" },
  });

  function login(name: string) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
    setAuth({ isLoggedIn: true, user: { name, initials } });
  }

  function logout() {
    setAuth({ isLoggedIn: false, user: null });
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
