import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const juguetes = await prisma.juguete.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(juguetes);
  } catch (error) {
    console.error('Error GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener los juguetes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, categoria, descripcion, imagenUrl } = body;

    const nuevoJuguete = await prisma.juguete.create({
      data: {
        nombre,
        categoria,
        descripcion,
        imagenUrl,
      },
    });

    return NextResponse.json(nuevoJuguete, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear el juguete' },
      { status: 500 }
    );
  }
}