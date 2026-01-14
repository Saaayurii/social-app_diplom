import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma/prisma';
import { AdminRole } from '@prisma/client';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production'
);
const ADMIN_SESSION_COOKIE = 'admin-session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  exp?: number;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email, isActive: true },
  });

  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return null;

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return admin;
}

export async function createAdminSession(admin: {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}) {
  const expiresAt = Date.now() + SESSION_DURATION;

  const token = await new SignJWT({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(ADMIN_JWT_SECRET);

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });

  return token;
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  cookies().delete(ADMIN_SESSION_COOKIE);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function canModify(role: AdminRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function canDelete(role: AdminRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function isSuperAdmin(role: AdminRole): boolean {
  return role === 'SUPER_ADMIN';
}
