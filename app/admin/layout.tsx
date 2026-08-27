import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({
children,
}: {
children: React.ReactNode;
}) {
const cookieStore = await cookies();
const sessionId = cookieStore.get('session')?.value;

if (!sessionId) {
redirect('/');
}

const user = await prisma.user.findUnique({
where: { id: Number(sessionId) },
});

const isAllowed = 
user && 
user.enabled && 
(user.role === 'admin' || user.role === 'super_admin');

if (!isAllowed) {
redirect('/');
}

return <>{children}</>;
}