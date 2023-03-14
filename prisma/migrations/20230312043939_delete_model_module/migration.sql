/*
  Warnings:

  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `module` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_moduleId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "module" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Module";
