import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt-utils';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const session = token ? await verifyToken(token) : null;

  return <NavbarClient initialUser={session} />;
}
