import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function NuevaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    redirect('/login');
  }

  // 2. Consultar el estado real del usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { id: Number(session.value) },
    select: { enabled: true },
  });

  // Si el usuario fue eliminado o tiene enabled en false, lo rebotamos al login
  if (!user || !user.enabled) {
    redirect('/login');
  }

  return <>{children}</>;
}