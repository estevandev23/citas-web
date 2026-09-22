"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { SessionView, TokenResponse } from "@/lib/api";

type AuthState = { status: "anonymous" | "checking" | "authenticated"; session: SessionView | null; establish: (tokens: TokenResponse, session: SessionView) => void; clear: () => void };
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionView | null>(null);
  const establish = useCallback((_tokens: TokenResponse, current: SessionView) => { setSession(current); }, []);
  const clear = useCallback(() => { setSession(null); }, []);
  const value = useMemo<AuthState>(() => ({ status: session ? "authenticated" : "anonymous", session, establish, clear }), [clear, establish, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value; }
