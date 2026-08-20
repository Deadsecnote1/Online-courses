import { NextResponse } from 'next/server';
import { isSyncAuthorized } from '@/lib/adminAuth';
import { runCouponPipeline } from '@/lib/couponPipeline';
import { catalogDriver } from '@/data/catalogStore';

export async function POST(request: Request) {
  if (!isSyncAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const summary = await runCouponPipeline();

  return NextResponse.json({
    success: true,
    driver: catalogDriver(),
    ...summary,
  });
}
