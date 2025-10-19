import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService.ts';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authService.signup({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.error || err?.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
        <div className="form-row">
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        {error && (
          <div className="error" role="alert">{error}</div>
        )}
        <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default SignUpPage;