import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Actualizar juguete o alternar favorito
export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();

    const jugueteActualizado = await prisma.juguete.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(jugueteActualizado);
  } catch (error) {
    console.error('Error PUT:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el juguete' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar juguete
export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await prisma.juguete.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Juguete eliminado con éxito' });
  } catch (error) {
    console.error('Error DELETE:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el juguete' },
      { status: 500 }
    );
  }
}