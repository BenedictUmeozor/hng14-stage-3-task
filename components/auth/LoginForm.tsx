'use client';

import { useState, FormEvent } from 'react';
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-amber-50 via-rose-50 to-violet-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-200/50">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                data-testid="auth-login-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 outline-none transition-all bg-white/50"
                placeholder="you@example.com"
                disabled={loading}
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
                data-testid="auth-login-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/50 outline-none transition-all bg-white/50"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              data-testid="auth-login-submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
