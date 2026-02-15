'use client';

import { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import FloatingStars from '@/components/admin/FloatingStars';

const LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingStars />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={LOGO_URL} alt="SkyFynd" className="w-12 h-12 object-contain" />
            <h1 className="text-4xl font-semibold text-[#FAFAFA]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", letterSpacing: '-0.5px' }}>
              Skyfynd
            </h1>
          </div>
          <p className="text-[#A1A1AA]">Operations Management Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card admin-service-tile p-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0A0A0B] border border-white/[0.06] rounded-lg text-white placeholder-[#71717A] focus:outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="admin@skyfynd.io"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[#A1A1AA] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0A0A0B] border border-white/[0.06] rounded-lg text-white placeholder-[#71717A] focus:outline-none focus:border-[#3B82F6] transition-colors"
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
              background: loading ? '#52525B' : 'linear-gradient(to right, rgba(167,139,250,0.75) 0%, rgba(96,175,250,0.85) 40%, rgba(52,211,153,0.8) 100%)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
