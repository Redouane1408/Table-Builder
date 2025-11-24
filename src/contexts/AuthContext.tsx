"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { mockApi, mockUsers } from "@/lib/mockData";
import { User } from "@/lib/types";

type AuthState = { user: User | null; isAuthenticated: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void };

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) setUser(JSON.parse(raw));
  }, []);
  const login = async (email: string, password: string) => {
    const { user } = await mockApi.login(email, password);
    setUser(user);
    localStorage.setItem("auth:user", JSON.stringify(user));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth:user");
  };
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
};

