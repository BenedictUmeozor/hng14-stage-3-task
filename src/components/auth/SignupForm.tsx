'use client';

import { useState, FormEvent } from 'react';
import { User, Session } from '@/types/auth';

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

      // Get users from localStorage
      const usersJson = localStorage.getItem('habit-tracker-users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check for existing user
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        setError('User already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      // Add user to localStorage
      users.push(newUser);
      localStorage.setItem('habit-tracker-users', JSON.stringify(users));

      // Create session in localStorage
      const session: Session = {
        userId: newUser.id,
        email: newUser.email,
      };
      localStorage.setItem('habit-tracker-session', JSON.stringify(session));

      // Call onSuccess callback
      onSuccess();
    } catch (err) {
      setError('User already exists');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-amber-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-violet-200/50">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
              Start Your Journey
            </h1>
            <p className="text-slate-600 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Create an account to track your habits
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
                data-testid="auth-signup-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 outline-none transition-all bg-white/50"
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
                data-testid="auth-signup-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200/50 outline-none transition-all bg-white/50"
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
              data-testid="auth-signup-submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
