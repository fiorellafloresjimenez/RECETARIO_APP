import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext({});

const STORAGE_KEY = "recetario_session_v1";
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE || "https://recetario-app-backend.onrender.com";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialSession() {
      try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && parsed.user && parsed.token) {
            try {
              const res = await fetch(`${BASE_URL}/api/validate`, {
                headers: { Authorization: `Bearer ${parsed.token}` },
              });
              if (res.ok) {
                setSession(parsed);
              } else {
                await SecureStore.deleteItemAsync(STORAGE_KEY);
              }
            } catch (e) {
              console.warn("Validation failed or network error", e);
              setSession(parsed); 
            }
          }
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialSession();
  }, []);

  useEffect(() => {
    async function syncSession() {
      if (loading) return;
      try {
        if (session) {
          await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
        } else {
          await SecureStore.deleteItemAsync(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }
    syncSession();
  }, [session, loading]);

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await loginUser({ email, password });

      const role = res.user?.is_admin ? "admin" : "user";

      const user = {
        id: res.user?.id,
        email: res.user?.email,
        username: res.user?.username,
        role,
        avatarUrl: res.user?.avatarUrl || null,
      };

      setSession({ user, token: res.token });
      return res;
    } catch (err) {
      Alert.alert("Error", "Error al iniciar sesión: " + err.message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async ({ email, password, username, birthday, gender }) => {
      try {
        const res = await registerUser({
          email,
          password,
          username,
          birthday,
          gender,
        });

        const role = res.user?.is_admin ? "admin" : "user";

        const user = {
          id: res.user?.id,
          email: res.user?.email,
          username: res.user?.username,
          role,
          avatarUrl: res.user?.avatarUrl || null,
        };

        setSession({ user, token: res.token });
        return res;
      } catch (err) {
        Alert.alert("Error", "Error al registrarse: " + err.message);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const setRole = useCallback((nextRole) => {
    setSession((prev) => {
      if (!prev || !prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          role: nextRole,
        },
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      role: session?.user?.role || "guest",
      token: session?.token || null,
      isLoading: loading,
      login,
      register,
      logout,
      setRole,
    }),
    [session, loading, login, register, logout, setRole]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
