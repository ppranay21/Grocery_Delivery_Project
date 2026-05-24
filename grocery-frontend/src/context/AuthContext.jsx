import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const register = async (userData) => {
    try {
      await api.post("/auth/register", userData);
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to register user";
      toast.error(message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setCurrentUser(response.data);
      toast.success("Login successful");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid email or password";
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.success("Logout successful");
  };

  const updateCurrentUserName = (name) => {
    setCurrentUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      return {
        ...previousUser,
        name,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        updateCurrentUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
