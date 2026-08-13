/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Juguete` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Juguete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "esFavorito" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Juguete" ("categoria", "id", "nombre") SELECT "categoria", "id", "nombre" FROM "Juguete";
DROP TABLE "Juguete";
ALTER TABLE "new_Juguete" RENAME TO "Juguete";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
