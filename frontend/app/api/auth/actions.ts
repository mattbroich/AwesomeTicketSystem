'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from "@/lib/generated/prisma";

const db = new PrismaClient();

// Gets the current user info, redirecting to /signin if there is none
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

// Removes the session from the database and removes the cookie
export async function signOut() {
  const c = await cookies()
  const sessionId = c.get('sessionId')?.value || "";
  const userId = c.get('userId')?.value || "";
  const id = c.get('id')?.value || "";

  if (id && sessionId && userId) {
    await db.session.delete({
      where: { id: parseInt(id), userId: parseInt(userId), sessionId: sessionId },
    })
  }

  c.delete('id');
  c.delete('sessionId')
  c.delete('userId')
  redirect('/login')
}

// Gets the current user info based on the sessionId cookie
export async function getCurrentUser() {
  const c = await cookies()
  const sessionId = c.get('sessionId')?.value || "";
  const userId = c.get('userId')?.value || "";

  if (!sessionId && !userId && userId !== undefined) return null

  const session = await db.session.findFirst({
    where: { userId: parseInt(userId), sessionId: sessionId },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    c.delete('id');
    c.delete('sessionId');
    c.delete('userId');
    return null
  }

  return session.userId;
}

// Create a session and set the sessionId cookie
export async function createSessionAndCookie(sessionId:string, userId:string) {
  const SESSION_DURATION_DAYS = 7
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  if (!userId) {
    throw new Error('User ID is required to create a session')
  }

  const intUserId = parseInt(userId);

  const session = await db.session.create({
    data: {
        userId: intUserId,
        sessionId: sessionId,
        expiresAt: expiresAt
    },
  })

  const c = await cookies();
  if (!session) {
    throw new Error('Failed to create session')
  }

  // Set session cookies

  c.set('id', session.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(session.expiresAt),
  });

  c.set('sessionId', session.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(session.expiresAt),
  });

  c.set('userId', session.userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(session.expiresAt),
  });
}