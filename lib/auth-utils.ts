import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
