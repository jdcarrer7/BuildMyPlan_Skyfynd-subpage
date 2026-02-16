import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import type { SessionData } from '@/lib/types/admin';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch all portals with their change requests count
    const { data: portals, error } = await supabase
      .from('portals')
      .select('id, qr_number, client_name, client_email, status, created_at, expires_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch portals error:', error);
      return NextResponse.json({ error: 'Failed to fetch portals' }, { status: 500 });
    }

    // Fetch pending change requests
    const { data: changeRequests } = await supabase
      .from('portal_change_requests')
      .select('portal_id, message, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    // Fetch payment info
    const { data: payments } = await supabase
      .from('portal_payments')
      .select('portal_id, amount, status, paid_at, payment_type')
      .eq('status', 'completed');

    // Build a lookup map for change requests and payments
    const changeRequestsByPortal: Record<string, { message: string; created_at: string }[]> = {};
    for (const cr of changeRequests || []) {
      if (!changeRequestsByPortal[cr.portal_id]) {
        changeRequestsByPortal[cr.portal_id] = [];
      }
      changeRequestsByPortal[cr.portal_id].push({ message: cr.message, created_at: cr.created_at });
    }

    // Build deposit and final payment lookup maps
    const depositByPortal: Record<string, { amount: number; paid_at: string | null }> = {};
    const finalByPortal: Record<string, { amount: number; paid_at: string | null }> = {};
    for (const p of payments || []) {
      if (p.payment_type === 'final') {
        finalByPortal[p.portal_id] = { amount: p.amount, paid_at: p.paid_at };
      } else if (!depositByPortal[p.portal_id]) {
        depositByPortal[p.portal_id] = { amount: p.amount, paid_at: p.paid_at };
      }
    }

    // Enrich portal data
    const enrichedPortals = (portals || []).map(p => ({
      ...p,
      pending_changes: changeRequestsByPortal[p.id] || [],
      payment: depositByPortal[p.id] || null,
      finalPayment: finalByPortal[p.id] || null,
    }));

    return NextResponse.json({ status: 'success', portals: enrichedPortals });
  } catch (error) {
    console.error('Portals API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
