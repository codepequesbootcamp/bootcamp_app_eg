import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return false;

  const user = await prisma.user.findUnique({
    where: { id: Number(sessionId) },
  });

  if (!user || !user.enabled) return false;

  return user.role === 'admin' || user.role === 'super_admin';
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}