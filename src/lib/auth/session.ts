import type { SessionData } from '@/lib/types/admin';
import type { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_replace_me',
  cookieName: 'skyfynd_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
  email: '',
  name: '',
};

// Hardcoded admin users
export const ADMIN_USERS = [
  {
    email: 'carlos@skyfynd.io',
    password: '***REMOVED***',
    name: 'Carlos',
  },
  {
    email: 'contact@skyfynd.io',
    password: '***REMOVED***',
    name: 'SkyFynd Admin',
  },
];
