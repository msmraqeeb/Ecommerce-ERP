'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'your-super-secret-key-that-is-long-enough';
const key = new TextEncoder().encode(secretKey);

// Hardcoded users for simplicity
const users = [
    { id: 1, username: 'admin', password: 'password', role: 'admin' },
    { id: 2, username: 'viewer', password: 'password', role: 'viewer' },
];

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This can happen if the token is expired or invalid
    return null;
  }
}

export async function login(prevState: string | undefined, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return 'Invalid username or password';
  }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });

  redirect('/');
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  return await decrypt(sessionCookie);
}

export async function isAdmin() {
    const session = await getSession();
    return session?.user?.role === 'admin';
}
