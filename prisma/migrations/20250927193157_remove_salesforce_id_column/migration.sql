/*
  Warnings:

  - You are about to drop the column `salesforce_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "salesforce_id";
