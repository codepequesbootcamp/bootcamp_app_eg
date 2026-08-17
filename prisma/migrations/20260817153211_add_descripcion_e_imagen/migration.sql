-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Juguete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagenUrl" TEXT,
    "esFavorito" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Juguete" ("categoria", "esFavorito", "id", "nombre") SELECT "categoria", "esFavorito", "id", "nombre" FROM "Juguete";
DROP TABLE "Juguete";
ALTER TABLE "new_Juguete" RENAME TO "Juguete";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
