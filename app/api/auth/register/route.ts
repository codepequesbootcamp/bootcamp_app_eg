import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. BLOQUEAR CAMPOS VACÍOS EN EL SERVIDOR
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      );
    }

    // 2. VERIFICAR SI EL USUARIO YA EXISTE
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // 3. ENCRIPTAR CONTRASEÑA Y CREAR USUARIO
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email.trim(),
        password: hashedPassword,
      },
    });

    // 4. RETORNAR ÚNICAMENTE DATOS SEGUROS (SIN LA CONTRASEÑA)
    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al registrar el usuario' },
      { status: 500 }
    );
  }
}