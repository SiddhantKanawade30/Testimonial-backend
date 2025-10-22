/*
  Warnings:

  - You are about to drop the column `favorite` on the `Testimonial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "favorite",
ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false;
