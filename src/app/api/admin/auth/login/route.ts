import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSession } from '@/lib/admin/adminAuth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid credentials', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const admin = await verifyAdminCredentials(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await createAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
