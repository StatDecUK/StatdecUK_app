"import { createContext, useContext, useEffect, useState, useCallback } from \"react\";
import { api, extractError } from \"@/lib/api\";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = unknown, false = anon, object = logged in
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get(\"/auth/me\");
      setUser(data);
    } catch {
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback (URL contains session_id=),
    // skip /me check. AuthCallback will exchange the session_id first.
    if (typeof window !== \"undefined\" && window.location.hash.includes(\"session_id=\")) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  async function login(email, password) {
    try {
      const { data } = await api.post(\"/auth/login\", { email, password });
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: extractError(e) };
    }
  }

  async function register(email, password, name) {
    try {
      const { data } = await api.post(\"/auth/register\", { email, password, name });
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: extractError(e) };
    }
  }

  async function logout() {
    try {
      await api.post(\"/auth/logout\");
    } catch {}
    setUser(false);
  }

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  function startGoogleLogin() {
    const redirectUrl = window.location.origin + \"/dashboard\";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(
      redirectUrl
    )}`;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, startGoogleLogin, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
"
Observation: Create successful: /app/frontend/src/context/AuthContext.jsx
