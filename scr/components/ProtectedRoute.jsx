
Action: file_editor create /app/frontend/src/components/ProtectedRoute.jsx --file-text "import { Navigate } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading || user === null) {
    return (
      <div className=\"min-h-screen flex items-center justify-center\" data-testid=\"auth-loading\">
        <div className=\"text-neutral-500 text-sm tracking-wider uppercase\">Verifying session…</div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to=\"/login\" replace />;
  }
  return children;
}
"
Observation: Create successful: /app/frontend/src/components/ProtectedRoute.jsx
