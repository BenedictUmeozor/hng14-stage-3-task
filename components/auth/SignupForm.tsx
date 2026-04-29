'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { findUserByEmail, createUser, createSession } from '@/lib/auth';

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
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
        setLoading(false);
        return;
      }

      // Check for existing user
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        setError('User already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = createUser(email, password);

      // Create session in localStorage
      createSession(newUser.id, newUser.email);

      // Call onSuccess callback
      onSuccess();
    } catch (err) {
      setError('User already exists');
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
              Start your journey
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Create an account to track your habits
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
                data-testid="auth-signup-email"
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
                data-testid="auth-signup-password"
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
              data-testid="auth-signup-submit"
              disabled={loading}
              className="w-full min-h-[44px] font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
              }}
              aria-label={loading ? 'Creating account...' : 'Create your account'}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
