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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-violet-200/50">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              Start Your Journey
            </h1>
            <p className="text-slate-600 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Create an account to track your habits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
                style={{ fontFamily: 'system-ui, sans-serif' }}
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
                className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 focus:ring-offset-2 outline-none transition-all bg-white/50"
                placeholder="you@example.com"
                disabled={loading}
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
                style={{ fontFamily: 'system-ui, sans-serif' }}
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
                className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 focus:ring-offset-2 outline-none transition-all bg-white/50"
                placeholder="••••••••"
                disabled={loading}
                aria-required="true"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              data-testid="auth-signup-submit"
              disabled={loading}
              className="w-full min-h-[44px] bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-violet-400/50 focus:ring-offset-2"
              style={{ fontFamily: 'Georgia, serif' }}
              aria-label={loading ? 'Creating account...' : 'Create your account'}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-violet-600 hover:text-fuchsia-600 transition-colors focus:outline-none focus:underline"
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
