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


  }

  

