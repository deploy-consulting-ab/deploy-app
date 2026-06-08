-- CreateTable
CREATE TABLE "FieldPermission" (
    "id" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "objectName" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,

    CONSTRAINT "FieldPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FieldPermissionToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FieldPermissionToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FieldPermissionToPermissionSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FieldPermissionToPermissionSet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldPermission_system_objectName_fieldName_key" ON "FieldPermission"("system", "objectName", "fieldName");

-- CreateIndex
CREATE INDEX "_FieldPermissionToProfile_B_index" ON "_FieldPermissionToProfile"("B");

-- CreateIndex
CREATE INDEX "_FieldPermissionToPermissionSet_B_index" ON "_FieldPermissionToPermissionSet"("B");

-- AddForeignKey
ALTER TABLE "_FieldPermissionToProfile" ADD CONSTRAINT "_FieldPermissionToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "FieldPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldPermissionToProfile" ADD CONSTRAINT "_FieldPermissionToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldPermissionToPermissionSet" ADD CONSTRAINT "_FieldPermissionToPermissionSet_A_fkey" FOREIGN KEY ("A") REFERENCES "FieldPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldPermissionToPermissionSet" ADD CONSTRAINT "_FieldPermissionToPermissionSet_B_fkey" FOREIGN KEY ("B") REFERENCES "PermissionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
