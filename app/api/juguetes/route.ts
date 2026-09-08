import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todos los juguetes con sus likes
export async function GET() {
  try {
    const juguetes = await prisma.juguete.findMany({
      include: {
        likes: true,
      },
      orderBy: { id: 'desc' },
    });

    const resultado = juguetes.map((j) => ({
      ...j,
      likesCount: j.likes.length,
      likedByUsers: j.likes.map((l) => l.userId),
    }));

    return NextResponse.json(resultado);
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
      data: {
        nombre: body.nombre,
        categoria: body.categoria,
        descripcion: body.descripcion,
        imagenUrl: body.imagenUrl,
      },
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