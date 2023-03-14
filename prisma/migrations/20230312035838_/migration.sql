/*
  Warnings:

  - A unique constraint covering the columns `[moduleNum]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `moduleNum` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "moduleNum" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleNum_key" ON "Module"("moduleNum");
