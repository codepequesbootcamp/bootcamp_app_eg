import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const libsqlUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const libsqlToken = process.env.TURSO_AUTH_TOKEN;

let prisma: PrismaClient;

if (libsqlUrl && libsqlToken) {
const libsql = createClient({
url: libsqlUrl,
authToken: libsqlToken,
});
const adapter = new PrismaLibSql({ url: libsqlUrl, authToken: libsqlToken });
prisma = new PrismaClient({ adapter });
} else {
prisma = new PrismaClient();
}

export default prisma;