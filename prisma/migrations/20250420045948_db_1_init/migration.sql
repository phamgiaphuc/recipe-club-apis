-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateTable
CREATE TABLE "ingredient_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ingredient_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "calories_kcal" DOUBLE PRECISION,
    "serving_size_g" DOUBLE PRECISION,
    "fat_total_g" DOUBLE PRECISION,
    "fat_saturated_g" DOUBLE PRECISION,
    "fat_monounsaturated_g" DOUBLE PRECISION,
    "fat_polyunsaturated_g" DOUBLE PRECISION,
    "fat_trans_g" DOUBLE PRECISION,
    "protein_g" DOUBLE PRECISION,
    "sodium_mg" DOUBLE PRECISION,
    "calcium_mg" DOUBLE PRECISION,
    "magnesium_mg" DOUBLE PRECISION,
    "potassium_mg" DOUBLE PRECISION,
    "cholesterol_mg" DOUBLE PRECISION,
    "iron_mg" DOUBLE PRECISION,
    "zinc_mg" DOUBLE PRECISION,
    "phosphorus_mg" DOUBLE PRECISION,
    "carbohydrates_total_g" DOUBLE PRECISION,
    "fiber_g" DOUBLE PRECISION,
    "sugar_g" DOUBLE PRECISION,
    "vitamin_a_ug" DOUBLE PRECISION,
    "vitamin_c_mg" DOUBLE PRECISION,
    "vitamin_b1_mg" DOUBLE PRECISION,
    "vitamin_b2_mg" DOUBLE PRECISION,
    "vitamin_b3_mg" DOUBLE PRECISION,
    "vitamin_b6_mg" DOUBLE PRECISION,
    "folate_dfe_ug" DOUBLE PRECISION,
    "folate_food_ug" DOUBLE PRECISION,
    "folic_acid_ug" DOUBLE PRECISION,
    "vitamin_b12_ug" DOUBLE PRECISION,
    "vitamin_d_ug" DOUBLE PRECISION,
    "vitamin_e_mg" DOUBLE PRECISION,
    "vitamin_k_ug" DOUBLE PRECISION,
    "water_g" DOUBLE PRECISION,
    "diets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "healths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_nutrition_updated" BOOLEAN NOT NULL DEFAULT false,
    "nutrition_last_updated" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_groups" (
    "category_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT,
    "image_url" TEXT,
    "display_url" TEXT,
    "hash" TEXT,
    "video_url" TEXT,
    "ingredients" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "attribs" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "recipe_id" TEXT NOT NULL,
    "ingredient_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_activated" BOOLEAN NOT NULL DEFAULT false,
    "is_2fa" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'user',
    "last_active" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "gender" "Gender",
    "phone_num" TEXT,
    "address" TEXT,
    "birth_date" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_categories_name_key" ON "ingredient_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_groups_category_id_ingredient_id_key" ON "ingredient_groups"("category_id", "ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipe_id_ingredient_id_key" ON "recipe_ingredients"("recipe_id", "ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "ingredient_groups" ADD CONSTRAINT "ingredient_groups_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "ingredient_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_groups" ADD CONSTRAINT "ingredient_groups_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
