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

// Build admin users from environment variables (ADMIN_EMAIL_1, ADMIN_PASSWORD_1, ADMIN_NAME_1, etc.)
export function getAdminUsers(): { email: string; password: string; name: string }[] {
  const users: { email: string; password: string; name: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    const email = process.env[`ADMIN_EMAIL_${i}`];
    const password = process.env[`ADMIN_PASSWORD_${i}`];
    const name = process.env[`ADMIN_NAME_${i}`] || `Admin ${i}`;
    if (email && password) {
      users.push({ email, password, name });
    }
  }
  return users;
}
