import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jugueteId = Number(id);

    // Obtener sesión/usuario actual mediante tu endpoint de auth o headers
    const meRes = await fetch(new URL('/api/auth/me', request.url).toString(), {
      headers: { cookie: request.headers.get('cookie') || '' },
    });

    if (!meRes.ok) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userData = await meRes.json();
    const userId = userData.id;

    if (!userId) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    // Verificar si el usuario ya dio like
    const likeExistente = await prisma.like.findUnique({
      where: {
        userId_jugueteId: {
          userId,
          jugueteId,
        },
      },
    });

    if (likeExistente) {
      // Si ya dio like, lo eliminamos (Quitar Me Gusta)
      await prisma.like.delete({
        where: { id: likeExistente.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Si no ha dado like, lo creamos
      await prisma.like.create({
        data: {
          userId,
          jugueteId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error procesando like:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud de me gusta' },
      { status: 500 }
    );
  }
}