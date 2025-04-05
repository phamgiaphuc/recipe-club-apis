-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "attribs" JSONB,
ADD COLUMN     "display_url" TEXT,
ADD COLUMN     "hash" TEXT,
ADD COLUMN     "ingredients" JSONB[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "video_url" TEXT;
