import Stripe from 'stripe';
import dns from 'dns';

// Force IPv4 to avoid IPv6 connection timeouts with Stripe API
try { dns.setDefaultResultOrder('ipv4first'); } catch {}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}
