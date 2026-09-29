import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const tracks = await query<any[]>(
      'SELECT id, slug, title, category, domain, description, highlights FROM altruisty_lms_internship_tracks WHERE is_active = 1 ORDER BY id ASC'
    );

    const pricing = await query<any[]>(
      'SELECT id, category, mode, duration, duration_label, price, allows_coupon, features FROM altruisty_lms_pricing ORDER BY category ASC, mode ASC, price ASC'
    );

    // Parse JSON strings
    const parsedTracks = tracks.map((t) => ({
      ...t,
      highlights: typeof t.highlights === 'string' ? JSON.parse(t.highlights) : t.highlights || [],
    }));

    const parsedPricing = pricing.map((p) => ({
      ...p,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
    }));

    return NextResponse.json({
      success: true,
      tracks: parsedTracks,
      pricing: parsedPricing,
    });
  } catch (error: any) {
    console.error('Fetch internships error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch internship details' }, { status: 500 });
  }
}
