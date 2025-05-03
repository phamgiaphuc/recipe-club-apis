import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { ApiTags, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from "@app/api/base/auth/guard/at.guard";

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(AtGuard) 
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('recommend')
  @ApiOkResponse({ description: 'get recipe based on their ingredient' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async recommend(@Request() req) {
    return this.recipeService.recommendRecipes(req.user.user_id);
  }
}
