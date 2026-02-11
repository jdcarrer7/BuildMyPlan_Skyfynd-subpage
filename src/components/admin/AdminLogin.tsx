'use client';

import { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAdminStore(s => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            SkyFynd Admin
          </h1>
          <p className="text-[#a0a0a0]">Quote Management Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1c1825] rounded-2xl p-8 border border-[#2a2435]">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2435] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#8b5cf6] transition-colors"
              placeholder="admin@skyfynd.io"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2435] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#8b5cf6] transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            style={{
              background: loading ? '#666' : 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
