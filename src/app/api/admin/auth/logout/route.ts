import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/admin/adminAuth';

export async function POST() {
  try {
    await deleteAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
