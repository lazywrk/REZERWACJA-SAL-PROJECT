import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";

function getInitialUser() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {

  const [user, setUser] = useState(getInitialUser);

  function login(token) {
    try {
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

    } catch {
      localStorage.removeItem("token");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}