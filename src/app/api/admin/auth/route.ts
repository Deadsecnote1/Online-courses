import { NextResponse } from 'next/server';
import { getAdminSecret } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();
    const adminKey = getAdminSecret();

    if (key === adminKey) {
      return NextResponse.json({ success: true, message: 'Authenticated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid Admin Access Key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
