"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as authApi from "@/lib/api/auth";
import { signInToFirebaseWithCustomToken, signOutOfFirebase, isFirebaseConfigured } from "@/lib/firebase";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  retryUserFetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setUser(await authApi.fetchCurrentUser());
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setUser(null); // not logged in
        }
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // Bridges the existing JWT/cookie session into Firebase so Firestore
  // Security Rules can authorize the patient's chat. Firebase manages its
  // own session after this, so it only needs to run when the signed-in
  // user changes.
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    if (!user) {
      signOutOfFirebase().catch(() => {});
      return;
    }
    (async () => {
      try {
        const firebaseToken = await authApi.fetchFirebaseToken();
        await signInToFirebaseWithCustomToken(firebaseToken);
      } catch (error) {
        console.error("Failed to sign in to Firebase for chat:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const login = async (email: string, password: string) => {
    try {
      setUser(await authApi.login(email, password));
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      throw new Error(message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setUser(await authApi.register(name, email, password));
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      throw new Error(message || "Registration failed");
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const retryUserFetch = async () => {
    try {
      setUser(await authApi.fetchCurrentUser());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          // Ask backend to refresh token using refreshToken cookie, then retry.
          await authApi.refreshSession();
          setUser(await authApi.fetchCurrentUser());
        } catch {
          // Refresh also failed -> log out.
          setUser(null);
        }
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    retryUserFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
