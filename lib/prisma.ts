import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL no está definida en las variables de entorno.')
  }

  // 1. Crear el cliente de LibSQL para Turso
  const libsql = createClient({
    url,
    authToken,
  })

  // 2. Pasar el cliente libsql dentro del objeto de configuración que exige tu versión
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  // 3. Crear e instanciar PrismaClient con el adaptador
  return new PrismaClient({ adapter })
}

// Reutilizar la instancia global para evitar agotar conexiones en Serverless
export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}