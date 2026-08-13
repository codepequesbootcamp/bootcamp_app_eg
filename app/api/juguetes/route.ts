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
    const { nombre, categoria } = body;

    if (!nombre || !categoria) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const nuevoJuguete = await prisma.juguete.create({
      data: {
        nombre: String(nombre),
        categoria: String(categoria),
      },
    });

    return NextResponse.json(nuevoJuguete, { status: 201 });
  } catch (error) {
    console.error('Error POST:', error);
    return NextResponse.json(
      { error: 'Error al guardar el juguete' },
      { status: 500 }
    );
  }
}