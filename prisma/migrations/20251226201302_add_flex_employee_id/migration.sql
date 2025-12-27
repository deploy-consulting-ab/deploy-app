/*
  Warnings:

  - A unique constraint covering the columns `[flexEmployeeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "flexEmployeeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_flexEmployeeId_key" ON "public"."User"("flexEmployeeId");
