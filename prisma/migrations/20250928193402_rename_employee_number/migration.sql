/*
  Warnings:

  - You are about to drop the column `employee_number` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_employee_number_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "employee_number",
ADD COLUMN     "employeeNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeNumber_key" ON "public"."User"("employeeNumber");
