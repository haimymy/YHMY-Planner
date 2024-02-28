/*
  Warnings:

  - You are about to drop the `TaskAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `status` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Access` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employeeName` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Access` table. All the data in the column will be lost.
  - Added the required column `assigneeName` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigneeName` to the `Access` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TaskAssignment";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectId" INTEGER NOT NULL,
    "effort" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "authorName" TEXT NOT NULL,
    "assigneeName" TEXT NOT NULL,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assigneeName_fkey" FOREIGN KEY ("assigneeName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("authorName", "description", "effort", "id", "projectId", "status", "title") SELECT "authorName", "description", "effort", "id", "projectId", "status", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_Access" (
    "assigneeName" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "accessType" TEXT NOT NULL,

    PRIMARY KEY ("assigneeName", "projectId"),
    CONSTRAINT "Access_assigneeName_fkey" FOREIGN KEY ("assigneeName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Access_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Access" ("accessType", "projectId") SELECT "accessType", "projectId" FROM "Access";
DROP TABLE "Access";
ALTER TABLE "new_Access" RENAME TO "Access";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
