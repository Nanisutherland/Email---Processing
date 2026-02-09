import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <div className="outlook-logo-large">
            <svg viewBox="0 0 48 48" width="80" height="80">
              <rect x="2" y="6" width="44" height="36" rx="3" fill="#0078D4" />
              <path d="M24 14L6 24l18 10 18-10L24 14z" fill="#fff" opacity="0.3" />
              <path d="M6 24v14a3 3 0 003 3h30a3 3 0 003-3V24L24 34 6 24z" fill="#fff" opacity="0.2" />
              <path d="M6 10a3 3 0 013-3h30a3 3 0 013 3v2L24 22 6 12V10z" fill="#fff" opacity="0.4" />
            </svg>
          </div>
          <h1>Outlook</h1>
          <p className="login-tagline">Email Processing System</p>
          <div className="login-features">
            <div className="feature-item">
              <Mail size={20} />
              <span>Manage your inbox efficiently</span>
            </div>
            <div className="feature-item">
              <Lock size={20} />
              <span>Secure document processing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <div className="ms-logo">
              <svg viewBox="0 0 21 21" width="28" height="28">
                <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
                <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
                <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
              </svg>
            </div>
            <h2>Sign in</h2>
            <p className="login-subtitle">Use your admin account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                'Sign in'
              )}
            </button>

            <div className="login-footer-links">
              <span className="forgot-link">Can't access your account?</span>
            </div>
          </form>

          <div className="login-footer">
            <p>Email Processing v1.0 | Powered by Supabase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
