import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 1. Verificar si el usuario existe y si está habilitado
    if (!user || !user.enabled) {
      return NextResponse.json(
        { error: 'Credenciales inválidas o cuenta deshabilitada' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('session', String(user.id), {
      httpOnly: true,
      path: '/',
    });

    // Retorna la sesión junto con los datos básicos del usuario
    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}