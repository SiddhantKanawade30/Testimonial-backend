/*
  Warnings:

  - A unique constraint covering the columns `[shareLink]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "category" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
ALTER COLUMN "shareLink" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_shareLink_key" ON "Campaign"("shareLink");
