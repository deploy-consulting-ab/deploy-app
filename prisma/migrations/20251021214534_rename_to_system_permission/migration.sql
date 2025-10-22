/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToPermissionSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermissionToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PermissionToPermissionSet" DROP CONSTRAINT "_PermissionToPermissionSet_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PermissionToPermissionSet" DROP CONSTRAINT "_PermissionToPermissionSet_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PermissionToProfile" DROP CONSTRAINT "_PermissionToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PermissionToProfile" DROP CONSTRAINT "_PermissionToProfile_B_fkey";

-- DropTable
DROP TABLE "public"."Permission";

-- DropTable
DROP TABLE "public"."_PermissionToPermissionSet";

-- DropTable
DROP TABLE "public"."_PermissionToProfile";

-- CreateTable
CREATE TABLE "public"."SystemPermission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SystemPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProfileToSystemPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileToSystemPermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PermissionSetToSystemPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionSetToSystemPermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemPermission_name_key" ON "public"."SystemPermission"("name");

-- CreateIndex
CREATE INDEX "_ProfileToSystemPermission_B_index" ON "public"."_ProfileToSystemPermission"("B");

-- CreateIndex
CREATE INDEX "_PermissionSetToSystemPermission_B_index" ON "public"."_PermissionSetToSystemPermission"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProfileToSystemPermission" ADD CONSTRAINT "_ProfileToSystemPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProfileToSystemPermission" ADD CONSTRAINT "_ProfileToSystemPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."SystemPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionSetToSystemPermission" ADD CONSTRAINT "_PermissionSetToSystemPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PermissionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionSetToSystemPermission" ADD CONSTRAINT "_PermissionSetToSystemPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."SystemPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
