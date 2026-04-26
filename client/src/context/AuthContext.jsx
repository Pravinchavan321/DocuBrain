import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { loginUser as loginApi, registerUser as registerApi, logoutUser as logoutApi } from '../api/auth.api';
import {
  setAccessToken,
  setRefreshToken,
  setUserData,
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getUserData,
} from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // true only during initial hydration

  // ─── Core logout utility (safe to call from anywhere) ────────────────────────
  const performLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    clearAuthStorage();
  }, []);

  // ─── Hydrate auth state from localStorage on mount ───────────────────────────
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getAccessToken();
      const storedUser = getUserData();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else if (storedToken || storedUser) {
        // Partial/corrupted state — wipe everything
        performLogout();
      }
      setIsLoading(false);
    };

    initAuth();

    // Global 401 listener (e.g. expired token caught by axios interceptor)
    const handleUnauthorized = () => performLogout();
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [performLogout]);

  // ─── Shared helper: persist tokens + user after login ────────────────────────
  const _persistAuthData = (data) => {
    // Server response shape: { success, data: { access_token, refresh_token, user } }
    const payload = data?.data ?? data;

    const accessToken  = payload?.access_token  ?? payload?.token ?? payload?.accessToken;
    const refreshToken = payload?.refresh_token ?? payload?.refreshToken;
    const userData     = payload?.user ?? null;

    if (accessToken) {
      setToken(accessToken);
      setAccessToken(accessToken);
    }
    if (refreshToken) {
      setRefreshToken(refreshToken); // ✅ FIX: was never stored before
    }
    if (userData) {
      setUser(userData);
      setUserData(userData);
    }
    setIsAuthenticated(true);
  };

  // ─── Login ────────────────────────────────────────────────────────────────────
  const login = async (payload) => {
    // Use a local loading state on the page; isLoading is only for initial hydration
    try {
      const resp = await loginApi(payload);

      // resp = { success: true, data: { access_token, refresh_token, user } }
      if (resp?.success !== true) {
        throw new Error(resp?.message || 'Login failed.');
      }

      const accessToken = resp?.data?.access_token ?? resp?.data?.token;
      if (!accessToken) {
        throw new Error('Server did not return an authorization token.');
      }

      _persistAuthData(resp);
      return resp;
    } catch (err) {
      throw err;
    }
  };

  // ─── Register ─────────────────────────────────────────────────────────────────
  const register = async (payload) => {
    try {
      const resp = await registerApi(payload);

      if (resp?.success !== true) {
        throw new Error(resp?.message || 'Registration failed.');
      }

      return resp; // caller redirects to /login
    } catch (err) {
      throw err;
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      // Best-effort server call — if it fails (e.g. network issue) we still log out locally
      await logoutApi();
    } catch (e) {
      // Intentionally silent — local state is cleared regardless
    } finally {
      performLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
