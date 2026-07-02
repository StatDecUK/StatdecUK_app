"import { useEffect, useRef } from \"react\";
import { useNavigate } from \"react-router-dom\";
import { api, extractError } from \"@/lib/api\";
import { useAuth } from \"@/context/AuthContext\";
import { toast } from \"sonner\";

export default function AuthCallback() {
  const processed = useRef(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const hash = window.location.hash;
    const match = hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate(\"/login\", { replace: true });
      return;
    }
    const sessionId = decodeURIComponent(match[1]);
    (async () => {
      try {
        const { data } = await api.post(\"/auth/session\", { session_id: sessionId });
        setUser(data.user);
        // clean URL
        window.history.replaceState(null, \"\", \"/dashboard\");
        toast.success(`Signed in as ${data.user.email}`);
        navigate(\"/dashboard\", { replace: true });
      } catch (e) {
        toast.error(extractError(e) || \"Google sign-in failed\");
        navigate(\"/login\", { replace: true });
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className=\"min-h-screen flex items-center justify-center\" data-testid=\"auth-callback\">
      <div className=\"text-neutral-500 text-sm uppercase tracking-widest\">
        Finalising sign-in…
      </div>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/AuthCallback.jsx
