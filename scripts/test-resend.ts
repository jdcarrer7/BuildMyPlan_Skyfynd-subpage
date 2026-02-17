/**
 * Quick Resend diagnostic — run with:
 *   RESEND_API_KEY=re_xxxxx npx tsx scripts/test-resend.ts
 *
 * This will:
 * 1. Verify the API key works
 * 2. List verified domains
 * 3. Attempt to send a test email
 */

const API_KEY = process.env.RESEND_API_KEY;
if (!API_KEY) {
  console.error('❌ RESEND_API_KEY not set. Run with:\n   RESEND_API_KEY=re_xxxxx npx tsx scripts/test-resend.ts');
  process.exit(1);
}

const headers = { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' };

async function run() {
  // 1. Check API key
  console.log('── Step 1: Verify API key ──');
  const keyRes = await fetch('https://api.resend.com/api-keys', { headers });
  if (!keyRes.ok) {
    console.error(`❌ API key invalid (${keyRes.status}):`, await keyRes.text());
    return;
  }
  console.log('✅ API key is valid\n');

  // 2. List domains
  console.log('── Step 2: Check domain verification ──');
  const domainRes = await fetch('https://api.resend.com/domains', { headers });
  const domainData = await domainRes.json() as { data?: Array<{ name: string; status: string; region: string }> };
  const domains = domainData.data || [];

  if (domains.length === 0) {
    console.error('❌ No domains configured in Resend!');
    console.error('   → Go to https://resend.com/domains and add "skyfynd.io"');
    console.error('   → Then add the DNS records (DKIM + SPF) to your domain registrar');
    return;
  }

  for (const d of domains) {
    const icon = d.status === 'verified' ? '✅' : '❌';
    console.log(`   ${icon} ${d.name} — ${d.status} (${d.region})`);
  }

  const skyfynd = domains.find(d => d.name === 'skyfynd.io');
  if (!skyfynd) {
    console.error('\n❌ Domain "skyfynd.io" not found in Resend!');
    console.error('   → Go to https://resend.com/domains and add it');
    return;
  }
  if (skyfynd.status !== 'verified') {
    console.error(`\n❌ Domain "skyfynd.io" is NOT verified (status: ${skyfynd.status})`);
    console.error('   → Check your DNS records at your domain registrar');
    console.error('   → Required: 3 CNAME records for DKIM + 1 TXT record for SPF');
    return;
  }
  console.log('');

  // 3. Send test email
  console.log('── Step 3: Send test email ──');
  const testTo = 'contact@skyfynd.io';
  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      from: 'Skyfynd <contact@skyfynd.io>',
      to: [testTo],
      subject: 'Resend Test — BuildMyPlan diagnostic',
      html: '<p>If you see this, Resend is working correctly.</p>',
    }),
  });

  const sendData = await sendRes.json();
  if (!sendRes.ok) {
    console.error(`❌ Send failed (${sendRes.status}):`, JSON.stringify(sendData, null, 2));
  } else {
    console.log(`✅ Email sent successfully to ${testTo}!`);
    console.log('   Response:', JSON.stringify(sendData, null, 2));
  }
}

run().catch(err => console.error('Script error:', err));
