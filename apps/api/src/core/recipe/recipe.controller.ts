import { Controller, Get, Request, UseGuards, Param, Query } from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiQuery
} from "@nestjs/swagger";
import { AtGuard } from "@app/api/base/auth/guard/at.guard";

@ApiTags("Recipes")
@Controller("recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("recommend")
  @ApiBearerAuth()
@UseGuards(AtGuard)
  @ApiOkResponse({ description: "get recipe based on their ingredient" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async recommend(@Request() req) {
    return this.recipeService.recommendRecipes(req.user.user_id);
  }
   @Get("search")
  @ApiOkResponse({ description: "Search for recipes by title or ingredient name" })
  @ApiQuery({ name: "q", type: String, required: true, description: "Search keyword" })
  async search(@Query("q") query: string) {
    return this.recipeService.searchRecipes(query);
  }
  @Get(":id")
  @ApiBearerAuth()
@UseGuards(AtGuard)
  @ApiOkResponse({ description: "Get full recipe detail by ID" })
@ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getById(@Request() req,@Param("id") id: string) {
     return this.recipeService.getRecipeById(id, req.user.user_id);
  }


@Get("recommend/guest")
@ApiOkResponse({ description: "Get public recipe recommendations (no login needed)" })
async recommendForGuest() {
  return this.recipeService.recommendRandomRecipes();
}

}
