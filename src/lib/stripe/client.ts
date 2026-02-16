import Stripe from 'stripe';
import https from 'https';

// Force IPv4 at the socket level to avoid IPv6 connection timeouts with Stripe API
const ipv4Agent = new https.Agent({ family: 4 });

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
    httpAgent: ipv4Agent,
  });
}
