-- CreateTable
CREATE TABLE "user_pantries" (
    "user_id" UUID NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "user_pantries_pkey" PRIMARY KEY ("user_id","ingredient_id")
);

-- AddForeignKey
ALTER TABLE "user_pantries" ADD CONSTRAINT "user_pantries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pantries" ADD CONSTRAINT "user_pantries_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
