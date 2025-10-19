import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../services/authService.ts';
import { mockApi } from '../services/mockApi.ts';
import api from '../services/api.ts';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from || '/dashboard';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authService.login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.error || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const useDemoCredentials = async () => {
    const demoEmail = process.env.REACT_APP_DEMO_EMAIL || 'demo@example.com';
    const demoPassword = process.env.REACT_APP_DEMO_PASSWORD || 'demo1234';
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    setError(null);
    try {
      // Force mock sign-in directly to guarantee demo login works
      const resp = await mockApi.signin({ email: demoEmail, password: demoPassword });
      api.setAuthToken(resp.accessToken);
      localStorage.setItem('user', JSON.stringify(resp.user));
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.error || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <div className="demo-info">
        <strong>Demo mode</strong>
        If you enabled mock API, you can sign in with:
        <div>Email: {process.env.REACT_APP_DEMO_EMAIL || 'demo@example.com'}</div>
        <div>Password: {process.env.REACT_APP_DEMO_PASSWORD || 'demo1234'}</div>
      </div>
      <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" onClick={useDemoCredentials} disabled={submitting}>
            Use demo credentials
          </button>
        </div>
      </form>
      <p style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
