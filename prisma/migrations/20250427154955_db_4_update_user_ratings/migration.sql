/*
  Warnings:

  - You are about to drop the column `image_url` on the `user_ratings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_ratings" DROP COLUMN "image_url",
ADD COLUMN     "image_urls" TEXT[];
