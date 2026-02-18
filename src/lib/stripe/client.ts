import Stripe from 'stripe';

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function findOrCreateStripeCustomer(
  stripe: Stripe,
  email: string,
  name: string
): Promise<Stripe.Customer> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0];
  return stripe.customers.create({ email, name });
}
