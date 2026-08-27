import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    // 1. Si no hay cookie de sesión, bloqueamos el acceso
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión.' },
        { status: 401 }
      );
    }

    // 2. Buscamos al usuario en la base de datos para verificar su rol y estado
    const currentUser = await prisma.user.findUnique({
      where: { id: Number(session.value) },
      select: { role: true, enabled: true },
    });

    // 3. Si no existe, está deshabilitado o NO es administrador, bloqueamos
    if (
      !currentUser ||
      !currentUser.enabled ||
      (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')
    ) {
      return NextResponse.json(
        { error: 'Acceso denegado. Permisos insuficientes.' },
        { status: 403 }
      );
    }

    // 4. Si pasa las validaciones, devolvemos la lista de usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}