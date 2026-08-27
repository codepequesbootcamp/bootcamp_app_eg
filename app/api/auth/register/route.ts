import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
try {
const { email, password } = await request.json();

const existingUser = await prisma.user.findUnique({
where: { email },
});

if (existingUser) {
return NextResponse.json(
{ error: 'El usuario ya existe' },
{ status: 400 }
);
}

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await prisma.user.create({
data: {
email,
password: hashedPassword,
},
});

return NextResponse.json(newUser, { status: 201 });
} catch (error) {
return NextResponse.json(
{ error: 'Error al registrar el usuario' },
{ status: 500 }
);
}
}