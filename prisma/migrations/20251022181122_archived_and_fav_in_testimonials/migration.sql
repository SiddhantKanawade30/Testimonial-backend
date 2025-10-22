-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;
