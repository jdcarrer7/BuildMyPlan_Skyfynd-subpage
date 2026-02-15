import type { SessionOptions } from 'iron-session';

export interface PortalSessionData {
  portalId: string;
  email: string;
  verified: boolean;
}

export const portalSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_replace_me',
  cookieName: 'skyfynd_portal_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

export const defaultPortalSession: PortalSessionData = {
  portalId: '',
  email: '',
  verified: false,
};
