import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Obtener un juguete específico por su ID (GET)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const juguete = await prisma.juguete.findUnique({
      where: { id: Number(id) },
    });

    if (!juguete) {
      return NextResponse.json(
        { error: 'Juguete no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(juguete);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener el juguete' },
      { status: 500 }
    );
  }
}

// 2. Actualizar los datos del juguete por su ID (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, categoria, esFavorito } = body; // 👈 1. Extraemos esFavorito

    const jugueteActualizado = await prisma.juguete.update({
      where: { id: Number(id) },
      data: {
        nombre,
        categoria,
        esFavorito, // 👈 2. Se lo pasamos a Prisma
      },
    });

    return NextResponse.json(jugueteActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el juguete' },
      { status: 500 }
    );
  }
}

// 3. Eliminar un juguete por su ID (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.juguete.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ mensaje: 'Juguete eliminado correctamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el juguete' },
      { status: 500 }
    );
  }
}