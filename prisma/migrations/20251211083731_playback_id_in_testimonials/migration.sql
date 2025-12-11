-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "playbackId" TEXT,
ALTER COLUMN "message" DROP NOT NULL;
