/*
  Warnings:

  - The `image_url` column on the `user_ratings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_ratings" DROP COLUMN "image_url",
ADD COLUMN     "image_url" TEXT[];
