'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { getUsers, createSession } from '@/lib/auth';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate email and password presence
      if (!email || !password) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Get users from localStorage
      const users = getUsers();

      // Find user with matching credentials
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Create session in localStorage
      createSession(user.id, user.email);

      // Call onSuccess callback
      onSuccess();
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md" style={{ animation: 'slideUp 0.4s ease-out' }}>
        <div
          className="rounded-xl sm:rounded-2xl p-6 sm:p-8 border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="mb-6 sm:mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Welcome back
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                data-testid="auth-login-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                placeholder="you@example.com"
                disabled={loading}
                aria-required="true"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                data-testid="auth-login-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-all text-sm"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                placeholder="••••••••"
                disabled={loading}
                aria-required="true"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--focus-ring)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm font-medium border"
                role="alert"
                style={{
                  background: 'var(--danger-surface)',
                  borderColor: 'var(--danger-dim)',
                  color: 'var(--danger)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              data-testid="auth-login-submit"
              disabled={loading}
              className="w-full min-h-[44px] font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
              }}
              aria-label={loading ? 'Signing in...' : 'Sign in to your account'}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
