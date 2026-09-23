import { auth } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getAuthSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(`${process.env.BETTER_AUTH_COOKIE_PREFIX}.session_token`);

  if (!sessionToken) {
    return false;
  }

  return true;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
