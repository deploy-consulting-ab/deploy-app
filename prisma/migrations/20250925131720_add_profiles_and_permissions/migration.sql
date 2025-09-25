-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profileId" TEXT;

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PermissionSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PermissionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PermissionSetToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionSetToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PermissionToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PermissionToPermissionSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToPermissionSet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_name_key" ON "public"."Profile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionSet_name_key" ON "public"."PermissionSet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "public"."Permission"("name");

-- CreateIndex
CREATE INDEX "_PermissionSetToUser_B_index" ON "public"."_PermissionSetToUser"("B");

-- CreateIndex
CREATE INDEX "_PermissionToProfile_B_index" ON "public"."_PermissionToProfile"("B");

-- CreateIndex
CREATE INDEX "_PermissionToPermissionSet_B_index" ON "public"."_PermissionToPermissionSet"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionSetToUser" ADD CONSTRAINT "_PermissionSetToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PermissionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionSetToUser" ADD CONSTRAINT "_PermissionSetToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToProfile" ADD CONSTRAINT "_PermissionToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToProfile" ADD CONSTRAINT "_PermissionToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToPermissionSet" ADD CONSTRAINT "_PermissionToPermissionSet_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToPermissionSet" ADD CONSTRAINT "_PermissionToPermissionSet_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PermissionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
