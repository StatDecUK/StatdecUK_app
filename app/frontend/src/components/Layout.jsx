Now create the components and pages:
Action: file_editor create /app/frontend/src/components/Layout.jsx --file-text "import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";
import { Button } from \"@/components/ui/button\";
import { LogOut, Scale } from \"lucide-react\";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(\"/login\");
  }

  return (
    <div className=\"min-h-screen bg-[#fafafa] text-foreground\">
      <header
        className=\"sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-neutral-200\"
        data-testid=\"app-header\"
      >
        <div className=\"max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between\">
          <Link
            to={user ? \"/dashboard\" : \"/\"}
            className=\"flex items-center gap-3 group\"
            data-testid=\"nav-home-link\"
          >
            <div className=\"w-8 h-8 rounded-sm bg-black flex items-center justify-center\">
              <Scale className=\"w-4 h-4 text-white\" strokeWidth={1.5} />
            </div>
            <div className=\"leading-tight\">
              <div className=\"font-serif-display text-lg font-semibold tracking-tight\">
                Statuta
              </div>
              <div className=\"text-[10px] uppercase tracking-[0.18em] text-neutral-500 -mt-0.5\">
                Declaration Suite
              </div>
            </div>
          </Link>

          {user ? (
            <div className=\"flex items-center gap-4\">
              <Link
                to=\"/dashboard\"
                className=\"text-sm text-neutral-700 hover:text-black transition-colors hidden sm:block\"
                data-testid=\"nav-dashboard-link\"
              >
                Dashboard
              </Link>
              <Link
                to=\"/editor\"
                className=\"text-sm text-neutral-700 hover:text-black transition-colors hidden sm:block\"
                data-testid=\"nav-new-declaration-link\"
              >
                New Declaration
              </Link>
              <div className=\"hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-neutral-100 border border-neutral-200\">
                <div className=\"w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-medium\">
                  {(user.name || user.email || \"?\").charAt(0).toUpperCase()}
                </div>
                <span className=\"text-sm text-neutral-700\" data-testid=\"nav-user-email\">
                  {user.email}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant=\"ghost\"
                size=\"sm\"
                className=\"rounded-sm\"
                data-testid=\"logout-button\"
              >
                <LogOut className=\"w-4 h-4 mr-1.5\" /> Sign out
              </Button>
            </div>
          ) : (
            <div className=\"flex items-center gap-2\">
              <Link to=\"/login\">
                <Button variant=\"ghost\" size=\"sm\" className=\"rounded-sm\" data-testid=\"nav-login-button\">
                  Sign in
                </Button>
              </Link>
              <Link to=\"/register\">
                <Button size=\"sm\" className=\"rounded-sm bg-black hover:bg-neutral-800\" data-testid=\"nav-register-button\">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className=\"max-w-7xl mx-auto px-6 lg:px-10 py-10\">{children}</main>
      <div id=\"print-area\" />
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/components/Layout.jsx
