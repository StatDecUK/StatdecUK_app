"
import { useState } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import { useAuth } from \"@/context/AuthContext\";
import { Button } from \"@/components/ui/button\";
import { Input } from \"@/components/ui/input\";
import { Label } from \"@/components/ui/label\";
import { toast } from \"sonner\";

const AUTH_BG = \"https://images.pexels.com/photos/14505030/pexels-photo-14505030.jpeg\";

export function AuthShell({ children, title, subtitle }) {
  return (
    <div className=\"min-h-screen grid lg:grid-cols-2\">
      <div
        className=\"hidden lg:block relative bg-cover bg-center\"
        style={{ backgroundImage: `url(${AUTH_BG})` }}
      >
        <div className=\"absolute inset-0 bg-black/55\" />
        <div className=\"absolute inset-0 p-12 flex flex-col justify-between text-white\">
          <div className=\"flex items-center gap-3\">
            <div className=\"w-9 h-9 rounded-sm bg-white text-black flex items-center justify-center font-serif-display font-bold\">
              S
            </div>
            <div className=\"leading-tight\">
              <div className=\"font-serif-display text-xl\">Statuta</div>
              <div className=\"text-[10px] uppercase tracking-[0.2em] text-white/70\">
                Declaration Suite
              </div>
            </div>
          </div>
          <div className=\"max-w-md\">
            <div className=\"text-xs uppercase tracking-[0.3em] text-white/70 mb-4\">
              Statutory Declarations Act 1835
            </div>
            <h1 className=\"font-serif-display text-4xl lg:text-5xl font-medium leading-tight mb-4\">
              Draft, witness and file UK statutory declarations with the rigour they deserve.
            </h1>
            <p className=\"text-white/80 leading-relaxed text-sm\">
              Nineteen pre-vetted declaration types, automated exhibit cover sheets, and
              court-grade PDF exports — built for solicitors, paralegals and commissioners
              for oaths.
            </p>
          </div>
          <div className=\"text-xs uppercase tracking-[0.25em] text-white/50\">
            Built for British legal practice
          </div>
        </div>
      </div>
      <div className=\"flex items-center justify-center p-8 lg:p-16\">
        <div className=\"w-full max-w-md\">
          <div className=\"mb-10\">
            <div className=\"text-xs uppercase tracking-[0.25em] text-neutral-500 mb-2\">
              {subtitle}
            </div>
            <h2 className=\"font-serif-display text-4xl font-semibold tracking-tight\">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function GoogleButton({ onClick, testid }) {
  return (
    <Button
      type=\"button\"
      variant=\"outline\"
      onClick={onClick}
      className=\"w-full rounded-sm h-11 border-neutral-300 hover:bg-neutral-50\"
      data-testid={testid}
    >
      <svg className=\"w-4 h-4 mr-2\" viewBox=\"0 0 24 24\">
        <path fill=\"#4285F4\" d=\"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z\"/>
        <path fill=\"#34A853\" d=\"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.97 10.97 0 0 0 12 23z\"/>
        <path fill=\"#FBBC05\" d=\"M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z\"/>
        <path fill=\"#EA4335\" d=\"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z\"/>
      </svg>
      Continue with Google
    </Button>
  );
}

export function LoginPage() {
  const { login, startGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success(\"Welcome back\");
      navigate(\"/dashboard\");
    } else {
      toast.error(res.error || \"Login failed\");
    }
  }

  return (
    <AuthShell title=\"Sign in\" subtitle=\"Practitioner access\">
      <form onSubmit={onSubmit} className=\"space-y-5\" data-testid=\"login-form\">
        <div className=\"space-y-2\">
          <Label htmlFor=\"email\" className=\"text-xs uppercase tracking-wider text-neutral-600\">
            Email
          </Label>
          <Input
            id=\"email\"
            type=\"email\"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=\"you@firm.co.uk\"
            className=\"rounded-sm h-11 border-neutral-300\"
            data-testid=\"login-email-input\"
          />
        </div>
        <div className=\"space-y-2\">
          <Label htmlFor=\"password\" className=\"text-xs uppercase tracking-wider text-neutral-600\">
            Password
          </Label>
          <Input
            id=\"password\"
            type=\"password\"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=\"rounded-sm h-11 border-neutral-300\"
            data-testid=\"login-password-input\"
          />
        </div>
        <Button
          type=\"submit\"
          disabled={busy}
          className=\"w-full h-11 rounded-sm bg-black hover:bg-neutral-800\"
          data-testid=\"login-submit-button\"
        >
          {busy ? \"Signing in…\" : \"Sign in\"}
        </Button>
      </form>
      <div className=\"my-6 flex items-center gap-4\">
        <div className=\"flex-1 h-px bg-neutral-200\" />
        <span className=\"text-xs uppercase tracking-[0.2em] text-neutral-400\">or</span>
        <div className=\"flex-1 h-px bg-neutral-200\" />
      </div>
      <GoogleButton onClick={startGoogleLogin} testid=\"login-google-button\" />
      <div className=\"mt-8 text-sm text-neutral-600\">
        New here?{\" \"}
        <Link to=\"/register\" className=\"text-black underline underline-offset-4\" data-testid=\"link-to-register\">
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register, startGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(\"\");
  const [email, setEmail] = useState(\"\");
  const [password, setPassword] = useState(\"\");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const res = await register(email, password, name);
    setBusy(false);
    if (res.ok) {
      toast.success(\"Account created\");
      navigate(\"/dashboard\");
    } else {
      toast.error(res.error || \"Registration failed\");
    }
  }

  return (
    <AuthShell title=\"Create account\" subtitle=\"Begin practice\">
      <form onSubmit={onSubmit} className=\"space-y-5\" data-testid=\"register-form\">
        <div className=\"space-y-2\">
          <Label className=\"text-xs uppercase tracking-wider text-neutral-600\">Full name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=\"J. Smith\"
            className=\"rounded-sm h-11 border-neutral-300\"
            data-testid=\"register-name-input\"
          />
        </div>
        <div className=\"space-y-2\">
          <Label className=\"text-xs uppercase tracking-wider text-neutral-600\">Email</Label>
          <Input
            type=\"email\"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=\"you@firm.co.uk\"
            className=\"rounded-sm h-11 border-neutral-300\"
            data-testid=\"register-email-input\"
          />
        </div>
        <div className=\"space-y-2\">
          <Label className=\"text-xs uppercase tracking-wider text-neutral-600\">Password</Label>
          <Input
            type=\"password\"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=\"rounded-sm h-11 border-neutral-300\"
            data-testid=\"register-password-input\"
          />
          <p className=\"text-xs text-neutral-500\">Minimum 6 characters.</p>
        </div>
        <Button
          type=\"submit\"
          disabled={busy}
          className=\"w-full h-11 rounded-sm bg-black hover:bg-neutral-800\"
          data-testid=\"register-submit-button\"
        >
          {busy ? \"Creating account…\" : \"Create account\"}
        </Button>
      </form>
      <div className=\"my-6 flex items-center gap-4\">
        <div className=\"flex-1 h-px bg-neutral-200\" />
        <span className=\"text-xs uppercase tracking-[0.2em] text-neutral-400\">or</span>
        <div className=\"flex-1 h-px bg-neutral-200\" />
      </div>
      <GoogleButton onClick={startGoogleLogin} testid=\"register-google-button\" />
      <div className=\"mt-8 text-sm text-neutral-600\">
        Already registered?{\" \"}
        <Link to=\"/login\" className=\"text-black underline underline-offset-4\" data-testid=\"link-to-login\">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Auth.jsx
