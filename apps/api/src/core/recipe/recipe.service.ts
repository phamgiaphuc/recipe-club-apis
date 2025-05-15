import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/common/database/database.service';

@Injectable()
export class RecipeService {
  constructor(private readonly databaseService: DatabaseService) {}

  async recommendRecipes(user_id: string){
    // lay user pantry tu pantry user
    const pantryIngredients = await this.databaseService.userPantries.findMany({
      where: { user_id },
      select: { ingredient_id: true },
    });

    if (pantryIngredients.length === 0) {
      const randomRecipes = await this.databaseService.recipes.findMany({
        take: 10,
      });

      return {
        total: randomRecipes.length,
        recipes: randomRecipes.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image_url: recipe.image_url,
          domain:recipe.domain,
          matched_ingredients: 0,
        })),
      };
    }

    const ingredientID = pantryIngredients.map(i => i.ingredient_id);

    // so luong nguyen lieu match voi recipes
    const numOfRecipes = await this.databaseService.recipeIngredients.groupBy({
      by: ['recipe_id'],
      where: { ingredient_id: { in: ingredientID } },
      _count: { ingredient_id: true },
      orderBy: { _count: { ingredient_id: 'desc' } },
      take: 80,
    });

    if (numOfRecipes.length === 0) {
      return {
        total: 0,
        recipes: [],
      };
    }

    const detailedRecipes = await this.databaseService.recipes.findMany({
      where: { id: { in: numOfRecipes.map(r => r.recipe_id) } },
      select: {
        id: true,
        title: true,
        image_url: true,
        domain:true,
      },
    });

    return {
      total: detailedRecipes.length,
      recipes: detailedRecipes.map(recipe => ({
        ...recipe,
        matched_ingredients: numOfRecipes.find(r => r.recipe_id === recipe.id)?._count.ingredient_id || 0,
      })),
    };


  }

  async getRecipeById(recipeId: string, userId: string) {
  const nutritionFields = [
    'calories_kcal', 'serving_size_g', 'fat_total_g', 'fat_saturated_g',
    'fat_monounsaturated_g', 'fat_polyunsaturated_g', 'fat_trans_g',
    'protein_g', 'sodium_mg', 'calcium_mg', 'magnesium_mg', 'potassium_mg',
    'cholesterol_mg', 'iron_mg', 'zinc_mg', 'phosphorus_mg',
    'carbohydrates_total_g', 'fiber_g', 'sugar_g',
    'vitamin_a_ug', 'vitamin_c_mg', 'vitamin_b1_mg', 'vitamin_b2_mg',
    'vitamin_b3_mg', 'vitamin_b6_mg', 'folate_dfe_ug', 'folate_food_ug',
    'folic_acid_ug', 'vitamin_b12_ug', 'vitamin_d_ug', 'vitamin_e_mg',
    'vitamin_k_ug', 'water_g',
  ];

  const selectFields = nutritionFields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as Record<string, true>);

  const recipe = await this.databaseService.recipes.findUnique({
    where: { id: recipeId },
    select: {
      id: true,
      title: true,
      image_url: true,
      domain: true,
      recipe_ingredients: {
        select: {
          ingredient: {
            select: {
              name: true,
              id: true,
              ...selectFields,
            },
          },
        },
      },
    },
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

 
  const pantryIngredients = await this.databaseService.userPantries.findMany({
    where: { user_id: userId },
    select: { ingredient_id: true },
  });
  const pantryIngredientIds = pantryIngredients.map(p => p.ingredient_id);

  const nutrition_facts = nutritionFields.reduce((acc, field) => {
    acc[field] = 0;
    return acc;
  }, {} as Record<string, number>);

  const ingredientNames: string[] = [];
  let matchedCount = 0;

  for (const ri of recipe.recipe_ingredients) {
    const ingredient = ri.ingredient;
    ingredientNames.push(ingredient.name);

  
    if (pantryIngredientIds.includes(ingredient.id)) {
      matchedCount++;
    }

    for (const field of nutritionFields) {
      nutrition_facts[field] += (ingredient as any)[field] || 0;
    }
  }

  for (const field of nutritionFields) {
    nutrition_facts[field] = Math.round(nutrition_facts[field] * 100) / 100;
  }

  return {
    id: recipe.id,
    title: recipe.title,
    image_url: recipe.image_url,
    domain: recipe.domain,
    ingredients: ingredientNames,
    nutrition_facts,
    matched_ingredients: matchedCount, 
  };
}




  }

  

