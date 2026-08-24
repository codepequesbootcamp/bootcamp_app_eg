import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todos los juguetes
export async function GET() {
  try {
    const juguetes = await prisma.juguete.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(juguetes);
  } catch (error) {
    console.error('Error GET:', error);
    return NextResponse.json(
      { error: 'Error al obtener juguetes' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo juguete
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoJuguete = await prisma.juguete.create({
      data: body,
    });
    return NextResponse.json(nuevoJuguete);
  } catch (error) {
    console.error('Error POST:', error);
    return NextResponse.json(
      { error: 'Error al crear juguete' },
      { status: 500 }
    );
  }
}