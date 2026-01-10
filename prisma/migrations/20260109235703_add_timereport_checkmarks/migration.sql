-- CreateTable
CREATE TABLE "TimereportCheckmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimereportCheckmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimereportCheckmark_userId_idx" ON "TimereportCheckmark"("userId");

-- CreateIndex
CREATE INDEX "TimereportCheckmark_weekStartDate_idx" ON "TimereportCheckmark"("weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "TimereportCheckmark_userId_weekStartDate_key" ON "TimereportCheckmark"("userId", "weekStartDate");

-- AddForeignKey
ALTER TABLE "TimereportCheckmark" ADD CONSTRAINT "TimereportCheckmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
