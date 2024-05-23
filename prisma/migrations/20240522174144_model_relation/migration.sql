/*
  Warnings:

  - Added the required column `artistId` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_MusicUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Music" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,
    CONSTRAINT "Music_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("album", "genre", "id", "name") SELECT "album", "genre", "id", "name" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
PRAGMA foreign_key_check("Music");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_MusicUser_AB_unique" ON "_MusicUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicUser_B_index" ON "_MusicUser"("B");
